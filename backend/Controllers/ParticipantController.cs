using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SheDesign.Data;
using SheDesign.DTO;

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
    }
}
