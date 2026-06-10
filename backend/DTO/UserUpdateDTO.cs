namespace SheDesign.DTO
{
    public class UserUpdateDTO
    {
        public string email { get; set; } = String.Empty;
        public Role role { get; set; } = Role.User;
        public Status status { get; set; } = Status.Approved;
    }
}