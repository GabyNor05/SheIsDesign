namespace SheDesign.Models
{
    public class Submission
    {
        public int Id { get; set; }
        public int studentId { get; set; }
        public int eventId { get; set; }
        public string title { get; set; } = String.Empty;
        public string description { get; set; } = String.Empty;
        public string category { get; set; } = String.Empty;
        public string image_file_link { get; set; } = String.Empty;
        public string status { get; set; } = String.Empty;
        public int points { get; set; }
        public int rank { get; set; }
        public DateTime timeStamp { get; set; } = DateTime.Now;
        public Student? Student { get; set; }
        public Event? Event { get; set; }
    }
}