using Microsoft.VisualBasic;

namespace SheDesign.Models
{
    public class User
    {
        public int Id { get; set; }
        public string email { get; set; } = String.Empty;
        public string password { get; set; } = String.Empty;
        public UserRoles roles { get; set; } = UserRoles.Guest;
    }

    public class Mentee
    {
        public int Id { get; set; }
        public string fullname { get; set; } = String.Empty;
        public string university { get; set; } = String.Empty;
        public int year_of_study { get; set; } = 2026;
        public string field_of_study { get; set; } = String.Empty;
        public int userId { get; set; }
    }

    public class Volenteer
    {
        public int Id { get; set; }
        public int eventCount { get; set; } = 0;
        public int userId { get; set; }
    }

    public class Event
    {
        public int Id { get; set; }
        public string name { get; set; } = String.Empty;
        public DateOnly start_date { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public DateOnly end_date { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public int entry_count { get; set; }
        public string description { get; set; } = String.Empty;
        public int max_entery { get; set; }
        public string category { get; set; } = String.Empty;
        public int points_reward { get; set; }
        public string status { get; set; } = String.Empty;
        public string image_link { get; set; } = String.Empty;
    }

    public class Comment
    {
        public int Id { get; set; }
        public string body { get; set; } = String.Empty;
        public int userId { get; set; }
        public int menteeId { get; set; }
        public DateTime timeStamp { get; set; } = DateTime.Now;
    }

    public class Submission
    {
        public int Id { get; set; }
        public int menteeId { get; set; }
        public string title { get; set; } = String.Empty;
        public string status { get; set; } = String.Empty;
        public int points { get; set; }
        public int rank { get; set; }
    }

    public class Post
    {
        public int Id { get; set; }
        public string title { get; set; } = String.Empty;
        public int menteeId { get; set; }
        public string image_file_link { get; set; } = String.Empty;
        public string category { get; set; } = String.Empty;
        public int eventId { get; set; }
        public int link_count { get; set; }
        public int comment_count { get; set; }
        public DateTime post_date { get; set; } = DateTime.Now;
        public string description { get; set; } = String.Empty;
        public string status { get; set; } = String.Empty;
    }

    public class Donation
    {
        public int Id { get; set; }
        public string donor_name { get; set; } = String.Empty;
        public int eventId { get; set; }
        public float amount { get; set; }
        public DateTime date { get; set; } = DateTime.Now;
        public string notes { get; set; } = String.Empty;
    }
}

public enum UserRoles
{
    Admin,
    User,
    Guest,
}