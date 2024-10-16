using Microsoft.AspNetCore.Mvc;

namespace DictionaryClient.Controllers {
    [Route("Home")]
    public class HomeController : Controller {
        public IActionResult Index() {
            return View();
        }
    }
}
