using System;

namespace SheDesign.DTO
{
    public class JudgeEventDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime Start_date { get; set; }
        public DateTime End_date { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Image_link { get; set; }
        public int SubmissionCount { get; set; }
        public int ScoredCount { get; set; }
    }
}
