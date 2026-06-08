using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SheDesign.Data;
using SheDesign.DTO;
using SheDesign.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticipantController : ControllerBase
    {
        private readonly SheDesignContext _context;

        public ParticipantController(SheDesignContext context)
        {
            _context = context;
        }

        // GET: api/Participant
        // Returns the current participant roster for the admin dashboard.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ParticipantListDTO>>> GetParticipants()
        {
            var participants = await _context.Users
                .Where(u => u.Role == Role.Student || u.Role == Role.IndustryProfessional)
                .OrderByDescending(u => u.DateCreated)
                .ToListAsync();

            var results = new List<ParticipantListDTO>();

            foreach (var user in participants)
            {
                var student = await _context.Student.FirstOrDefaultAsync(s => s.userId == user.Id);
                var professional = await _context.IndustryProfessional.FirstOrDefaultAsync(i => i.userId == user.Id);

                var type = student != null ? "student" : professional != null ? "professional" : user.Role.ToString().ToLowerInvariant();

                var name = student?.fullname
                    ?? professional?.job_title
                    ?? user.Email;

                var institution = student?.university
                    ?? professional?.institution
                    ?? "";

                var field = student?.field_of_study
                    ?? professional?.job_title
                    ?? "";

                var submissions = 0;
                var points = 0;

                if (student != null)
                {
                    submissions = await _context.Submission.CountAsync(s => s.studentId == student.Id);
                    points = await _context.Submission.Where(s => s.studentId == student.Id).SumAsync(s => (int?)s.points) ?? 0;
                }

                results.Add(new ParticipantListDTO
                {
                    Id = user.Id,
                    Type = type,
                    Initials = GetInitials(name, user.Email),
                    Name = name,
                    Email = user.Email,
                    Institution = institution,
                    Field = field,
                    Status = user.Status.ToString().ToLowerInvariant(),
                    Joined = user.DateCreated.ToString("d MMM yyyy"),
                    Submissions = submissions,
                    Points = points,
                });
            }

            return Ok(results);
        }

        // PATCH: api/Participant/{userId}/status
        [HttpPatch("{userId}/status")]
        public async Task<ActionResult<ParticipantStatusUpdateDTO>> UpdateParticipantStatus(int userId, ParticipantStatusUpdateDTO dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            if (!Enum.TryParse<Status>(dto.Status, true, out var parsedStatus))
            {
                return BadRequest("Invalid status value. Use approved, pending, or rejected.");
            }

            user.Status = parsedStatus;
            await _context.SaveChangesAsync();

            return Ok(new ParticipantStatusUpdateDTO
            {
                Status = user.Status.ToString().ToLowerInvariant()
            });
        }

        // GET: api/Participant/{userId}
        // Returns the full participant profile: name, email, university,
        // total events joined, total score, and their most recent event.
        [HttpGet("{userId}")]
        public async Task<ActionResult<ParticipantProfileDTO>> GetParticipantProfile(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("User not found");

            var student = await _context.Student.FirstOrDefaultAsync(s => s.userId == userId);
            if (student == null) return NotFound("Student profile not found for this user");

            var posts = await _context.Post
                .Where(p => p.studentId == student.Id)
                .Include(p => p.Event)
                .ToListAsync();

            var submissions = await _context.Submission
                .Where(s => s.studentId == student.Id)
                .ToListAsync();

            var mostRecentPost = posts.OrderByDescending(p => p.post_date).FirstOrDefault();

            var dto = new ParticipantProfileDTO
            {
                Name = student.fullname,
                Email = user.Email,
                University = student.university,
                TotalEventsJoined = posts.Select(p => p.eventId).Distinct().Count(),
                TotalScore = submissions.Sum(s => s.points),
                MostRecentEventTitle = mostRecentPost?.Event?.Title,
                MostRecentEventDate = mostRecentPost?.Event?.Start_date != null ? DateOnly.FromDateTime(mostRecentPost.Event.Start_date) : null
            };

            return Ok(dto);
        }

        // GET: api/Participant/{userId}/event/{eventId}
        // Returns the participant's submission status within a specific event.
        [HttpGet("{userId}/event/{eventId}")]
        public async Task<ActionResult<ParticipantEventStatusDTO>> GetParticipantEventStatus(int userId, int eventId)
        {
            var student = await _context.Student.FirstOrDefaultAsync(s => s.userId == userId);
            if (student == null) return NotFound("Student profile not found for this user");

            var post = await _context.Post
                .Include(p => p.Event)
                .FirstOrDefaultAsync(p => p.studentId == student.Id && p.eventId == eventId);

            if (post == null) return NotFound("No participation found for this user in this event");

            var dto = new ParticipantEventStatusDTO
            {
                Status = post.status,
                EventTitle = post.Event?.Title
            };

            return Ok(dto);
        }

        private static string GetInitials(string name, string email)
        {
            var source = (name ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(source))
            {
                source = email;
            }

            if (string.IsNullOrWhiteSpace(source))
            {
                return "?";
            }

            var parts = source.Split(new[] { ' ', '\t', '\n' }, StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length == 0)
            {
                return source[..1].ToUpperInvariant();
            }

            if (parts.Length == 1)
            {
                return parts[0].Substring(0, Math.Min(2, parts[0].Length)).ToUpperInvariant();
            }

            return (parts[0][0].ToString() + parts[1][0].ToString()).ToUpperInvariant();
        }
    }
}
