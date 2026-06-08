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

    public class LeaderboardController : ControllerBase
    {
        private readonly SheDesignContext _context;

        public LeaderboardController(SheDesignContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeaderboardTotalReadDTO>>> GetTotalLeaderboardDetails(int eventId)
        {
            // 1. Fetch submissions and join with Student data
            var results = await _context.Submission
                .Where(s => s.eventId == eventId)
                .Include(s => s.Student) // Ensure the Student relationship is loaded
                .OrderByDescending(s => s.rank) // Sort by score for ranking
                .ToListAsync();

            // 2. Map to DTO and calculate Rank
            var leaderboard = results.Select((s, index) => new LeaderboardTotalReadDTO
            {
                Id = s.Id,
                EventId = s.eventId,
                // Student Info (Accessing through navigation property)
                Student_name = s.Student?.fullname ?? "Unknown",
                Student_email = s.Student?.User?.Email,

                // Ranking (index starts at 0, so we add 1)
                Rank = index + 1,

                // Submission Info
                Score = s.points,
                Submission_title = s.title,
                Review_status = s.status
            }).ToList();

            return Ok(leaderboard);
        }
    }
}