using DictionaryAPI.DTOs;
using DictionaryAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DictionaryAPI.Controllers {
    [Route("api/v1/[controller]")]
    [ApiController]
    public class UserController : ControllerBase {
        private Dictionary_en_vnContext _context = new Dictionary_en_vnContext();
        private readonly IConfiguration _configuration;
        public UserController(IConfiguration configuration) {
            _configuration = configuration;
        }

        [HttpPost("register")]
        public IActionResult Register([FromForm] UserRegisterDTO userRegisting) {
            if (ModelState.IsValid) {
                User user = new User();
                user.FromRegisterDto(userRegisting);
                user.Role = "Member";
                try {
                    _context.Users.Add(user);
                    _context.SaveChanges();
                } catch (Exception ex) {
                    return BadRequest(ex.Message + "\n\n" + ex.InnerException);
                }
                return Ok("Register successfully.");
            } else {
                return BadRequest();
            }
        }





        [HttpPost("login")]
        public IActionResult Login([FromForm] UserLoginDTO loginDTO) {
            #pragma warning disable CS8602 // Dereference of a possibly null reference.
            var user = _context.Users
                .Include(u => u.UserDetail)
                .FirstOrDefault(u => u.UserDetail.Email == loginDTO.UsernameOrEmail
                                    || u.Username == loginDTO.UsernameOrEmail);
            #pragma warning restore CS8602 // Dereference of a possibly null reference.
            if (user == null || loginDTO.Password != user.Password) {
                return Unauthorized("Invalid email or password.");
            }
            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }
        private string GenerateJwtToken(User user) {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]);
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new[]
                {
                new Claim(ClaimTypes.Name, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role ?? "Member")
            }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }







        [HttpGet("{id}")]
        public IActionResult GetUserById(int id) {
            User? user = _context.Users.FirstOrDefault(x => x.Id == id);
            if (user == null) {
                return NotFound("User not found.");
            }
            return Ok(user);
        }

        [HttpGet("{id}/favourites")]
        public IActionResult GetFavourites(int id) {
            User? user = _context.Users
                .Include(u => u.Words)
                .FirstOrDefault(x => x.Id == id);
            if (user == null) {
                return NotFound("User not found.");
            }
            return Ok(user.Words.Select(w => new WordDTO {
                Id = w.Id,
                WordText = w.WordText,
                ShortDefinition = w.ShortDefinition,
                Type = w.Type,
                IsActive = w.IsActive,
            }));
        }

        [HttpGet("{id}/words-added")]
        public IActionResult GetWordsAdded(int id) {
            User? user = _context.Users
                .Include(u => u.PendingWords)
                .ThenInclude(pw => pw.Word)
                .FirstOrDefault(x => x.Id == id);
            if (user == null) {
                return NotFound("User not found.");
            }
            return Ok(user.PendingWords.Select(w => new { 
                Id = w.WordId,
                w.Word?.WordText,
                w.Word?.ShortDefinition,
                w.Word?.IsActive,
            }));
        }
    }
}
