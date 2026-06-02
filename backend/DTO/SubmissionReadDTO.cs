namespace SheDesign.DTO
{
    public class SubmissionReadDTO
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int EventId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int Points { get; set; }
        public int Rank { get; set; }
        public DateTime TimeStamp { get; set; }
    }
}