using DictionaryAPI.DTOs;
using DictionaryAPI.Models;
using DictionaryAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DictionaryAPI.Controllers {
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase {
        private readonly IUserService _service;
        private readonly Dictionary_en_vnContext _context;
        public UserController(IUserService service, Dictionary_en_vnContext context) {
            _service = service;
            _context = context;
        }

        [Authorize]
        [HttpGet("wordset")]
        public IActionResult Get(string username) {
            return Ok(_context.WordSets.Include(w => w.User).Where(w => w.User.Username == username).ToList());
        }

        [Authorize]
        [HttpGet("get-set")]
        public IActionResult GetSet(string username, int setId) {
            return Ok(_context.WordSets
                .Include(w => w.Words)
                .Include(w => w.User)
                .FirstOrDefault(w => w.User.Username == username && w.Id == setId));
        }
        [Authorize]
        [HttpDelete("delete-set")]
        public IActionResult DeleteSet(string username, int setId) {
            WordSet? set = _context.WordSets.Include(s => s.Words)
                .FirstOrDefault(w => w.User.Username == username && w.Id == setId);
            if (set != null) {
                set.Words.Clear();
                _context.WordSets.Remove(set);
                _context.SaveChanges();
            }
            return Ok("Successfull");
        }
        [Authorize]
        [HttpPost("create-new-set")]
        public IActionResult CreateNewSet(string username, string setsName) {
            User? user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) {
                return NotFound();
            }
            WordSet wset = new WordSet();
            wset.NameOfSet = setsName;
            wset.UserId = user.Id;
            WordSet result = _context.WordSets.Add(wset).Entity;
            _context.SaveChanges();
            return Ok(result);
        }
        [Authorize]
        [HttpPut("update-set/{setId}")]
        public IActionResult UpdateSet(string username, int setId, [FromBody] List<string> wordList, [FromQuery] string setName) {
            
            User? user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) {
                return NotFound();
            }
            WordSet? wset = _context.WordSets.Include(x => x.Words).FirstOrDefault(x => x.Id == setId);
            if (wset == null) {
                return NotFound();
            }
            wset.NameOfSet = setName;
            wset.Words.Clear();
            foreach (var word in wordList) {
                Word? w = _context.Words.FirstOrDefault(w => w.WordText == word);
                if (w != null) { 
                    wset.Words.Add(w); 
                }
            }
            WordSet result = _context.WordSets.Update(wset).Entity;
            _context.SaveChanges();
            return Ok();
        }


        [Authorize]
        [HttpPost("set-word-list-to-set/{setId}")]
        public IActionResult SetWordsInSet([FromBody] List<string> wordList, int setId) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }
            WordSet? set = _context.WordSets.FirstOrDefault(s => s.Id == setId);
            if (set != null) {
                List<Word> words = new List<Word>();
                foreach (var word in wordList) {
                    Word? w = _context.Words.FirstOrDefault(w => w.WordText == word);
                    if (w != null) { words.Add(w);}
                }
                set.Words = words;
                _context.WordSets.Update(set);
                _context.SaveChanges();
                return Ok("Successfull");
            }
            return Ok("fail");
        }
        [Authorize]
        [HttpPost("add-word-to-set/{setId}")]
        public IActionResult AddWordToSet([FromQuery] int wordId, int setId) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }
            Word? word = _context.Words.FirstOrDefault(w => w.Id == wordId);
            if (word == null) {
                return NotFound();
            }
            WordSet? set = _context.WordSets.FirstOrDefault(s => s.Id == setId);
            if (set != null) {
                set.Words.Add(word);
                _context.WordSets.Update(set);
                _context.SaveChanges();
                return Ok("Successfull");
            }
            return Ok("fail");
        }

    }
}
