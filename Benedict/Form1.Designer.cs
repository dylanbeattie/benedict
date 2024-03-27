namespace Benedict {
	partial class Form1 {
		/// <summary>
		///  Required designer variable.
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary>
		///  Clean up any resources being used.
		/// </summary>
		/// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
		protected override void Dispose(bool disposing) {
			if (disposing && (components != null)) {
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Windows Form Designer generated code

		/// <summary>
		///  Required method for Designer support - do not modify
		///  the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent() {
			var resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
			richTextBox1 = new RichBox();
			toolStrip1 = new ToolStrip();
			resetButton = new ToolStripButton();
			goButton = new ToolStripButton();
			splitContainer1 = new SplitContainer();
			textBox1 = new TextBox();
			toolStrip1.SuspendLayout();
			((System.ComponentModel.ISupportInitialize) splitContainer1).BeginInit();
			splitContainer1.Panel1.SuspendLayout();
			splitContainer1.Panel2.SuspendLayout();
			splitContainer1.SuspendLayout();
			this.SuspendLayout();
			// 
			// richTextBox1
			// 
			richTextBox1.BackColor = SystemColors.WindowText;
			richTextBox1.BorderStyle = BorderStyle.None;
			richTextBox1.Dock = DockStyle.Fill;
			richTextBox1.Font = new Font("Segoe UI Semibold", 48F, FontStyle.Bold, GraphicsUnit.Point,  0);
			richTextBox1.ForeColor = SystemColors.Window;
			richTextBox1.Location = new Point(0, 0);
			richTextBox1.Margin = new Padding(64, 3, 64, 3);
			richTextBox1.Name = "richTextBox1";
			richTextBox1.ScrollBars = RichTextBoxScrollBars.None;
			richTextBox1.Size = new Size(1082, 514);
			richTextBox1.TabIndex = 0;
			richTextBox1.Text = resources.GetString("richTextBox1.Text");
			// 
			// toolStrip1
			// 
			toolStrip1.BackColor = Color.Black;
			toolStrip1.Font = new Font("Segoe UI Semibold", 15.75F, FontStyle.Bold, GraphicsUnit.Point,  0);
			toolStrip1.ImageScalingSize = new Size(32, 32);
			toolStrip1.Items.AddRange(new ToolStripItem[] { resetButton, goButton });
			toolStrip1.Location = new Point(0, 0);
			toolStrip1.Name = "toolStrip1";
			toolStrip1.Size = new Size(1082, 39);
			toolStrip1.TabIndex = 1;
			toolStrip1.Text = "toolStrip1";
			// 
			// resetButton
			// 
			resetButton.Font = new Font("Segoe UI Semibold", 12F, FontStyle.Bold, GraphicsUnit.Point,  0);
			resetButton.ForeColor = SystemColors.Window;
			resetButton.Image = (Image) resources.GetObject("resetButton.Image");
			resetButton.ImageTransparentColor = Color.Magenta;
			resetButton.Name = "resetButton";
			resetButton.Size = new Size(87, 36);
			resetButton.Text = "Reset";
			resetButton.ToolTipText = "Reset";
			resetButton.Click += this.resetButton_Click;
			// 
			// goButton
			// 
			goButton.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
			goButton.ForeColor = SystemColors.Window;
			goButton.Image = (Image) resources.GetObject("goButton.Image");
			goButton.ImageTransparentColor = Color.Magenta;
			goButton.Name = "goButton";
			goButton.Size = new Size(67, 36);
			goButton.Text = "Go";
			goButton.Click += this.goButton_Click;
			// 
			// splitContainer1
			// 
			splitContainer1.Dock = DockStyle.Fill;
			splitContainer1.Location = new Point(0, 39);
			splitContainer1.Name = "splitContainer1";
			splitContainer1.Orientation = Orientation.Horizontal;
			// 
			// splitContainer1.Panel1
			// 
			splitContainer1.Panel1.Controls.Add(richTextBox1);
			// 
			// splitContainer1.Panel2
			// 
			splitContainer1.Panel2.Controls.Add(textBox1);
			splitContainer1.Size = new Size(1082, 608);
			splitContainer1.SplitterDistance = 514;
			splitContainer1.TabIndex = 2;
			// 
			// textBox1
			// 
			textBox1.BackColor = Color.Black;
			textBox1.BorderStyle = BorderStyle.None;
			textBox1.Dock = DockStyle.Fill;
			textBox1.ForeColor = Color.Lime;
			textBox1.Location = new Point(0, 0);
			textBox1.Multiline = true;
			textBox1.Name = "textBox1";
			textBox1.Size = new Size(1082, 90);
			textBox1.TabIndex = 0;
			// 
			// Form1
			// 
			this.AutoScaleDimensions = new SizeF(7F, 15F);
			this.AutoScaleMode = AutoScaleMode.Font;
			this.BackColor = Color.Black;
			this.ClientSize = new Size(1082, 647);
			this.Controls.Add(splitContainer1);
			this.Controls.Add(toolStrip1);
			this.Name = "Form1";
			this.Text = "Form1";
			toolStrip1.ResumeLayout(false);
			toolStrip1.PerformLayout();
			splitContainer1.Panel1.ResumeLayout(false);
			splitContainer1.Panel2.ResumeLayout(false);
			splitContainer1.Panel2.PerformLayout();
			((System.ComponentModel.ISupportInitialize) splitContainer1).EndInit();
			splitContainer1.ResumeLayout(false);
			this.ResumeLayout(false);
			this.PerformLayout();
		}

		#endregion
		private ToolStrip toolStrip1;
		private ToolStripButton resetButton;
		private SplitContainer splitContainer1;
		private TextBox textBox1;
		private ToolStripButton goButton;
		private RichBox richTextBox1;
	}
}
