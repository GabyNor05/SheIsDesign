namespace SheDesign.DTO
{
    public class MenteeCreateDTO
    {
        public string fullname { get; set; } = String.Empty;
        public string university { get; set; } = String.Empty;
        public string year_of_study { get; set; } = String.Empty;
        public string field_of_study { get; set; } = String.Empty;
        public string student_number { get; set; } = String.Empty;
        public bool wants_volunteer { get; set; } = false;
        public int userId { get; set; }
    }
}
