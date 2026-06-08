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
    public class EventControllerTests : IDisposable
    {
        private readonly SheDesignContext _context;
        private readonly EventController _controller;

        public EventControllerTests()
        {
            // 1. Setup InMemory Database unique for each test run
            var options = new DbContextOptionsBuilder<SheDesignContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SheDesignContext(options);
            _context.Database.EnsureCreated();

            // 2. Instantiate controller with the in-memory context
            _controller = new EventController(_context);
        }

        // Cleanup after every test
        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetEvent_ReturnsAllEventsMappedToDTO()
        {
            // Arrange
            var testEvent = new Event { Id = 1, Title = "Tech Conference", Status = "open" };
            _context.Event.Add(testEvent);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetEvent();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<EventReadDTO>>>(result);
            var value = Assert.IsAssignableFrom<IEnumerable<EventReadDTO>>(actionResult.Value);
            
            Assert.Single(value);
            Assert.Equal("Tech Conference", value.First().Title);
        }

        [Fact]
        public async Task GetEventById_ReturnsNotFound_WhenEventDoesNotExist()
        {
            // Act
            var result = await _controller.GetEvent(99);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetEventsByStatus_ReturnsOk_WithMatchingEvents()
        {
            // Arrange
            _context.Event.AddRange(new List<Event>
            {
                new Event { Id = 1, Title = "E1", Status = "open" },
                new Event { Id = 2, Title = "E2", Status = "closed" }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetEventsByStatus("open");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var events = Assert.IsAssignableFrom<IEnumerable<Event>>(okResult.Value);
            Assert.Single(events);
            Assert.Equal("E1", events.First().Title);
        }

        [Fact]
        public async Task GetEventsStatsByCategory_ReturnsCorrectCounts()
        {
            // Arrange
            string targetCategory = "Workshops";
            _context.Event.AddRange(new List<Event>
            {
                new Event { Id = 1, Category = targetCategory, Status = "open" },
                new Event { Id = 2, Category = targetCategory, Status = "drafted" },
                new Event { Id = 3, Category = targetCategory, Status = "closed" },
                new Event { Id = 4, Category = "OtherCategory", Status = "open" }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetEventsStatsByCategory(targetCategory);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var dto = Assert.IsType<EventStatisticsDTO>(okResult.Value);
            
            Assert.Equal(1, dto.openCount);
            Assert.Equal(1, dto.draftCount);
            Assert.Equal(1, dto.closedCount);
        }

        [Fact]
        public async Task PostEvent_ReturnsCreatedAtAction_AndAddsToDatabase()
        {
            // Arrange
            var createDto = new EventCreateDTO
            {
                Title = "Hackathon",
                Status = "drafted",
                Start_date = DateTime.UtcNow
            };

            // Act
            var result = await _controller.PostEvent(createDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedDto = Assert.IsType<EventReadDTO>(createdAtActionResult.Value);
            
            Assert.Equal("Hackathon", returnedDto.Title);
            
            // Verify it was actually saved to the in-memory database
            var dbEvent = await _context.Event.FindAsync(returnedDto.Id);
            Assert.NotNull(dbEvent);
            Assert.Equal("Hackathon", dbEvent.Title);
        }

        [Fact]
        public async Task DeleteEvent_ReturnsNoContent_WhenSuccessful()
        {
            // Arrange
            var testEvent = new Event { Id = 5, Title = "To Delete" };
            _context.Event.Add(testEvent);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteEvent(5);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var dbEvent = await _context.Event.FindAsync(5);
            Assert.Null(dbEvent); // Should be gone
        }
    }
}