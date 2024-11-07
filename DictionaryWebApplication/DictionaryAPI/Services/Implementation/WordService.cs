using DictionaryAPI.DTOs;
using DictionaryAPI.DTOs.WordDto;
using DictionaryAPI.Models;
using DictionaryAPI.Repositories;
using DictionaryAPI.Repositories.Implementation;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace DictionaryAPI.Services.Implementation {
    public class WordService : IWordService {
        public readonly IWordRepo _repo;
        public readonly IConfiguration _config;
        public readonly IMapper _mapper;
        public WordService(IWordRepo repo, IConfiguration config, IMapper mapper) {
            _repo = repo;
            _config = config;
            _mapper = mapper;
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
            return _mapper.WordToDetailDto(_repo.GetWordByWordText(search));
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
            if (_repo.GetWordByWordText(word.WordText.Trim()) != null) {
                return "word exist";
            }
            Word data = _mapper.DtoToWord(word);
            Word? w = _repo.Create(data);
            if (w != null)
                return _config["Messages:Successes:ADD_WORD"];
            return _config["Messages:Errors:ADD_WORD"];
        }

        public dynamic? LookUp(string search) {
            return _mapper.WordToLookupDto(_repo.GetWordByWordText(search));
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
            if (_repo.GetWordByWordText(dto.WordText) != null && dto.WordText != word.WordText) {
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
            _repo.Update(word);
            if (dto.Antonyms != null && dto.Antonyms.Count > 0) {
                foreach (var antonym in dto.Antonyms) {
                    Word? search = _repo.GetWordByWordText(antonym);
                    if (search != null)
                        word.Antonyms.Add(search);
                }
            }
            if (dto.Synonyms != null && dto.Synonyms.Count > 0) {
                foreach (var synonym in dto.Synonyms) {
                    Word? search = _repo.GetWordByWordText(synonym);
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
