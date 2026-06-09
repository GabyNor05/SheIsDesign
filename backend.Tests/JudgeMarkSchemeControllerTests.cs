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
    public class JudgeMarkSchemeControllerTests : IDisposable
    {
        private readonly SheDesignContext _context;
        private readonly JudgeMarkSchemeController _controller;

        public JudgeMarkSchemeControllerTests()
        {
            // Build an isolated database configuration context per test iteration
            var options = new DbContextOptionsBuilder<SheDesignContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SheDesignContext(options);
            _context.Database.EnsureCreated();

            _controller = new JudgeMarkSchemeController(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetJudgeMarkScheme_ReturnsAllRecords()
        {
            // Arrange
            _context.JudgeMarkScheme.AddRange(new List<JudgeMarkScheme>
            {
                new JudgeMarkScheme { Id = 1, PostId = 10, JudgeId = 2, Score = 85, Comment = "Good work" },
                new JudgeMarkScheme { Id = 2, PostId = 11, JudgeId = 3, Score = 92, Comment = "Exceptional UI" }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetJudgeMarkScheme();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<JudgeMarkScheme>>>(result);
            var schemes = Assert.IsAssignableFrom<IEnumerable<JudgeMarkScheme>>(actionResult.Value);
            Assert.Equal(2, schemes.Count());
        }

        [Fact]
        public async Task GetJudgeMarkSchemeById_ReturnsRecord_WhenIdExists()
        {
            // Arrange
            var entry = new JudgeMarkScheme { Id = 5, PostId = 20, JudgeId = 4, Score = 78, Comment = "Solid attempt" };
            _context.JudgeMarkScheme.Add(entry);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetJudgeMarkScheme(5);

            // Assert
            var actionResult = Assert.IsType<ActionResult<JudgeMarkScheme>>(result);
            var returnedScheme = Assert.IsType<JudgeMarkScheme>(actionResult.Value);
            Assert.Equal(78, returnedScheme.Score);
            Assert.Equal("Solid attempt", returnedScheme.Comment);
        }

        [Fact]
        public async Task GetJudgeMarkSchemeById_ReturnsNotFound_WhenIdDoesNotExist()
        {
            // Act
            var result = await _controller.GetJudgeMarkScheme(99);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PutJudgeMarkScheme_ReturnsBadRequest_WhenIdsMismatched()
        {
            // Arrange
            var schemeToUpdate = new JudgeMarkScheme { Id = 1, PostId = 5, JudgeId = 2, Score = 80 };

            // Act
            var result = await _controller.PutJudgeMarkScheme(2, schemeToUpdate); // Route ID 2 != Object ID 1

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task PutJudgeMarkScheme_ReturnsNoContent_AndPersistsChangesOnSuccess()
        {
            // Arrange
            var scheme = new JudgeMarkScheme { Id = 10, PostId = 5, JudgeId = 2, Score = 80, Comment = "Initial feedback" };
            _context.JudgeMarkScheme.Add(scheme);
            await _context.SaveChangesAsync();

            // Detach entity instance state tracking to prevent local cache overwrites
            _context.Entry(scheme).State = EntityState.Detached;

            var updatedScheme = new JudgeMarkScheme { Id = 10, PostId = 5, JudgeId = 2, Score = 95, Comment = "Revised feedback" };

            // Act
            var result = await _controller.PutJudgeMarkScheme(10, updatedScheme);

            // Assert
            Assert.IsType<NoContentResult>(result);

            var dbRecord = await _context.JudgeMarkScheme.FindAsync(10);
            Assert.Equal(95, dbRecord.Score);
            Assert.Equal("Revised feedback", dbRecord.Comment);
        }

        [Fact]
        public async Task PostJudgeMarkScheme_PersistsEntity_AndReturnsCreatedActionWithDTO()
        {
            // Arrange
            var dto = new JudgeMarkSchemeCreateDTO
            {
                PostId = 15,
                JudgeId = 3,
                Score = 88,
                Comment = "Looks clean"
            };

            // Act
            var result = await _controller.PostJudgeMarkScheme(dto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedDto = Assert.IsType<JudgeMarkSchemeCreateDTO>(createdAtActionResult.Value);
            
            // Validate returned representation targets DTO values correctly
            Assert.Equal("Looks clean", returnedDto.Comment);
            Assert.Equal(88, returnedDto.Score);
            Assert.Equal("GetJudgeMarkScheme", createdAtActionResult.ActionName);

            // Verify a backing backend record was generated under the hood inside the Context
            var generatedId = Convert.ToInt32(createdAtActionResult.RouteValues["id"]);
            var dbRecord = await _context.JudgeMarkScheme.FindAsync(generatedId);
            
            Assert.NotNull(dbRecord);
            Assert.Equal(15, dbRecord.PostId);
            Assert.Equal(3, dbRecord.JudgeId);
            // Verify structural timestamp application logic route triggered successfully
            Assert.True((DateTime.UtcNow - dbRecord.TimeStamp).TotalSeconds < 5);
        }

        [Fact]
        public async Task DeleteJudgeMarkScheme_RemovesRecordFromContext()
        {
            // Arrange
            var scheme = new JudgeMarkScheme { Id = 30, PostId = 5, JudgeId = 1, Score = 60 };
            _context.JudgeMarkScheme.Add(scheme);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteJudgeMarkScheme(30);

            // Assert
            Assert.IsType<NoContentResult>(result);

            var dbRecord = await _context.JudgeMarkScheme.FindAsync(30);
            Assert.Null(dbRecord);
        }

        [Fact]
        public async Task DeleteJudgeMarkScheme_ReturnsNotFound_WhenRecordMissing()
        {
            // Act
            var result = await _controller.DeleteJudgeMarkScheme(404);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}