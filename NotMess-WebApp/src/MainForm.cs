using System.Net.NetworkInformation;
using Microsoft.Win32;

namespace NotMess;

public partial class MainForm : Form
{
    private readonly WebBrowser browser;
    private readonly Label offlineLabel;

    public MainForm()
    {
        Text = "NotMess";
        Size = new Size(1200, 800);
        MinimumSize = new Size(400, 300);
        StartPosition = FormStartPosition.CenterScreen;
        var icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath);
        if (icon != null) Icon = icon;

        browser = new WebBrowser
        {
            Dock = DockStyle.Fill,
            ScriptErrorsSuppressed = true,
            AllowWebBrowserDrop = false,
            IsWebBrowserContextMenuEnabled = false,
            WebBrowserShortcutsEnabled = true,
        };
        browser.Navigating += (_, e) =>
        {
            if (e.Url?.ToString().StartsWith("https://web.notmess.ru") == false &&
                e.Url?.ToString() != "about:blank")
            {
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                {
                    FileName = e.Url!.ToString(),
                    UseShellExecute = true
                });
                e.Cancel = true;
            }
        };
        browser.DocumentCompleted += (_, _) =>
        {
            if (browser.Url?.ToString().StartsWith("https://web.notmess.ru") == true)
            {
                if (offlineLabel.Visible) offlineLabel.Visible = false;
                if (!browser.Visible) browser.Visible = true;
            }
        };

        offlineLabel = new Label
        {
            Text = "Нет подключения к сети",
            Dock = DockStyle.Fill,
            TextAlign = ContentAlignment.MiddleCenter,
            Font = new Font("Segoe UI", 18),
            ForeColor = Color.Gray,
            BackColor = Color.FromArgb(13, 17, 23),
            Visible = false
        };

        Controls.Add(browser);
        Controls.Add(offlineLabel);

        Load += async (_, _) => await CheckAndLoad();
        AppSystemEvents.ApplicationResume += async (_, _) => await CheckAndLoad();
    }

    private async Task CheckAndLoad()
    {
        if (NetworkInterface.GetIsNetworkAvailable())
        {
            offlineLabel.Visible = false;
            browser.Visible = true;
            if (browser.Url == null || browser.Url.ToString() == "about:blank")
                browser.Navigate("https://web.notmess.ru");
        }
        else
        {
            browser.Visible = false;
            offlineLabel.Visible = true;
            await Task.Delay(3000);
            _ = CheckAndLoad();
        }
    }

    protected override void WndProc(ref Message m)
    {
        if (m.Msg == 0x1A) // WM_SETTINGCHANGE
            _ = CheckAndLoad();
        base.WndProc(ref m);
    }
}

internal static class AppSystemEvents
{
    public static event EventHandler? ApplicationResume;

    public static void Initialize()
    {
        Microsoft.Win32.SystemEvents.PowerModeChanged += (_, e) =>
        {
            if (e.Mode == PowerModes.Resume)
                ApplicationResume?.Invoke(null, EventArgs.Empty);
        };
    }
}
