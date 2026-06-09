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
    public class JudgeControllerTests : IDisposable
    {
        private readonly SheDesignContext _context;
        private readonly JudgeController _controller;

        public JudgeControllerTests()
        {
            var options = new DbContextOptionsBuilder<SheDesignContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SheDesignContext(options);
            _context.Database.EnsureCreated();

            _controller = new JudgeController(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetJudge_ReturnsAllJudgesMappedToReadDTO()
        {
            // Arrange
            var mockIp1 = new IndustryProfessional { Id = 1, fullname = "Ada Lovelace", institution = "Analytical Labs", job_title = "Engine Lead", userId = 101 };
            var mockIp2 = new IndustryProfessional { Id = 2, fullname = "Grace Hopper", institution = "Navy Computing", job_title = "Systems Specialist", userId = 102 };

            _context.Judge.AddRange(new List<Judge>
            {
                new Judge { Id = 10, IndustryProfessionalID = 1, IndustryProfessional = mockIp1 },
                new Judge { Id = 11, IndustryProfessionalID = 2, IndustryProfessional = mockIp2 }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetJudge();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<JudgeReadDTO>>>(result);
            var judges = Assert.IsAssignableFrom<IEnumerable<JudgeReadDTO>>(actionResult.Value).ToList();

            Assert.Equal(2, judges.Count);
            
            var firstJudgeDto = judges.First(j => j.Id == 10);
            Assert.Equal("Ada Lovelace", firstJudgeDto.Fullname);
            Assert.Equal("Analytical Labs", firstJudgeDto.Institution);
            Assert.Equal("Engine Lead", firstJudgeDto.JobTitle);
            Assert.Equal(101, firstJudgeDto.UserId);
        }

        [Fact]
        public async Task GetJudgeById_ReturnsRawJudgeModel_WhenIdExists()
        {
            // Arrange
            var entry = new Judge { Id = 5, IndustryProfessionalID = 3 };
            _context.Judge.Add(entry);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetJudge(5);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Judge>>(result);
            var returnedJudge = Assert.IsType<Judge>(actionResult.Value);
            Assert.Equal(3, returnedJudge.IndustryProfessionalID);
        }

        [Fact]
        public async Task GetJudgeById_ReturnsNotFound_WhenIdDoesNotExist()
        {
            // Act
            var result = await _controller.GetJudge(99);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PutJudge_ReturnsBadRequest_WhenIdsDoNotMatch()
        {
            // Arrange
            var judgeToUpdate = new Judge { Id = 1, IndustryProfessionalID = 5 };

            // Act
            var result = await _controller.PutJudge(2, judgeToUpdate); // Route ID mismatch

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task PutJudge_ReturnsNoContent_AndSavesChangesOnSuccess()
        {
            // Arrange
            var judge = new Judge { Id = 8, IndustryProfessionalID = 4 };
            _context.Judge.Add(judge);
            await _context.SaveChangesAsync();

            _context.Entry(judge).State = EntityState.Detached;

            var updatedJudge = new Judge { Id = 8, IndustryProfessionalID = 12 };

            // Act
            var result = await _controller.PutJudge(8, updatedJudge);

            // Assert
            Assert.IsType<NoContentResult>(result);

            var dbRecord = await _context.Judge.FindAsync(8);
            Assert.Equal(12, dbRecord.IndustryProfessionalID);
        }

        [Fact]
        public async Task PostJudge_PersistsRecord_AndReturnsCreatedActionWithCreateDTO()
        {
            // Arrange
            var createDto = new JudgeCreateDTO
            {
                IndustryProfessionalId = 7
            };

            // Act
            var result = await _controller.PostJudge(createDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedDto = Assert.IsType<JudgeCreateDTO>(createdAtActionResult.Value);
            
            Assert.Equal(7, returnedDto.IndustryProfessionalId);
            Assert.Equal("GetJudge", createdAtActionResult.ActionName);

            // Confirm tracking assignment via database validation mapping
            var generatedId = Convert.ToInt32(createdAtActionResult.RouteValues["id"]);
            var dbRecord = await _context.Judge.FindAsync(generatedId);
            
            Assert.NotNull(dbRecord);
            Assert.Equal(7, dbRecord.IndustryProfessionalID);
        }

        [Fact]
        public async Task DeleteJudge_RemovesJudgeFromContext_WhenIdExists()
        {
            // Arrange
            var judgeToDelete = new Judge { Id = 15, IndustryProfessionalID = 9 };
            _context.Judge.Add(judgeToDelete);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteJudge(15);

            // Assert
            Assert.IsType<NoContentResult>(result);

            var dbRecord = await _context.Judge.FindAsync(15);
            Assert.Null(dbRecord);
        }

        [Fact]
        public async Task DeleteJudge_ReturnsNotFound_WhenIdMissing()
        {
            // Act
            var result = await _controller.DeleteJudge(404);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}