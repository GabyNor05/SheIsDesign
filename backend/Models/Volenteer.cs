namespace SheDesign.Models
{
    public class Volenteer
    {
        public int Id { get; set; }
        public int eventCount { get; set; } = 0;
        public int userId { get; set; }

        public User? User { get; set; }
    }
}