using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class NumberMemoryTest
    {
        public NumberMemoryTest(int userId, int digitCount) {
            this.UserId = userId;
            this.DigitCount = digitCount;
        }
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int DigitCount { get; set; }
    }
}