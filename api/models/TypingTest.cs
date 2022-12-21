using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class TypingTest
    {
        public TypingTest(int userId, int wordsPerMinute, float accuracy) {
            this.UserId = userId;
            this.WordsPerMinute = wordsPerMinute;
            this.Accuracy = accuracy;
        }
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int WordsPerMinute { get; set; }
        public float Accuracy { get; set; }
    }
}