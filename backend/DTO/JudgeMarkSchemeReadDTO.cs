namespace SheDesign.DTO
{
    public class JudgeMarkSchemeReadDTO
    {
        public int Id { get; set; }
        public int PostId { get; set; } 
        public int JudgeId { get; set; } 
        public int Score { get; set; }
        public string? Comment { get; set; }
        public DateTime TimeStamp { get; set; }

        // Flattened relational fields for easier frontend rendering
        public string JudgeName { get; set; } = string.Empty;
        public string PostTitle { get; set; } = string.Empty;
    }
}