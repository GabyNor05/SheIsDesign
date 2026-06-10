using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SheDesign.Data;
using SheDesign.Models;
using SheDesign.DTO;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JudgeController : ControllerBase
    {
        private readonly SheDesignContext _context;

        public JudgeController(SheDesignContext context)
        {
            _context = context;
        }

        // GET: api/Judge
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JudgeReadDTO>>> GetJudge()
        {
            return await _context.Judge
                .Include(j => j.IndustryProfessional)
                .Select(j => new JudgeReadDTO
                {
                    Id = j.Id,
                    IndustryProfessionalID = j.IndustryProfessionalID,
                    Fullname = j.IndustryProfessional!.fullname,
                    Institution = j.IndustryProfessional.institution,
                    JobTitle = j.IndustryProfessional.job_title,
                    UserId = j.IndustryProfessional.userId
                })
                .ToListAsync();
        }

        // GET: api/Judge/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Judge>> GetJudge(int id)
        {
            var judge = await _context.Judge.FindAsync(id);

            if (judge == null)
            {
                return NotFound();
            }

            return judge;
        }

        // PUT: api/Judge/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutJudge(int id, Judge judge)
        {
            if (id != judge.Id)
            {
                return BadRequest();
            }

            _context.Entry(judge).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JudgeExists(id))
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

        // POST: api/Judge
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<JudgeCreateDTO>> PostJudge(JudgeCreateDTO dto)
        {
            var judge = new Judge
            {
                IndustryProfessionalID = dto.IndustryProfessionalId
            };

            _context.Judge.Add(judge);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetJudge", new { id = judge.Id }, dto);
        }

        // POST: api/Judge/promote
        // One-shot: create IP + Judge records, set role = Judge, assign to all events.
        // Body: { "userId": 5, "fullname": "Jane Smith", "institution": "Ogilvy", "jobTitle": "CD" }
        [HttpPost("promote")]
        public async Task<IActionResult> PromoteToJudge([FromBody] PromoteJudgeDTO dto)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null) return NotFound($"User {dto.UserId} not found.");

            // Create IndustryProfessional record
            var ip = new IndustryProfessional
            {
                userId      = dto.UserId,
                fullname    = dto.Fullname ?? user.Email,
                institution = dto.Institution ?? "SheIsDesign",
                job_title   = dto.JobTitle ?? "Judge",
            };
            _context.IndustryProfessional.Add(ip);
            await _context.SaveChangesAsync();

            // Create Judge record
            var judge = new Judge { IndustryProfessionalID = ip.Id };
            _context.Judge.Add(judge);

            // Promote user role to Judge
            user.Role = Role.Judge;
            _context.Entry(user).Property(u => u.Role).IsModified = true;

            await _context.SaveChangesAsync();

            // Assign judge to every event that has no judge yet
            var events = await _context.Event.ToListAsync();
            foreach (var ev in events)
            {
                if (ev.JudgeId == null)
                    ev.JudgeId = judge.Id;
            }
            await _context.SaveChangesAsync();

            return Ok(new
            {
                judgeId                = judge.Id,
                industryProfessionalId = ip.Id,
                userId                 = dto.UserId,
                assignedEvents         = events.Count(e => e.JudgeId == judge.Id),
            });
        }

        // DELETE: api/Judge/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJudge(int id)
        {
            var judge = await _context.Judge.FindAsync(id);
            if (judge == null)
            {
                return NotFound();
            }

            _context.Judge.Remove(judge);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool JudgeExists(int id)
        {
            return _context.Judge.Any(e => e.Id == id);
        }
    }
}
