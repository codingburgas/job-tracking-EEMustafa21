using JobTracking.Application.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace JobTracking.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]

public class SingerController : Controller
{
    private readonly ISingerService _singerService;

    public SingerConroller(ISingerService singerService)
    {
        _singerService = singerService
    }

    [HttpGet]
    public async Task<IActionResult> GetDyId(int id)
    {
        return Ok(await _singerService.GetSinger(id));
    }
}