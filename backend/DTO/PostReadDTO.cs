using System;

namespace SheDesign.DTO
{
    public class PostReadDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public int StudentId { get; set; }
        public string ImageFileLink { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int EventId { get; set; }
        public int LinkCount { get; set; }
        public int CommentCount { get; set; }
        public DateTime PostDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        
        // Optional: If your UI needs basic details about the student/event 
        // without pulling the entire heavy entity, you can add simple strings or nested light DTOs here.
        public string StudentName { get; set; } = string.Empty; 
        public string EventName { get; set; } = string.Empty;
    }
}