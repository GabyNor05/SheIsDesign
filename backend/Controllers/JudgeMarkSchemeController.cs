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
                .Include(scheme => scheme.Judge)
                .Include(scheme => scheme.Post)
                .Select(scheme => new JudgeMarkSchemeReadDTO
                {
                    Id = scheme.Id,
                    PostId = scheme.PostId,
                    JudgeId = scheme.JudgeId,
                    Score = scheme.Score,
                    Comment = scheme.Comment,
                    TimeStamp = scheme.TimeStamp,
                    // Pulling flattened properties safely via null-conditional operators
                    JudgeName = scheme.Judge != null ? scheme.Judge.IndustryProfessional.fullname : "Unknown Judge",
                    PostTitle = scheme.Post != null ? scheme.Post.title : "Untitled Post"
                })
                .ToListAsync();
        }

        // GET: api/JudgeMarkScheme/5
        [HttpGet("{id}")]
        public async Task<ActionResult<JudgeMarkSchemeReadDTO>> GetJudgeMarkScheme(int id)
        {
            var judgeMarkScheme = await _context.JudgeMarkScheme
                .Include(scheme => scheme.Judge)
                .Include(scheme => scheme.Post)
                .Where(scheme => scheme.Id == id)
                .Select(scheme => new JudgeMarkSchemeReadDTO
                {
                    Id = scheme.Id,
                    PostId = scheme.PostId,
                    JudgeId = scheme.JudgeId,
                    Score = scheme.Score,
                    Comment = scheme.Comment,
                    TimeStamp = scheme.TimeStamp,
                    JudgeName = scheme.Judge != null ? scheme.Judge.IndustryProfessional.fullname : "Unknown Judge",
                    PostTitle = scheme.Post != null ? scheme.Post.title : "Untitled Post"
                })
                .FirstOrDefaultAsync();

            if (judgeMarkScheme == null)
            {
                return NotFound();
            }

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
            // 1. Map incoming DTO to your core Entity Model
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

            // 2. Fetch the newly saved record with its navigation properties loaded
            var savedScheme = await _context.JudgeMarkScheme
                .Include(s => s.Judge)
                .Include(s => s.Post)
                .FirstOrDefaultAsync(s => s.Id == judgeMarkScheme.Id);

            // 3. Map it back to a clear, descriptive Read DTO to return to the frontend
            var readDto = new JudgeMarkSchemeReadDTO
            {
                Id = judgeMarkScheme.Id,
                PostId = judgeMarkScheme.PostId,
                JudgeId = judgeMarkScheme.JudgeId,
                Score = judgeMarkScheme.Score,
                Comment = judgeMarkScheme.Comment,
                TimeStamp = judgeMarkScheme.TimeStamp,
                JudgeName = savedScheme?.Judge != null ? savedScheme.Judge.IndustryProfessional.fullname : "Unknown Judge",
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