namespace SheDesign.DTO
{
    public class LeaderboardEntryReadDTO
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public int PostId { get; set; }
        public string Student_name { get; set; } = string.Empty;
        public string? Student_email { get; set; } = string.Empty;
        public string? Student_University { get; set; } = string.Empty;
        public int Score { get; set; }
        public string Submission_title { get; set; } = string.Empty;
        public ReviewStatus Review_status { get; set; } = ReviewStatus.Reviewed;
    }
}

public enum ReviewStatus
{
    Unreviewed,
    Reviewed,
}