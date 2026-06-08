namespace SheDesign.DTO
{
    public class StudentCreateDTO
    {
        public string fullname { get; set; } = String.Empty;
        public string university { get; set; } = String.Empty;
        public int year_of_study { get; set; } = 2026;
        public string field_of_study { get; set; } = String.Empty;
        public string student_number { get; set; } = String.Empty;
        public int userID { get; set; }
    }
}