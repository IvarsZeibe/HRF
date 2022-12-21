namespace API.ViewModels
{
    public class ReactionTimeTestDetailedSummary
    {
        public int TotalTestsCompleted { get; set; }
        public double AverageReactionTime { get; set; }
        public int BestReactionTime { get; set; }
        public int BestReactionTimeRank { get; set; }
    }
}