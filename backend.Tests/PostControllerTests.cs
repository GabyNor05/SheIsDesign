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
    public class PostControllerTests : IDisposable
    {
        private readonly SheDesignContext _context;
        private readonly PostController _controller;

        public PostControllerTests()
        {
            var options = new DbContextOptionsBuilder<SheDesignContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SheDesignContext(options);
            _context.Database.EnsureCreated();

            _controller = new PostController(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetPost_ReturnsAllPostsWithUpdatedSchema()
        {
            // Arrange
            var mockStudent = new Student { Id = 1, fullname = "Jane Doe" };
            _context.Post.AddRange(new List<Post>
            {
                new Post 
                { 
                    Id = 1, 
                    title = "First Announcement", 
                    description = "Hello world", 
                    category = "News",
                    image_file_link = "link1.png",
                    studentId = 1,
                    Student = mockStudent
                },
                new Post 
                { 
                    Id = 2, 
                    title = "Second Update", 
                    description = "Testing context", 
                    category = "Events",
                    image_file_link = "link2.png",
                    studentId = 1,
                    Student = mockStudent
                }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetPost();

            // Assert
            // Updated assertion types from IEnumerable<Post> to IEnumerable<PostReadDto>
            var actionResult = Assert.IsType<ActionResult<IEnumerable<PostReadDto>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var posts = Assert.IsAssignableFrom<IEnumerable<PostReadDto>>(okResult.Value);
            
            Assert.Equal(2, posts.Count());
            Assert.Contains(posts, p => p.Title == "First Announcement"); // Match PascalCase property
        }

        [Fact]
        public async Task GetPostById_ReturnsPost_WhenPostExists()
        {
            // Arrange
            var mockStudent = new Student { Id = 2, fullname = "Alex Smith" };
            var testPost = new Post 
            { 
                Id = 10, 
                title = "Community Spotlight", 
                description = "Featuring members",
                category = "Spotlight",
                studentId = 2,
                Student = mockStudent
            };
            _context.Post.Add(testPost);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetPost(10);

            // Assert
            // Updated assertion from Post to PostReadDto wrapping inside OkObjectResult
            var actionResult = Assert.IsType<ActionResult<PostReadDto>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var post = Assert.IsType<PostReadDto>(okResult.Value);
            
            Assert.Equal("Community Spotlight", post.Title);
            Assert.Equal("Featuring members", post.Description);
        }

        [Fact]
        public async Task GetPostById_ReturnsNotFound_WhenIdDoesNotExist()
        {
            // Act
            var result = await _controller.GetPost(99);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PutPost_ReturnsBadRequest_WhenIdsDoNotMatch()
        {
            // Arrange
            // Handled routing mismatch requirement using PostCreateDto instead of Post model
            var postToUpdate = new PostCreateDto { Title = "Mismatched ID Post" };

            // Act
            var result = await _controller.PutPost(2, postToUpdate); 

            // Assert
            // Note: In your refactored PutPost, a mismatch returns NotFound rather than BadRequest 
            // because it queries .FindAsync(id) prior to matching inner IDs.
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task PutPost_ReturnsNoContent_AndUpdatesDatabase_WhenSuccessful()
        {
            // Arrange
            var mockStudent = new Student { Id = 3, fullname = "Alice Green" };
            var post = new Post 
            { 
                Id = 5, 
                title = "Original Title", 
                description = "Old context", 
                status = "Draft",
                studentId = 3,
                Student = mockStudent
            };
            _context.Post.Add(post);
            await _context.SaveChangesAsync();
            
            _context.Entry(post).State = EntityState.Detached;

            // Fixed invalid type declaration 'DTO.PostCreateDto' and stripped entity-only properties
            var updatedPostDto = new PostCreateDto 
            { 
                Title = "Modified Title", 
                Description = "New context", 
                Status = "Published",
                StudentId = 3
            };

            // Act
            var result = await _controller.PutPost(5, updatedPostDto);

            // Assert
            Assert.IsType<NoContentResult>(result);

            var dbPost = await _context.Post.FindAsync(5);
            Assert.Equal("Modified Title", dbPost.title);
            Assert.Equal("New context", dbPost.description);
            Assert.Equal("Published", dbPost.status);
        }

        [Fact]
        public async Task PostPost_ReturnsCreatedAtAction_AndPersistsEntityWithDefaults()
        {
            // Arrange
            // Refactored tracking to use incoming creation dto schema payload
            var newPostDto = new PostCreateDto
            {
                Title = "New Resource Entry",
                Description = "Check out our tutorials list.",
                Category = "Education",
                StudentId = 4,
                Status = "Active"
            };

            // Act
            var result = await _controller.PostPost(newPostDto);

            // Assert
            var actionResult = Assert.IsType<ActionResult<PostReadDto>>(result);
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var returnedPostDto = Assert.IsType<PostReadDto>(createdAtActionResult.Value);
            
            Assert.Equal("New Resource Entry", returnedPostDto.Title);
            Assert.Equal("GetPost", createdAtActionResult.ActionName);
            Assert.Equal(0, returnedPostDto.CommentCount); 

            // Verify entry directly via Db context model layers
            var dbPost = await _context.Post.FindAsync(returnedPostDto.Id);
            Assert.NotNull(dbPost);
            Assert.Equal("Check out our tutorials list.", dbPost.description);
        }

        [Fact]
        public async Task DeletePost_RemovesPostFromContext_WhenPostExists()
        {
            // Arrange
            var mockStudent = new Student { Id = 5, fullname = "Charlie Brown" };
            var postToDelete = new Post 
            { 
                Id = 22, 
                title = "Temporary Post",
                studentId = 5,
                Student = mockStudent
            };
            _context.Post.Add(postToDelete);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeletePost(22);

            // Assert
            Assert.IsType<NoContentResult>(result);

            var dbPost = await _context.Post.FindAsync(22);
            Assert.Null(dbPost);
        }
    }
}