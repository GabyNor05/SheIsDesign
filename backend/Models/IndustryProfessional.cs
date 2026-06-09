namespace SheDesign.Models
{
    public class IndustryProfessional
    {
        public int Id { get; set; }
        public string institution { get; set; } = String.Empty;
        public string fullname { get; set; } = String.Empty;
        public string job_title { get; set; } = String.Empty;
        public int userId { get; set; }

        public User? User { get; set; }
    }
}
