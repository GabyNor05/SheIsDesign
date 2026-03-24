using Microsoft.VisualBasic;

namespace Models.User
{
    public class User
    {
        public int Id { get; set; }
        public string email { get; set; } = String.Empty;
        public string password { get; set; } = String.Empty;
        public UserRoles roles { get; set; } = UserRoles.Guest;
    }
}

public enum UserRoles
{
    Admin,
    User,
    Guest,
}