
namespace DictionaryAPI.DTOs.DefinitionDto {
    public class WordDefinitionDTO {
        public WordDefinitionDTO() {
            Definitions = new DefinitionDTO();
        }
        public string? Type { get; set; }
        public virtual DefinitionDTO Definitions { get; set; }
    }
}
