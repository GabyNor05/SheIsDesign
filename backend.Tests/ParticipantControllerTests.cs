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
    public class ParticipantControllerTests : IDisposable
    {
        private readonly SheDesignContext _context;
        private readonly ParticipantController _controller;

        public ParticipantControllerTests()
        {
            var options = new DbContextOptionsBuilder<SheDesignContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SheDesignContext(options);
            _context.Database.EnsureCreated();

            _controller = new ParticipantController(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetParticipantProfile_ReturnsNotFound_WhenUserDoesNotExist()
        {
            // Act
            var result = await _controller.GetParticipantProfile(99);

            // Assert
            var codesResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal("User not found", codesResult.Value);
        }

        [Fact]
        public async Task GetParticipantProfile_ReturnsNotFound_WhenStudentProfileIsMissing()
        {
            // Arrange
            var user = new User { Id = 1, Email = "independent@test.com", PasswordHash = "hash" };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetParticipantProfile(1);

            // Assert
            var codesResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal("Student profile not found for this user", codesResult.Value);
        }

        [Fact]
        public async Task GetParticipantProfile_CalculatesAggregatesAndFindsMostRecentEvent_WhenSuccessful()
        {
            // Arrange
            var user = new User { Id = 10, Email = "coder@test.com", PasswordHash = "hash" };
            var student = new Student { Id = 5, userId = 10, fullname = "Grace Hopper", university = "MIT" };

            var event1 = new Event { Id = 101, Title = "Hackathon Alpha", Start_date = new DateTime(2026, 1, 1) };
            var event2 = new Event { Id = 102, Title = "Design Sprint Beta", Start_date = new DateTime(2026, 5, 20) };

            var posts = new List<Post>
            {
                new Post { Id = 1, studentId = 5, eventId = 101, Event = event1, post_date = new DateTime(2026, 1, 2), title = "Post 1" },
                new Post { Id = 2, studentId = 5, eventId = 102, Event = event2, post_date = new DateTime(2026, 5, 21), title = "Post 2" },
                new Post { Id = 3, studentId = 5, eventId = 101, Event = event1, post_date = new DateTime(2026, 1, 15), title = "Post 3" } // Duplicate event join attempt
            };

            var submissions = new List<Submission>
            {
                new Submission { Id = 1, studentId = 5, eventId = 101, points = 45, title = "Sub 1" },
                new Submission { Id = 2, studentId = 5, eventId = 102, points = 50, title = "Sub 2" }
            };

            _context.Users.Add(user);
            _context.Student.Add(student);
            _context.Post.AddRange(posts);
            _context.Submission.AddRange(submissions);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetParticipantProfile(10);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var dto = Assert.IsType<ParticipantProfileDTO>(okResult.Value);

            Assert.Equal("Grace Hopper", dto.Name);
            Assert.Equal("coder@test.com", dto.Email);
            Assert.Equal("MIT", dto.University);

            // Aggregations validations
            Assert.Equal(2, dto.TotalEventsJoined); // 3 posts but distinct event count is 2
            Assert.Equal(95, dto.TotalScore);       // 45 + 50 points

            // Most recent event validation (Design Sprint Beta has the latest post_date)
            Assert.Equal("Design Sprint Beta", dto.MostRecentEventTitle);
            Assert.Equal(DateOnly.FromDateTime(event2.Start_date), dto.MostRecentEventDate);
        }

        [Fact]
        public async Task GetParticipantEventStatus_ReturnsNotFound_WhenStudentProfileIsMissing()
        {
            // Act
            var result = await _controller.GetParticipantEventStatus(99, 101);

            // Assert
            var codesResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal("Student profile not found for this user", codesResult.Value);
        }

        [Fact]
        public async Task GetParticipantEventStatus_ReturnsNotFound_WhenNoParticipationFound()
        {
            // Arrange
            var student = new Student { Id = 2, userId = 4, fullname = "Ada Lovelace" };
            _context.Student.Add(student);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetParticipantEventStatus(4, 555); // Checking event 555

            // Assert
            var codesResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal("No participation found for this user in this event", codesResult.Value);
        }

        [Fact]
        public async Task GetParticipants_ReturnsStudentsAndProfessionals_WithStatusAndActivity()
        {
            // Arrange
            var studentUser = new User
            {
                Id = 1,
                Email = "student@example.com",
                PasswordHash = "hash",
                Role = Role.Student,
                Status = Status.Pending,
                DateCreated = new DateTime(2026, 5, 1)
            };
            var professionalUser = new User
            {
                Id = 2,
                Email = "mentor@example.com",
                PasswordHash = "hash",
                Role = Role.IndustryProfessional,
                Status = Status.Approved,
                DateCreated = new DateTime(2026, 5, 2)
            };

            var student = new Student
            {
                Id = 10,
                fullname = "Ava Student",
                university = "Wits University",
                field_of_study = "Graphic Design",
                userId = 1
            };
            var professional = new IndustryProfessional
            {
                Id = 20,
                institution = "Ogilvy SA",
                job_title = "Creative Director",
                userId = 2
            };

            _context.Users.AddRange(studentUser, professionalUser);
            _context.Student.Add(student);
            _context.IndustryProfessional.Add(professional);
            _context.Post.Add(new Post { Id = 100, studentId = 10, eventId = 1, status = "Pending", title = "Alpha", post_date = new DateTime(2026, 5, 10) });
            _context.Submission.Add(new Submission { Id = 200, studentId = 10, points = 42, title = "Submission 1" });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetParticipants();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var participants = Assert.IsAssignableFrom<IEnumerable<ParticipantListDTO>>(okResult.Value);

            Assert.Equal(2, participants.Count());
            Assert.Contains(participants, p => p.Email == "student@example.com" && p.Type == "student");
            Assert.Contains(participants, p => p.Email == "mentor@example.com" && p.Type == "professional");
            Assert.Contains(participants, p => p.Name == "Ava Student" && p.Status == "pending");
        }

        [Fact]
        public async Task UpdateParticipantStatus_UpdatesUserStatus_WhenValid()
        {
            // Arrange
            var user = new User
            {
                Id = 5,
                Email = "pending@example.com",
                PasswordHash = "hash",
                Role = Role.Student,
                Status = Status.Pending
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.UpdateParticipantStatus(5, new ParticipantStatusUpdateDTO { Status = "approved" });

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var dto = Assert.IsType<ParticipantStatusUpdateDTO>(okResult.Value);
            Assert.Equal("approved", dto.Status);

            var updated = await _context.Users.FindAsync(5);
            Assert.NotNull(updated);
            Assert.Equal(Status.Approved, updated.Status);
        }

        [Fact]
        public async Task UpdateParticipantStatus_ReturnsNotFound_WhenUserDoesNotExist()
        {
            // Act
            var result = await _controller.UpdateParticipantStatus(999, new ParticipantStatusUpdateDTO { Status = "approved" });

            // Assert
            var notFound = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal("User not found", notFound.Value);
        }

        [Fact]
        public async Task GetParticipantEventStatus_ReturnsStatusAndTitle_WhenParticipationExists()
        {
            // Arrange
            var student = new Student { Id = 3, userId = 7, fullname = "Margaret Hamilton" };
            var targetedEvent = new Event { Id = 200, Title = "Apollo Software Workshop" };
            var post = new Post
            {
                Id = 8,
                studentId = 3,
                eventId = 200,
                status = "Approved",
                Event = targetedEvent,
                title = "Workshop Update Log"
            };

            _context.Student.Add(student);
            _context.Post.Add(post);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetParticipantEventStatus(7, 200);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var dto = Assert.IsType<ParticipantEventStatusDTO>(okResult.Value);

            Assert.Equal("Approved", dto.Status);
            Assert.Equal("Apollo Software Workshop", dto.EventTitle);
        }
    }
}