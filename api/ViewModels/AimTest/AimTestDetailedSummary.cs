namespace API.ViewModels
{
    public class AimTestDetailedSummary
    {
        public int TotalTestsCompleted { get; set; }
        public double AverageTimePerTarget { get; set; }
        public double AverageAccuracy { get; set; }
        public int BestAverageTimePerTarget { get; set; }
        public float BestAccuracy { get; set; }
        public int BestAverageTimePerTargetRank { get; set; }
        public int BestAccuracyRank { get; set; }
    }
}