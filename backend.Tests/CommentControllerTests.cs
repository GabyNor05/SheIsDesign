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
    public class CommentControllerTests : IDisposable
    {
        private readonly SheDesignContext _context;
        private readonly CommentController _controller;

        public CommentControllerTests()
        {
            var options = new DbContextOptionsBuilder<SheDesignContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SheDesignContext(options);
            _context.Database.EnsureCreated();

            _controller = new CommentController(_context);
        }

        [Fact]
        public async Task GetComment_ReturnsAllComments()
        {
            // Arrange
            _context.Comment.AddRange(new List<Comment>
            {
                new Comment { Id = 1, body = "Great post!", userId = 101, studentId = 201 },
                new Comment { Id = 2, body = "Very informative.", userId = 102, studentId = 202 }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetComment();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Comment>>>(result);
            var comments = Assert.IsAssignableFrom<IEnumerable<Comment>>(actionResult.Value);
            
            Assert.Equal(2, comments.Count());
        }

        [Fact]
        public async Task GetCommentById_ReturnsComment_WhenCommentExists()
        {
            // Arrange
            var testComment = new Comment { Id = 10, body = "Looking looking good!", userId = 101, studentId = 201 };
            _context.Comment.Add(testComment);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetComment(10);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Comment>>(result);
            var comment = Assert.IsType<Comment>(actionResult.Value);
            Assert.Equal("Looking looking good!", comment.body);
        }

        [Fact]
        public async Task GetCommentById_ReturnsNotFound_WhenCommentDoesNotExist()
        {
            // Act
            var result = await _controller.GetComment(99);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PutComment_ReturnsNoContent_WhenUpdateIsSuccessful()
        {
            // Arrange
            var originalComment = new Comment { Id = 1, body = "Original Text", userId = 101, studentId = 201 };
            _context.Comment.Add(originalComment);
            await _context.SaveChangesAsync();

            _context.Entry(originalComment).State = EntityState.Detached;

            var updatedComment = new Comment { Id = 1, body = "Updated Text", userId = 101, studentId = 201 };

            // Act
            var result = await _controller.PutComment(1, updatedComment);

            // Assert
            Assert.IsType<NoContentResult>(result);
            
            var dbComment = await _context.Comment.FindAsync(1);
            Assert.NotNull(dbComment);
            Assert.Equal("Updated Text", dbComment.body);
        }

        [Fact]
        public async Task PutComment_ReturnsBadRequest_WhenIdMismatch()
        {
            // Arrange
            var mismatchedComment = new Comment { Id = 5, body = "Mismatched", userId = 101, studentId = 201 };

            // Act
            var result = await _controller.PutComment(1, mismatchedComment);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task PutComment_ReturnsNotFound_WhenConcurrencyExceptionAndCommentMissing()
        {
            // Arrange
            var nonExistentComment = new Comment { Id = 99, body = "Doesn't exist in DB", userId = 101, studentId = 201 };
            _context.Entry(nonExistentComment).State = EntityState.Modified;

            // Act
            var result = await _controller.PutComment(99, nonExistentComment);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task PostComment_ReturnsCreatedAtAction_AndSavesToDatabase()
        {
            // Arrange
            var newComment = new Comment { body = "Fresh commentary", userId = 105, studentId = 205 };

            // Act
            var result = await _controller.PostComment(newComment);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedComment = Assert.IsType<Comment>(createdAtActionResult.Value);
            
            Assert.Equal("Fresh commentary", returnedComment.body);
            Assert.True(returnedComment.Id > 0);

            var dbComment = await _context.Comment.FindAsync(returnedComment.Id);
            Assert.NotNull(dbComment);
            Assert.Equal("Fresh commentary", dbComment.body);
        }

        [Fact]
        public async Task DeleteComment_ReturnsNoContent_WhenSuccessful()
        {
            // Arrange
            var targetComment = new Comment { Id = 42, body = "Goodbye world", userId = 101, studentId = 201 };
            _context.Comment.Add(targetComment);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteComment(42);

            // Assert
            Assert.IsType<NoContentResult>(result);

            var dbComment = await _context.Comment.FindAsync(42);
            Assert.Null(dbComment);
        }

        [Fact]
        public async Task DeleteComment_ReturnsNotFound_WhenCommentDoesNotExist()
        {
            // Act
            var result = await _controller.DeleteComment(999);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}