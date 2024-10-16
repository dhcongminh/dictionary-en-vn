using DictionaryAPI.Models;

namespace DictionaryAPI.DTOs {
    public class WordDTO {

        public WordDTO() {
            Antonyms = new HashSet<WordDTO>();
            Definitions = new HashSet<Definition>();
            Synonyms = new HashSet<WordDTO>();
        }

        public int Id { get; set; }
        public string WordText { get; set; } = null!;
        public string? ShortDefinition { get; set; }
        public string? IllustrationImage { get; set; }
        public string? Type { get; set; }
        public bool? IsActive { get; set; }
        public virtual ICollection<WordDTO> Antonyms { get; set; }
        public virtual ICollection<Definition> Definitions { get; set; }
        public virtual ICollection<WordDTO> Synonyms { get; set; }
        public void ToDto(Word? w) {
            if (w != null) {
                this.Id = w.Id;
                this.WordText = w.WordText;
                this.ShortDefinition = w.ShortDefinition;
                this.IllustrationImage = w.IllustrationImage;
                this.Type = w.Type;
                this.IsActive = w.IsActive;
                this.Antonyms = w.Antonyms?.Select(a => new WordDTO {
                    Id = a.Id,
                    WordText = a.WordText,
                    ShortDefinition = a.ShortDefinition,
                    IllustrationImage = a.IllustrationImage,
                    Type = a.Type,
                    IsActive = a.IsActive,
                    Definitions = a.Definitions,
                }).ToList() ?? new List<WordDTO>();
                this.Definitions = w.Definitions;
                this.Synonyms = w.Synonyms.Select(a => new WordDTO {
                    Id = a.Id,
                    WordText = a.WordText,
                    ShortDefinition = a.ShortDefinition,
                    IllustrationImage = a.IllustrationImage,
                    Type = a.Type,
                    IsActive = a.IsActive,
                    Definitions = a.Definitions,
                }).ToList() ?? new List<WordDTO>();
            } else {
                Console.WriteLine("Word opject is null");
            }
        }
    }
}
