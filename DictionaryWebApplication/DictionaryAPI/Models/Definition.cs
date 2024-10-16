using System;
using System.Collections.Generic;

namespace DictionaryAPI.Models
{
    public partial class Definition
    {
        public Definition()
        {
            Words = new HashSet<Word>();
        }

        public int Id { get; set; }
        public string? Detail { get; set; }

        public virtual ICollection<Word> Words { get; set; }
    }
}
