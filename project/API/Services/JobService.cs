using JobPortal.API.Data;
using JobPortal.API.DTOs;
using JobPortal.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Services;

public class JobService : IJobService
{
    private readonly JobPortalDbContext _context;
    
    public JobService(JobPortalDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<JobResponse>> GetAllJobsAsync()
    {
        var jobs = await _context.Jobs
            .OrderByDescending(j => j.DatePosted)
            .ToListAsync();
            
        return jobs.Select(MapToJobResponse);
    }
    
    public async Task<IEnumerable<JobResponse>> GetActiveJobsAsync()
    {
        var jobs = await _context.Jobs
            .Where(j => j.IsActive)
            .OrderByDescending(j => j.DatePosted)
            .ToListAsync();
            
        return jobs.Select(MapToJobResponse);
    }
    
    public async Task<JobResponse?> GetJobByIdAsync(int id)
    {
        var job = await _context.Jobs.FindAsync(id);
        return job == null ? null : MapToJobResponse(job);
    }
    
    public async Task<JobResponse> CreateJobAsync(CreateJobRequest request)
    {
        var job = new Job
        {
            Title = request.Title,
            CompanyName = request.CompanyName,
            Description = request.Description,
            IsActive = request.IsActive,
            DatePosted = DateTime.UtcNow
        };
        
        _context.Jobs.Add(job);
        await _context.SaveChangesAsync();
        
        return MapToJobResponse(job);
    }
    
    public async Task<JobResponse?> UpdateJobAsync(int id, UpdateJobRequest request)
    {
        var job = await _context.Jobs.FindAsync(id);
        if (job == null) return null;
        
        if (!string.IsNullOrEmpty(request.Title))
            job.Title = request.Title;
            
        if (!string.IsNullOrEmpty(request.CompanyName))
            job.CompanyName = request.CompanyName;
            
        if (!string.IsNullOrEmpty(request.Description))
            job.Description = request.Description;
            
        if (request.IsActive.HasValue)
            job.IsActive = request.IsActive.Value;
        
        await _context.SaveChangesAsync();
        
        return MapToJobResponse(job);
    }
    
    public async Task<bool> DeleteJobAsync(int id)
    {
        var job = await _context.Jobs.FindAsync(id);
        if (job == null) return false;
        
        _context.Jobs.Remove(job);
        await _context.SaveChangesAsync();
        
        return true;
    }
    
    private static JobResponse MapToJobResponse(Job job)
    {
        return new JobResponse
        {
            Id = job.Id,
            Title = job.Title,
            CompanyName = job.CompanyName,
            Description = job.Description,
            DatePosted = job.DatePosted,
            IsActive = job.IsActive
        };
    }
}