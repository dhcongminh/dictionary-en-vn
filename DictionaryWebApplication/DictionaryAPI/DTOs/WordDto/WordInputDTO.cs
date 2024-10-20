using DictionaryAPI.DTOs.DefinitionDto;
using DictionaryAPI.Models;

namespace DictionaryAPI.DTOs.WordDto {
    public class WordInputDTO {
        public string WordText { get; set; } = null!;
        public string? ShortDefinition { get; set; }
        public string? Phonetic { get; set; }
        public int? AddByUser { get; set; }
        public string? Status { get; set; }
        public virtual ICollection<WordDefinitionDTO> WordDefinitions { get; set; }
        public virtual ICollection<string> Antonyms { get; set; }
        public virtual ICollection<string> Synonyms { get; set; }
        public WordInputDTO() {
            WordDefinitions = new HashSet<WordDefinitionDTO>();
            Antonyms = new HashSet<string>();
            Synonyms = new HashSet<string>();
        }
    }
}
