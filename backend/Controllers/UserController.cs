using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SheDesign.Data;
using SheDesign.Models;
using SheDesign.DTO;

namespace backend.Controllers
{
    [Route("api/[controller]s")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly SheDesignContext _context;

        public UserController(SheDesignContext context)
        {
            _context = context;
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
                Status = user.Status
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
                Status = user.Status
            };
        }

        [HttpPut("{id}/ApproveUser")]
        public async Task<IActionResult> ApproveUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Status = Status.Approved;

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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserUpdateDTO dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Email = dto.email;
            user.Role = dto.role;
            user.Status = dto.status;
            // add whichever fields your UserUpdateDTO has

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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(UserCreateDTO dto)
        {
            var hash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            Console.WriteLine($"DEBUG: The generated hash is: {hash}");
            var user = new User
            {
                Email = dto.Email,
                PasswordHash = hash,
                DateCreated = DateTime.UtcNow,
                Role = Role.User
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var result = new UserReadDTO
            {
                Id = user.Id,
                Email = user.Email,
                DateCreated = user.DateCreated,
                Role = user.Role
            };

            return CreatedAtAction("GetUser", new { id = user.Id }, result);
        }

        
        [HttpPost("Login")]
        public async Task<ActionResult> Login([FromBody] LoginDTO dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null) return Unauthorized("User Not Found");

            bool validPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!validPassword)
                return Unauthorized("Incorrect Password");

            return Ok(new UserReadDTO
            {
                Id = user.Id,
                Email = user.Email,
                DateCreated = user.DateCreated,
                Role = user.Role
            });
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
                    Role = Role.User
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            return Ok(new UserReadDTO
            {
                Id          = user.Id,
                Email       = user.Email,
                Role        = user.Role,
                DateCreated = user.DateCreated,
                IsNewUser   = isNewUser,
                GivenName   = givenName,
                FamilyName  = familyName,
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
