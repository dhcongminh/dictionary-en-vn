using DictionaryAPI.DTOs.DefinitionDto;
using DictionaryAPI.DTOs.WordDto;
using DictionaryAPI.Models;
using DictionaryAPI.Repositories;

namespace DictionaryAPI.Services.Implementation {
    public class Mapper : IMapper {
        private readonly IWordRepo _wordRepo;
        public Mapper(IWordRepo wordRepo) {
            _wordRepo = wordRepo;
        }

        public Definition DefinitionDtoToDefinition(DefinitionDTO dto) {
            Definition definition = new Definition() { 
                Detail = dto.Detail,
            };
            foreach (var item in dto.Examples)
            {
                definition.Examples.Add(_wordRepo.GetWordExampleByText(item));
            }
            return definition;
        }

        public DefinitionDTO DefinitionToDefinitionDto(Definition? definition) {
            if (definition == null) {
                return new DefinitionDTO();
            }
            DefinitionDTO dto = new DefinitionDTO() {
                Detail = definition.Detail,
            };
            foreach (var item in definition.Examples)
            {
                dto.Examples.Add(item.Detail ?? "");
            }
            return dto;
        }

        public WordDefinition WordDefinitionDtoToWordDefinition(WordDefinitionDTO dto) {
            WordDefinition definition = new WordDefinition() {
                Type = _wordRepo.GetTypeByText(dto.Type ?? ""),
                Definition = DefinitionDtoToDefinition(dto.Definitions)
            };
            return definition;
        }

        public WordDefinitionDTO WordDefinitionToWordDefinitionDto(WordDefinition wordDefinition) {
            WordDefinitionDTO dto = new WordDefinitionDTO() {
                Type = wordDefinition.Type.Title,
                Definitions = DefinitionToDefinitionDto(wordDefinition.Definition)
            };

            return dto;
        }

        public Word WordInDetailDtoToWord(WordInDetailDTO dto) {
            Word word = new Word {
                Id = dto.Id,
                WordText = dto.WordText,
                Phonetic = dto.Phonetic,
                AddByUser = dto.AddByUser,
                Status = dto.Status,
            };
            if (dto.Antonyms != null && dto.Antonyms.Count > 0) {
                foreach (var antonym in dto.Antonyms) {
                    Word? search = _wordRepo.GetWordByWordText(antonym);
                    if (search != null)
                        word.Antonyms.Add(search);
                }
            }
            if (dto.Synonyms != null && dto.Synonyms.Count > 0) {
                foreach (var synonym in dto.Synonyms) {
                    Word? search = _wordRepo.GetWordByWordText(synonym);
                    if (search != null)
                        word.Synonyms.Add(search);
                }
            }
            if (dto.WordDefinitions != null && dto.WordDefinitions.Count > 0) {
                foreach (var definition in dto.WordDefinitions) {
                    word.WordDefinitions.Add(WordDefinitionDtoToWordDefinition(definition));
                }
            }

            return word;
        }

        public Word WordInListDtoToWord(WordInListDTO dto) {
            Word word = new Word {
                Id = dto.Id,
                WordText = dto.WordText,
                Phonetic = dto.Phonetic,
                Status = dto.Status,
                ShortDefinition = dto.ShortDefinition,
            };
            return word;
        }

        public Word WordInputDtoToWord(WordInputDTO dto) {
            Word word = new Word {
                WordText = dto.WordText,
                ShortDefinition = dto.ShortDefinition,
                Phonetic = dto.Phonetic,
                AddByUser = dto.AddByUser,
                Status = dto.Status,
            };
            if (dto.Antonyms != null && dto.Antonyms.Count > 0) {
                foreach (var antonym in dto.Antonyms) {
                    Word? search = _wordRepo.GetWordByWordText(antonym);
                    if (search != null)
                        word.Antonyms.Add(search);
                }
            }
            if (dto.Synonyms != null && dto.Synonyms.Count > 0) {
                foreach (var synonym in dto.Synonyms) {
                    Word? search = _wordRepo.GetWordByWordText(synonym);
                    if (search != null)
                        word.Synonyms.Add(search);
                }
            }
            if (dto.WordDefinitions != null && dto.WordDefinitions.Count > 0) {
                foreach (var definition in dto.WordDefinitions) {
                    word.WordDefinitions.Add(WordDefinitionDtoToWordDefinition(definition));
                }
            }

            return word;
        }

        public WordInDetailDTO? WordToDetailDto(Word? word) {
            if (word == null)
                return null;
            WordInDetailDTO dto = new WordInDetailDTO {
                Id = word.Id,
                WordText = word.WordText,
                Phonetic = word.Phonetic,
                AddByUser = word.AddByUser,
                Status = word.Status
            };

            if (word.Antonyms != null && word.Antonyms.Count > 0) {
                foreach (var antonym in word.Antonyms) {
                    dto.Antonyms.Add(antonym.WordText);
                }
            }

            if (word.Synonyms != null && word.Synonyms.Count > 0) {
                foreach (var synonym in word.Synonyms) {
                    dto.Synonyms.Add(synonym.WordText);
                }
            }

            if (word.WordDefinitions != null && word.WordDefinitions.Count > 0) {
                foreach (var definition in word.WordDefinitions) {
                    dto.WordDefinitions.Add(WordDefinitionToWordDefinitionDto(definition));
                }
            }

            return dto;
        }

        public WordInputDTO WordToInputDto(Word word) {
            WordInputDTO dto = new WordInputDTO {
                WordText = word.WordText,
                ShortDefinition = word.ShortDefinition,
                Phonetic = word.Phonetic,
                AddByUser = word.AddByUser,
                Status = word.Status
            };

            if (word.Antonyms != null && word.Antonyms.Count > 0) {
                foreach (var antonym in word.Antonyms) {
                    dto.Antonyms.Add(antonym.WordText);
                }
            }

            if (word.Synonyms != null && word.Synonyms.Count > 0) {
                foreach (var synonym in word.Synonyms) {
                    dto.Synonyms.Add(synonym.WordText);
                }
            }

            if (word.WordDefinitions != null && word.WordDefinitions.Count > 0) {
                foreach (var definition in word.WordDefinitions) {
                    dto.WordDefinitions.Add(WordDefinitionToWordDefinitionDto(definition));
                }
            }

            return dto;
        }

        public WordInListDTO WordToListDto(Word word) {
            WordInListDTO dto = new WordInListDTO {
                Id = word.Id,
                WordText = word.WordText,
                Phonetic = word.Phonetic,
                ShortDefinition = word.ShortDefinition,
                Status = word.Status
            };

            return dto;
        }


    }
}
