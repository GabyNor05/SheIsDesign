namespace SheDesign.Models
{
    public class Event
    {
        public int Id { get; set; }
        public int? JudgeId { get; set; }
        public string Title { get; set; } = String.Empty;
        public DateTime Start_date { get; set; } = DateTime.UtcNow;
        public DateTime End_date { get; set; } = DateTime.UtcNow;
        public int? Entry_count { get; set; }
        public string Description { get; set; } = String.Empty;
        public int Max_entry { get; set; }
        public string Category { get; set; } = String.Empty;
        public int Points_reward { get; set; }
        public string Status { get; set; } = String.Empty; 
        public string? Image_link { get; set; } = String.Empty;
        public Judge? AssignedJudgeIDs { get; set; } = new Judge();
        public ICollection<Donation>? Donations { get; set; } = new List<Donation>();
        public ICollection<Post>? Posts { get; set; } = new List<Post>();
    }
}
