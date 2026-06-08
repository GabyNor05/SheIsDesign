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
    public class UserControllerTests : IDisposable
    {
        private readonly SheDesignContext _context;
        private readonly UserController _controller;

        public UserControllerTests()
        {
            var options = new DbContextOptionsBuilder<SheDesignContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SheDesignContext(options);
            _context.Database.EnsureCreated();

            _controller = new UserController(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetUsers_ReturnsAllUsersMappedToUserReadDTO()
        {
            // Arrange
            _context.Users.AddRange(new List<User>
            {
                new User { Id = 1, Email = "one@test.com", Role = "User", PasswordHash = "abc" },
                new User { Id = 2, Email = "two@test.com", Role = "Admin", PasswordHash = "xyz" }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetUsers();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<UserReadDTO>>>(result);
            var users = Assert.IsAssignableFrom<IEnumerable<UserReadDTO>>(actionResult.Value);
            Assert.Equal(2, users.Count());
            Assert.Contains(users, u => u.Email == "one@test.com");
        }

        [Fact]
        public async Task PostUser_HashesPassword_AndStoresDefaultRole()
        {
            // Arrange
            var dto = new UserCreateDTO
            {
                Email = "secure@test.com",
                Password = "SuperSecretPassword123"
            };

            // Act
            var result = await _controller.PostUser(dto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedDto = Assert.IsType<UserReadDTO>(createdAtActionResult.Value);
            
            Assert.Equal("secure@test.com", returnedDto.Email);
            Assert.Equal("User", returnedDto.Role);

            // Verify entry in the DB has a valid BCrypt hashed signature
            var dbUser = await _context.Users.FindAsync(returnedDto.Id);
            Assert.NotNull(dbUser);
            Assert.NotEqual("SuperSecretPassword123", dbUser.PasswordHash);
            Assert.True(BCrypt.Net.BCrypt.Verify("SuperSecretPassword123", dbUser.PasswordHash));
        }

        [Fact]
        public async Task Login_ReturnsUserReadDTO_WhenCredentialsAreValid()
        {
            // Arrange
            string clearTextPassword = "MySecurePassword!";
            string clearTextHash = BCrypt.Net.BCrypt.HashPassword(clearTextPassword);
            
            var testUser = new User 
            { 
                Id = 5, 
                Email = "auth@test.com", 
                PasswordHash = clearTextHash, 
                Role = "User" 
            };
            _context.Users.Add(testUser);
            await _context.SaveChangesAsync();

            var loginDto = new LoginDTO { Email = "auth@test.com", Password = clearTextPassword };

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedDto = Assert.IsType<UserReadDTO>(okResult.Value);
            Assert.Equal("auth@test.com", returnedDto.Email);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenUserDoesNotExist()
        {
            // Arrange
            var loginDto = new LoginDTO { Email = "nonexistent@test.com", Password = "somePassword" };

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("User Not Found", unauthorizedResult.Value);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenPasswordIsIncorrect()
        {
            // Arrange
            string truePassword = "CorrectPassword";
            string trueHash = BCrypt.Net.BCrypt.HashPassword(truePassword);
            
            var testUser = new User { Id = 8, Email = "wrongpass@test.com", PasswordHash = trueHash };
            _context.Users.Add(testUser);
            await _context.SaveChangesAsync();

            var loginDto = new LoginDTO { Email = "wrongpass@test.com", Password = "WrongPassword" };

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Incorrect Password", unauthorizedResult.Value);
        }

        [Fact]
        public async Task DeleteUser_RemovesUserFromContext()
        {
            // Arrange
            var user = new User { Id = 12, Email = "delete@test.com", PasswordHash = "hash" };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteUser(12);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var dbUser = await _context.Users.FindAsync(12);
            Assert.Null(dbUser);
        }
    }
}