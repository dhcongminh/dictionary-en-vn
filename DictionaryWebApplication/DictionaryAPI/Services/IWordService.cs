using DictionaryAPI.DTOs.WordDto;
using DictionaryAPI.Models;

namespace DictionaryAPI.Services {
    public interface IWordService {
        public List<WordInListDTO> GetAll();
        public WordInDetailDTO? GetById(int id);
        public List<WordInListDTO> GetWordsStartWith(string search);
        public List<WordInListDTO> GetWordsByAddedUser(int uid);
        public string Delete(int id);
        public string Restore(int id);
        public string Insert(WordInputDTO word);
        public string Update(int id, WordInputDTO word);
        WordInDetailDTO? GetByText(string search);
    }
}
