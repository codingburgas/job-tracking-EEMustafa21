using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.DTOs;

public class UpdateJobRequest
{
    [MaxLength(200)]
    public string? Title { get; set; }
    
    [MaxLength(200)]
    public string? CompanyName { get; set; }
    
    [MinLength(50)]
    public string? Description { get; set; }
    
    public bool? IsActive { get; set; }
}