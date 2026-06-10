namespace SheDesign.DTOs
{
    public class EventUpdateDTO
    {
        public string Title { get; set; } = String.Empty;
        public DateTime Start_date { get; set; } = DateTime.UtcNow;
        public DateTime End_date { get; set; } = DateTime.UtcNow;
        public string Description { get; set; } = String.Empty;
        public int Max_entry { get; set; }
        public string Category { get; set; } = String.Empty;
        public int Points_reward { get; set; }
        public string Status { get; set; } = String.Empty;
        public string? Image_link { get; set; } = String.Empty;
    }
}