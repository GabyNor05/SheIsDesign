namespace SheDesign.DTO
{
    public class ParticipantProfileDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string University { get; set; } = string.Empty;
        public int TotalEventsJoined { get; set; }
        public int TotalScore { get; set; }
        public string? MostRecentEventTitle { get; set; }
        public DateOnly? MostRecentEventDate { get; set; }
    }
}
