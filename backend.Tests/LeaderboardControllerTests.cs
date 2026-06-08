using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;
using backend.Controllers;
using SheDesign.Data;
using SheDesign.Models;
using SheDesign.DTO;

namespace SheDesign.Tests
{
    public class LeaderboardControllerTests : IDisposable
    {
        private readonly SheDesignContext _context;
        private readonly LeaderboardController _controller;

        public LeaderboardControllerTests()
        {
            var options = new DbContextOptionsBuilder<SheDesignContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SheDesignContext(options);
            _context.Database.EnsureCreated();

            _controller = new LeaderboardController(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetTotalLeaderboardDetails_ReturnsEmptyList_WhenNoSubmissionsExistForEvent()
        {
            // Arrange
            int targetEventId = 99;
            // Seed a submission for a completely different event
            _context.Submission.Add(new Submission { Id = 1, eventId = 100, title = "Other Event Sub" });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetTotalLeaderboardDetails(targetEventId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var leaderboard = Assert.IsAssignableFrom<IEnumerable<LeaderboardTotalReadDTO>>(okResult.Value);
            Assert.Empty(leaderboard);
        }

        [Fact]
        public async Task GetTotalLeaderboardDetails_FiltersCorrectEvent_AndCalculatesSequentialRanks()
        {
            // Arrange
            int targetEventId = 5;

            var student1 = new Student { Id = 1, fullname = "Alice Johnson" };
            var student2 = new Student { Id = 2, fullname = "Bob Smith" };

            var sub1 = new Submission
            {
                Id = 10,
                eventId = targetEventId,
                title = "Alice Entry",
                points = 85,
                rank = 2, // Current database rank value
                Student = student1
            };

            var sub2 = new Submission
            {
                Id = 11,
                eventId = targetEventId,
                title = "Bob Entry",
                points = 98,
                rank = 5, // Higher database rank value, should come first based on your OrderByDescending
                Student = student2
            };

            var subOtherEvent = new Submission
            {
                Id = 12,
                eventId = 999, // Different event entirely
                title = "Charlie Entry",
                points = 100,
                rank = 10
            };

            _context.Submission.AddRange(sub1, sub2, subOtherEvent);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetTotalLeaderboardDetails(targetEventId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var leaderboard = Assert.IsAssignableFrom<IEnumerable<LeaderboardTotalReadDTO>>(okResult.Value).ToList();

            // 1. Check filtering: Only the 2 items matching targetEventId should return
            Assert.Equal(2, leaderboard.Count);

            // 2. Check sorting ordering: sub2 has rank 5, sub1 has rank 2. 
            // OrderByDescending(s => s.rank) means sub2 must appear first (Index 0).
            var firstPlace = leaderboard[0];
            var secondPlace = leaderboard[1];

            Assert.Equal(11, firstPlace.Id);
            Assert.Equal(targetEventId, firstPlace.EventId);
            Assert.Equal("Bob Smith", firstPlace.Student_name);
            Assert.Equal(98, firstPlace.Score);
            Assert.Equal(1, firstPlace.Rank); // Procedural index math (0 + 1)

            Assert.Equal("Alice Johnson", secondPlace.Student_name);
            Assert.Equal(85, secondPlace.Score);
            Assert.Equal(2, secondPlace.Rank); // Procedural index math (1 + 1)
        }

        [Fact]
        public async Task GetTotalLeaderboardDetails_HandlesMissingStudentGracefully()
        {
            // Arrange
            int targetEventId = 1;
            var subWithoutStudent = new Submission
            {
                Id = 20,
                eventId = targetEventId,
                title = "Orphaned Submission",
                points = 70,
                rank = 1,
                Student = null // Simulating missing relational data
            };

            _context.Submission.Add(subWithoutStudent);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetTotalLeaderboardDetails(targetEventId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var leaderboard = Assert.IsAssignableFrom<IEnumerable<LeaderboardTotalReadDTO>>(okResult.Value).ToList();

            Assert.Single(leaderboard);
            // Confirms your null-coalescing operator logic (?? "Unknown") works smoothly
            Assert.Equal("Unknown", leaderboard[0].Student_name);
            Assert.Null(leaderboard[0].Student_email);
        }
    }
}