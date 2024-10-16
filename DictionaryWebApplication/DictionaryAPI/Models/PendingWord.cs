using System;
using System.Collections.Generic;

namespace DictionaryAPI.Models
{
    public partial class PendingWord
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? WordId { get; set; }

        public virtual User? User { get; set; }
        public virtual Word? Word { get; set; }
    }
}
