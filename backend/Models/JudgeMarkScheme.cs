namespace SheDesign.Models
{
    public class JudgeMarkScheme
    {
        public int Id { get; set; }
        public int PostId { get; set; } 
        public int JudgeId { get; set; } 
        public int Score { get; set; }
        public string? Comment { get; set; } = String.Empty;
        public DateTime TimeStamp = DateTime.UtcNow;
        
        public Judge? Judge { get; set; }
        public Post? Post { get; set; }
    }
}
