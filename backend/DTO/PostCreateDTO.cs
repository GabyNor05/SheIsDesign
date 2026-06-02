using System.ComponentModel.DataAnnotations;

namespace SheDesign.DTO
{
    public class PostCreateDto
    {
        [Required(ErrorMessage = "Title is required.")]
        [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "StudentId is required.")]
        public int StudentId { get; set; }

        public string ImageFileLink { get; set; } = string.Empty;

        [Required(ErrorMessage = "Category is required.")]
        public string Category { get; set; } = string.Empty;

        public int EventId { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        public string Description { get; set; } = string.Empty;

        public string Status { get; set; } = "Pending";
    }
}