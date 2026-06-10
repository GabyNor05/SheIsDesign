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
    public class RecentActivityController : ControllerBase
    {
        private readonly SheDesignContext _context;

        public RecentActivityController(SheDesignContext context)
        {
            _context = context;
        }

        // GET: api/RecentActivity
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecentActivityReadDTO>>> GetRecentActivity(int limit = 10)
        {
            // 1. Posts
            var postActivities = await _context.Post
                .Include(p => p.Student)
                .Select(p => new RecentActivityReadDTO
                {
                    Id = p.Id,
                    ActivityType = "Post",
                    Title = $"New post submitted: {p.title}",
                    Description = p.description,
                    Timestamp = p.post_date,
                    ActorName = p.Student != null ? p.Student.fullname : "Unknown Student",
                    RelatedEventId = p.eventId,
                    RelatedPostId = p.Id
                })
                .ToListAsync();

            // 2. Donations
            var donationActivities = await _context.Donation
                .Select(d => new RecentActivityReadDTO
                {
                    Id = d.Id,
                    ActivityType = "Donation",
                    Title = $"Donation received: R{d.amount}",
                    Description = d.notes,
                    Timestamp = d.date,
                    ActorName = d.donor_name ?? "Anonymous",
                    RelatedEventId = d.eventId,
                    RelatedPostId = null
                })
                .ToListAsync();

            // 3. JudgeMarkScheme scores
            var markSchemeActivities = await _context.JudgeMarkScheme
                .Include(j => j.Judge)
                    .ThenInclude(j => j.IndustryProfessional)
                .Include(j => j.Post)
                .Select(j => new RecentActivityReadDTO
                {
                    Id = j.Id,
                    ActivityType = "JudgeMarkScheme",
                    Title = $"Post scored: {(j.Post != null ? j.Post.title : "Unknown Post")}",
                    Description = j.Comment,
                    Timestamp = j.TimeStamp,
                    ActorName = j.Judge != null && j.Judge.IndustryProfessional != null
                        ? j.Judge.IndustryProfessional.fullname
                        : "Unknown Judge",
                    RelatedEventId = j.Post != null ? j.Post.eventId : null,
                    RelatedPostId = j.PostId
                })
                .ToListAsync();

            // 4. Events created (using Start_date as creation proxy)
            var eventActivities = await _context.Event
                .Select(e => new RecentActivityReadDTO
                {
                    Id = e.Id,
                    ActivityType = "Event",
                    Title = $"New event created: {e.Title}",
                    Description = e.Description,
                    Timestamp = e.Start_date,
                    ActorName = "Admin",
                    RelatedEventId = e.Id,
                    RelatedPostId = null
                })
                .ToListAsync();

            // 5. New user accounts
            var userActivities = await _context.Users
                .Select(u => new RecentActivityReadDTO
                {
                    Id = u.Id,
                    ActivityType = "NewAccount",
                    Title = $"New account registered: {u.Email}",
                    Description = $"Role: {u.Role}",
                    Timestamp = u.DateCreated,
                    ActorName = u.Email,
                    RelatedEventId = null,
                    RelatedPostId = null
                })
                .ToListAsync();

            // Merge all, sort by most recent, take top 10
            var recentActivity = postActivities
                .Concat(donationActivities)
                .Concat(markSchemeActivities)
                .Concat(eventActivities)
                .Concat(userActivities)
                .OrderByDescending(a => a.Timestamp)
                .Take(limit)
                .ToList();

            return Ok(recentActivity);
        }

        // GET: api/RecentActivity/Event/5
        [HttpGet("Event/{eventId}")]
        public async Task<ActionResult<IEnumerable<RecentActivityReadDTO>>> GetRecentActivityByEvent(int eventId)
        {
            var postActivities = await _context.Post
                .Where(p => p.eventId == eventId)
                .Include(p => p.Student)
                .Select(p => new RecentActivityReadDTO
                {
                    Id = p.Id,
                    ActivityType = "Post",
                    Title = $"New post submitted: {p.title}",
                    Description = p.description,
                    Timestamp = p.post_date,
                    ActorName = p.Student != null ? p.Student.fullname : "Unknown Student",
                    RelatedEventId = p.eventId,
                    RelatedPostId = p.Id
                })
                .ToListAsync();

            var donationActivities = await _context.Donation
                .Where(d => d.eventId == eventId)
                .Select(d => new RecentActivityReadDTO
                {
                    Id = d.Id,
                    ActivityType = "Donation",
                    Title = $"Donation received: R{d.amount}",
                    Description = d.notes,
                    Timestamp = d.date,
                    ActorName = d.donor_name ?? "Anonymous",
                    RelatedEventId = d.eventId,
                    RelatedPostId = null
                })
                .ToListAsync();

            var markSchemeActivities = await _context.JudgeMarkScheme
                .Include(j => j.Post)
                .Where(j => j.Post != null && j.Post.eventId == eventId)
                .Include(j => j.Judge)
                    .ThenInclude(j => j.IndustryProfessional)
                .Select(j => new RecentActivityReadDTO
                {
                    Id = j.Id,
                    ActivityType = "JudgeMarkScheme",
                    Title = $"Post scored: {(j.Post != null ? j.Post.title : "Unknown Post")}",
                    Description = j.Comment,
                    Timestamp = j.TimeStamp,
                    ActorName = j.Judge != null && j.Judge.IndustryProfessional != null
                        ? j.Judge.IndustryProfessional.fullname
                        : "Unknown Judge",
                    RelatedEventId = eventId,
                    RelatedPostId = j.PostId
                })
                .ToListAsync();

            // For event-scoped view, include the event creation itself
            var eventActivity = await _context.Event
                .Where(e => e.Id == eventId)
                .Select(e => new RecentActivityReadDTO
                {
                    Id = e.Id,
                    ActivityType = "Event",
                    Title = $"Event created: {e.Title}",
                    Description = e.Description,
                    Timestamp = e.Start_date,
                    ActorName = "Admin",
                    RelatedEventId = e.Id,
                    RelatedPostId = null
                })
                .ToListAsync();

            var recentActivity = postActivities
                .Concat(donationActivities)
                .Concat(markSchemeActivities)
                .Concat(eventActivity)
                .OrderByDescending(a => a.Timestamp)
                .Take(10)
                .ToList();

            if (!recentActivity.Any())
                return NotFound($"No recent activity found for event ID {eventId}.");

            return Ok(recentActivity);
        }
    }
}
