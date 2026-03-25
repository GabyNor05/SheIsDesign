using Microsoft.EntityFrameworkCore;
using SheDesign.Models;
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Comment relationships
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.userId);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Mentee)
                .WithMany(m => m.Comments)
                .HasForeignKey(c => c.menteeId);

            // Donation relationship
            modelBuilder.Entity<Donation>()
                .HasOne(d => d.Event)
                .WithMany(e => e.Donations)
                .HasForeignKey(d => d.eventId);

            // Mentee relationship
            modelBuilder.Entity<Mentee>()
                .HasOne(m => m.User)
                .WithMany(u => u.Mentees)
                .HasForeignKey(m => m.userId);

            // Post relationships
            modelBuilder.Entity<Post>()
                .HasOne(p => p.Mentee)
                .WithMany(m => m.Posts)
                .HasForeignKey(p => p.menteeId);

            modelBuilder.Entity<Post>()
                .HasOne(p => p.Event)
                .WithMany(e => e.Posts)
                .HasForeignKey(p => p.eventId);

            // Submission relationship
            modelBuilder.Entity<Submission>()
                .HasOne(s => s.Mentee)
                .WithMany(m => m.Submissions)
                .HasForeignKey(s => s.menteeId);

            // Volenteer relationship
            modelBuilder.Entity<Volenteer>()
                .HasOne(v => v.User)
                .WithMany(u => u.Volenteers)
                .HasForeignKey(v => v.userId);
        }
    }
}