namespace SheDesign.DTO
{
    public class UserReadDTO
    {
        public int Id { get; set; }
        public string Email { get; set; } = String.Empty;
        public string Password { get; set; } = String.Empty;
        public DateTime DateCreated { get; set; }
        public string Role { get; set; } = String.Empty;
    }
}