using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SheDesign.Models;
using SheDesign.Data;
using SheDesign.DTOs; // Ensure this matches your DTO namespace

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonationController : ControllerBase
    {
        private readonly SheDesignContext _context;

        public DonationController(SheDesignContext context)
        {
            _context = context;
        }

        // GET: api/Donation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DonationReadDTO>>> GetDonation()
        {
            return await _context.Donation
                .Select(d => new DonationReadDTO
                {
                    Id = d.Id,
                    Donor_name = d.donor_name,
                    EventId = d.eventId,
                    Amount = d.amount,
                    Date = d.date,
                    Notes = d.notes
                }).ToListAsync();
        }

        // GET: api/Donation/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DonationReadDTO>> GetDonation(int id)
        {
            var donation = await _context.Donation
                .Select(d => new DonationReadDTO
                {
                    Id = d.Id,
                    Donor_name = d.donor_name,
                    EventId = d.eventId,
                    Amount = d.amount,
                    Date = d.date,
                    Notes = d.notes
                })
                .FirstOrDefaultAsync(d => d.Id == id);

            if (donation == null) return NotFound();

            return donation;
        }

        // GET: api/Donation/Total
        [HttpGet("Total")]
        public async Task<ActionResult<float>> GetDonationTotals()
        {
            var total = await _context.Donation.SumAsync(e => e.amount);
            var totalDonations = new
            {
              total_Donations = total  
            };
            return Ok(totalDonations);
        }

        // POST: api/Donation
        [HttpPost]
        public async Task<ActionResult<DonationReadDTO>> PostDonation(DonationCreateDTO donationDto)
        {
            var donation = new Donation
            {
                donor_name = donationDto.Donor_name,
                eventId = donationDto.EventId,
                amount = donationDto.Amount,
                notes = donationDto.Notes,
                date = DateTime.UtcNow
            };

            _context.Donation.Add(donation);
            await _context.SaveChangesAsync();

            var readDto = new DonationReadDTO
            {
                Id = donation.Id,
                Donor_name = donation.donor_name,
                EventId = donation.eventId,
                Amount = donation.amount,
                Date = donation.date,
                Notes = donation.notes
            };

            return CreatedAtAction(nameof(GetDonation), new { id = readDto.Id }, readDto);
        }

        // PUT: api/Donation/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDonation(int id, DonationCreateDTO donationDto)
        {
            var donation = await _context.Donation.FindAsync(id);
            if (donation == null) return NotFound();

            // Update the existing entity properties
            donation.donor_name = donationDto.Donor_name;
            donation.eventId = donationDto.EventId;
            donation.amount = donationDto.Amount;
            donation.notes = donationDto.Notes;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DonationExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/Donation/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDonation(int id)
        {
            var donation = await _context.Donation.FindAsync(id);
            if (donation == null) return NotFound();

            _context.Donation.Remove(donation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DonationExists(int id)
        {
            return _context.Donation.Any(e => e.Id == id);
        }
    }
}