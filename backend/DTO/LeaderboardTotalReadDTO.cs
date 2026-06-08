namespace SheDesign.DTO
{
    public class LeaderboardTotalReadDTO
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public string Student_name { get; set; } = string.Empty;
        public string? Student_email { get; set; } = string.Empty;
        public int Rank { get; set; } = 1;
        public int Score { get; set; }
        public string Submission_title { get; set; } = string.Empty;
        public string Review_status { get; set; } = string.Empty;
    }
}