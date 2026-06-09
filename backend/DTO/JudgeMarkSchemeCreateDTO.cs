namespace SheDesign.DTO
{
    public class JudgeMarkSchemeCreateDTO
    {
        public int PostId { get; set; }
        public int JudgeId { get; set; }
        public int Score { get; set; }
        public string? Comment { get; set; } = String.Empty;
    }
}
