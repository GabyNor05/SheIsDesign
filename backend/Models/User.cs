using System.ComponentModel.DataAnnotations;
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
        public string Role { get; set; } = "User";

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Mentee> Mentees { get; set; } = new List<Mentee>();
        public ICollection<Volenteer> Volenteers { get; set; } = new List<Volenteer>();
        public ICollection<IndustryProfessional> IndustryProfessionals { get; set; } = new List<IndustryProfessional>();
    }
}
