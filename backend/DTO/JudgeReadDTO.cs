namespace SheDesign.DTO
{
    public class JudgeReadDTO
    {
        public int Id { get; set; }
        public int IndustryProfessionalID { get; set; }

        // Flattened IndustryProfessional fields
        public string Fullname { get; set; } = String.Empty;
        public string Institution { get; set; } = String.Empty;
        public string JobTitle { get; set; } = String.Empty;
        public int UserId { get; set; }
    }
}