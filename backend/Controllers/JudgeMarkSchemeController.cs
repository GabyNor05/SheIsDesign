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
    public class JudgeMarkSchemeController : ControllerBase
    {
        private readonly SheDesignContext _context;

        public JudgeMarkSchemeController(SheDesignContext context)
        {
            _context = context;
        }

        // GET: api/JudgeMarkScheme
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JudgeMarkSchemeReadDTO>>> GetJudgeMarkScheme()
        {
            return await _context.JudgeMarkScheme
                .Include(scheme => scheme.Post)
                .Include(scheme => scheme.Judge)
                    .ThenInclude(j => j.IndustryProfessional) // Dig deeper to get the IP details
                .Select(scheme => new JudgeMarkSchemeReadDTO
                {
                    Id = scheme.Id,
                    PostId = scheme.PostId,
                    JudgeId = scheme.JudgeId,
                    Score = scheme.Score,
                    Comment = scheme.Comment,
                    TimeStamp = scheme.TimeStamp,
                    
                    // Step through the relationship chain with null safety checks
                    JudgeName = scheme.Judge != null && scheme.Judge.IndustryProfessional != null 
                        ? scheme.Judge.IndustryProfessional.fullname 
                        : "Unknown Judge",
                        
                    PostTitle = scheme.Post != null ? scheme.Post.title : "Untitled Post"
                })
                .ToListAsync();
        }

        // GET: api/JudgeMarkScheme/event/{eventId}
        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<JudgeMarkSchemeReadDTO>>> GetMarkSchemesByEvent(int eventId)
        {
            var postIds = await _context.Post
                .Where(p => p.eventId == eventId)
                .Select(p => p.Id)
                .ToListAsync();

            return await _context.JudgeMarkScheme
                .Where(j => postIds.Contains(j.PostId))
                .Include(j => j.Post)
                .Include(j => j.Judge)
                    .ThenInclude(judge => judge.IndustryProfessional)
                .Select(j => new JudgeMarkSchemeReadDTO
                {
                    Id = j.Id,
                    PostId = j.PostId,
                    JudgeId = j.JudgeId,
                    Score = j.Score,
                    Comment = j.Comment,
                    TimeStamp = j.TimeStamp,
                    JudgeName = j.Judge != null && j.Judge.IndustryProfessional != null
                        ? j.Judge.IndustryProfessional.fullname
                        : "Unknown Judge",
                    PostTitle = j.Post != null ? j.Post.title : "Untitled Post"
                })
                .ToListAsync();
        }

        // GET: api/JudgeMarkScheme/5
        [HttpGet("{id}")]
        public async Task<ActionResult<JudgeMarkSchemeReadDTO>> GetJudgeMarkScheme(int id)
        {
            var judgeMarkScheme = await _context.JudgeMarkScheme
                .Include(scheme => scheme.Post)
                .Include(scheme => scheme.Judge)
                    .ThenInclude(j => j.IndustryProfessional)
                .Where(scheme => scheme.Id == id)
                .Select(scheme => new JudgeMarkSchemeReadDTO
                {
                    Id = scheme.Id,
                    PostId = scheme.PostId,
                    JudgeId = scheme.JudgeId,
                    Score = scheme.Score,
                    Comment = scheme.Comment,
                    TimeStamp = scheme.TimeStamp,
                    JudgeName = scheme.Judge != null && scheme.Judge.IndustryProfessional != null 
                        ? scheme.Judge.IndustryProfessional.fullname 
                        : "Unknown Judge",
                    PostTitle = scheme.Post != null ? scheme.Post.title : "Untitled Post"
                })
                .FirstOrDefaultAsync();

            if (judgeMarkScheme == null) return NotFound();

            return judgeMarkScheme;
        }

        // PUT: api/JudgeMarkScheme/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutJudgeMarkScheme(int id, JudgeMarkScheme judgeMarkScheme)
        {
            if (id != judgeMarkScheme.Id)
            {
                return BadRequest();
            }

            _context.Entry(judgeMarkScheme).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JudgeMarkSchemeExists(id))
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

        // POST: api/JudgeMarkScheme
        [HttpPost]
        public async Task<ActionResult<JudgeMarkSchemeReadDTO>> PostJudgeMarkScheme(JudgeMarkSchemeCreateDTO dto)
        {
            var judgeMarkScheme = new JudgeMarkScheme
            {
                PostId = dto.PostId,
                JudgeId = dto.JudgeId,
                Comment = dto.Comment,
                Score = dto.Score,
                TimeStamp = DateTime.UtcNow
            };

            _context.JudgeMarkScheme.Add(judgeMarkScheme);
            await _context.SaveChangesAsync();

            // Re-fetch with the full relationship graph loaded
            var savedScheme = await _context.JudgeMarkScheme
                .Include(s => s.Post)
                .Include(s => s.Judge)
                    .ThenInclude(j => j.IndustryProfessional)
                .FirstOrDefaultAsync(s => s.Id == judgeMarkScheme.Id);

            var readDto = new JudgeMarkSchemeReadDTO
            {
                Id = judgeMarkScheme.Id,
                PostId = judgeMarkScheme.PostId,
                JudgeId = judgeMarkScheme.JudgeId,
                Score = judgeMarkScheme.Score,
                Comment = judgeMarkScheme.Comment,
                TimeStamp = judgeMarkScheme.TimeStamp,
                JudgeName = savedScheme?.Judge?.IndustryProfessional != null 
                    ? savedScheme.Judge.IndustryProfessional.fullname 
                    : "Unknown Judge",
                PostTitle = savedScheme?.Post != null ? savedScheme.Post.title : "Untitled Post"
            };

            return CreatedAtAction("GetJudgeMarkScheme", new { id = readDto.Id }, readDto);
        }

        // DELETE: api/JudgeMarkScheme/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJudgeMarkScheme(int id)
        {
            var judgeMarkScheme = await _context.JudgeMarkScheme.FindAsync(id);
            if (judgeMarkScheme == null)
            {
                return NotFound();
            }

            _context.JudgeMarkScheme.Remove(judgeMarkScheme);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool JudgeMarkSchemeExists(int id)
        {
            return _context.JudgeMarkScheme.Any(e => e.Id == id);
        }
    }
}