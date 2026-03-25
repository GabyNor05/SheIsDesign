namespace SheDesign.Models
{
    public class Event
    {
        public int Id { get; set; }
        public string name { get; set; } = String.Empty;
        public DateOnly start_date { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public DateOnly end_date { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public int entry_count { get; set; }
        public string description { get; set; } = String.Empty;
        public int max_entery { get; set; }
        public string category { get; set; } = String.Empty;
        public int points_reward { get; set; }
        public string status { get; set; } = String.Empty;
        public string image_link { get; set; } = String.Empty;

        public ICollection<Donation> Donations { get; set; } = new List<Donation>();
        public ICollection<Post> Posts { get; set; } = new List<Post>();
    }
}
