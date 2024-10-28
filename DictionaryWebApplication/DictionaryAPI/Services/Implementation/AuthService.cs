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
            if (string.IsNullOrEmpty(emailOrUsername) || string.IsNullOrEmpty(password)) {
                result.Errors.Add("Fields must not be empty.");
            }
            User? user = _repo.GetUserByEmailOrUsername_AndPassword(emailOrUsername, password);
            if (user != null) {
                result.User = user;
                result.Token = GenerateJwtToken(user);
                result.ExpireTime = GetExpirationDate();
            }

            return result;
        }

        public AuthResultDTO Register(string? email, string? username, string? password) {
            AuthResultDTO result = new AuthResultDTO();
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password)) {
                result.Errors.Add("Some required fields are not completed.");
            } else {
                if (_repo.GetUserByEmail(email) != null) {
                    result.Errors.Add("Email already exists in the system.");
                }
                if (_repo.GetUserByUsername(username) != null) {
                    result.Errors.Add("Username already exists in the system.");
                }
                if (result.Errors.Count == 0) { 
                    User? user = new User();
                    user.Username = username;
                    user.Password = password;
                    user.Role = _configuration["Roles:Member"];
                    user.UserDetail = new UserDetail();
                    user.UserDetail.Email = email;
                    _repo.Create(user);
                    if (user != null) {
                        result.User = user;
                        result.Token = GenerateJwtToken(user);
                        result.ExpireTime = GetExpirationDate();
                    }
                }
            }
            return result;
        }

        public DateTime GetExpirationDate() {
            var expireTimeSetting = _configuration["Jwt:ExpireTime"];
            if (string.IsNullOrEmpty(expireTimeSetting)) {
                throw new InvalidOperationException("ExpireTime is not configured.");
            }

            // Split the string into the numeric part and the unit
            var parts = expireTimeSetting.Split('-');
            if (parts.Length != 2 || !int.TryParse(parts[0], out var duration) || string.IsNullOrEmpty(parts[1])) {
                throw new FormatException("ExpireTime format is invalid. Expected format: '<number>-<unit>'");
            }

            // Parse the duration and unit
            var unit = parts[1].ToLower();
            TimeSpan timeSpan;

            switch (unit) {
                case "minutes":
                    timeSpan = TimeSpan.FromMinutes(duration);
                    break;
                case "days":
                    timeSpan = TimeSpan.FromDays(duration);
                    break;
                default:
                    throw new InvalidOperationException("Unknown time unit. Use 'Minutes' or 'Days'.");
            }

            // Calculate the expiration date by adding the time span to the current date and time
            return DateTime.Now.Add(timeSpan);
        }

        private string GenerateJwtToken(User user) {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]);
            var expireTimeConfig = _configuration["Jwt:ExpireTime"];
            DateTime? expireTime = null;
            if (expireTimeConfig.Contains("Minutes")) {
                int minute = Int32.Parse(expireTimeConfig.Split("-")[0]);
                expireTime = DateTime.UtcNow.AddMinutes(minute);
            } else if (expireTimeConfig.Contains("Days")) {
                int day = Int32.Parse(expireTimeConfig.Split("-")[0]);
                expireTime = DateTime.UtcNow.AddDays(day);
            }
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new[] {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username.ToString()),
                    new Claim(ClaimTypes.Role, user.Role ?? _configuration["Roles:Member"])
                }),
                Expires = expireTime,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), 
                    SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


        public bool AdminRoleAuthorization(string? role) {
            if (string.IsNullOrEmpty(role) || role != "Admin system") {
                return false;
            } else {
                return true;
            }
        }


    }
}
