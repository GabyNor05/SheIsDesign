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
        public string Role { get; set; } = "User";

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Student> Students { get; set; } = new List<Student>();
    }
}
