using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SheDesign.Models;
using SheDesign.Data;
using System.Data.Common;
using System.Text.Json;
using SheDesign.DTO;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly SheDesignContext _context;

        public EventController(SheDesignContext context)
        {
            _context = context;
        }

        // GET: api/Event
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvent()
        {
            return await _context.Event.ToListAsync();
        }

        // GET: api/Event/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            var @event = await _context.Event.FindAsync(id);

            if (@event == null) return NotFound();

            return @event;
        }

        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<Event>>> GetEventsByStatus(string status)
        {
            var events = await _context.Event.Where(e => e.status == status).ToListAsync();

            if (events == null || !events.Any()) return NotFound($"No events found: {status}");

            return Ok(events);
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<Event>>> GetEventsStatsByCategory(string category)
        {
            var _events = await _context.Event.Where(e => e.category == category).ToListAsync();

            if (_events == null || !_events.Any()) return NotFound($"No events found for category: {category}");

            var _openCount = _events.Count(e => e.status.Equals("open", StringComparison.CurrentCultureIgnoreCase));
            var _draftCount = _events.Count(e => e.status.Equals("drafted", StringComparison.CurrentCultureIgnoreCase));
            var _closedCount = _events.Count(e => e.status.Equals("closed", StringComparison.CurrentCultureIgnoreCase));

            var DTO = new EventStatisticsDTO
            {
                openCount = _openCount,
                draftCount = _draftCount,
                closedCount = _closedCount
            };

            return Ok(DTO);
        }

        // PUT: api/Event/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEvent(int id, Event @event)
        {
            if (id != @event.Id) return BadRequest();

            _context.Entry(@event).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventExists(id))
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

        // POST: api/Event
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Event>> PostEvent(Event @event)
        {
            _context.Event.Add(@event);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEvent", new { id = @event.Id }, @event);
        }

        // DELETE: api/Event/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var @event = await _context.Event.FindAsync(id);
            if (@event == null) return NotFound();

            _context.Event.Remove(@event);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EventExists(int id)
        {
            return _context.Event.Any(e => e.Id == id);
        }
    }
}
