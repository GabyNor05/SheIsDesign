namespace SheDesign.Models
{
    public class Donation
    {
        public int Id { get; set; }
        public string? donor_name { get; set; } = String.Empty;
        public int eventId { get; set; }
        public float amount { get; set; }
        public DateTime date { get; set; } = DateTime.Now;
        public string? notes { get; set; } = String.Empty;

        public Event? Event { get; set; }
    }
}
