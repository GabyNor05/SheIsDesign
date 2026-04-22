namespace SheDesign.Models
{
    public class Student
    {
        public int Id { get; set; }
        public string fullname { get; set; } = String.Empty;
        public string university { get; set; } = String.Empty;
        public string year_of_study { get; set; } = String.Empty;
        public string field_of_study { get; set; } = String.Empty;
        public string student_number { get; set; } = String.Empty;
        public bool wants_volunteer { get; set; } = false;
        public int userId { get; set; }

        public User? User { get; set; }

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Post> Posts { get; set; } = new List<Post>();
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    }
}