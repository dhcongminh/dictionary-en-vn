using System;
using System.Collections.Generic;

namespace DictionaryClient.Models
{
    public partial class WordSetItem
    {
        public int? WordSetId { get; set; }
        public int? WordId { get; set; }

        public virtual Word? Word { get; set; }
        public virtual WordSet? WordSet { get; set; }
    }
}
