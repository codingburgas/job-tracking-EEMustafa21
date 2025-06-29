using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.DTOs;

public class CreateJobRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string CompanyName { get; set; } = string.Empty;
    
    [Required]
    [MinLength(50)]
    public string Description { get; set; } = string.Empty;
    
    public bool IsActive { get; set; } = true;
}