using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DictionaryAPI.Models
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
        [JsonIgnore]
        public virtual ICollection<Word> WordsNavigation { get; set; }
        
        public virtual ICollection<Word> Words { get; set; }
    }
}
