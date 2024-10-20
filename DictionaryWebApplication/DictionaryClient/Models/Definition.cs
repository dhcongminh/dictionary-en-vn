using System;
using System.Collections.Generic;

namespace DictionaryClient.Models
{
    public partial class Definition
    {
        public Definition()
        {
            Examples = new HashSet<Example>();
        }

        public int Id { get; set; }
        public string? Detail { get; set; }

        public virtual WordDefinition? WordDefinition { get; set; }
        public virtual ICollection<Example> Examples { get; set; }
    }
}
