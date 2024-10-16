using System.ComponentModel.DataAnnotations;

namespace DictionaryAPI.DTOs {
    public class UserLoginDTO {
        public UserLoginDTO() { }
        [Required]
        public string? UsernameOrEmail { get; set; }
        [Required]
        public string? Password { get; set; }
    }
}
