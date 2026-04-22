namespace SheDesign.DTO
{
    public class LeaderboardDetailsDTO
    {
        public int rank { get; set; }
        public int points { get; set; }
        public string studentName { get; set; } = String.Empty;
        public string studentEmail { get; set; } = String.Empty;
        public string submissionTitle { get; set; } = String.Empty;
        public string submissionStatus { get; set; } = String.Empty;
    }
}