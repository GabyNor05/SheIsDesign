namespace SheDesign.DTO
{
    public class UserCreateDTO
    {
        public string Email { get; set; } = String.Empty;
        public string Password { get; set; } = String.Empty;
        public string? ProfilePictureLink { get; set; } = String.Empty;
    }
}