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
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Post>>>(result);
            var posts = Assert.IsAssignableFrom<IEnumerable<Post>>(actionResult.Value);
            Assert.Equal(2, posts.Count());
            Assert.Contains(posts, p => p.title == "First Announcement");
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
            var actionResult = Assert.IsType<ActionResult<Post>>(result);
            var post = Assert.IsType<Post>(actionResult.Value);
            Assert.Equal("Community Spotlight", post.title);
            Assert.Equal("Featuring members", post.description);
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
            var postToUpdate = new Post { Id = 1, title = "Mismatched ID Post" };

            // Act
            var result = await _controller.PutPost(2, postToUpdate); // Route ID is 2, object ID is 1

            // Assert
            Assert.IsType<BadRequestResult>(result);
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
            
            // Detach to avoid EF tracking conflicts with the update model instance
            _context.Entry(post).State = EntityState.Detached;

            var updatedPost = new Post 
            { 
                Id = 5, 
                title = "Modified Title", 
                description = "New context", 
                status = "Published",
                studentId = 3,
                Student = mockStudent
            };

            // Act
            var result = await _controller.PutPost(5, updatedPost);

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
            var mockStudent = new Student { Id = 4, fullname = "Bob Ross" };
            var newPost = new Post
            {
                Id = 12,
                title = "New Resource Entry",
                description = "Check out our tutorials list.",
                category = "Education",
                studentId = 4,
                Student = mockStudent,
                link_count = 5
                // comment_count default (0) and post_date default (DateTime.Now) are evaluated here
            };

            // Act
            var result = await _controller.PostPost(newPost);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedPost = Assert.IsType<Post>(createdAtActionResult.Value);
            
            Assert.Equal("New Resource Entry", returnedPost.title);
            Assert.Equal("GetPost", createdAtActionResult.ActionName);
            Assert.Equal(0, returnedPost.comment_count); // Ensures model default state handles correctly

            // Verify entry via backend context layer
            var dbPost = await _context.Post.FindAsync(returnedPost.Id);
            Assert.NotNull(dbPost);
            Assert.Equal("Check out our tutorials list.", dbPost.description);
            Assert.Equal(5, dbPost.link_count);
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