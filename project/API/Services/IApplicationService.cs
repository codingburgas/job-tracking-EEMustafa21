using JobPortal.API.DTOs;

namespace JobPortal.API.Services;

public interface IApplicationService
{
    Task<ApplicationResponse?> ApplyForJobAsync(int userId, int jobId);
    Task<IEnumerable<ApplicationResponse>> GetUserApplicationsAsync(int userId);
    Task<IEnumerable<ApplicationResponse>> GetAllApplicationsAsync();
    Task<ApplicationResponse?> UpdateApplicationStatusAsync(int applicationId, string status);
    Task<bool> HasUserAppliedForJobAsync(int userId, int jobId);
}