using DictionaryAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;

namespace DictionaryAPI.Repositories.Implementation {
    public class WordRepo : IWordRepo {
        private readonly Dictionary_en_vnContext _context = new Dictionary_en_vnContext();
        public WordRepo() { }

        public Word? Create(Word word) {
            Word? w = _context.Words.Add(word).Entity;
            _context.SaveChanges();
            return w;
        }

        public Word? Delete(int id) {
            Word? deletingWord = _context.Words.FirstOrDefault(x => x.Id == id);
            if (deletingWord != null) {
                deletingWord.Status = "Inactive";
                _context.Words.Update(deletingWord);
                _context.SaveChanges();
            }
            return deletingWord;
        }

        public List<Word> GetAll() {
            return _context.Words
                .Include(x => x.WordDefinitions)
                .Include(x => x.Antonyms) 
                .Include(x => x.Synonyms)
                .ToList();
        }

        public Models.Type? GetTypeByText(string text) {
            return _context.Types.FirstOrDefault(x => x.Title == text);
        }

        public Word? GetWordById(int id) {
            return _context.Words
                .Include(x => x.WordDefinitions)
                .Include(x => x.Antonyms)
                .Include(x => x.Synonyms)
                .FirstOrDefault(x => x.Id == id);
        }

        public Word? GetWordByWordText(string word_text) {
            return _context.Words
                .Include(x => x.WordDefinitions)
                .Include(x => x.Antonyms)
                .Include(x => x.Synonyms)
                .FirstOrDefault(x => x.WordText == word_text);
        }

        public Example? GetWordExampleByText(string text) {
            return _context.Examples.FirstOrDefault(x => x.Detail == text);
        }

        public List<Word> GetWordsStartWith(string text) {
            return _context.Words
                .Include(x => x.WordDefinitions)
                .Include(x => x.Antonyms)
                .Include(x => x.Synonyms)
                .Where(x => x.WordText.StartsWith(text))
                .ToList();
        }

        public Word? Restore(int id) {
            Word? restoringWord = _context.Words.FirstOrDefault(x => x.Id == id);
            if (restoringWord != null) {
                restoringWord.Status = "Active";
                _context.Words.Update(restoringWord);
                _context.SaveChanges();
            }
            return restoringWord;
        }

        public Word? Update(Word word) {
            _context.Words.Update(word);
            _context.SaveChanges();
            return word;
        }
    }
}
