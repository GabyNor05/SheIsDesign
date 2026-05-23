using System;
namespace SheDesign.DTO
{
    public class EventReadDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateOnly Start_date { get; set; }
        public DateOnly End_date { get; set; }
        public int? Entry_count { get; set; }
        public string Description { get; set; } = string.Empty;
        public int Max_entry { get; set; }
        public string Category { get; set; } = string.Empty;
        public int Points_reward { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Image_link { get; set; }
    }
}