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
        public async Task GetJudgeMarkScheme_ReturnsAllRecordsMappedToReadDTO()
        {
            // Arrange
            var mockIp = new IndustryProfessional { Id = 1, fullname = "Professor McGonagall" };
            var mockJudge = new Judge { Id = 2, IndustryProfessionalID = 1, IndustryProfessional = mockIp };
            var mockPost = new Post { Id = 10, title = "Transfiguration Portfolio" };

            _context.JudgeMarkScheme.AddRange(new List<JudgeMarkScheme>
            {
                new JudgeMarkScheme { Id = 1, PostId = 10, JudgeId = 2, Score = 85, Comment = "Good work", Judge = mockJudge, Post = mockPost },
                new JudgeMarkScheme { Id = 2, PostId = 11, JudgeId = 3, Score = 92, Comment = "Exceptional UI" } // Left orphan intentionally to test fallback logic
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetJudgeMarkScheme();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<JudgeMarkSchemeReadDTO>>>(result);
            var schemes = Assert.IsAssignableFrom<IEnumerable<JudgeMarkSchemeReadDTO>>(actionResult.Value).ToList();
            
            Assert.Equal(2, schemes.Count);
            
            // Validate that multi-hop flattening projection mapped nested entities correctly
            var populatedDto = schemes.First(s => s.Id == 1);
            Assert.Equal("Professor McGonagall", populatedDto.JudgeName);
            Assert.Equal("Transfiguration Portfolio", populatedDto.PostTitle);

            // Validate that the orphan entry safely defaults to standard text boundaries
            var fallbackDto = schemes.First(s => s.Id == 2);
            Assert.Equal("Unknown Judge", fallbackDto.JudgeName);
            Assert.Equal("Untitled Post", fallbackDto.PostTitle);
        }

        [Fact]
        public async Task GetJudgeMarkSchemeById_ReturnsReadDTO_WhenIdExists()
        {
            // Arrange
            var mockIp = new IndustryProfessional { Id = 2, fullname = "Albus Dumbledore" };
            var mockJudge = new Judge { Id = 4, IndustryProfessionalID = 2, IndustryProfessional = mockIp };
            var mockPost = new Post { Id = 20, title = "Dark Arts Defense Project" };
            
            var entry = new JudgeMarkScheme 
            { 
                Id = 5, 
                PostId = 20, 
                JudgeId = 4, 
                Score = 99, 
                Comment = "Flawless execution",
                Judge = mockJudge,
                Post = mockPost
            };
            _context.JudgeMarkScheme.Add(entry);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetJudgeMarkScheme(5);

            // Assert
            var actionResult = Assert.IsType<ActionResult<JudgeMarkSchemeReadDTO>>(result);
            var returnedSchemeDto = Assert.IsType<JudgeMarkSchemeReadDTO>(actionResult.Value);
            
            Assert.Equal(99, returnedSchemeDto.Score);
            Assert.Equal("Albus Dumbledore", returnedSchemeDto.JudgeName);
            Assert.Equal("Dark Arts Defense Project", returnedSchemeDto.PostTitle);
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
            var result = await _controller.PutJudgeMarkScheme(2, schemeToUpdate);

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
        public async Task PostJudgeMarkScheme_PersistsEntity_AndReturnsCreatedActionWithPopulatedReadDTO()
        {
            // Arrange
            var mockIp = new IndustryProfessional { Id = 3, fullname = "Severus Snape" };
            var mockJudge = new Judge { Id = 3, IndustryProfessionalID = 3, IndustryProfessional = mockIp };
            var mockPost = new Post { Id = 15, title = "Potions Lab Report" };
            
            _context.IndustryProfessional.Add(mockIp);
            _context.Judge.Add(mockJudge);
            _context.Post.Add(mockPost);
            await _context.SaveChangesAsync();

            var createDto = new JudgeMarkSchemeCreateDTO
            {
                PostId = 15,
                JudgeId = 3,
                Score = 88,
                Comment = "Acceptable execution"
            };

            // Act
            var result = await _controller.PostJudgeMarkScheme(createDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedReadDto = Assert.IsType<JudgeMarkSchemeReadDTO>(createdAtActionResult.Value);
            
            // Verify that the response payload contains the multi-hop flattened data points 
            Assert.Equal("Acceptable execution", returnedReadDto.Comment);
            Assert.Equal(88, returnedReadDto.Score);
            Assert.Equal("Severus Snape", returnedReadDto.JudgeName);
            Assert.Equal("Potions Lab Report", returnedReadDto.PostTitle);
            Assert.Equal("GetJudgeMarkScheme", createdAtActionResult.ActionName);

            // Verify a backing backend record was generated successfully
            var dbRecord = await _context.JudgeMarkScheme.FindAsync(returnedReadDto.Id);
            Assert.NotNull(dbRecord);
            Assert.Equal(15, dbRecord.PostId);
            Assert.Equal(3, dbRecord.JudgeId);
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
    }
}