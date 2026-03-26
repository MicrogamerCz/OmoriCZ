using System;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Interactivity;
using Gameloop.Vdf;
using Gameloop.Vdf.Linq;

namespace Omopatch.Views;

public partial class MainWindow : Window
{
    const string omoriSteamId = "1150690";
#if LINUXBUILD
    string SteamPath { get; } = Environment.GetEnvironmentVariable("HOME") + "/.local/share/Steam/steamapps/";
#elif WINBUILD
    string SteamPath { get; } = "C:\\Program Files (x86)\\Steam\\steamapps\\";
#else
    string SteamPath { get; } = "~/Library/Application Support/Steam/steamapps/";
#endif

    #region Properties
    static readonly StyledProperty<int> LoadValueProperty = AvaloniaProperty.Register<MainWindow, int>(nameof(LoadValue));
    static readonly StyledProperty<double> WinOpacityProperty = AvaloniaProperty.Register<MainWindow, double>(nameof(WinOpacity));
    static readonly StyledProperty<string> MessageProperty = AvaloniaProperty.Register<MainWindow, string>(nameof(Message));
    static readonly StyledProperty<bool> HangmanProperty = AvaloniaProperty.Register<MainWindow, bool>(nameof(Hangman));


    public int LoadValue {
        get => GetValue(LoadValueProperty);
        set => SetValue(LoadValueProperty, value);
    }
    public double WinOpacity {
        get => GetValue(WinOpacityProperty);
        set => SetValue(WinOpacityProperty, value);
    }
    public string Message {
        get => GetValue(MessageProperty);
        set => SetValue(MessageProperty, value);
    }
    public bool Hangman {
        get => GetValue(HangmanProperty);
        set => SetValue(HangmanProperty, value);
    }
    #endregion

    readonly HttpClient client = new();

#pragma warning disable SYSLIB0014
    readonly WebClient wc = new();
#pragma warning restore SYSLIB0014

    public MainWindow() =>
        InitializeComponent();

    async Task<string?> GetLatestReleaseZipAssetUrl(string owner, string repo) {
        using HttpRequestMessage request = new (HttpMethod.Get, $"https://api.github.com/repos/{owner}/{repo}/releases/latest");
        request.Headers.Add("User-Agent", "Omopatch");

        using HttpResponseMessage response = await client.SendAsync(request);

        if (!response.IsSuccessStatusCode)
            return null;

        await using Stream contentStream = await response.Content.ReadAsStreamAsync();

        using JsonDocument json = await JsonDocument.ParseAsync(contentStream);
        string? assetUrl = null;

        foreach (JsonElement asset in json.RootElement.GetProperty("assets").EnumerateArray()) {
            string? au = asset.GetProperty("browser_download_url").GetString();
            if (!(au?.EndsWith(".zip") ?? true)) continue;

            assetUrl = au;
            break;
        }

        contentStream.Close();

        return assetUrl;
    }

    string GetInstallDir()
    {
        VObject libraries = (VObject)VdfConvert.Deserialize(File.ReadAllText(SteamPath + "libraryfolders.vdf")).Value;

        string libraryPath = "";
        foreach (VObject library in from l in libraries.Properties() select l.Value as VObject)
        {
            libraryPath = library["path"]!.Value<string>();

            VObject apps = (VObject)library["apps"]!;
            if (apps.ContainsKey(omoriSteamId)) break;
        }

        return Path.Combine(libraryPath, "steamapps", "common", "OMORI");
    }
    async void BeginSetup(object? sender, RoutedEventArgs e)
    {
        LoadValue = 1;
        Message = "Příprava";

        string installDir = GetInstallDir();
        string saveFileDir = Path.Combine(installDir, "www", "save");
        string modDir = Path.Combine(installDir, "www", "mods", "omoricz");
        bool oneloaderInstalled = Directory.Exists(Path.Combine(installDir, "www", "mods", "oneloader"));

        string backupLocation = saveFileDir + ".zip";
        if (File.Exists(backupLocation))
            File.Delete(backupLocation);
        await Task.Run(() => ZipFile.CreateFromDirectory(saveFileDir, backupLocation));

        if (!oneloaderInstalled) {
            Message = "Získávání nejnovější verze OneLoaderu";
            string? oneloaderUrl = await GetLatestReleaseZipAssetUrl("rphsoftware", "OneLoader");
            if (string.IsNullOrEmpty(oneloaderUrl)) {
                Message = "[DEBUG] URL pro stažení Oneloaderu neexistuje";
                // Environment.Exit(1); // TODO: notify about error
                return;
            }

            Message = "Stahování nejnovější verze OneLoaderu";
            Stream oneloaderStream;
            try {
                oneloaderStream = await client.GetStreamAsync(oneloaderUrl);
            }
            catch (Exception ex) {
                Message = $"[DEBUG] {ex.GetType().Name}: {ex.Message}";
                return;
            }

            Message = "Instalace nejnovější verze OneLoaderu";
            try {
                await Task.Run(() => ZipFile.ExtractToDirectory(oneloaderStream, installDir, null, true));
            }
            catch (Exception ex) {
                Message = $"[DEBUG] {ex.GetType().Name}: {ex.Message}";
                oneloaderStream.Close();
                return;
            }

            oneloaderStream.Close();
        }

        Message = "Získávání překladu";
        string? translationUrl = await GetLatestReleaseZipAssetUrl("MicrogamerCz", "OmoriCz");
        if (string.IsNullOrEmpty(translationUrl)) {
            Message = "[DEBUG] URL pro stažení Překladu neexistuje";
            // Environment.Exit(1);
            return;
        }

        Message = "Stahování překladu";

        wc.DownloadProgressChanged += (_, e) => LoadValue = e.ProgressPercentage / 10 + 1;
        byte[] translationZip;
        try {
            translationZip = await wc.DownloadDataTaskAsync(translationUrl);
        }
        catch (Exception ex) {
            Message = $"[DEBUG] {ex.GetType().Name}: {ex.Message}";
            return;
        }

        Message = "Instalace překladu";
        using Stream stream = new MemoryStream(translationZip);

        if (Directory.Exists(modDir)) Directory.Delete(modDir, true);
        Directory.CreateDirectory(modDir);
        await Task.Run(() => ZipFile.ExtractToDirectory(stream, modDir, overwriteFiles: true));

        Message = " ";
        WinOpacity = 1;
        stream.Close();

        await Task.Delay(3000);
        Environment.Exit(0);
    }
}
