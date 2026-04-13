using Microsoft.VisualBasic;

namespace Models.User
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = String.Empty;
        public string Password { get; set; } = String.Empty;
        public UserRoles Roles { get; set; } = UserRoles.Guest;
    }
}

public enum UserRoles
{
    Admin,
    User,
    Guest,
}