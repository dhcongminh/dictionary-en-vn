using DictionaryAPI.DTOs;
using DictionaryAPI.DTOs.WordDto;
using DictionaryAPI.Models;
using DictionaryAPI.Services;
using DictionaryAPI.Services.Implementation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DictionaryAPI.Controllers {
    [Route("api/v1/[controller]")]
    [ApiController]
    public class WordController : ControllerBase {
        private readonly IWordService _service;
        private readonly IAuthService _authService;
        private readonly IConfiguration _configuration;
        public WordController(IWordService service, IAuthService authService, IConfiguration configuration) {
            _service = service;
            _authService = authService;
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult Index() {
            return Ok(_service.GetAll());
        }

        [HttpGet("search/{search}")]
        public IActionResult FindByWordText(string search) {
            return Ok(_service.GetWordsStartWith(search));
        }

        [HttpGet("{id}")]
        public IActionResult GetWordById(int id) {

            WordInDetailDTO? dto = _service.GetById(id);
            if (dto == null)
                return Ok(_configuration["Messages:Errors:WORD_NOT_FOUND"]);
            return Ok(dto);
        }

        [Authorize(Roles = "Admin system")]
        [HttpPost]
        public IActionResult Add([FromBody] WordInputDTO dto) {
            if (ModelState.IsValid) {
                return Ok(_service.Insert(dto));
            }
            return BadRequest(_configuration["Messages:Errors:INVALID_INPUT_FORMAT"]);
        }

        [Authorize(Roles = "Admin system")]
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] WordInputDTO dto) {
            if (ModelState.IsValid) {
                return Ok(_service.Update(id, dto));
            }
            return BadRequest(_configuration["Messages:Errors:INVALID_INPUT_FORMAT"]);
        }

        [Authorize(Roles = "Admin system")]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id) {
            return Ok(_service.Delete(id));
        }
    }
}
