using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SheDesign.Models;
using SheDesign.Data;
using SheDesign.DTO;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly SheDesignContext _context;

        public SubmissionController(SheDesignContext context)
        {
            _context = context;
        }

        // GET: api/Submission
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubmissionReadDTO>>> GetSubmission()
        {
            return await _context.Submission
                .Include(s => s.Student)
                .Include(s => s.Event)
                .Select(s => new SubmissionReadDTO
                {
                    Id = s.Id,
                    StudentId = s.studentId,
                    EventId = s.eventId,
                    Title = s.title,
                    Description = s.description,
                    Category = s.category,
                    ImageFileLink = s.image_file_link,
                    Status = s.status,
                    Points = s.points,
                    Rank = s.rank,
                    TimeStamp = s.timeStamp,
                    StudentName = s.Student != null ? s.Student.fullname : "Unknown",
                    EventName = s.Event != null ? s.Event.Title : "Unknown"
                }).ToListAsync();
        }

        // GET: api/Submission/gallery
        // Returns only approved submissions for the public gallery
        [HttpGet("gallery")]
        public async Task<ActionResult<IEnumerable<SubmissionReadDTO>>> GetGallery()
        {
            return await _context.Submission
                .Include(s => s.Student)
                .Include(s => s.Event)
                .Where(s => s.status == "Approved")
                .Select(s => new SubmissionReadDTO
                {
                    Id = s.Id,
                    StudentId = s.studentId,
                    EventId = s.eventId,
                    Title = s.title,
                    Description = s.description,
                    Category = s.category,
                    ImageFileLink = s.image_file_link,
                    Status = s.status,
                    Points = s.points,
                    Rank = s.rank,
                    TimeStamp = s.timeStamp,
                    StudentName = s.Student != null ? s.Student.fullname : "Unknown",
                    EventName = s.Event != null ? s.Event.Title : "Unknown"
                })
                .OrderByDescending(s => s.TimeStamp)
                .ToListAsync();
        }

        // GET: api/Submission/gallery/featured
        // Returns top 6 highest scoring approved submissions for the home page
        [HttpGet("gallery/featured")]
        public async Task<ActionResult<IEnumerable<SubmissionReadDTO>>> GetFeatured()
        {
            return await _context.Submission
                .Include(s => s.Student)
                .Include(s => s.Event)
                .Where(s => s.status == "Approved")
                .OrderByDescending(s => s.points)
                .Take(6)
                .Select(s => new SubmissionReadDTO
                {
                    Id = s.Id,
                    StudentId = s.studentId,
                    EventId = s.eventId,
                    Title = s.title,
                    Description = s.description,
                    Category = s.category,
                    ImageFileLink = s.image_file_link,
                    Status = s.status,
                    Points = s.points,
                    Rank = s.rank,
                    TimeStamp = s.timeStamp,
                    StudentName = s.Student != null ? s.Student.fullname : "Unknown",
                    EventName = s.Event != null ? s.Event.Title : "Unknown"
                })
                .ToListAsync();
        }

        // GET: api/Submission/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SubmissionReadDTO>> GetSubmission(int id)
        {
            var submission = await _context.Submission
                .Include(s => s.Student)
                .Include(s => s.Event)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (submission == null) return NotFound();

            return new SubmissionReadDTO
            {
                Id = submission.Id,
                StudentId = submission.studentId,
                EventId = submission.eventId,
                Title = submission.title,
                Description = submission.description,
                Category = submission.category,
                ImageFileLink = submission.image_file_link,
                Status = submission.status,
                Points = submission.points,
                Rank = submission.rank,
                TimeStamp = submission.timeStamp,
                StudentName = submission.Student?.fullname ?? "Unknown",
                EventName = submission.Event?.Title ?? "Unknown"
            };
        }

        // POST: api/Submission
        [HttpPost]
        public async Task<ActionResult<SubmissionReadDTO>> PostSubmission(SubmissionCreateDTO createDto)
        {
            var submission = new Submission
            {
                studentId = createDto.StudentId,
                eventId = createDto.EventId,
                title = createDto.Title,
                description = createDto.Description,
                category = createDto.Category,
                image_file_link = createDto.ImageFileLink,
                status = "Pending",
                timeStamp = DateTime.UtcNow
            };

            _context.Submission.Add(submission);
            await _context.SaveChangesAsync();

            var readDto = new SubmissionReadDTO
            {
                Id = submission.Id,
                StudentId = submission.studentId,
                EventId = submission.eventId,
                Title = submission.title,
                Description = submission.description,
                Category = submission.category,
                ImageFileLink = submission.image_file_link,
                Status = submission.status,
                Points = submission.points,
                Rank = submission.rank,
                TimeStamp = submission.timeStamp
            };

            return CreatedAtAction(nameof(GetSubmission), new { id = readDto.Id }, readDto);
        }

        // PUT: api/Submission/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubmission(int id, SubmissionUpdateDTO updateDto)
        {
            var submission = await _context.Submission.FindAsync(id);
            if (submission == null) return NotFound();

            submission.title = updateDto.Title;
            submission.status = updateDto.Status;
            submission.points = updateDto.Points;
            submission.rank = updateDto.Rank;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubmissionExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/Submission/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubmission(int id)
        {
            var submission = await _context.Submission.FindAsync(id);
            if (submission == null) return NotFound();

            _context.Submission.Remove(submission);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SubmissionExists(int id)
        {
            return _context.Submission.Any(e => e.Id == id);
        }
    }
}