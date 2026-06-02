namespace SheDesign.DTO
{
    public class SubmissionReadDTO
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int EventId { get; set; }
        public string Title { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public string Category { get; set; } = String.Empty;
        public string ImageFileLink { get; set; } = String.Empty;
        public string Status { get; set; } = String.Empty;
        public int Points { get; set; }
        public int Rank { get; set; }
        public DateTime TimeStamp { get; set; }
        public string StudentName { get; set; } = String.Empty;
        public string EventName { get; set; } = String.Empty;
    }
}