using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class ReactionTimeTest
    {
        public ReactionTimeTest(int userId, int reactionTime) {
            this.UserId = userId;
            this.ReactionTime = reactionTime;
        }
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ReactionTime { get; set; }
    }
}