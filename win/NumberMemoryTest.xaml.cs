using System;
using System.Collections.Generic;
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
    /// Interaction logic for NumberMemoryTest.xaml
    /// </summary>
    public partial class NumberMemoryTest : UserControl
    {
        private int currentLevel;
        private int startingLevel = 2;
        private bool isTestStarted = false;
        private Random random = new();
        private DispatcherTimer timer = new();
        public NumberMemoryTest()
        {
            InitializeComponent();
            NumberInput.PreviewKeyDown += (object sender, KeyEventArgs e) =>
            {
                if (e.Key == Key.Enter)
                {
                    SubmitAnswer();
                    e.Handled = true;
                }
            };
            timer.Tick += (_, _) =>
            {
                NumberToRemember.Visibility = Visibility.Hidden;
                NumberInput.Text = "";
                NumberInput.Visibility = Visibility.Visible;
                NumberInput.Focus();
                timer.Stop();
            };
        }
        private void OnGridClick(object sender, RoutedEventArgs e)
        {
            if (!isTestStarted)
            {
                StartTest();
            }
        }
        private void StartTest()
        {
            TestDetails.Text = "";
            isTestStarted = true;
            currentLevel = startingLevel;
            StartLevel();
        }
        private void StartLevel()
        {
            string number = "";
            for (int i = 0; i < currentLevel; i++)
            {
                number += GetRandomDigit().ToString();
            }
            NumberToRemember.Text = number;
            NumberToRemember.Visibility = Visibility.Visible;
            NumberInput.Visibility = Visibility.Hidden;

            timer.Interval = new TimeSpan(0, 0, currentLevel);
            timer.Start();
        }
        private int GetRandomDigit()
        {
            return random.Next(0, 10);
        }
        private void SubmitAnswer()
        {
            if (NumberInput.Text == NumberToRemember.Text)
            {
                currentLevel++;
                StartLevel();
            }
            else
            {
                if (currentLevel == startingLevel)
                {
                    currentLevel = 0;
                }
                else
                {
                    currentLevel--;
                }
                isTestStarted = false;
                NumberToRemember.Visibility = Visibility.Hidden;
                NumberInput.Visibility = Visibility.Hidden;
                TestDetails.Text = $"Your result: {currentLevel} digits\nClick to try again";
            }
        }
    }
}
