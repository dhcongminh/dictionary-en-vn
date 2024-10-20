using System;
using System.Collections.Generic;

namespace DictionaryAPI.Models {
    public partial class Word {
        public Word() {
            WordDefinitions = new HashSet<WordDefinition>();
            Antonyms = new HashSet<Word>();
            Synonyms = new HashSet<Word>();
            Users = new HashSet<User>();
            Words = new HashSet<Word>();
            WordsNavigation = new HashSet<Word>();
        }

        public int Id { get; set; }
        public string WordText { get; set; } = null!;
        public string? ShortDefinition { get; set; }
        public string? Phonetic { get; set; }
        public int? AddByUser { get; set; }
        public string? Status { get; set; }

        public virtual User? AddByUserNavigation { get; set; }
        public virtual ICollection<WordDefinition> WordDefinitions { get; set; }

        public virtual ICollection<Word> Antonyms { get; set; }
        public virtual ICollection<Word> Synonyms { get; set; }
        public virtual ICollection<User> Users { get; set; }
        public virtual ICollection<Word> Words { get; set; }
        public virtual ICollection<Word> WordsNavigation { get; set; }
    }
}
