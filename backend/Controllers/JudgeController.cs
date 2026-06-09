using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SheDesign.Data;
using SheDesign.Models;

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
        public async Task<ActionResult<IEnumerable<Judge>>> GetJudge()
        {
            return await _context.Judge.ToListAsync();
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
        public async Task<ActionResult<Judge>> PostJudge(Judge judge)
        {
            _context.Judge.Add(judge);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetJudge", new { id = judge.Id }, judge);
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
