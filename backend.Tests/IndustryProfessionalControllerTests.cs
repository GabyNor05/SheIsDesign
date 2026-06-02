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
    public class IndustryProfessionalControllerTests : IDisposable
    {
        private readonly SheDesignContext _context;
        private readonly IndustryProfessionalController _controller;

        public IndustryProfessionalControllerTests()
        {
            var options = new DbContextOptionsBuilder<SheDesignContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SheDesignContext(options);
            _context.Database.EnsureCreated();

            _controller = new IndustryProfessionalController(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetAll_ReturnsAllProfessionalsFromContext()
        {
            // Arrange
            _context.IndustryProfessional.AddRange(new List<IndustryProfessional>
            {
                new IndustryProfessional { Id = 1, institution = "Tech Corp", job_title = "Senior Designer", userId = 10 },
                new IndustryProfessional { Id = 2, institution = "Design Studio", job_title = "Creative Director", userId = 11 }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetAll();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<IndustryProfessional>>>(result);
            var professionals = Assert.IsAssignableFrom<IEnumerable<IndustryProfessional>>(actionResult.Value);
            Assert.Equal(2, professionals.Count());
            Assert.Contains(professionals, ip => ip.job_title == "Senior Designer");
        }

        [Fact]
        public async Task GetById_ReturnsProfessional_WhenRecordExists()
        {
            // Arrange
            var professional = new IndustryProfessional 
            { 
                Id = 5, 
                institution = "Global Innovation Inc", 
                job_title = "Product Manager", 
                userId = 25 
            };
            _context.IndustryProfessional.Add(professional);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetById(5);

            // Assert
            var actionResult = Assert.IsType<ActionResult<IndustryProfessional>>(result);
            var returnedIp = Assert.IsType<IndustryProfessional>(actionResult.Value);
            Assert.Equal("Global Innovation Inc", returnedIp.institution);
            Assert.Equal("Product Manager", returnedIp.job_title);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenIdDoesNotExist()
        {
            // Act
            var result = await _controller.GetById(999);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task Post_MapsDTOToEntity_SavesToDatabase_AndReturnsCreatedAtAction()
        {
            // Arrange
            var createDto = new IndustryProfessionalCreateDTO
            {
                institution = "Aviation Design Group",
                job_title = "Lead UX Researcher",
                userId = 42
            };

            // Act
            var result = await _controller.Post(createDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedIp = Assert.IsType<IndustryProfessional>(createdAtActionResult.Value);
            
            Assert.Equal("Aviation Design Group", returnedIp.institution);
            Assert.Equal("Lead UX Researcher", returnedIp.job_title);
            Assert.Equal(42, returnedIp.userId);
            Assert.True(returnedIp.Id > 0); // Verifies the In-Memory DB auto-assigned an incremental primary key
            Assert.Equal(nameof(_controller.GetById), createdAtActionResult.ActionName);

            // Double check it actually landed in the DB context state
            var dbRecord = await _context.IndustryProfessional.FindAsync(returnedIp.Id);
            Assert.NotNull(dbRecord);
            Assert.Equal("Lead UX Researcher", dbRecord.job_title);
        }

        [Fact]
        public async Task Delete_RemovesRecordFromContext_WhenProfessionalExists()
        {
            // Arrange
            var professionalToDelete = new IndustryProfessional 
            { 
                Id = 12, 
                institution = "Freeland Design", 
                job_title = "Consultant", 
                userId = 80 
            };
            _context.IndustryProfessional.Add(professionalToDelete);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.Delete(12);

            // Assert
            Assert.IsType<NoContentResult>(result);

            // Confirm database omission
            var dbRecord = await _context.IndustryProfessional.FindAsync(12);
            Assert.Null(dbRecord);
        }

        [Fact]
        public async Task Delete_ReturnsNotFound_WhenIdDoesNotExist()
        {
            // Act
            var result = await _controller.Delete(888);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}