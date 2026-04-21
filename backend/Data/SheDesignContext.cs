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
        public DbSet<Student> Student { get; set; }
        public DbSet<Post> Post { get; set; }
        public DbSet<Submission> Submission { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User column mapping for existing PostgreSQL lowercase schema
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.Property(u => u.Email).HasColumnName("email");
                entity.Property(u => u.PasswordHash).HasColumnName("password");
                entity.Property(u => u.Role).HasColumnName("roles");
            });

            // Comment table naming & mapping
            modelBuilder.Entity<Comment>(entity =>
            {
                entity.ToTable("Comment");
                entity.Property(c => c.body).HasColumnName("body");
                entity.Property(c => c.userId).HasColumnName("userId");
                entity.Property(c => c.studentId).HasColumnName("studentId");
                entity.Property(c => c.timeStamp).HasColumnName("timeStamp");
            });

            modelBuilder.Entity<Donation>(entity =>
            {
                entity.ToTable("Donation");
                entity.Property(d => d.donor_name).HasColumnName("donor_name");
                entity.Property(d => d.eventId).HasColumnName("eventId");
            });

            modelBuilder.Entity<Event>(entity =>
            {
                entity.ToTable("Event");
                entity.Property(e => e.name).HasColumnName("name");
            });

            modelBuilder.Entity<Student>(entity =>
            {
                entity.ToTable("Student");
                entity.Property(m => m.userId).HasColumnName("userId");
            });

            modelBuilder.Entity<Post>(entity =>
            {
                entity.ToTable("Post");
                entity.Property(p => p.studentId).HasColumnName("studentId");
                entity.Property(p => p.eventId).HasColumnName("eventId");
            });

            modelBuilder.Entity<Submission>(entity =>
            {
                entity.ToTable("Submission");
                entity.Property(s => s.studentId).HasColumnName("studentId");
            });

            // Comment relationships
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.userId);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Student)
                .WithMany(s => s.Comments)
                .HasForeignKey(c => c.studentId);

            // Donation relationship
            modelBuilder.Entity<Donation>()
                .HasOne(d => d.Event)
                .WithMany(e => e.Donations)
                .HasForeignKey(d => d.eventId);

            // Student relationship
            modelBuilder.Entity<Student>()
                .HasOne(s => s.User)
                .WithMany(u => u.Students)
                .HasForeignKey(s => s.userId);

            // Post relationships
            modelBuilder.Entity<Post>()
                .HasOne(p => p.Student)
                .WithMany(s => s.Posts)
                .HasForeignKey(p => p.studentId);

            modelBuilder.Entity<Post>()
                .HasOne(p => p.Event)
                .WithMany(e => e.Posts)
                .HasForeignKey(p => p.eventId);

            // Submission relationship
            modelBuilder.Entity<Submission>()
                .HasOne(s => s.Student)
                .WithMany(s => s.Submissions)
                .HasForeignKey(s => s.studentId);
        }
    }
}