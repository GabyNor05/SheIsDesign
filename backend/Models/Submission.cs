namespace Models.Submission
{
    public class Submission
    {
        public int Id { get; set; }
        public int menteeId { get; set; }
        public string title { get; set; } = String.Empty;
        public string status { get; set; } = String.Empty;
        public int points { get; set; }
        public int rank { get; set; }
    }
}