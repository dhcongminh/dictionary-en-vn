using DictionaryAPI.Models;
using System.Diagnostics.CodeAnalysis;

namespace DictionaryAPI.DTOs {
    public class AuthResultDTO {
        public AuthResultDTO() {
            Errors = new List<string>();
        }
        public List<string> Errors { get; set; }
        public User? User { get; set; }
        public string? Token { get; set; }
        public DateTime ExpireTime {  get; set; }
    }
}
