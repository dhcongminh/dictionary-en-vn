using System.ComponentModel.DataAnnotations;

namespace DictionaryAPI.DTOs {
    public class UserRegisterDTO {
        public UserRegisterDTO() { }
        public UserRegisterDTO(string? username, string? password, string? email) {
            Username = username;
            Password = password;
            Email = email;
        }
        [Required]
        public string? Username { get; set; }
        [Required]
        public string? Password { get; set; }
        [Required]
        public string? Email { get; set; }

    }
}
