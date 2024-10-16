using System;
using System.Collections.Generic;

namespace DictionaryClient.Models
{
    public partial class Word
    {
        public Word()
        {
            PendingWords = new HashSet<PendingWord>();
            Antonyms = new HashSet<Word>();
            Definitions = new HashSet<Definition>();
            Synonyms = new HashSet<Word>();
            Users = new HashSet<User>();
            Words = new HashSet<Word>();
            WordsNavigation = new HashSet<Word>();
        }

        public int Id { get; set; }
        public string WordText { get; set; } = null!;
        public string? ShortDefinition { get; set; }
        public string? IllustrationImage { get; set; }
        public string? Type { get; set; }
        public bool? IsActive { get; set; }

        public virtual ICollection<PendingWord> PendingWords { get; set; }

        public virtual ICollection<Word> Antonyms { get; set; }
        public virtual ICollection<Definition> Definitions { get; set; }
        public virtual ICollection<Word> Synonyms { get; set; }
        public virtual ICollection<User> Users { get; set; }
        public virtual ICollection<Word> Words { get; set; }
        public virtual ICollection<Word> WordsNavigation { get; set; }
    }
}
