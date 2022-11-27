using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.NetworkInformation;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
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
using System.Xml.Linq;

namespace win
{
    /// <summary>
    /// Interaction logic for WritingTest.xaml
    /// </summary>
    public partial class WritingTest : UserControl
    {
        private const string validKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        private List<string> correctWords = new() { "one", "two", "three", "four", "one", "two", "three", "four", "one", "two", "three", "four", "one", "two", "three", "four" };

        private int currentWordIndex = 0;
        private int currentLetterIndex = 0;

        private int correctKeyPresses = 0;
        private int incorrectKeyPresses = 0;

        private InlineCollection inlines;

        // wordIndex, List<letterIndex>
        private Dictionary<int, List<int>> errorLocations = new();

        private bool isStarted = false;
        private const int averageWordLength = 5;
        private const int testTimeInSeconds = 30;
        private int timeLeft = 0;
        private DispatcherTimer dispatcherTimer = new();
        private Random random = new();

        public WritingTest()
        {
            InitializeComponent();
            LoadWords();
            if (Words.Document.Blocks.FirstBlock is not Paragraph paragraph)
            {
                throw new Exception("Should have been a paragraph");
            }
            inlines = paragraph.Inlines;

            SetupTimer();
            Reset();
        }
        private void LoadWords()
        {
            List<string> allWords = new();

            string file = @"pack://application:,,,/" + Assembly.GetExecutingAssembly().GetName().Name + ";component/assets/word_list.txt";
            using (var reader = new StreamReader(Application.GetResourceStream(new Uri(file)).Stream))
            {
                while (reader.ReadLine() is string line)
                {
                    allWords.Add(line);
                }
            }
            correctWords.Clear();
            for (int i = 0; i < 100; i++)
            {
                correctWords.Add(allWords[random.Next(0, allWords.Count())]);
            }
        }
        private void SetupTimer()
        {
            dispatcherTimer.Tick += (object? sender, EventArgs e) =>
            {
                timeLeft--;
                if (timeLeft <= 0)
                {
                    Reset();
                }
                else
                {
                    UpdateTimer();
                }
            };
            dispatcherTimer.Interval = new TimeSpan(0, 0, 1);
        }
        void Reset()
        {
            dispatcherTimer.Stop();
            if (incorrectKeyPresses + correctKeyPresses == 0)
            {
                result.Text = "No characters typed";
            }
            else
            {
                int letterCountInCorrectWords = 0;
                for (int i = 0; i < currentWordIndex + 1; i++)
                {
                    if (!(errorLocations.TryGetValue(i, out var errors) && errors != null && errors.Count > 0))
                    {
                        if (i == currentWordIndex)
                        {
                            letterCountInCorrectWords += currentLetterIndex;
                        }
                        else
                        {
                            letterCountInCorrectWords += correctWords[i].Length + 1;
                        }
                    }
                }
                double accuracy = Math.Round((float)correctKeyPresses / (incorrectKeyPresses + correctKeyPresses) * 100, 2);
                double wordsPerMinute = Math.Round((float)letterCountInCorrectWords / averageWordLength * 60 / testTimeInSeconds, 2);
                result.Text = $"WPM: {wordsPerMinute}\nAccuracy: {accuracy}%";
            }
            inlines.Clear();
            errorLocations.Clear();
            correctKeyPresses = 0;
            incorrectKeyPresses = 0;
            currentWordIndex = 0;
            currentLetterIndex = 0;
            isStarted = false;
            timeLeft = testTimeInSeconds;
            UpdateTimer();
            AddUnwrittenPartOfTest();
        }
        private void UserControl_Loaded(object sender, RoutedEventArgs e)
        {
            Words.KeyDown += HandleKeyPress;
            Words.PreviewKeyDown += HandlePreviewKeyPress;
            Words.Focus();
        }
        private void HandlePreviewKeyPress(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Space)
            {
                RemoveUnwrittenPartOfTest();
                if (currentLetterIndex < correctWords[currentWordIndex].Length)
                {
                    inlines.Add(new Run(correctWords[currentWordIndex].Substring(currentLetterIndex)) { Foreground = Brushes.Gray });
                    AddError(currentWordIndex, currentLetterIndex);

                }

                currentLetterIndex = 0;
                currentWordIndex++;
                if (currentWordIndex >= correctWords.Count)
                {
                    Reset();
                    return;
                }
                inlines.Add(new Run(" "));
                Words.CaretPosition = inlines.LastInline.ElementEnd;

                if (AnyErrorsIn(currentWordIndex - 1))
                {
                    incorrectKeyPresses++;
                    // underline word
                    var inline = inlines.LastInline.PreviousInline;
                    while (true)
                    {
                        if (inline is null || inline.ContentEnd.GetTextInRun(LogicalDirection.Backward) == " ")
                            break;
                        inline.TextDecorations = TextDecorations.Underline;
                        inline = inline.PreviousInline;
                    }
                }
                else
                {
                    correctKeyPresses++;
                }
                AddUnwrittenPartOfTest();
            }
            else if (e.Key == Key.Back)
            {
                if (currentLetterIndex == 0)
                {
                    if (currentWordIndex > 0)
                    {
                        RemoveUnwrittenPartOfTest();
                        currentWordIndex--;
                        inlines.Remove(inlines.LastInline);
                        currentLetterIndex = 0;
                        var inline = inlines.LastInline;

                        while (true)
                        {
                            if (inline is null || inline.ContentEnd.GetTextInRun(LogicalDirection.Backward) == " ")
                                break;
                            Inline previousInline = inline.PreviousInline;
                            int inlineLength = inline.ContentEnd.GetTextRunLength(LogicalDirection.Backward);
                            inline.TextDecorations.TryRemove(TextDecorations.Underline, out var result);
                            inline.TextDecorations = result;
                            if (inlineLength > 1)
                            {
                                inlines.Remove(inline);
                            }
                            else
                            {
                                currentLetterIndex += inlineLength;
                            }
                            inline = previousInline;
                        }
                        TryRemoveError(currentWordIndex, currentLetterIndex);
                        AddUnwrittenPartOfTest();
                    }
                }
                else
                {
                    RemoveUnwrittenPartOfTest();
                    inlines.Remove(inlines.LastInline);
                    currentLetterIndex--;
                    TryRemoveError(currentWordIndex, currentLetterIndex);
                    AddUnwrittenPartOfTest();
                }
            }
            else if (new List<Key>() { Key.Left, Key.Right, Key.Up, Key.Down, Key.PageDown, Key.PageUp, Key.Home, Key.End }.Contains(e.Key))
            {
                e.Handled = true;
            }
            else if (e.Key == Key.Enter)
            {
                Reset();
            }
        }
        private void HandleKeyPress(object sender, KeyEventArgs e)
        {
            if (TryGetLetter(e.Key, out char letter))
            {
                if (!isStarted)
                {
                    dispatcherTimer.Start();
                    isStarted = true;
                }

                RemoveUnwrittenPartOfTest();
                WriteLetter(letter);
                Words.CaretPosition = inlines.LastInline.ElementEnd;
                AddUnwrittenPartOfTest();
            }
        }
        private bool TryGetLetter(Key key, out char letter)
        {
            string enteredKey = key.ToString();
            if (enteredKey.Length == 1 && validKeys.Contains(enteredKey))
            {
                bool isShiftPressed = Keyboard.IsKeyDown(Key.LeftShift) || Keyboard.IsKeyDown(Key.RightShift);
                letter = isShiftPressed ? enteredKey[0] : Char.ToLower(enteredKey[0]);
                return true;
            }
            else
            {
                letter = new();
                return false;
            }
        }
        private void WriteLetter(char letter)
        {
            if (currentWordIndex >= correctWords.Count)
            {
                throw new Exception("This shouldn't be possible");
            }
            else if (currentLetterIndex >= correctWords[currentWordIndex].Length)
            {
                inlines.Add(new Run(letter.ToString()) { Foreground = Brushes.Red });
                AddError(currentWordIndex, currentLetterIndex);
                currentLetterIndex++;
                incorrectKeyPresses++;
            }
            else if (correctWords[currentWordIndex][currentLetterIndex] == letter)
            {
                inlines.Add(new Run(letter.ToString()) { Foreground = Brushes.LightGreen });
                currentLetterIndex++;
                correctKeyPresses++;
            }
            else
            {
                inlines.Add(new Run(correctWords[currentWordIndex][currentLetterIndex].ToString()) { Foreground = Brushes.Red });
                
                AddError(currentWordIndex, currentLetterIndex);
                currentLetterIndex++;
                incorrectKeyPresses++;
            }
        }
        private void RemoveUnwrittenPartOfTest()
        {
            Inline end = inlines.LastInline;
            inlines.Remove(end);
        }
        private void AddUnwrittenPartOfTest()
        {
            string currentWordsUnwrittenPart = correctWords[currentWordIndex].Substring(Math.Min(currentLetterIndex, correctWords[currentWordIndex].Length));
            string unwrittenWords = String.Join(' ', correctWords.Skip(currentWordIndex + 1));
            Inline end = new Run(currentWordsUnwrittenPart + " " + unwrittenWords);
            inlines.Add(end);
        }
        private void AddError(int wordIndex, int letterIndex)
        {
            if (!errorLocations.ContainsKey(wordIndex))
            {
                errorLocations.Add(wordIndex, new());
            }
            errorLocations[wordIndex].Add(letterIndex);
        }
        private void TryRemoveError(int wordIndex, int letterIndex)
        {
            if (errorLocations.ContainsKey(wordIndex))
            {
                errorLocations[wordIndex].Remove(letterIndex);
            }
        }
        private bool AnyErrorsIn(int wordIndex)
        {
            return errorLocations.ContainsKey(wordIndex) && errorLocations[wordIndex].Count > 0;
        }
        private void UpdateTimer()
        {
            TimerUI.Text = $"Time left: {timeLeft}";
        }
    }
}
