using DictionaryAPI.Models;

namespace DictionaryAPI.Repositories {
    public interface IUserRepo {
        public void Create(User user);
        public void Update(User user);
        public void Delete(User user);
        public List<Word> GetFavouriteWords(int userId);
        public List<Word> GetAddedWords(int userId);

    }
}
