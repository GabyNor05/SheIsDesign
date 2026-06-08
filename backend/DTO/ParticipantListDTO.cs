namespace SheDesign.DTO
{
    public class ParticipantListDTO
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Initials { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public string Field { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Joined { get; set; } = string.Empty;
        public int Submissions { get; set; }
        public int Points { get; set; }
    }

    public class ParticipantStatusUpdateDTO
    {
        public string Status { get; set; } = string.Empty;
    }
}
