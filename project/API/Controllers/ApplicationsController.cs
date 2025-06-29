using JobPortal.API.DTOs;
using JobPortal.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JobPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;
    
    public ApplicationsController(IApplicationService applicationService)
    {
        _applicationService = applicationService;
    }
    
    [HttpPost("apply/{jobId}")]
    public async Task<ActionResult<ApplicationResponse>> ApplyForJob(int jobId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        
        var application = await _applicationService.ApplyForJobAsync(userId, jobId);
        
        if (application == null)
        {
            return BadRequest(new { message = "You have already applied for this job" });
        }
        
        return Ok(application);
    }
    
    [HttpGet("my-applications")]
    public async Task<ActionResult<IEnumerable<ApplicationResponse>>> GetMyApplications()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        
        var applications = await _applicationService.GetUserApplicationsAsync(userId);
        return Ok(applications);
    }
    
    [HttpGet("check/{jobId}")]
    public async Task<ActionResult<bool>> CheckIfApplied(int jobId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        
        var hasApplied = await _applicationService.HasUserAppliedForJobAsync(userId, jobId);
        return Ok(hasApplied);
    }
    
    [HttpGet("all")]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<IEnumerable<ApplicationResponse>>> GetAllApplications()
    {
        var applications = await _applicationService.GetAllApplicationsAsync();
        return Ok(applications);
    }
    
    [HttpPut("{id}/status")]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<ApplicationResponse>> UpdateApplicationStatus(int id, [FromBody] UpdateApplicationStatusRequest request)
    {
        var application = await _applicationService.UpdateApplicationStatusAsync(id, request.Status);
        
        if (application == null)
        {
            return NotFound();
        }
        
        return Ok(application);
    }
}

public class UpdateApplicationStatusRequest
{
    public string Status { get; set; } = string.Empty;
}