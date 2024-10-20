using DictionaryAPI.DTOs;

namespace DictionaryAPI.Services {
    public interface IAuthService {
        public AuthResultDTO Register(string? email, string? username, string? password);
        public AuthResultDTO Login(string? usernameOrEmail, string? password);
        public bool AdminRoleAuthorization(string? role);
    }
}
