using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
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
        public async Task<ActionResult<IEnumerable<Submission>>> GetSubmission()
        {
            return await _context.Submission.ToListAsync();
        }

        // GET: api/Submission/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Submission>> GetSubmission(int id)
        {
            var submission = await _context.Submission.FindAsync(id);

            if (submission == null) return NotFound();

            return submission;
        }

        [HttpGet("details")]
        public async Task<ActionResult<Submission>> GetSubmissionDetails(int id)
        {
            var submission = await _context.Submission.FindAsync(id);

            if (submission == null) return NotFound();

            int studentId = submission.studentId;

            var student = await _context.Student.FindAsync(studentId);

            if (student == null) return NotFound();

            int userId = student.userId;

            var User = await _context.Users.FindAsync(userId);

            if (User == null) return NotFound();

            var DTO = new LeaderboardDetailsDTO
            {
                rank = submission.rank,
                points = submission.points,
                studentName = student.fullname,
                studentEmail = User.Email,
                submissionTitle = submission.title,
                submissionStatus = submission.status
            };

            return Ok(DTO);
        }

        // PUT: api/Submission/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubmission(int id, Submission submission)
        {
            if (id != submission.Id) return BadRequest();

            _context.Entry(submission).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubmissionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Submission
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Submission>> PostSubmission(Submission submission)
        {
            _context.Submission.Add(submission);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSubmission", new { id = submission.Id }, submission);
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
