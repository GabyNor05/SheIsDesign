using Microsoft.AspNetCore.Mvc;
using SheDesign.Data;
using Microsoft.EntityFrameworkCore;
using SheDesign.Models;

namespace SheDesign.Controllers
{
    [ApiController]
    [Route("api/controller")]

    public class SheIsDesignController : ControllerBase
    {
        private readonly SheDesignContext _context;

        public SheIsDesignController(SheDesignContext context)
        {
            _context = context;
        }

        //GET
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAll()
        {
            return await _context.Users.ToListAsync();
        }
    }
}