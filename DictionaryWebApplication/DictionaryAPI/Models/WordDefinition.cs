using System;
using System.Collections.Generic;

namespace DictionaryAPI.Models
{
    public partial class WordDefinition
    {
        public int WordId { get; set; }
        public int TypeId { get; set; }
        public int? DefinitionId { get; set; }

        public virtual Definition? Definition { get; set; }
        public virtual Type Type { get; set; } = null!;
        public virtual Word Word { get; set; } = null!;
    }
}
