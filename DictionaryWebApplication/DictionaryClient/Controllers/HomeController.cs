using Microsoft.AspNetCore.Mvc;

namespace DictionaryClient.Controllers {
    public class HomeController : Controller {
        public readonly IConfiguration _configuration;
        public string BaseAddress {  get; set; }
        public HomeController(IConfiguration configuration) {
            _configuration = configuration;
            BaseAddress = _configuration["DictionaryApi:BaseAddress"];
        }
        public IActionResult Index() {
            ViewData["BaseAddress"] = BaseAddress;
            return View();
        }
    }
}
