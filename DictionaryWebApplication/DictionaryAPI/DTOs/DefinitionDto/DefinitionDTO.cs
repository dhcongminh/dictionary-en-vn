using DictionaryAPI.Models;

namespace DictionaryAPI.DTOs.DefinitionDto {
    public class DefinitionDTO {
        public DefinitionDTO() {
            Examples = new HashSet<string>();
        }
        public string? Detail {  get; set; }

        public virtual ICollection<string> Examples { get; set; }
    }
}
