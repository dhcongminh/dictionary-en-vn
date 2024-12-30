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
        private readonly IConfiguration _configuration;
        private readonly IAuthorizationService _authorizationService;
        public WordController(IWordService service, IConfiguration configuration, IAuthorizationService authorizationService) {
            _service = service;
            _configuration = configuration;
            _authorizationService = authorizationService;
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

        [HttpGet("en/{search}")]
        public IActionResult GetWordByText(string search) {

            WordInDetailDTO? dto = _service.GetByText(search);
            if (dto == null)
                return NoContent();
            return Ok(dto);
        }

        [HttpGet("en-vi/{search}")]
        public IActionResult LookUp(string search, string username) {

            dynamic? dto = _service.LookUp(search, username);
            if (dto == null)
                return NoContent();
            return Ok(new {
                dto.Id,
                dto.WordText,
                dto.ShortDefinition,
                dto.Phonetic,
                dto.AddByUser,
                dto.Status,
                dto.UserAdded,
                dto.Antonyms,
                dto.Synonyms,
                dto.WordDefinitions,
                dto.heartsCount

            });
        }

        [Authorize]
        [HttpGet("u/{uid}")]
        public async Task<IActionResult> GetWordsByAddedUser(int uid) {
            var authorizationResult = await _authorizationService.AuthorizeAsync(User, uid, "WordListViewOwnerPolicy");
            if (!authorizationResult.Succeeded) {
                return Forbid("Chỉ được truy cập những từ add bởi uid.");
            }
            return Ok(_service.GetWordsByAddedUser(uid));
        }

        [Authorize(Roles = "Admin system")]
        [HttpPost]
        public IActionResult Add([FromBody] WordInputDTO dto) {
            if (ModelState.IsValid) {
                dto.LastTimeUpdate = DateTime.Now.ToString();
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
        [HttpPut("restore/{id}")]
        public IActionResult Restore(int id) {
            return Ok(_service.Restore(id));
        }
        [Authorize(Roles = "Admin system")]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id) {
            return Ok(_service.Delete(id));
        }

        [Authorize(Roles = "Member")]
        [HttpPost("request-add-word")]
        public IActionResult RequestAdd([FromBody] WordInputDTO dto) {
            if (ModelState.IsValid) {
                dto.Status = "pending";
                return Ok(_service.Insert(dto));
            }
            return BadRequest(_configuration["Messages:Errors:INVALID_INPUT_FORMAT"]);
        }

        [Authorize(Roles = "Member")]
        [HttpPut("request-update-added-word/{id}")]
        public async Task<IActionResult>  RequestUpdate(int id, [FromBody] WordInputDTO dto) {
            var authorizationResult = await _authorizationService.AuthorizeAsync(User, dto, "WordOwnerPolicy");
            if (!authorizationResult.Succeeded) {
                return Forbid("You don't have permission to adjust this word.");
            }
            if (ModelState.IsValid) {
                dto.Status = "pending";
                return Ok(_service.Update(id, dto));
            }
            return BadRequest(_configuration["Messages:Errors:INVALID_INPUT_FORMAT"]);
        }
    }
}
