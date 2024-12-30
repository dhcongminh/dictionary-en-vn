using DictionaryAPI.Models;

namespace DictionaryAPI.Repositories {
    public interface IWordRepo {
        public Word? Create(Word word);
        public Word? Update(Word word);
        public Word? Delete(int id);
        public Word? Restore(int id);
        public List<Word> GetAll();
        public List<Word> GetWordsStartWith(string text);
        public List<Word> GetWordsByAddedUser(int uid);
        public Word? GetWordById(int id);
        public Word? GetWordByWordText(string word_text, string username);
        public Example GetWordExampleByText(string text);
        public Models.Type GetTypeByText(string text);

    }
}
