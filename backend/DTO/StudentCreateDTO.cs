namespace SheDesign.DTO
{
    public class StudentCreateDTO
    {
        public string Fullname { get; set; } = String.Empty;
        public string University { get; set; } = String.Empty;
        public int Year_of_study { get; set; } = 2026;
        public string Field_of_study { get; set; } = String.Empty;
        public string Student_number { get; set; } = String.Empty;
        public int UserID { get; set; }
    }
}