using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class AimTest
    {
        public AimTest(int userId, int averageTimePerTarget, float accuracy) {
            this.UserId = userId;
            this.AverageTimePerTarget = averageTimePerTarget;
            this.Accuracy = accuracy;
        }
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int AverageTimePerTarget { get; set; }
        public float Accuracy { get; set; }
    }
}