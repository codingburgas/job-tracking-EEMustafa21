using JobPortal.API.DTOs;

namespace JobPortal.API.Services;

public interface IJobService
{
    Task<IEnumerable<JobResponse>> GetAllJobsAsync();
    Task<IEnumerable<JobResponse>> GetActiveJobsAsync();
    Task<JobResponse?> GetJobByIdAsync(int id);
    Task<JobResponse> CreateJobAsync(CreateJobRequest request);
    Task<JobResponse?> UpdateJobAsync(int id, UpdateJobRequest request);
    Task<bool> DeleteJobAsync(int id);
}