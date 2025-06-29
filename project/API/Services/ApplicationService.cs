using JobPortal.API.Data;
using JobPortal.API.DTOs;
using JobPortal.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Services;

public class ApplicationService : IApplicationService
{
    private readonly JobPortalDbContext _context;
    
    public ApplicationService(JobPortalDbContext context)
    {
        _context = context;
    }
    
    public async Task<ApplicationResponse?> ApplyForJobAsync(int userId, int jobId)
    {
        // Check if user has already applied
        if (await HasUserAppliedForJobAsync(userId, jobId))
        {
            return null;
        }
        
        var application = new Application
        {
            UserId = userId,
            JobId = jobId,
            Status = "Submitted",
            AppliedAt = DateTime.UtcNow
        };
        
        _context.Applications.Add(application);
        await _context.SaveChangesAsync();
        
        // Load the application with related data
        var createdApplication = await _context.Applications
            .Include(a => a.Job)
            .Include(a => a.User)
            .FirstAsync(a => a.Id == application.Id);
        
        return MapToApplicationResponse(createdApplication);
    }
    
    public async Task<IEnumerable<ApplicationResponse>> GetUserApplicationsAsync(int userId)
    {
        var applications = await _context.Applications
            .Include(a => a.Job)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();
            
        return applications.Select(MapToApplicationResponse);
    }
    
    public async Task<IEnumerable<ApplicationResponse>> GetAllApplicationsAsync()
    {
        var applications = await _context.Applications
            .Include(a => a.Job)
            .Include(a => a.User)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();
            
        return applications.Select(MapToApplicationResponse);
    }
    
    public async Task<ApplicationResponse?> UpdateApplicationStatusAsync(int applicationId, string status)
    {
        var application = await _context.Applications
            .Include(a => a.Job)
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == applicationId);
            
        if (application == null) return null;
        
        application.Status = status;
        await _context.SaveChangesAsync();
        
        return MapToApplicationResponse(application);
    }
    
    public async Task<bool> HasUserAppliedForJobAsync(int userId, int jobId)
    {
        return await _context.Applications
            .AnyAsync(a => a.UserId == userId && a.JobId == jobId);
    }
    
    private static ApplicationResponse MapToApplicationResponse(Application application)
    {
        return new ApplicationResponse
        {
            Id = application.Id,
            UserId = application.UserId,
            JobId = application.JobId,
            Status = application.Status,
            AppliedAt = application.AppliedAt,
            Job = application.Job == null ? null : new JobResponse
            {
                Id = application.Job.Id,
                Title = application.Job.Title,
                CompanyName = application.Job.CompanyName,
                Description = application.Job.Description,
                DatePosted = application.Job.DatePosted,
                IsActive = application.Job.IsActive
            },
            User = application.User == null ? null : new UserResponse
            {
                Id = application.User.Id,
                FirstName = application.User.FirstName,
                MiddleName = application.User.MiddleName,
                LastName = application.User.LastName,
                Username = application.User.Username,
                Role = application.User.Role
            }
        };
    }
}