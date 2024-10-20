namespace DictionaryAPI.DTOs.WordDto {
    public class WordInListDTO {
        public int Id { get; set; }
        public string WordText { get; set; } = null!;
        public string? ShortDefinition { get; set; }
        public string? Phonetic { get; set; }
        public string? Status { get; set; }
        public WordInListDTO() { }
    }
}
