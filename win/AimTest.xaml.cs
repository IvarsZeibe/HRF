using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.Common;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.NetworkInformation;
using System.Runtime.CompilerServices;
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
using System.Windows.Shapes;
using System.Windows.Threading;
using Path = System.IO.Path;

namespace win
{
    /// <summary>
    /// Interaction logic for AimTest.xaml
    /// </summary>
    public partial class AimTest : UserControl
    {
        private Random random = new Random();
        private float targetSizeRatio = 0.1f;

        private int targetCount = 10;
        private int targetsClicked;
        private int missedTargets = 0;

        private (double x, double y) targetPosition = (0.5, 0.5);

        private Stopwatch timer = new();

        double accuracy = 0;
        double averageTimePerTarget = 0;

        private BlurEffect blurEffect = new() { Radius = 5, KernelType = KernelType.Gaussian };
        public AimTest()
        {
            InitializeComponent();
            // SizeChanged executes also on Loaded event (executes when UserControl is loaded)
            Loaded += (_, _) => ReadyUpTest();
            SizeChanged += (_, _) => SetTargetSize();
            
        }
        private void OnTargetClick(object sender, RoutedEventArgs e)
        {
            e.Handled = true;

            if (targetsClicked == -1)
            {
                StartTest();
            }

            targetsClicked++;
            TargetsRemaining.Text = $"Targets remaining: {targetCount - targetsClicked}";

            if (targetsClicked >= targetCount)
            {
                StopTest();
            }
            else
            {
                MoveTargetToRandomPosition();
            }
        }
        private void StartTest()
        {
            timer.Restart();
            TargetsRemaining.Visibility = Visibility.Visible;
            ResultView.Visibility = Visibility.Hidden;
        }
        private void StopTest()
        {
            TargetsRemaining.Visibility = Visibility.Hidden;
            timer.Stop();
            ResultView.Visibility = Visibility.Visible;
            SaveButton.Visibility = Visibility.Visible;
            accuracy = Math.Round((double)targetCount / (targetCount + missedTargets) * 100, 2);
            averageTimePerTarget = timer.ElapsedMilliseconds / targetCount;
            Result.Text = $"Average time per target: {averageTimePerTarget}ms\nAccuracy: {accuracy}%\nClick to try again";
            Target.Visibility = Visibility.Hidden;
        }
        private void Restart(object sender, RoutedEventArgs e)
        {
            ResultView.Visibility = Visibility.Hidden;
            TargetsRemaining.Text = "Click the target to start";
            TargetsRemaining.Visibility = Visibility.Visible;
            ReadyUpTest();
        }
        private void MoveTargetToRandomPosition()
        {
            targetPosition = (random.NextDouble(), random.NextDouble());
            Target.Margin = new Thickness(
                (AimArea.ActualWidth - Target.Width) * targetPosition.x,
                (AimArea.ActualHeight - Target.Height) * targetPosition.y,
                0, 0);
        }
        private void OnGridClick(object sender, RoutedEventArgs e)
        {
            if (targetsClicked >=0)
            {
                missedTargets++;
            }
        }
        private void SetTargetSize()
        {
            double targetActualSize = AimArea.ActualWidth * targetSizeRatio;
            Target.Width = targetActualSize;
            Target.Height = targetActualSize;
            Target.Margin = new Thickness(
                (AimArea.ActualWidth - targetActualSize) * targetPosition.x,
                (AimArea.ActualHeight - targetActualSize) * targetPosition.y,
                0, 0);
        }
        private void ReadyUpTest()
        {
            targetPosition = (0.5, 0.5);
            SetTargetSize();
            targetsClicked = -1;
            missedTargets = 0;
            Target.Visibility = Visibility.Visible;
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
            string pathToFolder = Path.Combine(Environment.CurrentDirectory, "HRF_TestResults");
            if (!Directory.Exists(pathToFolder))
            {
                Directory.CreateDirectory(pathToFolder);
            }
            var filePath = Path.Combine(pathToFolder, "AimTestResults.txt");

            File.AppendAllText(filePath, $"Username: {nickname}; Average time per target: {averageTimePerTarget}; Accuracy: {accuracy}%\n");
        }
    }
}
