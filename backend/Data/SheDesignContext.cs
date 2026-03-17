using Microsoft.EntityFrameworkCore;
using SheDesign.Models;

namespace SheDesign.Data
{
    public class SheDesignContext : DbContext
    {
        public SheDesignContext(DbContextOptions<SheDesignContext> options) : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
    }
}