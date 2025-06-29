using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.Models;

public class Application
{
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    
    [Required]
    public int JobId { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Submitted";
    
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public User User { get; set; } = null!;
    public Job Job { get; set; } = null!;
}