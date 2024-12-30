using DictionaryAPI.DTOs;
using DictionaryAPI.DTOs.WordDto;
using DictionaryAPI.Models;
using DictionaryAPI.Repositories;
using DictionaryAPI.Repositories.Implementation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;

namespace DictionaryAPI.Services.Implementation {
    public class WordService : IWordService {
        public readonly IWordRepo _repo;
        public readonly IConfiguration _config;
        public readonly IMapper _mapper;
        public readonly Dictionary_en_vnContext _context;
        public WordService(IWordRepo repo, IConfiguration config, IMapper mapper, Dictionary_en_vnContext context) {
            _repo = repo;
            _config = config;
            _mapper = mapper;
            _context = context;
        }
        public void Activate(int id) {
            throw new NotImplementedException();
        }

        public string Delete(int id) {
            Word? word = _repo.Delete(id);
            if (word != null)
                return _config["Messages:Successes:REMOVE_WORD"];
            return _config["Messages:Errors:WORD_NOT_FOUND"];
        }

        public List<WordInListDTO> GetAll() {
            return _repo.GetAll().Select(w => {
                WordInListDTO dto = _mapper.WordToListDto(w);
                return dto;
            }).ToList();
        }

        public WordInDetailDTO? GetById(int id) {
            return _mapper.WordToDetailDto(_repo.GetWordById(id));
        }

        public WordInDetailDTO? GetByText(string search) {
            return _mapper.WordToDetailDto(_repo.GetWordByWordText(search, ""));
        }

        public List<WordInListDTO> GetWordsByAddedUser(int uid) {
            return _repo.GetWordsByAddedUser(uid).Select(w => {
                return _mapper.WordToListDto(w);
            }).ToList();
        }

        public List<WordInListDTO> GetWordsStartWith(string search) {
            return _repo.GetWordsStartWith(search).Select(w => {
                return _mapper.WordToListDto(w);
            }).ToList();
        }

        public string Insert(WordInputDTO word) {
            Word data = _mapper.DtoToWord(word);
            Word? wordExist = _context.Words
                .Include(x => x.AddByUserNavigation)
                .Include(x => x.WordDefinitions)
                .ThenInclude(x => x.Type)
                .FirstOrDefault(x => x.WordText.Equals(word.WordText) && x.AddByUserNavigation.Id == word.AddByUser
                && x.WordDefinitions.ToList().Any(x=>x.Type.Title==word.WordDefinitions.Select(a => a.Type).FirstOrDefault()));
            if (wordExist != null) {
                return "word exist";
            }
            Word? checkWord = _context.Words.FirstOrDefault(x => x.WordText == word.WordText);
            if (checkWord != null) {
                foreach (var item in word.WordDefinitions)
                {
                    checkWord.WordDefinitions.Add(_mapper.WordDefinitionDtoToWordDefinition(item));
                }
                _context.Words.Update(checkWord);
                _context.SaveChanges();
            } else {
                Word? w = _repo.Create(data);
                if (w != null)
                    return _config["Messages:Successes:ADD_WORD"];
            }
            return _config["Messages:Errors:ADD_WORD"];
        }

        public dynamic? LookUp(string search, string username) {
            return _mapper.WordToLookupDto(_repo.GetWordByWordText(search, username), username);
        }

        public string Restore(int id) {
            Word? word = _repo.Restore(id);
            if (word != null)
                return _config["Messages:Successes:RESTORE_WORD"];
            return _config["Messages:Errors:WORD_NOT_FOUND"];
        }

        public string Update(int id, WordInputDTO dto) {
            Word? word = _repo.GetWordById(id);
            if (word == null) {
                return _config["Messages:Errors:WORD_NOT_FOUND"];
            }
            Word? wordExist = _context.Words
                .Include(x => x.AddByUserNavigation)
                .FirstOrDefault(x => !x.WordText.Equals(word.WordText) && x.WordText.Equals(dto.WordText) && x.AddByUserNavigation.Id == dto.AddByUser);
            if (wordExist != null) {
                return "word exist";
            }

            word.WordText = dto.WordText;
            word.ShortDefinition = dto.ShortDefinition;
            word.Phonetic = dto.Phonetic;
            word.AddByUser = dto.AddByUser;
            word.Status = dto.Status;
            word.Antonyms.Clear();
            word.Synonyms.Clear();
            word.WordDefinitions.Clear();
            word.LastTimeUpdate = dto.LastTimeUpdate;
            _repo.Update(word);
            if (dto.Antonyms != null && dto.Antonyms.Count > 0) {
                foreach (var antonym in dto.Antonyms) {
                    Word? search = _repo.GetWordByWordText(antonym, "");
                    if (search != null)
                        word.Antonyms.Add(search);
                }
            }
            if (dto.Synonyms != null && dto.Synonyms.Count > 0) {
                foreach (var synonym in dto.Synonyms) {
                    Word? search = _repo.GetWordByWordText(synonym, "");
                    if (search != null)
                        word.Synonyms.Add(search);
                }
            }
            if (dto.WordDefinitions != null && dto.WordDefinitions.Count > 0) {
                foreach (var definition in dto.WordDefinitions) {
                    word.WordDefinitions.Add(_mapper.WordDefinitionDtoToWordDefinition(definition));
                }
            }
            _repo.Update(word);
            return _config["Messages:Successes:UPDATE_WORD"];
        }
    }
}
