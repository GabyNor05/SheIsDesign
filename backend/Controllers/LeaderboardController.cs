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
        public async Task<ActionResult<IEnumerable<LeaderboardEntryReadDTO>>> GetLeaderboard(int eventId)
        {
            // Fetch all posts linked to the event, with their student and mark scheme scores
            var posts = await _context.Post
                .Where(p => p.eventId == eventId)
                .Include(p => p.Student)
                    .ThenInclude(s => s.User)
                .Include(p => p.Event)
                .ToListAsync();

            if (!posts.Any())
                return NotFound($"No posts found for event ID {eventId}.");

            // Get all JudgeMarkScheme scores for posts in this event
            var postIds = posts.Select(p => p.Id).ToList();

            var markSchemes = await _context.JudgeMarkScheme
                .Where(j => postIds.Contains(j.PostId))
                .ToListAsync();

            // Map to DTO, summing all judge scores per post, sorted by total score descending
            var leaderboard = posts
                .Select(p => new
                {
                    Post = p,
                    TotalScore = markSchemes
                        .Where(j => j.PostId == p.Id)
                        .Sum(j => j.Score)
                })
                .OrderByDescending(x => x.TotalScore)
                .Select((x, index) => new LeaderboardEntryReadDTO
                {
                    Id = x.Post.Id,
                    EventId = eventId,
                    Student_name = x.Post.Student?.fullname ?? "Unknown",
                    Student_email = x.Post.Student?.User?.Email,
                    Student_University = x.Post.Student?.university,
                    Score = x.TotalScore,
                    Submission_title = x.Post.title,
                    Review_status = markSchemes.Any(j => j.PostId == x.Post.Id)
                        ? ReviewStatus.Reviewed
                        : ReviewStatus.Unreviewed,
                    Image_file_link = x.Post.image_file_link
                })
                .ToList();

            return Ok(leaderboard);
        }
    }
}