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
    public class SubmissionControllerTests : IDisposable
    {
        private readonly SheDesignContext _context;
        private readonly SubmissionController _controller;

        public SubmissionControllerTests()
        {
            var options = new DbContextOptionsBuilder<SheDesignContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SheDesignContext(options);
            _context.Database.EnsureCreated();

            _controller = new SubmissionController(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetSubmission_ReturnsAllSubmissionsMappedToReadDTO()
        {
            // Arrange
            _context.Submission.AddRange(new List<Submission>
            {
                new Submission { Id = 1, title = "Design Challenge A", status = "Pending" },
                new Submission { Id = 2, title = "Design Challenge B", status = "Approved" }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetSubmission();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<SubmissionReadDTO>>>(result);
            var submissions = Assert.IsAssignableFrom<IEnumerable<SubmissionReadDTO>>(actionResult.Value);
            Assert.Equal(2, submissions.Count());
            Assert.Contains(submissions, s => s.Title == "Design Challenge A");
        }

        [Fact]
        public async Task GetSubmissionById_ReturnsReadDTO_WhenSubmissionExists()
        {
            // Arrange
            var testSubmission = new Submission { Id = 10, title = "Portfolio Review", points = 85 };
            _context.Submission.Add(testSubmission);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetSubmission(10);

            // Assert
            var actionResult = Assert.IsType<ActionResult<SubmissionReadDTO>>(result);
            var dto = Assert.IsType<SubmissionReadDTO>(actionResult.Value);
            Assert.Equal("Portfolio Review", dto.Title);
            Assert.Equal(85, dto.Points);
        }

        [Fact]
        public async Task GetSubmissionDetails_ReturnsLeaderboardDTO_WithEagerLoadedRelationships()
        {
            // Arrange
            // Seed the deeply nested entities: User -> Student -> Submission
            var user = new User { Id = 1, Email = "student@university.com", PasswordHash = "hash" };
            var student = new Student { Id = 4, fullname = "Sarah Jenkins", User = user };
            var submission = new Submission 
            { 
                Id = 100, 
                title = "UI Design Concept", 
                status = "Reviewed", 
                points = 95, 
                rank = 1, 
                Student = student 
            };

            _context.Submission.Add(submission);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetSubmissionDetails(100);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var dto = Assert.IsType<LeaderboardTotalReadDTO>(okResult.Value);
            
            Assert.Equal("Sarah Jenkins", dto.Student_name);
            Assert.Equal("student@university.com", dto.Student_email);
            Assert.Equal("UI Design Concept", dto.Submission_title);
            Assert.Equal(95, dto.Score);
            Assert.Equal(1, dto.Rank);
        }

        [Fact]
        public async Task GetSubmissionDetails_ReturnsNotFound_WhenIdDoesNotExist()
        {
            // Act
            var result = await _controller.GetSubmissionDetails(999);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PostSubmission_SetsDefaultPendingStatus_AndReturnsCreatedAtAction()
        {
            // Arrange
            var createDto = new SubmissionCreateDTO
            {
                StudentId = 2,
                EventId = 5,
                Title = "Hackathon Submission"
            };

            // Act
            var result = await _controller.PostSubmission(createDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedDto = Assert.IsType<SubmissionReadDTO>(createdAtActionResult.Value);
            
            Assert.Equal("Hackathon Submission", returnedDto.Title);
            Assert.Equal("Pending", returnedDto.Status); // Verify default logic path

            // Verify it persists down to our backend context layer
            var dbSubmission = await _context.Submission.FindAsync(returnedDto.Id);
            Assert.NotNull(dbSubmission);
            Assert.Equal("Pending", dbSubmission.status);
        }

        [Fact]
        public async Task PutSubmission_UpdatesFieldsCorrectly_WhenSubmissionExists()
        {
            // Arrange
            var submission = new Submission { Id = 15, title = "Old Title", status = "Pending", points = 0, rank = 0 };
            _context.Submission.Add(submission);
            await _context.SaveChangesAsync();
            _context.Entry(submission).State = EntityState.Detached;

            var updateDto = new SubmissionUpdateDTO
            {
                Title = "New Title",
                Status = "Approved",
                Points = 90,
                Rank = 2
            };

            // Act
            var result = await _controller.PutSubmission(15, updateDto);

            // Assert
            Assert.IsType<NoContentResult>(result);

            var dbSubmission = await _context.Submission.FindAsync(15);
            Assert.Equal("New Title", dbSubmission.title);
            Assert.Equal("Approved", dbSubmission.status);
            Assert.Equal(90, dbSubmission.points);
            Assert.Equal(2, dbSubmission.rank);
        }

        [Fact]
        public async Task DeleteSubmission_RemovesFromContext()
        {
            // Arrange
            var submission = new Submission { Id = 30, title = "To Be Deleted" };
            _context.Submission.Add(submission);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteSubmission(30);

            // Assert
            Assert.IsType<NoContentResult>(result);
            
            var dbSubmission = await _context.Submission.FindAsync(30);
            Assert.Null(dbSubmission);
        }
    }
}