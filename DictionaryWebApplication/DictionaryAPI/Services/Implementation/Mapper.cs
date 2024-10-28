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
                Detail = dto.Detail.Trim(),
            };
            if (dto.Examples != null && dto.Examples.Count > 0) {
                foreach (var item in dto.Examples) {
                    definition.Examples.Add(new Example() { Detail = item.Trim() });
                }
            }
            return definition;
        }

        public DefinitionDTO DefinitionToDefinitionDto(Definition? definition) {
            if (definition == null) {
                return new DefinitionDTO();
            }
            DefinitionDTO dto = new DefinitionDTO() {
                Detail = definition.Detail.Trim(),
            };
            foreach (var item in definition.Examples)
            {
                dto.Examples.Add(item.Detail.Trim() ?? "");
            }
            return dto;
        }

        public WordDefinition WordDefinitionDtoToWordDefinition(WordDefinitionDTO dto) {
            Models.Type wordType = _wordRepo.GetTypeByText(dto.Type.Trim());
            WordDefinition definition = new WordDefinition() {
                DefinitionId = 0,
                TypeId = wordType.Id,
                Type = null,
                Definition = DefinitionDtoToDefinition(dto.Definitions)
            };
            return definition;
        }

        public WordDefinitionDTO WordDefinitionToWordDefinitionDto(WordDefinition wordDefinition) {
            WordDefinitionDTO dto = new WordDefinitionDTO();
            dto.Type = wordDefinition.Type.Title.Trim();
            dto.Definitions = DefinitionToDefinitionDto(wordDefinition.Definition);
            
            return dto;
        }

        public Word DtoToWord(WordInDetailDTO dto) {
            Word word = new Word {
                Id = dto.Id,
                WordText = dto.WordText.Trim(),
                Phonetic = dto.Phonetic.Trim(),
                AddByUser = dto.AddByUser,
                Status = dto.Status.Trim(),
                AddByUserNavigation = dto.UserAdded
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

        public Word DtoToWord(WordInListDTO dto) {
            Word word = new Word {
                Id = dto.Id,
                WordText = dto.WordText.Trim(),
                Phonetic = dto.Phonetic.Trim(),
                Status = dto.Status.Trim(),
                ShortDefinition = dto.ShortDefinition.Trim(),
                AddByUserNavigation = dto.UserAdded,
            };
            return word;
        }

        public Word DtoToWord(WordInputDTO dto) {
            Word word = new Word();
            word.Id = 0;
            word.WordText = dto.WordText.Trim();
            word.ShortDefinition = dto.ShortDefinition.Trim();
            word.Phonetic = dto.Phonetic.Trim();
            word.AddByUser = dto.AddByUser;
            word.Status = dto.Status.Trim();
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
                WordText = word.WordText.Trim(),
                Phonetic = word.Phonetic.Trim(),
                AddByUser = word.AddByUser,
                Status = word.Status.Trim(),
                ShortDefinition = word.ShortDefinition.Trim(),
                UserAdded = word.AddByUserNavigation
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
                WordText = word.WordText.Trim(),
                ShortDefinition = word.ShortDefinition.Trim(),
                Phonetic = word.Phonetic.Trim(),
                AddByUser = word.AddByUser,
                Status = word.Status.Trim()
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
                WordText = word.WordText.Trim(),
                Phonetic = word.Phonetic.Trim(),
                ShortDefinition = word.ShortDefinition.Trim(),
                Status = word.Status.Trim(),
                UserAdded = word.AddByUserNavigation
            };

            return dto;
        }


    }
}
