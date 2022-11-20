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
        private int level = 1;
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
            level = 1;
            StartLevel();
        }
        private void StartLevel()
        {
            int maxNumber = (int)Math.Pow(10, level);
            int minNumber = level == 1 ? 0 : (int)Math.Pow(10, level - 1);
            NumberToRemember.Text = random.Next(minNumber, maxNumber).ToString();
            NumberToRemember.Visibility = Visibility.Visible;
            NumberInput.Visibility = Visibility.Hidden;

            timer.Interval = new TimeSpan(0, 0, level);
            timer.Start();
        }
        private void SubmitAnswer()
        {
            if (NumberInput.Text == NumberToRemember.Text)
            {
                level++;
                StartLevel();
            }
            else
            {
                isTestStarted = false;
                NumberToRemember.Visibility = Visibility.Hidden;
                NumberInput.Visibility = Visibility.Hidden;
                TestDetails.Text = $"Your result: {level - 1} digits\nClick to try again";
            }
        }
    }
}
