using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SheDesign.Models;
using SheDesign.Data;
using SheDesign.DTO;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IndustryProfessionalController : ControllerBase
    {
        private readonly SheDesignContext _context;

        public IndustryProfessionalController(SheDesignContext context)
        {
            _context = context;
        }

        // GET: api/IndustryProfessional
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IndustryProfessional>>> GetAll()
        {
            return await _context.IndustryProfessional.ToListAsync();
        }

        // GET: api/IndustryProfessional/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IndustryProfessional>> GetById(int id)
        {
            var ip = await _context.IndustryProfessional.FindAsync(id);
            if (ip == null) return NotFound();
            return ip;
        }

        // POST: api/IndustryProfessional
        [HttpPost]
        public async Task<ActionResult<IndustryProfessional>> Post(IndustryProfessionalCreateDTO dto)
        {
            var ip = new IndustryProfessional
            {
                fullname    = dto.fullname,
                institution = dto.institution,
                job_title   = dto.job_title,
                userId      = dto.userId,
            };

            _context.IndustryProfessional.Add(ip);

            var userToUpdate = await _context.Users.FindAsync(dto.userId);
            if (userToUpdate != null)
            {
                userToUpdate.Role = Role.IndustryProfessional;
                _context.Entry(userToUpdate).Property(u => u.Role).IsModified = true;
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = ip.Id }, ip);
        }

        // DELETE: api/IndustryProfessional/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ip = await _context.IndustryProfessional.FindAsync(id);
            if (ip == null) return NotFound();

            _context.IndustryProfessional.Remove(ip);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
