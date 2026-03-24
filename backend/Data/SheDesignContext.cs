using Microsoft.EntityFrameworkCore;
using Models.User;
using Models.Comment;
using Models.Donation;
using Models.Event;
using Models.Mentee;
using Models.Post;
using Models.Submission;
using Models.Volenteer;
using Microsoft.CodeAnalysis.Host;

namespace SheDesign.Data
{
    public class SheDesignContext : DbContext
    {
        public SheDesignContext(DbContextOptions<SheDesignContext> options) : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Comment> Comment { get; set; }
        public DbSet<Donation> Donation { get; set; }
        public DbSet<Event> Event { get; set; }
        public DbSet<Mentee> Mentee { get; set; }
        public DbSet<Post> Post { get; set; }
        public DbSet<Submission> Submission { get; set; }
        public DbSet<Volenteer> Volenteer { get; set; }
    }
}