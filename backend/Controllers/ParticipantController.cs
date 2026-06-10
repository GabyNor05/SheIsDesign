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
            var rows = await _context.Users
                .Where(u => u.Role == Role.Student || u.Role == Role.IndustryProfessional)
                .OrderByDescending(u => u.DateCreated)
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.Status,
                    u.DateCreated,
                    Student = u.Students.FirstOrDefault(),
                    Professional = u.IndustryProfessionals.FirstOrDefault(),
                    SubmissionCount = u.Students.SelectMany(s => s.Submissions).Count(),
                    TotalPoints = u.Students.SelectMany(s => s.Submissions).Sum(s => s.points),
                })
                .ToListAsync();

            var results = rows.Select(r =>
            {
                var name = r.Student?.fullname ?? r.Professional?.job_title ?? r.Email;
                string type;
                if (r.Student != null) type = "student";
                else if (r.Professional != null) type = "professional";
                else type = r.Status.ToString().ToLowerInvariant();
                return new ParticipantListDTO
                {
                    Id = r.Id,
                    Type = type,
                    Initials = GetInitials(name, r.Email),
                    Name = name,
                    Email = r.Email,
                    Institution = r.Student?.university ?? r.Professional?.institution ?? "",
                    Field = r.Student?.field_of_study ?? r.Professional?.job_title ?? "",
                    Status = r.Status.ToString().ToLowerInvariant(),
                    Joined = r.DateCreated.ToString("d MMM yyyy"),
                    Submissions = r.SubmissionCount,
                    Points = r.TotalPoints,
                };
            }).ToList();

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
            var data = await _context.Student
                .Where(s => s.userId == userId)
                .Select(s => new
                {
                    s.fullname,
                    Email = s.User.Email,
                    s.university,
                    TotalEventsJoined = s.Posts.Select(p => p.eventId).Distinct().Count(),
                    TotalScore = s.Submissions.Sum(sub => sub.points),
                    MostRecentEventTitle = s.Posts.OrderByDescending(p => p.post_date).Select(p => p.Event.Title).FirstOrDefault(),
                    MostRecentEventStart = s.Posts.OrderByDescending(p => p.post_date).Select(p => (DateTime?)p.Event.Start_date).FirstOrDefault(),
                })
                .FirstOrDefaultAsync();

            if (data == null) return NotFound("Student profile not found for this user");

            return Ok(new ParticipantProfileDTO
            {
                Name = data.fullname,
                Email = data.Email,
                University = data.university,
                TotalEventsJoined = data.TotalEventsJoined,
                TotalScore = data.TotalScore,
                MostRecentEventTitle = data.MostRecentEventTitle,
                MostRecentEventDate = data.MostRecentEventStart.HasValue ? DateOnly.FromDateTime(data.MostRecentEventStart.Value) : null,
            });
        }

        // GET: api/Participant/{userId}/event/{eventId}
        // Returns the participant's submission status within a specific event.
        [HttpGet("{userId}/event/{eventId}")]
        public async Task<ActionResult<ParticipantEventStatusDTO>> GetParticipantEventStatus(int userId, int eventId)
        {
            var dto = await _context.Post
                .Where(p => p.Student.userId == userId && p.eventId == eventId)
                .Select(p => new ParticipantEventStatusDTO
                {
                    Status = p.status,
                    EventTitle = p.Event.Title,
                })
                .FirstOrDefaultAsync();

            if (dto == null) return NotFound("No participation found for this user in this event");

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
