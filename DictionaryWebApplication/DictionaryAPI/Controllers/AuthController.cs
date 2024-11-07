using DictionaryAPI.DTOs;
using DictionaryAPI.Helper.EmailSender;
using DictionaryAPI.Models;
using DictionaryAPI.Services;
using DictionaryAPI.Services.Implementation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Web;

namespace DictionaryAPI.Controllers {
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase {
        private readonly IAuthService _service;
        private readonly IEmailSender _emailSender;
        private Dictionary_en_vnContext _context = new Dictionary_en_vnContext();
        public AuthController(IAuthService service, IEmailSender emailSender) {
            _service = service;
            _emailSender = emailSender;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDTO userRegisting) {
            if (ModelState.IsValid) {
                AuthResultDTO result = _service.Register(userRegisting.Email, userRegisting.Username, userRegisting.Password);


                var confirmationLink = Url.Action("ConfirmEmail", "Auth",
                                    new { userId = result.User.Id },
                                    protocol: HttpContext.Request.Scheme);
                await SendActivationEmail(userRegisting.Email, confirmationLink);
                return Ok(confirmationLink);
            } else {
                return BadRequest();
            }
        }

        [Authorize]
        [HttpPost("password-change")]
        public IActionResult ChangePassword(string username, string newPassword) {
            if (ModelState.IsValid) {
                User? user = _context.Users.FirstOrDefault(x => x.Username == username);
                if (user != null) {
                    user.Password = newPassword;
                    _context.Users.Update(user);    
                    _context.SaveChanges();
                }
                return Ok(user);
            } else {
                return BadRequest();
            }
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId) {
            if (userId == null ) {
                return BadRequest("Thông tin xác nhận không hợp lệ.");
            }

            var user = _context.Users.FirstOrDefault(u => u.Id.ToString() == userId);
            if (user == null) {
                return NotFound("Không tìm thấy người dùng.");
            }
            user.IsActive = true;
            _context.Users.Update(user);
            _context.SaveChanges();
            return Ok("Xác nhận email thành công! Tài khoản của bạn đã được kích hoạt.");
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

        private async Task SendActivationEmail(string email, string confirmationLink) {
            await _emailSender.SendEmailAsync(email, "Kích hoạt tài khoản Dictionary tại đây!",
                    $"Vui lòng nhấn vào liên kết sau để kích hoạt tài khoản của bạn: <a href='{confirmationLink}'>Kích hoạt tài khoản</a>");
        }


        [HttpPost("send-confirmation/{usernameOrEmail}")]
        public async Task<IActionResult> SendActivate(string usernameOrEmail) {
            var user = _context.Users.Include(u => u.UserDetail).FirstOrDefault(u => u.Username == usernameOrEmail || u.UserDetail.Email == usernameOrEmail);
            var confirmationLink = Url.Action("ConfirmEmail", "Auth",
                                    new { userId = user.Id },
                                    protocol: HttpContext.Request.Scheme);
            await SendActivationEmail(user.UserDetail.Email, confirmationLink);
            return Ok("Vui lòng kiểm tra email để kích hoạt tài khoản." + confirmationLink);
        }
    }
}
