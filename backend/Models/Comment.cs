namespace SheDesign.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string body { get; set; } = String.Empty;
        public int userId { get; set; }
        public int studentId { get; set; }
        public DateTime timeStamp { get; set; } = DateTime.Now;

        public User? User { get; set; }
        public Student? Student { get; set; }
    }
}
