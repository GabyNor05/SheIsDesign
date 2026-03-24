namespace Models.Mentee
{
    public class Mentee
    {
        public int Id { get; set; }
        public string fullname { get; set; } = String.Empty;
        public string university { get; set; } = String.Empty;
        public int year_of_study { get; set; } = 2026;
        public string field_of_study { get; set; } = String.Empty;
        public int userId { get; set; }
    }
}