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


        public List<WordInListDTO> GetWordsStartWith(string search) {
            return _repo.GetWordsStartWith(search).Select(w => {
                return _mapper.WordToListDto(w);
            }).ToList();
        }

        public string Insert(WordInputDTO word) {
            Word? w = _repo.Create(_mapper.WordInputDtoToWord(word));
            if (w != null)
                return _config["Messages:Successes:ADD_WORD"];
            return _config["Messages:Errors:ADD_WORD"];
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

            word.WordText = dto.WordText;
            word.ShortDefinition = dto.ShortDefinition;
            word.Phonetic = dto.Phonetic;
            word.AddByUser = dto.AddByUser;
            word.Status = dto.Status;
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
            return _config["Messages:Successes:UPDATE_WORD"];
        }
    }
}
