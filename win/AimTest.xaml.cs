using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.Common;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
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
    /// Interaction logic for AimTest.xaml
    /// </summary>
    public partial class AimTest : UserControl
    {
        private Random random = new Random();
        private float targetSizeRatio = 0.1f;

        private int targetCount = 10;
        private int targetsClicked;

        private Stopwatch timer = new();
        private bool isTestEnded;
        public AimTest()
        {
            InitializeComponent();
            // size changed executes also on Loaded event
            SizeChanged += (_, _) => ReadyUpTest();
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
        }
        private void StopTest()
        {

            TargetsRemaining.Visibility = Visibility.Hidden;
            isTestEnded = true;
            timer.Stop();
            ResultTextBlock.Text = $"{(timer.ElapsedMilliseconds / targetCount)}ms\nClick to try again";
            Target.Visibility = Visibility.Hidden;
        }
        private void MoveTargetToRandomPosition()
        {
            Target.Margin = new Thickness(
                (AimArea.ActualWidth - Target.Width) * random.NextDouble(),
                (AimArea.ActualHeight - Target.Height) * random.NextDouble(),
                0, 0);
        }
        private void OnGridClick(object sender, RoutedEventArgs e)
        {
            if (isTestEnded)
            {
                ReadyUpTest();
            }
        }
        private void ReadyUpTest()
        {
            double targetActualSize = AimArea.ActualWidth * targetSizeRatio;
            Target.Width = targetActualSize;
            Target.Height = targetActualSize;
            Target.Margin = new Thickness(
                (AimArea.ActualWidth - targetActualSize) / 2,
                (AimArea.ActualHeight - targetActualSize) / 2,
                0, 0);
            ResultTextBlock.Text = "";
            targetsClicked = -1;
            isTestEnded = false;
            Target.Visibility = Visibility.Visible;
        }
    }
}
