using Microsoft.AspNetCore.Mvc;

namespace JobPortal.Web.Controllers;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}