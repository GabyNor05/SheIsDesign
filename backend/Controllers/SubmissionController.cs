using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SheDesign.Models;
using SheDesign.Data;
using SheDesign.DTO; // Ensure this matches your DTO namespace

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
                .Select(s => new SubmissionReadDTO
                {
                    Id = s.Id,
                    StudentId = s.studentId,
                    EventId = s.eventId,
                    Title = s.title,
                    Status = s.status,
                    Points = s.points,
                    Rank = s.rank,
                    TimeStamp = s.timeStamp
                }).ToListAsync();
        }

        // GET: api/Submission/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SubmissionReadDTO>> GetSubmission(int id)
        {
            var submission = await _context.Submission
                .Select(s => new SubmissionReadDTO
                {
                    Id = s.Id,
                    StudentId = s.studentId,
                    EventId = s.eventId,
                    Title = s.title,
                    Status = s.status,
                    Points = s.points,
                    Rank = s.rank,
                    TimeStamp = s.timeStamp
                })
                .FirstOrDefaultAsync(s => s.Id == id);

            if (submission == null) return NotFound();

            return submission;
        }

        // PUT: api/Submission/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubmission(int id, SubmissionUpdateDTO updateDto)
        {
            var submission = await _context.Submission.FindAsync(id);

            if (submission == null) return NotFound();

            // Map updated fields from DTO
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

        // POST: api/Submission
        [HttpPost]
        public async Task<ActionResult<SubmissionReadDTO>> PostSubmission(SubmissionCreateDTO createDto)
        {
            var submission = new Submission
            {
                studentId = createDto.StudentId,
                eventId = createDto.EventId,
                title = createDto.Title,
                status = "Pending", // Default status
                timeStamp = DateTime.UtcNow // Use UtcNow for Postgres compatibility
            };

            _context.Submission.Add(submission);
            await _context.SaveChangesAsync();

            var readDto = new SubmissionReadDTO
            {
                Id = submission.Id,
                StudentId = submission.studentId,
                EventId = submission.eventId,
                Title = submission.title,
                Status = submission.status,
                Points = submission.points,
                Rank = submission.rank,
                TimeStamp = submission.timeStamp
            };

            return CreatedAtAction(nameof(GetSubmission), new { id = readDto.Id }, readDto);
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