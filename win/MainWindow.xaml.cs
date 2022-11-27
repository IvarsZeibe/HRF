using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
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
using static System.Net.Mime.MediaTypeNames;

namespace win
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            ActiveTest.Content = new Home();

            WritingTestButton.Click += (_, _) => ActiveTest.Content = new WritingTest();
            ReactionTimeTestButton.Click += (_, _) => ActiveTest.Content = new ReactionTimeTest();
            AimTestButton.Click += (_, _) => ActiveTest.Content = new AimTest();
            NumberMemoryTestButton.Click += (_, _) => ActiveTest.Content = new NumberMemoryTest();
            HomeButton.Click += (_, _) => ActiveTest.Content = new Home();
        }
    }
}
