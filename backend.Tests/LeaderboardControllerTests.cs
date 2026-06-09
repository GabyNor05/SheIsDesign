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
        public async Task GetLeaderboard_ReturnsNotFound_WhenNoPostsExistForEvent()
        {
            // Arrange
            int targetEventId = 99;

            // Seed a post for a completely different event
            _context.Post.Add(new Post { Id = 1, eventId = 100, title = "Other Event Post" });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetLeaderboard(targetEventId);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetLeaderboard_FiltersCorrectEvent_AndSortsByTotalScoreDescending()
        {
            // Arrange
            int targetEventId = 5;

            var user1 = new User { Id = 1, Email = "alice@test.com" };
            var user2 = new User { Id = 2, Email = "bob@test.com" };

            var student1 = new Student { Id = 1, fullname = "Alice Johnson", university = "UCT", userId = 1, User = user1 };
            var student2 = new Student { Id = 2, fullname = "Bob Smith", university = "Wits", userId = 2, User = user2 };

            var post1 = new Post { Id = 10, eventId = targetEventId, title = "Alice Entry", studentId = 1, Student = student1 };
            var post2 = new Post { Id = 11, eventId = targetEventId, title = "Bob Entry", studentId = 2, Student = student2 };
            var postOtherEvent = new Post { Id = 12, eventId = 999, title = "Other Event Post" };

            // Alice gets score 85, Bob gets score 98 — Bob should rank first
            var mark1 = new JudgeMarkScheme { Id = 1, PostId = 10, JudgeId = 1, Score = 85 };
            var mark2 = new JudgeMarkScheme { Id = 2, PostId = 11, JudgeId = 1, Score = 98 };

            _context.Post.AddRange(post1, post2, postOtherEvent);
            _context.JudgeMarkScheme.AddRange(mark1, mark2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetLeaderboard(targetEventId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var leaderboard = Assert.IsAssignableFrom<IEnumerable<LeaderboardEntryReadDTO>>(okResult.Value).ToList();

            // Only the 2 posts matching targetEventId should return
            Assert.Equal(2, leaderboard.Count);

            // Bob has higher score so should be first
            var firstPlace = leaderboard[0];
            var secondPlace = leaderboard[1];

            Assert.Equal(11, firstPlace.Id);
            Assert.Equal(targetEventId, firstPlace.EventId);
            Assert.Equal("Bob Smith", firstPlace.Student_name);
            Assert.Equal("bob@test.com", firstPlace.Student_email);
            Assert.Equal(98, firstPlace.Score);
            Assert.Equal(ReviewStatus.Reviewed, firstPlace.Review_status);

            Assert.Equal("Alice Johnson", secondPlace.Student_name);
            Assert.Equal(85, secondPlace.Score);
            Assert.Equal(ReviewStatus.Reviewed, secondPlace.Review_status);
        }

        [Fact]
        public async Task GetLeaderboard_SumsMultipleJudgeScores_PerPost()
        {
            // Arrange
            int targetEventId = 3;

            var student = new Student { Id = 1, fullname = "Carol White", university = "UCT", userId = 1 };
            var post = new Post { Id = 20, eventId = targetEventId, title = "Carol Entry", studentId = 1, Student = student };

            // Two judges score the same post — scores should be summed
            var mark1 = new JudgeMarkScheme { Id = 1, PostId = 20, JudgeId = 1, Score = 40 };
            var mark2 = new JudgeMarkScheme { Id = 2, PostId = 20, JudgeId = 2, Score = 55 };

            _context.Post.Add(post);
            _context.JudgeMarkScheme.AddRange(mark1, mark2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetLeaderboard(targetEventId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var leaderboard = Assert.IsAssignableFrom<IEnumerable<LeaderboardEntryReadDTO>>(okResult.Value).ToList();

            Assert.Single(leaderboard);
            Assert.Equal(95, leaderboard[0].Score); // 40 + 55
        }

        [Fact]
        public async Task GetLeaderboard_SetsUnreviewed_WhenNoMarkSchemeExists()
        {
            // Arrange
            int targetEventId = 1;

            var student = new Student { Id = 1, fullname = "Dave Brown", university = "UJ", userId = 1 };
            var post = new Post { Id = 30, eventId = targetEventId, title = "Unscored Post", studentId = 1, Student = student };

            // No JudgeMarkScheme entries for this post
            _context.Post.Add(post);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetLeaderboard(targetEventId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var leaderboard = Assert.IsAssignableFrom<IEnumerable<LeaderboardEntryReadDTO>>(okResult.Value).ToList();

            Assert.Single(leaderboard);
            Assert.Equal(0, leaderboard[0].Score);
            Assert.Equal(ReviewStatus.Unreviewed, leaderboard[0].Review_status);
            Assert.Equal("Dave Brown", leaderboard[0].Student_name);
        }

        [Fact]
        public async Task GetLeaderboard_HandlesMissingStudentGracefully()
        {
            // Arrange
            int targetEventId = 1;

            var post = new Post
            {
                Id = 40,
                eventId = targetEventId,
                title = "Orphaned Post",
                studentId = 99, // No matching student
                Student = null
            };

            _context.Post.Add(post);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetLeaderboard(targetEventId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var leaderboard = Assert.IsAssignableFrom<IEnumerable<LeaderboardEntryReadDTO>>(okResult.Value).ToList();

            Assert.Single(leaderboard);
            Assert.Equal("Unknown", leaderboard[0].Student_name);
            Assert.Null(leaderboard[0].Student_email);
        }
    }
}