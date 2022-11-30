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

    /*
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
        private HttpClient client;
        private string url = "https://localhost:5001/api";
        //private DispatcherTimer internetConnectionCheckTimer = new();

        //BackgroundWorker ??
        private Task internetCheckTask;
        public MainWindow()
        {
            InitializeComponent();

            client = CreateClient();
            ActiveTest.Content = new Home();
            //string url = @"https://localhost:5001/api/testitems";
            //(FindName("testBox") as TextBox).Text = client.GetStringAsync(url).Result;
            //internetConnectionCheckTimer.Interval = new TimeSpan(0, 0, 10);
            //internetConnectionCheckTimer.Tick += (_, _) => this.Dispatcher.Invoke(() => WebsiteAvailability.Text = IsWebsiteAvailable(url) ? "Ok" : ":(");
            //internetCheckTask = Task.Factory.StartNew(() => this.Dispatcher.Invoke(() => WebsiteAvailability.Text = IsWebsiteAvailable(url) ? "Ok" : ":("));
            //Test();
            //WebsiteAvailability.Text = IsWebsiteAvailable(url) ? "Ok" : ":(";

            //Loaded += Start;

            //internetConnectionCheckTimer.Start();

            WritingTestButton.Click += (_, _) => ActiveTest.Content = new WritingTest();
            ReactionTimeTestButton.Click += (_, _) => ActiveTest.Content = new ReactionTimeTest();
            AimTestButton.Click += (_, _) => ActiveTest.Content = new AimTest();
            NumberMemoryTestButton.Click += (_, _) => ActiveTest.Content = new NumberMemoryTest();
            HomeButton.Click += (_, _) => ActiveTest.Content = new Home();

        }
        private bool IsWebsiteAvailable(string url)
        {
            try
            {
                return client.GetAsync(url).Result.StatusCode == HttpStatusCode.OK;
            }
            catch
            {
                return false;
            }
        }
        private HttpClient CreateClient()
        {
            HttpClientHandler clientHandler = new();
            // Bypassing SSL cetificate
            clientHandler.ServerCertificateCustomValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true;

            return new HttpClient(clientHandler);
        }
        //private async void Test()
        //{
        //    return Task.Factory.StartNew(() => WebsiteAvailability.Text = IsWebsiteAvailable(url) ? "Ok" : ":(");
        //    //new Task(() => WebsiteAvailability.Text = IsWebsiteAvailable(url) ? "Ok" : ":(").Start();
        //}
        //private async void Start(object sender, RoutedEventArgs e)
        //{
        //    try
        //    {
        //        await Task.Run(() =>
        //        {
        //            this.Dispatcher.Invoke(() => WebsiteAvailability.Text = IsWebsiteAvailable(url) ? "Ok" : ":(");
        //            DispatcherTimer timer = new();
        //            timer.Interval = new TimeSpan(0, 0, 10);
        //            timer.Tick += (_, _) => this.Dispatcher.Invoke(() => WebsiteAvailability.Text = IsWebsiteAvailable(url) ? "Ok" : ":({");
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        MessageBox.Show(ex.Message);
        //    }
        //}
    }
}

     */
}
