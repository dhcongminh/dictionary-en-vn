using System;
using System.Collections.Generic;

namespace DictionaryClient.Models
{
    public partial class User
    {
        public User()
        {
            WordSets = new HashSet<WordSet>();
            WordsNavigation = new HashSet<Word>();
            Words = new HashSet<Word>();
        }

        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
        public bool? IsActive { get; set; }

        public virtual UserDetail? UserDetail { get; set; }
        public virtual ICollection<WordSet> WordSets { get; set; }
        public virtual ICollection<Word> WordsNavigation { get; set; }

        public virtual ICollection<Word> Words { get; set; }
    }
}
