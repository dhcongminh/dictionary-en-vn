using DictionaryAPI.DTOs;
using DictionaryAPI.Models;

namespace DictionaryAPI.Repositories {
    public interface IAuthRepo {
        public User? GetUserByEmail(string email);
        public User? GetUserByUsername(string username);
        public User? GetUserByEmailOrUsername(string emailOrUsername);
        public User? GetUserByEmailOrUsername_AndPassword(string? emailOrUsername, string? password);
        public void Create(User user);
    }
}
