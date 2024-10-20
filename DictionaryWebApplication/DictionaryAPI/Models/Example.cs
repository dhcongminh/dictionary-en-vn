using System;
using System.Collections.Generic;

namespace DictionaryAPI.Models
{
    public partial class Example
    {
        public int Id { get; set; }
        public int? DefinitionId { get; set; }
        public string? Detail { get; set; }

        public virtual Definition? Definition { get; set; }
    }
}
