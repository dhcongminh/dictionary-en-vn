using System.Diagnostics.CodeAnalysis;

namespace DictionaryAPI.DTOs {
    public class AuthResultDTO {
        public AuthResultDTO() {
            Errors = new List<string>();
        }
        public string Action { get; set; } = "";
        public bool IsSuccess { get; set; }
        public List<string> Errors { get; set; }
        public string? Token { get; set; }
    }
}
