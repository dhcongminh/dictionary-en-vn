using DictionaryAPI.DTOs;
using DictionaryAPI.Models;
using DictionaryAPI.Repositories;
using DictionaryAPI.Repositories.Implementation;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DictionaryAPI.Services.Implementation {
    public class AuthService : IAuthService {
        private readonly IAuthRepo _repo;
        private readonly IConfiguration _configuration;
        public AuthService(IConfiguration configuration, IAuthRepo repo) {
            _configuration = configuration;
            _repo = repo;
        }
        public AuthResultDTO Login(string? emailOrUsername, string? password) {
            AuthResultDTO result = new AuthResultDTO();
            result.Action = "Login";
            if (emailOrUsername == null || password == null) {
                result.Errors.Add("Fields must not be empty.");
            } else {
                User? user = _repo.GetUserByEmailOrUsername_AndPassword(emailOrUsername, password);
                if (user == null) {
                    result.Errors.Add("Incorrect information.");
                } else {
                    if (result.Errors.Count > 0) {
                        result.IsSuccess = false;
                    } else {
                        result.IsSuccess = true;
                        result.Token = GenerateJwtToken(user);
                    }
                }
            }
            return result;
        }

        public AuthResultDTO Register(string? email, string? username, string? password) {
            AuthResultDTO result = new AuthResultDTO();
            result.Action = "Register";
            if (email == null || username == null || password == null) {
                result.Errors.Add("Some required fields are not completed.");
            } else {
                if (_repo.GetUserByEmail(email) != null) {
                    result.Errors.Add("Email already exists in the system.");
                }
                if (_repo.GetUserByUsername(username) != null) {
                    result.Errors.Add("Username already exists in the system.");
                }
                if (result.Errors.Count > 0) {
                    result.IsSuccess = false;
                } else {
                    result.IsSuccess= true;
                    User? user = new User();
                    user.Username = username;
                    user.Password = password;
                    user.Role = _configuration["Roles:Member"];
                    user.UserDetail = new UserDetail();
                    user.UserDetail.Email = email;
                    _repo.Create(user);
                    user = _repo.GetUserByEmailOrUsername_AndPassword(username, password);
                    if (user != null) {
                        result.Token = GenerateJwtToken(user);
                    }
                }
            }
            return result;
        }

        private string GenerateJwtToken(User user) {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]);
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new[]
                {
                new Claim(ClaimTypes.Name, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role ?? _configuration["Roles:Member"])
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


        public bool AdminRoleAuthorization(string? role) {
            if (role == null || role != "Admin system") {
                return false;
            } else {
                return true;
            }
        }


    }
}
