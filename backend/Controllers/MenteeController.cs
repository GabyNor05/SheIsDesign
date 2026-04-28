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
    public class MenteeController : ControllerBase
    {
        private readonly SheDesignContext _context;

        public MenteeController(SheDesignContext context)
        {
            _context = context;
        }

        // GET: api/Mentee
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mentee>>> GetMentee()
        {
            return await _context.Mentee.ToListAsync();
        }

        // GET: api/Mentee/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Mentee>> GetMentee(int id)
        {
            var mentee = await _context.Mentee.FindAsync(id);

            if (mentee == null)
            {
                return NotFound();
            }

            return mentee;
        }

        // PUT: api/Mentee/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMentee(int id, Mentee mentee)
        {
            if (id != mentee.Id)
            {
                return BadRequest();
            }

            _context.Entry(mentee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MenteeExists(id))
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

        // POST: api/Mentee
        [HttpPost]
        public async Task<ActionResult<Mentee>> PostMentee(MenteeCreateDTO dto)
        {
            var mentee = new Mentee
            {
                fullname = dto.fullname,
                university = dto.university,
                year_of_study = dto.year_of_study,
                field_of_study = dto.field_of_study,
                student_number = dto.student_number,
                wants_volunteer = dto.wants_volunteer,
                userId = dto.userId,
            };

            _context.Mentee.Add(mentee);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMentee", new { id = mentee.Id }, mentee);
        }

        // DELETE: api/Mentee/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMentee(int id)
        {
            var mentee = await _context.Mentee.FindAsync(id);
            if (mentee == null)
            {
                return NotFound();
            }

            _context.Mentee.Remove(mentee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MenteeExists(int id)
        {
            return _context.Mentee.Any(e => e.Id == id);
        }
    }
}
