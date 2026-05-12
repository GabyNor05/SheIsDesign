namespace SheDesign.DTO
{
    public class SubmissionUpdateDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int Points { get; set; }
        public int Rank { get; set; }
    }
}