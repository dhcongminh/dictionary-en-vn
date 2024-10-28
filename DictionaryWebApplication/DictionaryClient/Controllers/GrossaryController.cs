using Microsoft.AspNetCore.Mvc;

namespace DictionaryClient.Controllers {
    public class GrossaryController : Controller {
        public GrossaryController() { }
        public IActionResult Index() {
            return View();
        }
        public IActionResult Create() {
            return View();
        }
    }
}
