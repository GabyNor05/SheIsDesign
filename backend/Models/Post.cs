using Microsoft.Build.Framework;

namespace SheDesign.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string title { get; set; } = String.Empty;
        public int studentId { get; set; }
        public string image_file_link { get; set; } = String.Empty;
        public string category { get; set; } = String.Empty;
        public int? eventId { get; set; }
        public int link_count { get; set; }
        public int comment_count { get; set; } = 0;
        public DateTime post_date { get; set; } = DateTime.Now;
        public string description { get; set; } = String.Empty;
        public string status { get; set; } = String.Empty;
        [Required]
        public Student? Student { get; set; }
        public Event? Event { get; set; }
    }
}