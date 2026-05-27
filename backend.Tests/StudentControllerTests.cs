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
    public class StudentControllerTests : IDisposable
    {
        private readonly SheDesignContext _context;
        private readonly StudentController _controller;

        public StudentControllerTests()
        {
            var options = new DbContextOptionsBuilder<SheDesignContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SheDesignContext(options);
            _context.Database.EnsureCreated();

            _controller = new StudentController(_context);
        }

        [Fact]
        public async Task GetStudent_ReturnsAllStudents()
        {
            // Arrange
            _context.Student.AddRange(new List<Student>
            {
                new Student 
                { 
                    Id = 1, 
                    fullname = "Alice Smith", 
                    university = "MIT", 
                    student_number = "STU123", 
                    wants_volunteer = true 
                },
                new Student 
                { 
                    Id = 2, 
                    fullname = "Bob Jones", 
                    university = "Stanford", 
                    student_number = "STU456", 
                    wants_volunteer = false 
                }
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetStudent();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Student>>>(result);
            var students = Assert.IsAssignableFrom<IEnumerable<Student>>(actionResult.Value);
            
            Assert.Equal(2, students.Count());
        }

        [Fact]
        public async Task GetStudentById_ReturnsStudent_WhenStudentExists()
        {
            // Arrange
            var testStudent = new Student 
            { 
                Id = 10, 
                fullname = "Charlie Brown", 
                university = "Harvard", 
                student_number = "STU789" 
            };
            _context.Student.Add(testStudent);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetStudent(10);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Student>>(result);
            var student = Assert.IsType<Student>(actionResult.Value);
            Assert.Equal("Charlie Brown", student.fullname);
            Assert.Equal("STU789", student.student_number);
        }

        [Fact]
        public async Task GetStudentById_ReturnsNotFound_WhenStudentDoesNotExist()
        {
            // Act
            var result = await _controller.GetStudent(99);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PutStudent_ReturnsNoContent_WhenUpdateIsSuccessful()
        {
            // Arrange
            var originalStudent = new Student 
            { 
                Id = 1, 
                fullname = "Jane Doe", 
                university = "Oxford", 
                student_number = "STU111",
                wants_volunteer = false
            };
            _context.Student.Add(originalStudent);
            await _context.SaveChangesAsync();

            _context.Entry(originalStudent).State = EntityState.Detached;

            var updatedStudent = new Student 
            { 
                Id = 1, 
                fullname = "Jane Smith", 
                university = "Oxford", 
                student_number = "STU111",
                wants_volunteer = true 
            };

            // Act
            var result = await _controller.PutStudent(1, updatedStudent);

            // Assert
            Assert.IsType<NoContentResult>(result);
            
            var dbStudent = await _context.Student.FindAsync(1);
            Assert.NotNull(dbStudent);
            Assert.Equal("Jane Smith", dbStudent.fullname);
            Assert.True(dbStudent.wants_volunteer);
        }

        [Fact]
        public async Task PutStudent_ReturnsBadRequest_WhenIdMismatch()
        {
            // Arrange
            var mismatchedStudent = new Student { Id = 5, fullname = "Mismatched" };

            // Act
            var result = await _controller.PutStudent(1, mismatchedStudent);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task PutStudent_ReturnsNotFound_WhenConcurrencyExceptionAndStudentMissing()
        {
            // Arrange
            var nonExistentStudent = new Student { Id = 99, fullname = "Ghost Student" };
            _context.Entry(nonExistentStudent).State = EntityState.Modified;

            // Act
            var result = await _controller.PutStudent(99, nonExistentStudent);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task PostStudent_ReturnsCreatedAtAction_AndSavesToDatabaseWithUserRelation()
        {
            // Arrange
            var fakeUser = new User { Id = 500, Email = "Associated User" };
            _context.Users.Add(fakeUser);
            await _context.SaveChangesAsync();

            var dto = new StudentCreateDTO
            {
                fullname = "New Student",
                university = "Cambridge",
                year_of_study = 3,
                field_of_study = "Computer Science",
                userID = 500
            };

            // Act
            var result = await _controller.PostStudent(dto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedDto = Assert.IsType<StudentCreateDTO>(createdAtActionResult.Value);
            
            Assert.Equal("New Student", returnedDto.fullname);
            
            var routeValues = createdAtActionResult.RouteValues;
            var generatedId = Assert.IsType<int>(routeValues["id"]);

            var dbStudent = await _context.Student.Include(s => s.User).FirstOrDefaultAsync(s => s.Id == generatedId);
            Assert.NotNull(dbStudent);
            Assert.Equal("New Student", dbStudent.fullname);
            Assert.Equal(500, dbStudent.userId);
            Assert.NotNull(dbStudent.User);
            Assert.NotNull(dbStudent.Comments);
        }

        [Fact]
        public async Task DeleteStudent_ReturnsNoContent_WhenSuccessful()
        {
            // Arrange
            var targetStudent = new Student { Id = 42, fullname = "Leaving Student", student_number = "STU999" };
            _context.Student.Add(targetStudent);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteStudent(42);

            // Assert
            Assert.IsType<NoContentResult>(result);

            var dbStudent = await _context.Student.FindAsync(42);
            Assert.Null(dbStudent);
        }

        [Fact]
        public async Task DeleteStudent_ReturnsNotFound_WhenStudentDoesNotExist()
        {
            // Act
            var result = await _controller.DeleteStudent(999);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}