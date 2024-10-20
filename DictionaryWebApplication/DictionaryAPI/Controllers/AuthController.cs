using DictionaryAPI.DTOs;
using DictionaryAPI.Models;
using DictionaryAPI.Services;
using DictionaryAPI.Services.Implementation;
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
    public class AuthController : ControllerBase {
        private readonly IAuthService _service;
        public AuthController(IAuthService service) {
            _service = service;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegisterDTO userRegisting) {
            if (ModelState.IsValid) {
                AuthResultDTO result = _service.Register(userRegisting.Email, userRegisting.Username, userRegisting.Password);
                return Ok(result);
            } else {
                return BadRequest();
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginDTO loginDTO) {
            if (ModelState.IsValid) {
                AuthResultDTO result = _service.Login(loginDTO.UsernameOrEmail, loginDTO.Password);
                return Ok(result);
            } else {
                return BadRequest();
            }
        }
    }
}
