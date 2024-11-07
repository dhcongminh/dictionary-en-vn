using System;
using System.Collections.Generic;

namespace DictionaryClient.Models
{
    public partial class WordSet
    {
        public WordSet()
        {
            Words = new HashSet<Word>();
        }

        public int Id { get; set; }
        public int? UserId { get; set; }
        public string? NameOfSet { get; set; }

        public virtual User? User { get; set; }

        public virtual ICollection<Word> Words { get; set; }
    }
}
