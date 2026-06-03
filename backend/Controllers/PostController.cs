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
    public class PostController : ControllerBase
    {
        private readonly SheDesignContext _context;

        public PostController(SheDesignContext context)
        {
            _context = context;
        }

        // GET: api/Post
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostReadDto>>> GetPost()
        {
            var posts = await _context.Post.ToListAsync();

            var postDtos = posts.Select(post => new PostReadDto
            {
                Id = post.Id,
                Title = post.title,
                StudentId = post.studentId,
                ImageFileLink = post.image_file_link,
                Category = post.category,
                EventId = post.eventId,
                LinkCount = post.link_count,
                CommentCount = post.comment_count,
                PostDate = post.post_date,
                Description = post.description,
                Status = post.status
            }).ToList();

            return Ok(postDtos);
        }

        // GET: api/Post/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PostReadDto>> GetPost(int id)
        {
            var post = await _context.Post.FindAsync(id);

            if (post == null) return NotFound();

            var postDto = new PostReadDto
            {
                Id = post.Id,
                Title = post.title,
                StudentId = post.studentId,
                ImageFileLink = post.image_file_link,
                Category = post.category,
                EventId = post.eventId,
                LinkCount = post.link_count,
                CommentCount = post.comment_count,
                PostDate = post.post_date,
                Description = post.description,
                Status = post.status
            };

            return Ok(postDto);
        }

        // PUT: api/Post/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPost(int id, PostCreateDto postUpdateDto)
        {
            var postToUpdate = await _context.Post.FindAsync(id);
            if (postToUpdate == null) return NotFound();

            postToUpdate.title = postUpdateDto.Title;
            postToUpdate.studentId = postUpdateDto.StudentId;
            postToUpdate.image_file_link = postUpdateDto.ImageFileLink;
            postToUpdate.category = postUpdateDto.Category;
            postToUpdate.eventId = postUpdateDto.EventId;
            postToUpdate.description = postUpdateDto.Description;
            postToUpdate.status = postUpdateDto.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostExists(id))
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

        // POST: api/Post
        [HttpPost]
        public async Task<ActionResult<PostReadDto>> PostPost(PostCreateDto postCreateDto)
        {
            var postEntity = new Post
            {
                title = postCreateDto.Title,
                studentId = postCreateDto.StudentId,
                image_file_link = postCreateDto.ImageFileLink,
                category = postCreateDto.Category,
                eventId = postCreateDto.EventId,
                description = postCreateDto.Description,
                status = postCreateDto.Status,
                comment_count = 0,
                post_date = DateTime.Now
            };

            _context.Post.Add(postEntity);
            await _context.SaveChangesAsync();

            var postReadDto = new PostReadDto
            {
                Id = postEntity.Id,
                Title = postEntity.title,
                StudentId = postEntity.studentId,
                ImageFileLink = postEntity.image_file_link,
                Category = postEntity.category,
                EventId = postEntity.eventId,
                LinkCount = postEntity.link_count,
                CommentCount = postEntity.comment_count,
                PostDate = postEntity.post_date,
                Description = postEntity.description,
                Status = postEntity.status
            };

            return CreatedAtAction(nameof(GetPost), new { id = postReadDto.Id }, postReadDto);
        }

        // DELETE: api/Post/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _context.Post.FindAsync(id);
            if (post == null) return NotFound();

            _context.Post.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PostExists(int id)
        {
            return _context.Post.Any(e => e.Id == id);
        }
    }
}