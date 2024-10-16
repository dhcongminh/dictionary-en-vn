using DictionaryAPI.DTOs;
using DictionaryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DictionaryAPI.Controllers {
    [Route("api/v1/[controller]")]
    [ApiController]
    public class WordController : ControllerBase {
        private Dictionary_en_vnContext _context = new Dictionary_en_vnContext();

        [HttpGet]
        public IActionResult Index() {
            var words = _context.Words
                .Include(w => w.Synonyms)
                .Include(w => w.Definitions)
                .Include(w => w.Antonyms);
            var wordDtos = words.Select(w => new WordDTO {
                Id = w.Id,
                WordText = w.WordText,
                ShortDefinition = w.ShortDefinition,
                Type = w.Type,
                IsActive = w.IsActive,
            });
            return Ok(wordDtos.ToList());
        }

        [HttpGet("search/{search}")]
        public IActionResult FindByWordText(string search) {
            var words = _context.Words.Where(w => w.WordText.StartsWith(search))
                .Include(w => w.Synonyms)
                .Include(w => w.Definitions)
                .Include(w => w.Antonyms);
            var wordDtos = words.Select(w => new WordDTO {
                Id = w.Id,
                WordText = w.WordText,
                ShortDefinition = w.ShortDefinition,
                Type = w.Type,
                IsActive = w.IsActive,
            });
            
            return Ok(wordDtos.ToList());
        }
        [HttpGet("{id}")]
        public IActionResult WordDetail(int id) {
            Word? word = _context.Words
                .Include(w => w.Synonyms)
                .Include(w => w.Definitions)
                .Include(w => w.Antonyms)
                .FirstOrDefault(w => w.Id == id);
            if (word == null) {
                return NotFound("Word not found.");
            }
            var wordDto = new WordDTO();
            wordDto.ToDto(word);
            return Ok(wordDto);
        }


        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id) {
            Word? word = _context.Words.FirstOrDefault(w => w.Id == id);
            if (word == null) {
                return NotFound("Word not found.");
            }
            word.IsActive = false;
            try {
                _context.Words.Update(word);
                _context.SaveChanges();
            } catch (Exception ex) {
                return BadRequest(ex.Message + "\n\n" + ex.InnerException);
            }
            return Ok("Word's status is set to deactive.");
        }


        /*
            {
                "id": 1,
                "wordText": "Apple",
                "shortDefinition": "Quả táo",
                "illustrationImage": "",
                "type": "Noun",
                "isActive": true,
                "antonyms": [],
                "definitions": [],
                "synonyms": []
            }
         */
        [HttpPost]
        public IActionResult Insert([FromBody] WordDTO wordDto) {
            if (ModelState.IsValid) {
                wordDto.Id = 0;
                Word word = new Word();
                word.FromDto(wordDto);
                try {
                    _context.Words.Add(word);
                    _context.SaveChanges();
                } catch (Exception ex) {
                    return BadRequest(ex.Message + "\n\n" + ex.InnerException);
                }
                return Ok("Insert new word successfully.");
            } else {
                return BadRequest();
            }
        }
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] WordDTO wordDto) {
            if (ModelState.IsValid) {
                Word? word = _context.Words.FirstOrDefault(w => w.Id == id);
                if (word == null) {
                    return NotFound("Word not found to update.");
                }
                word.Update(wordDto, _context);
                try {
                    _context.Words.Update(word);
                    _context.SaveChanges();
                } catch (Exception ex) {
                    return BadRequest(ex.Message + "\n\n" + ex.InnerException);
                }
                return Ok("Update word successfully.");
            } else {
                return BadRequest();
            }
        }

    }
}
