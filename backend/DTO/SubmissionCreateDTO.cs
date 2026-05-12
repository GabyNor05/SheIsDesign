namespace SheDesign.DTO
{
    public class SubmissionCreateDTO
    {
        public int StudentId { get; set; }
        public int EventId { get; set; }
        public string Title { get; set; } = string.Empty;
    }
}