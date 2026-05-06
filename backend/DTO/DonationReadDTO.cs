namespace SheDesign.DTOs
{
    public class DonationReadDTO
    {
        public int Id { get; set; }
        public string? Donor_name { get; set; }
        public int EventId { get; set; }
        public float Amount { get; set; }
        public DateTime Date { get; set; }
        public string? Notes { get; set; }
    }
}