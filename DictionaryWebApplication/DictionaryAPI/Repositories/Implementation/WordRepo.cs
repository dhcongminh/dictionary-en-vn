using DictionaryAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;
using static System.Net.Mime.MediaTypeNames;

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
                deletingWord.Status = "inactive";
                _context.Words.Update(deletingWord);
                _context.SaveChanges();
            }
            return deletingWord;
        }

        public List<Word> GetAll() {
            return _context.Words
                .Include(x => x.AddByUserNavigation)
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
                    .ThenInclude(d => d.Type)
                    .ThenInclude(d => d.WordDefinitions)
                    .ThenInclude(d => d.Definition)
                    .ThenInclude(d => d.Examples)
                .Include(x => x.Antonyms)
                .Include(x => x.Synonyms)
                .Include(x => x.AddByUserNavigation)
                .FirstOrDefault(x => x.Id == id);
        }

        public Word? GetWordByWordText(string word_text, string username) {
            // Base query with common includes
            var query = _context.Words
                .Include(x => x.Users)
                .Include(x => x.WordDefinitions)
                    .ThenInclude(d => d.Type)
                .Include(x => x.WordDefinitions)
                    .ThenInclude(d => d.Definition)
                    .ThenInclude(d => d.Examples)
                .Include(x => x.Antonyms)
                .Include(x => x.Synonyms)
                .Include(x => x.AddByUserNavigation)
                .Where(x => x.WordText == word_text);

            // Apply filter for username if provided
            if (!string.IsNullOrEmpty(username)) {
                query = query.Where(x => x.AddByUserNavigation.Username == username);
            }

            // Execute the query and retrieve the word
            var word = query.FirstOrDefault();

            // If not found and username is provided, fallback to finding the word regardless of username
            if (word == null && !string.IsNullOrEmpty(username)) {
                word = _context.Words
                    .Include(x => x.Users)
                    .Include(x => x.WordDefinitions)
                        .ThenInclude(d => d.Type)
                    .Include(x => x.WordDefinitions)
                        .ThenInclude(d => d.Definition)
                        .ThenInclude(d => d.Examples)
                    .Include(x => x.Antonyms)
                    .Include(x => x.Synonyms)
                    .Include(x => x.AddByUserNavigation)
                    .FirstOrDefault(x => x.WordText == word_text);
            }

            return word;
        }


        public Example? GetWordExampleByText(string text) {
            return _context.Examples.FirstOrDefault(x => x.Detail == text);
        }

        public List<Word> GetWordsByAddedUser(int uid) {
            return _context.Words
                .Include(x => x.WordDefinitions)
                .Include(x => x.Antonyms)
                .Include(x => x.Synonyms)
                .Include(x => x.AddByUserNavigation)
                .Where(x => x.AddByUserNavigation.Id == uid)
                .ToList();
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
                restoringWord.Status = "active";
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
