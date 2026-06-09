namespace SheDesign.Models
{
    public class Judge
    {
        public int Id { get; set; }
        public int IndustryProfessionalID;
        public IndustryProfessional? IndustryProfessional { get; set; }
    }
}
