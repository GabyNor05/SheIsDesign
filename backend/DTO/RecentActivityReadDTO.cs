namespace SheDesign.DTO
{
    public class RecentActivityReadDTO
    {
        public int Id { get; set; }
        public string ActivityType { get; set; } = string.Empty; // "Post", "Donation", "JudgeMarkScheme"
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime Timestamp { get; set; }
        public string? ActorName { get; set; }  // Student name, donor name, or judge name
        public int? RelatedEventId { get; set; }
        public int? RelatedPostId { get; set; }
    }
}
 