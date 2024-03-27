using System.Drawing.Drawing2D;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.CognitiveServices.Speech;
using SpeechRecognizer = Microsoft.CognitiveServices.Speech.SpeechRecognizer;
using Timer = System.Windows.Forms.Timer;
using System.Text.RegularExpressions;
using System.Windows.Forms;

namespace Benedict {
	public partial class Form1 : Form {

		// This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
		static string speechKey = Environment.GetEnvironmentVariable("BENEDICT_SPEECH_KEY");
		static string speechRegion = Environment.GetEnvironmentVariable("BENEDICT_SPEECH_REGION");

		//private readonly SpeechRecognitionEngine engine;
		private string recognized = String.Empty;
		private int trackIndex = 0;
		private readonly SpeechRecognizer speechRecognizer;

		public Form1() {
			InitializeComponent();
			var speechConfig = SpeechConfig.FromSubscription(speechKey, speechRegion);
			speechConfig.SpeechRecognitionLanguage = "en-US";
			using var audioConfig = AudioConfig.FromDefaultMicrophoneInput();
			speechRecognizer = new(speechConfig, audioConfig);
			speechRecognizer.Recognizing += SpeechRecognizerOnRecognizing;
			speechRecognizer.Recognized += SpeechRecognizerOnRecognized;
			speechRecognizer.StartContinuousRecognitionAsync();
			const int FRAMES_PER_SECOND = 50;
			timer = new() { Interval = 1000 / FRAMES_PER_SECOND };
			timer.Tick += TimerOnTick;
			timer.Start();
			//richTextBox1.Paint += RichTextBox1OnPaint;
			goButton_Click(this, EventArgs.Empty);
		}

		//private void RichTextBox1OnPaint(object? sender, PaintEventArgs e) {
		//	var graphics = richTextBox1.CreateGraphics();
		//	var pen = new Pen(Color.Red, 2);
		//	graphics.DrawLine(pen, 0, richTextBox1.Height / 2, richTextBox1.Width, richTextBox1.Height / 2);
		//}

		private void TimerOnTick(object? sender, EventArgs e) => ScrollText();

		private void SpeechRecognizerOnRecognized(object? sender, SpeechRecognitionEventArgs e) {
			recognized += e.Result.Text + " ";
			//			EchoText(recognized);
		}

		private void SpeechRecognizerOnRecognizing(object? sender, SpeechRecognitionEventArgs e) {
			Track(recognized + e.Result.Text);
			//	EchoText(recognized + e.Result.Text);
		}

		private void EchoText(string text) {
			if (textBox1.InvokeRequired) {
				textBox1.Invoke(() => EchoText(text));
			} else {
				textBox1.Text = text;
			}

		}

		private readonly Timer timer;
		private int index = 0;

		private void Track(string text) {
			if (richTextBox1.InvokeRequired) {
				richTextBox1.Invoke(() => Track(text));
			} else {
				var chungus = Math.Min(text.Length, 10);
				var chunk = text[^chungus..];
				chunk = Regex.Replace(chunk, "\\W+$", "");
				EchoText(chunk + ": " + index);
				var localIndex = richTextBox1.Text?.IndexOf(chunk, index) ?? 0;
				if (localIndex < index) return;
				index = localIndex;
				richTextBox1.SelectionStart = index + chunk.Length;
			}
		}

		private void ScrollText() {
			if (richTextBox1.InvokeRequired) {
				richTextBox1.Invoke(ScrollText);
			} else {
				var actualPosition = richTextBox1.GetPositionFromCharIndex(index).Y;
				var targetPosition = (this.ClientSize.Height / 2) - (3 * richTextBox1.Font.GetHeight()) + 10;
				var sign = ((actualPosition > targetPosition) ? 1 : -1);
				var distance = Math.Abs(actualPosition - targetPosition); /* switch {
					> 64 => 4,
					> 32 => 3,
					> 16 => 2,
					> 2 => 1,
					_ => 0
				};*/
				if (distance < 5) return;
				Point point = default;
				SendMessage(richTextBox1.Handle, EM_GETSCROLLPOS, 0, ref point);
				point.Y += sign * 5; // distance;
				SendMessage(richTextBox1.Handle, EM_SETSCROLLPOS, 0, ref point);
			}
		}

		const int WM_USER = 0x400;
		const int EM_GETSCROLLPOS = WM_USER + 221;
		const int EM_SETSCROLLPOS = WM_USER + 222;
		[System.Runtime.InteropServices.DllImport("user32.dll")]
		static extern int SendMessage(IntPtr hWnd, int msg, int wParam, ref Point lParam);

		private void resetButton_Click(object sender, EventArgs e) {
			index = 0;
			richTextBox1.SelectionStart = 0;
			recognized = "";
			textBox1.Clear();
		}

		private void goButton_Click(object sender, EventArgs e) {
			richTextBox1.Text = Environment.NewLine + Environment.NewLine + richTextBox1.Text;
			richTextBox1.SelectAll();
			richTextBox1.SelectionAlignment = HorizontalAlignment.Center;
			richTextBox1.SelectionIndent = this.Width / 8;
			richTextBox1.SelectionRightIndent = this.Width / 8;
			richTextBox1.DeselectAll();

		}
	}

	public class RichBox : RichTextBox {
		private const int WM_PAINT = 15;
		private readonly Pen pen = new(Color.Red, 3);
		protected override void WndProc(ref Message m) {
			if (m.Msg == WM_PAINT) {
				this.Invalidate();
				base.WndProc(ref m);
				using Graphics g = Graphics.FromHwnd(this.Handle);
				g.CompositingQuality = CompositingQuality.HighQuality;
				g.DrawLine(pen,
					new(0, this.ClientSize.Height / 2),
					new(this.ClientSize.Width - 1, this.ClientSize.Height / 2)
				);
			} else {
				base.WndProc(ref m);
			}
		}
	}
}
