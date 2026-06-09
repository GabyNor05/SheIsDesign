using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.VisualBasic;

namespace SheDesign.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; } = String.Empty;
        public string PasswordHash { get; set; } = String.Empty;
        public DateTime DateCreated {get; set; } = DateTime.UtcNow;
        public Role Role { get; set; } = Role.User;
        [Column("status")]
        public Status Status { get; set; } = Status.Pending;

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Student> Students { get; set; } = new List<Student>();
        public ICollection<IndustryProfessional> IndustryProfessionals { get; set; } = new List<IndustryProfessional>();
    }
}

public enum Status
{
    Pending,
    Approved,
    Rejected
};

public enum Role
{
    User,
    Judge,
    IndustryProfessional,
    Student,
    Admin
}
