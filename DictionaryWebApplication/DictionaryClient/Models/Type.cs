using System;
using System.Collections.Generic;

namespace DictionaryClient.Models
{
    public partial class Type
    {
        public Type()
        {
            WordDefinitions = new HashSet<WordDefinition>();
        }

        public int Id { get; set; }
        public string? Title { get; set; }

        public virtual ICollection<WordDefinition> WordDefinitions { get; set; }
    }
}
