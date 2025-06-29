namespace JobPortal.API.DTOs;

public class ApplicationResponse
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int JobId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime AppliedAt { get; set; }
    public JobResponse? Job { get; set; }
    public UserResponse? User { get; set; }
}