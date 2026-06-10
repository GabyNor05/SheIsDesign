using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SheDesign.Data;
using SheDesign.Models;
using SheDesign.DTO;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly SheDesignContext _context;
        private readonly IConfiguration _configuration;

        public UserController(SheDesignContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserReadDTO>>> GetUsers()
        {
            return await _context.Users.Select(user => new UserReadDTO
            {
                Id = user.Id,
                Email = user.Email,
                DateCreated = user.DateCreated,
                Role = user.Role,
                Status = user.Status,
                ProfilePictureLink = user.ProfilePictureLink
            }).ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserReadDTO>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null) return NotFound();

            return new UserReadDTO
            {
                Id = user.Id,
                Email = user.Email,
                DateCreated = user.DateCreated,
                Role = user.Role,
                Status = user.Status,
                ProfilePictureLink = user.ProfilePictureLink
            };
        }

        [HttpPut("{id}/ChangeUserStatus")]
        public async Task<IActionResult> ChangeUserStatus(int id, Status userStatus)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Status = userStatus;
            _context.Entry(user).Property(u => u.Status).IsModified = true;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpPut("{id}/ChangeUserRole")]
        public async Task<IActionResult> ChangeUserRole(int id, Role userRole)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Role = userRole;
            _context.Entry(user).Property(u => u.Role).IsModified = true;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpPut("{id}/UpdateProfilePicture")]
        public async Task<IActionResult> UpdateProfilePicture(int id, UserProfilePictureDTO profilePictureDTO)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.ProfilePictureLink = profilePictureDTO.ProfilePictureLink;
            _context.Entry(user).Property(u => u.ProfilePictureLink).IsModified = true; // fixed

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserUpdateDTO dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Email = dto.email;
            user.Role = dto.role;
            user.Status = dto.status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(UserCreateDTO dto)
        {
            var emailExists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
            if (emailExists)
                return Conflict("An account with this email address already exists.");

            var hash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = hash,
                DateCreated = DateTime.UtcNow,
                Role = Role.User,
                ProfilePictureLink = dto.ProfilePictureLink
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var result = new UserReadDTO
            {
                Id = user.Id,
                Email = user.Email,
                DateCreated = user.DateCreated,
                Role = user.Role,
                ProfilePictureLink = user.ProfilePictureLink
            };

            return CreatedAtAction("GetUser", new { id = user.Id }, result);
        }

        [HttpPost("Login")]
        public async Task<ActionResult> Login([FromBody] LoginDTO dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null) return Unauthorized("User Not Found");

            bool validPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!validPassword) return Unauthorized("Incorrect Password");

            var student = await _context.Student.FirstOrDefaultAsync(s => s.userId == user.Id);
            var ip      = await _context.IndustryProfessional.FirstOrDefaultAsync(ip => ip.userId == user.Id);
            var judge   = ip != null ? await _context.Judge.FirstOrDefaultAsync(j => j.IndustryProfessionalID == ip.Id) : null;

            return Ok(new UserReadDTO
            {
                Id = user.Id,
                Email = user.Email,
                DateCreated = user.DateCreated,
                Role = user.Role,
                Status = user.Status,
                StudentId = student?.Id,
                JudgeId = judge?.Id,
            });
        }

        [HttpPost("VerifyAdminCode")]
        public ActionResult VerifyAdminCode([FromBody] AdminCodeDTO dto)
        {
            var expected = _configuration["AdminAccessCode"];
            if (string.IsNullOrEmpty(expected) || dto.Code?.Trim() != expected)
                return Unauthorized("Invalid admin access code.");
            return Ok();
        }

        [HttpPost("GoogleLogin")]
        public async Task<ActionResult<UserReadDTO>> GoogleLogin([FromBody] GoogleLoginDTO dto)
        {
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", dto.AccessToken);

            var googleResponse = await httpClient.GetAsync("https://www.googleapis.com/oauth2/v3/userinfo");
            if (!googleResponse.IsSuccessStatusCode)
                return Unauthorized("Invalid Google token");

            var json = await googleResponse.Content.ReadAsStringAsync();
            using var doc = System.Text.Json.JsonDocument.Parse(json);
            var root = doc.RootElement;

            var email      = root.GetProperty("email").GetString() ?? "";
            var givenName  = root.TryGetProperty("given_name",  out var gn) ? gn.GetString() ?? "" : "";
            var familyName = root.TryGetProperty("family_name", out var fn) ? fn.GetString() ?? "" : "";

            if (string.IsNullOrEmpty(email))
                return Unauthorized("Could not retrieve email from Google");

            bool isNewUser = false;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                isNewUser = true;
                user = new User
                {
                    Email = email,
                    PasswordHash = string.Empty,
                    DateCreated = DateTime.UtcNow,
                    Role = Role.User,
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            var student = await _context.Student.FirstOrDefaultAsync(s => s.userId == user.Id);
            var ip      = await _context.IndustryProfessional.FirstOrDefaultAsync(ip => ip.userId == user.Id);
            var judge   = ip != null ? await _context.Judge.FirstOrDefaultAsync(j => j.IndustryProfessionalID == ip.Id) : null;

            return Ok(new UserReadDTO
            {
                Id         = user.Id,
                Email      = user.Email,
                Role       = user.Role,
                DateCreated = user.DateCreated,
                Status     = user.Status,
                IsNewUser  = isNewUser,
                GivenName  = givenName,
                FamilyName = familyName,
                StudentId  = student?.Id,
                JudgeId    = judge?.Id,
            });
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}