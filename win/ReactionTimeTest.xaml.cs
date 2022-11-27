using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace win
{
    /// <summary>
    /// Interaction logic for ReactionTimeTest.xaml
    /// </summary>
    public partial class ReactionTimeTest : UserControl
    {
        private Random random = new Random();
        private DispatcherTimer timerUntilClickable = new();
        private Stopwatch stopwatch = new();
        private bool isStarted = false;
        private bool isClickable = false;
        public ReactionTimeTest()
        {
            InitializeComponent();

            timerUntilClickable.Tick += (object? sender, EventArgs e) =>
            {
                timerUntilClickable.Stop();
                ReactionTimeButton.Background = Brushes.Green;
                ReactionTimeButton.Content = "Click";
                isClickable = true;
                stopwatch.Restart();
            };
        }
        private void StartTest()
        {
            isClickable = false;
            ReactionTimeButton.Background = Brushes.Red;
            ReactionTimeButton.Content = "Wait for green";
            timerUntilClickable.Interval = new TimeSpan(0, 0, random.Next(3, 5));
            timerUntilClickable.Start();
        }
        private void StopTest()
        {
            stopwatch.Stop();
            timerUntilClickable.Stop();
            if (isClickable)
            {
                ReactionTimeButton.Background = Brushes.LightBlue;
                ReactionTimeButton.Content = $"Your reaction time is {Math.Max(0, (int)stopwatch.ElapsedMilliseconds)} ms";
            }
            else
            {   
                ReactionTimeButton.Background = Brushes.LightBlue;
                ReactionTimeButton.Content = "You clicked too early";
            }
        }
        private void OnClick(object sender, RoutedEventArgs e)
        {
            if (!isStarted)
            {
                isStarted = true;
                StartTest();
            }
            else
            {
                StopTest();
                isStarted = false;
            }
        }

    }
}
