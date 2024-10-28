using DictionaryAPI.DTOs.DefinitionDto;
using DictionaryAPI.DTOs.WordDto;
using DictionaryAPI.Models;

namespace DictionaryAPI.Services {
    public interface IMapper {
        public Word DtoToWord(WordInDetailDTO dto);
        public Word DtoToWord(WordInListDTO dto);
        public Word DtoToWord(WordInputDTO dto);
        public WordInDetailDTO? WordToDetailDto(Word? word);
        public WordInListDTO WordToListDto(Word word);
        public WordInputDTO WordToInputDto(Word word);

        public Definition DefinitionDtoToDefinition(DefinitionDTO dto);
        public WordDefinition WordDefinitionDtoToWordDefinition(WordDefinitionDTO dto);
        public DefinitionDTO DefinitionToDefinitionDto(Definition dto);
        public WordDefinitionDTO WordDefinitionToWordDefinitionDto(WordDefinition dto);


    }
}
