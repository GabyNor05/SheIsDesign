namespace SheDesign.DTOs
{
    public class DonationCreateDTO
    {
        public string? Donor_name { get; set; } = string.Empty;
        public int? EventId { get; set; }
        public float Amount { get; set; }
        public string? Notes { get; set; } = string.Empty;
    }
}