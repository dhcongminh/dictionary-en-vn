using DictionaryAPI.DTOs.DefinitionDto;

namespace DictionaryAPI.DTOs.WordDto {
    public class WordInDetailDTO {
        public int Id { get; set; }
        public string WordText { get; set; } = "";
        public string? Phonetic { get; set; }
        public int? AddByUser { get; set; }
        public string? Status { get; set; }
        public virtual ICollection<string> Antonyms { get; set; }
        public virtual ICollection<string> Synonyms { get; set; }
        public virtual ICollection<WordDefinitionDTO> WordDefinitions { get; set; }
        public WordInDetailDTO() {
            WordDefinitions = new HashSet<WordDefinitionDTO>();
            Antonyms = new HashSet<string>();
            Synonyms = new HashSet<string>();
        }
    }
}
