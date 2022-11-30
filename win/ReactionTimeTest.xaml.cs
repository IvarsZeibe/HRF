using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Effects;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Threading;

namespace win
{
    /// <summary>
    /// Interaction logic for ReactionTimeTest.xaml
    /// </summary>
    public partial class ReactionTimeTest : UserControl
    {
        private const string validNameCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
        private int reactionTime = 0;
        private Random random = new Random();
        private DispatcherTimer timerUntilClickable = new();
        private Stopwatch stopwatch = new();
        private bool isStarted = false;
        private bool isClickable = false;
        private BlurEffect blurEffect = new() { Radius = 5, KernelType = KernelType.Gaussian };
        public ReactionTimeTest()
        {
            InitializeComponent();

            timerUntilClickable.Tick += (object? sender, EventArgs e) =>
            {
                timerUntilClickable.Stop();
                Test.Background = Brushes.Green;
                TestText.Text = "Click";
                isClickable = true;
                stopwatch.Restart();
            };
            NameInput.TextChanged += (_, _) =>
            {
                int caretIndex = NameInput.CaretIndex;
                for (int i = 0; i < NameInput.Text.Length; i++)
                {
                    if (!validNameCharacters.Contains(Char.ToUpper(NameInput.Text[i])))
                    {
                        NameInput.Text = NameInput.Text.Remove(i, 1);
                        if (i <= caretIndex)
                        {
                            caretIndex--;
                        }
                    }
                }
                //NameInput.Text = String.Concat(NameInput.Text.Where(c => validNameCharacters.Contains(Char.ToUpper(c))));
                NameInput.CaretIndex = caretIndex;
            };
        }
        private void StartTest()
        {
            isClickable = false;
            Test.Background = Brushes.Red;
            TestText.Text = "Wait for green";
            SaveButton.Visibility = Visibility.Hidden;
            timerUntilClickable.Interval = new TimeSpan(0, 0, random.Next(3, 5));
            timerUntilClickable.Start();
        }
        private void StopTest()
        {
            stopwatch.Stop();
            timerUntilClickable.Stop();
            if (isClickable)
            {
                Test.Background = Brushes.Transparent;
                reactionTime = Math.Max(0, (int)stopwatch.ElapsedMilliseconds);
                TestText.Text = $"Your reaction time is {reactionTime} ms\nClick to try again";
                SaveButton.Visibility = Visibility.Visible;
            }
            else
            {   
                Test.Background = Brushes.LightBlue;
                TestText.Text = "You clicked too early";
            }
        }
        private void Restart(object sender, RoutedEventArgs e)
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
        private void SavePopup(object sender, RoutedEventArgs e)
        {
            BlurBorder.Effect = blurEffect;
            NameInputPopup.Visibility = Visibility.Visible;
        }
        private void Cancel(object sender, RoutedEventArgs e)
        {
            BlurBorder.Effect = null;
            NameInputPopup.Visibility = Visibility.Hidden;
        }
        private void Save(object sender, RoutedEventArgs e)
        {
            BlurBorder.Effect = null;
            NameInputPopup.Visibility = Visibility.Hidden;
            SaveButton.Visibility = Visibility.Hidden;
            string nickname = NameInput.Text.Trim();
            if (nickname == "")
            {
                nickname = "Anonymous";
            }
            string pathToFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "HRF");
            if (!Directory.Exists(pathToFolder))
            {
                Directory.CreateDirectory(pathToFolder);
            }
            var filePath = Path.Combine(pathToFolder, "ReactionTimeTestResults.txt");
            File.AppendAllText(filePath, $"Username: {nickname}; Reaction time: {reactionTime}\n");
        }

    }
}
