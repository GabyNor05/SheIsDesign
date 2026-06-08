namespace SheDesign.DTO
{
    public class UserReadDTO
    {
        public int Id { get; set; }
        public string Email { get; set; } = String.Empty;
        public string Password { get; set; } = String.Empty;
        public Role Role { get; set; }
        public Status Status { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public bool IsNewUser { get; set; } = false;
        public string GivenName { get; set; } = string.Empty;
        public string FamilyName { get; set; } = string.Empty;
    }
}