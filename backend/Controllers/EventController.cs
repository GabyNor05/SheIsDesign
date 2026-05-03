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
        public async Task<ActionResult<IEnumerable<EventReadDTO>>> GetEvent()
        {
            // Map the Entity list to a DTO list
            return await _context.Event.Select(e => new EventReadDTO
            {
                Id = e.Id,
                Title = e.Title,
                Start_date = e.Start_date,
                End_date = e.End_date,
                Entry_count = e.Entry_count,
                Description = e.Description,
                Max_entry = e.Max_entry,
                Category = e.Category,
                Points_reward = e.Points_reward,
                Status = e.Status,
                Image_link = e.Image_link
            }).ToListAsync();
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
            var events = await _context.Event.Where(e => e.Status == status).ToListAsync();

            if (events == null || !events.Any()) return NotFound($"No events found: {status}");

            return Ok(events);
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<Event>>> GetEventsStatsByCategory(string category)
        {
            var _events = await _context.Event.Where(e => e.Category == category).ToListAsync();

            if (_events == null || !_events.Any()) return NotFound($"No events found for category: {category}");

            var _openCount = _events.Count(e => e.Status.Equals("open", StringComparison.CurrentCultureIgnoreCase));
            var _draftCount = _events.Count(e => e.Status.Equals("drafted", StringComparison.CurrentCultureIgnoreCase));
            var _closedCount = _events.Count(e => e.Status.Equals("closed", StringComparison.CurrentCultureIgnoreCase));

            var DTO = new EventStatisticsDTO
            {
                openCount = _openCount,
                draftCount = _draftCount,
                closedCount = _closedCount
            };

            return Ok(DTO);
        }

        [HttpGet("upcoming")]
        public async Task<ActionResult<IEnumerable<EventReadDTO>>> GetUpcomingEvents()
        {
            var today = DateOnly.FromDateTime(DateTime.Now);

            var upcomingEvents = await _context.Event
                .Where(e => e.Start_date > today)
                .OrderBy(e => e.Start_date)
                .Select(e => new EventReadDTO
                {
                    Id = e.Id,
                    Title = e.Title,
                    Start_date = e.Start_date,
                    End_date = e.End_date,
                    Entry_count = e.Entry_count,
                    Description = e.Description,
                    Max_entry = e.Max_entry,
                    Category = e.Category,
                    Points_reward = e.Points_reward,
                    Status = e.Status,
                    Image_link = e.Image_link
                })
                .ToListAsync();

            return Ok(upcomingEvents);
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
        public async Task<ActionResult<EventReadDTO>> PostEvent(EventCreateDTO eventDto)
        {
            // 1. Map DTO to Entity
            var @event = new Event
            {
                Title = eventDto.Title,
                Start_date = eventDto.Start_date,
                End_date = eventDto.End_date,
                Description = eventDto.Description,
                Max_entry = eventDto.Max_entry,
                Category = eventDto.Category,
                Points_reward = eventDto.Points_reward,
                Status = eventDto.Status,
                Image_link = eventDto.Image_link,
                // Entry_count and Collections are handled by the DB/Model defaults
            };

            // 2. Add to context and save
            _context.Event.Add(@event);
            await _context.SaveChangesAsync();

            // 3. Map the created Entity back to a ReadDTO for the response
            var readDto = new EventReadDTO
            {
                Id = @event.Id,
                Title = @event.Title,
                Start_date = @event.Start_date,
                End_date = @event.End_date,
                Entry_count = @event.Entry_count,
                Description = @event.Description,
                Max_entry = @event.Max_entry,
                Category = @event.Category,
                Points_reward = @event.Points_reward,
                Status = @event.Status,
                Image_link = @event.Image_link
            };

            return CreatedAtAction(nameof(GetEvent), new { id = readDto.Id }, readDto);
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
