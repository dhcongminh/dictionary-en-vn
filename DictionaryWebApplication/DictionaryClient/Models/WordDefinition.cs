using System;
using System.Collections.Generic;

namespace DictionaryClient.Models
{
    public partial class WordDefinition
    {
        public int Id { get; set; }
        public int? WordId { get; set; }
        public int? TypeId { get; set; }
        public int? DefinitionId { get; set; }

        public virtual Definition? Definition { get; set; }
        public virtual Type? Type { get; set; }
        public virtual Word? Word { get; set; }
    }
}
