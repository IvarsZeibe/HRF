namespace API.ViewModels
{
    public class TypingTestDetailedSummary
    {
        public int TotalTestsCompleted { get; set; }
        public double AverageWordsPerMinute { get; set; }
        public double AverageAccuracy { get; set; }
        public int BestWordsPerMinute { get; set; }
        public float BestAccuracy { get; set; }
        public int BestWordsPerMinuteRank { get; set; }
        public float BestAccuracyRank { get; set; }
    }
}