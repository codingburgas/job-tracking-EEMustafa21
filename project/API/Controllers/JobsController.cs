using JobPortal.API.DTOs;
using JobPortal.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JobPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly IJobService _jobService;
    
    public JobsController(IJobService jobService)
    {
        _jobService = jobService;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<JobResponse>>> GetJobs([FromQuery] bool activeOnly = false)
    {
        var jobs = activeOnly 
            ? await _jobService.GetActiveJobsAsync()
            : await _jobService.GetAllJobsAsync();
            
        return Ok(jobs);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<JobResponse>> GetJob(int id)
    {
        var job = await _jobService.GetJobByIdAsync(id);
        
        if (job == null)
        {
            return NotFound();
        }
        
        return Ok(job);
    }
    
    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<JobResponse>> CreateJob([FromBody] CreateJobRequest request)
    {
        var job = await _jobService.CreateJobAsync(request);
        return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
    }
    
    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<JobResponse>> UpdateJob(int id, [FromBody] UpdateJobRequest request)
    {
        var job = await _jobService.UpdateJobAsync(id, request);
        
        if (job == null)
        {
            return NotFound();
        }
        
        return Ok(job);
    }
    
    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> DeleteJob(int id)
    {
        var result = await _jobService.DeleteJobAsync(id);
        
        if (!result)
        {
            return NotFound();
        }
        
        return NoContent();
    }
}