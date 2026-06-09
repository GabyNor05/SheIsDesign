namespace SheDesign.Models
{
    public class Judge
    {
        public int Id { get; set; }
        public int IndustryProfessionalID { get; set; } 
        public IndustryProfessional? IndustryProfessional { get; set; }
    }
}
