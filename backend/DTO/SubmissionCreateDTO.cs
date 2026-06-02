namespace SheDesign.DTO
{
    public class SubmissionCreateDTO
    {
        public int StudentId { get; set; }
        public int EventId { get; set; }
        public string Title { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public string Category { get; set; } = String.Empty;
        public string ImageFileLink { get; set; } = String.Empty;
    }
}