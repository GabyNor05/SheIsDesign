namespace SheDesign.Models
{
    public class Event
    {
        public int Id { get; set; }
        public string Title { get; set; } = String.Empty;
        public DateOnly Start_date { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public DateOnly End_date { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public int? Entry_count { get; set; }
        public string Description { get; set; } = String.Empty;
        public int Max_entry { get; set; }
        public string Category { get; set; } = String.Empty;
        public int Points_reward { get; set; }
        public string Status { get; set; } = String.Empty; 
        public string? Image_link { get; set; } = String.Empty;
        public ICollection<Donation>? Donations { get; set; } = new List<Donation>();
        public ICollection<Post>? Posts { get; set; } = new List<Post>();
    }
}
