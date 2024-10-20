using DictionaryAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace DictionaryAPI.Repositories.Implementation {
    public class UserRepo : IUserRepo {
        private readonly Dictionary_en_vnContext _context = new Dictionary_en_vnContext();
        public UserRepo() { }

        public void Create(User user) {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public void Delete(User? user) {
            if (user != null) {
                int id = user.Id;
                user = _context.Users.FirstOrDefault(x => x.Id == id);
                if (user != null) {
                    user.IsActive = false;
                    _context.Users.Update(user);
                    _context.SaveChanges();
                }
            }
        }

        public List<Word> GetAddedWords(int userId) {
            throw new NotImplementedException();
        }

        public List<Word> GetFavouriteWords(int userId) {
            User? user = _context.Users
                .Include(u => u.Words)
                .FirstOrDefault(x => x.Id == userId);
            if (user == null) {
                return new List<Word>();
            }
            return user.Words.ToList();
        }

        public void Update(User? new_user) {
            throw new NotImplementedException();
        }
    }
}
