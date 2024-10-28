using DictionaryAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace DictionaryAPI.Repositories.Implementation {
    public class AuthRepo : IAuthRepo {
        private readonly Dictionary_en_vnContext _context = new Dictionary_en_vnContext();
        public AuthRepo() { }

        public void Create(User user) {
            _context.Add(user);
            _context.SaveChanges();
        }

        public User? GetUserByEmail(string email) {
            User? user = _context.Users
                    .Include(u => u.UserDetail)
                    .FirstOrDefault(u => u.UserDetail.Email == email);
            return user;
        }

        public User? GetUserByEmailOrUsername(string emailOrUsername) {
            User? user = _context.Users
                .Include(u => u.UserDetail)
                .FirstOrDefault(u => u.UserDetail.Email == emailOrUsername || u.Username == emailOrUsername);
            return user;
        }

        public User? GetUserByEmailOrUsername_AndPassword(string? emailOrUsername, string? password) {
            User? user = _context.Users
                .Include(u => u.UserDetail)
                .FirstOrDefault(u => (u.UserDetail.Email == emailOrUsername || u.Username == emailOrUsername) &&
                                u.Password == password);
            return user;
        }

        public User? GetUserByUsername(string username) {
            User? user = _context.Users
                    .FirstOrDefault(u => u.Username == username);
            return user;
        }
    }
}
