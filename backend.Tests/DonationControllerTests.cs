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
using SheDesign.DTOs;

namespace SheDesign.Tests
{
    public class DonationControllerTests : IDisposable
    {
        private readonly SheDesignContext _context;
        private readonly DonationController _controller;

        public DonationControllerTests()
        {
            // Setup an isolated InMemory Database for each test run
            var options = new DbContextOptionsBuilder<SheDesignContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SheDesignContext(options);
            _context.Database.EnsureCreated();

            _controller = new DonationController(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetDonation_ReturnsAllDonationsMappedToReadDTO()
        {
            // Arrange
            _context.Donation.AddRange(new List<Donation>
            {
                new Donation { Id = 1, donor_name = "Alice", amount = 150.0f, date = DateTime.UtcNow },
                new Donation { Id = 2, donor_name = "Bob", amount = 250.0f, date = DateTime.UtcNow }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetDonation();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<DonationReadDTO>>>(result);
            var donations = Assert.IsAssignableFrom<IEnumerable<DonationReadDTO>>(actionResult.Value);
            Assert.Equal(2, donations.Count());
            Assert.Contains(donations, d => d.Donor_name == "Alice");
        }

        [Fact]
        public async Task GetDonationById_ReturnsReadDTO_WhenDonationExists()
        {
            // Arrange
            var testDonation = new Donation { Id = 10, donor_name = "Charlie", amount = 500.0f, date = DateTime.UtcNow };
            _context.Donation.Add(testDonation);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetDonation(10);

            // Assert
            var actionResult = Assert.IsType<ActionResult<DonationReadDTO>>(result);
            var donationDto = Assert.IsType<DonationReadDTO>(actionResult.Value);
            Assert.Equal("Charlie", donationDto.Donor_name);
            Assert.Equal(500.0f, donationDto.Amount);
        }

        [Fact]
        public async Task GetDonationById_ReturnsNotFound_WhenIdDoesNotExist()
        {
            // Act
            var result = await _controller.GetDonation(99);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetDonationTotals_ReturnsCorrectSum()
        {
            // Arrange
            _context.Donation.AddRange(new List<Donation>
            {
                new Donation { Id = 1, amount = 100.50f },
                new Donation { Id = 2, amount = 200.25f }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetDonationTotals();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            
            // Accessing properties of the anonymous object response via reflection
            var totalDonationsProperty = okResult.Value.GetType().GetProperty("total_Donations");
            var totalSum = (float)totalDonationsProperty.GetValue(okResult.Value, null);

            Assert.Equal(300.75f, totalSum);
        }

        [Fact]
        public async Task PostDonation_ReturnsCreatedAtAction_AndSavesRecord()
        {
            // Arrange
            var createDto = new DonationCreateDTO
            {
                Donor_name = "Diana",
                EventId = 3,
                Amount = 1000.0f,
                Notes = "Corporate sponsorship"
            };

            // Act
            var result = await _controller.PostDonation(createDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedDto = Assert.IsType<DonationReadDTO>(createdAtActionResult.Value);
            
            Assert.Equal("Diana", returnedDto.Donor_name);
            Assert.True(returnedDto.Id > 0);

            // Verify entry matches DB state
            var dbDonation = await _context.Donation.FindAsync(returnedDto.Id);
            Assert.NotNull(dbDonation);
            Assert.Equal(1000.0f, dbDonation.amount);
        }

        [Fact]
        public async Task PutDonation_ModifiesExistingEntityProperties()
        {
            // Arrange
            var originalDonation = new Donation { Id = 5, donor_name = "Evan", amount = 50.0f };
            _context.Donation.Add(originalDonation);
            await _context.SaveChangesAsync();
            _context.Entry(originalDonation).State = EntityState.Detached;

            var updateDto = new DonationCreateDTO
            {
                Donor_name = "Evan Updated",
                EventId = 1,
                Amount = 75.0f,
                Notes = "Added top-up"
            };

            // Act
            var result = await _controller.PutDonation(5, updateDto);

            // Assert
            Assert.IsType<NoContentResult>(result);

            var dbDonation = await _context.Donation.FindAsync(5);
            Assert.Equal("Evan Updated", dbDonation.donor_name);
            Assert.Equal(75.0f, dbDonation.amount);
            Assert.Equal("Added top-up", dbDonation.notes);
        }

        [Fact]
        public async Task DeleteDonation_RemovesRecordFromContext_WhenSuccessful()
        {
            // Arrange
            var donation = new Donation { Id = 8, donor_name = "Frank", amount = 20.0f };
            _context.Donation.Add(donation);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteDonation(8);

            // Assert
            Assert.IsType<NoContentResult>(result);

            var dbDonation = await _context.Donation.FindAsync(8);
            Assert.Null(dbDonation);
        }
    }
}