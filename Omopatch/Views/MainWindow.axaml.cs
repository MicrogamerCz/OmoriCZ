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

#if WINBUILD
        return libraryPath + "\\steamapps\\common\\OMORI";
#else
        return libraryPath + "/steamapps/common/OMORI";
#endif
    }
    async void BeginSetup(object? sender, RoutedEventArgs e)
    {
        LoadValue = 1;
        Message = "Příprava";
        
        string installDir = GetInstallDir(), saveFileDir, modsDir;
        bool oneloaderInstalled;
        
#if WINBUILD
        saveFileDir = installDir + "\\www\\save";
        modsDir = installDir + "\\www\\mods\\omoricz";
        oneloaderInstalled = Directory.Exists(installDir + "\\www\\mods\\oneloader"); // because obviously Windows :/
#else
        saveFileDir = installDir + "/www/save";
        modsDir = installDir + "/www/mods/omoricz";
        oneloaderInstalled = Directory.Exists(installDir + "/www/mods/oneloader");
#endif

        if (!oneloaderInstalled) {
            string backupLocation = saveFileDir + ".zip";
            if (File.Exists(backupLocation))
                File.Delete(backupLocation);

            await Task.Run(() => ZipFile.CreateFromDirectory(saveFileDir, backupLocation));

            Message = "Získávání nejnovější verze OneLoaderu";
            string? oneloaderUrl = await GetLatestReleaseZipAssetUrl("rphsoftware", "OneLoader");
            if (string.IsNullOrEmpty(oneloaderUrl)) {
                Environment.Exit(1);
                return;
            }

            Message = "Stahování nejnovější verze OneLoaderu";
            using Stream oneloaderStream = await client.GetStreamAsync(oneloaderUrl);
            
            Message = "Instalace nejnovější verze OneLoaderu";
            await Task.Run(() => ZipFile.ExtractToDirectory(oneloaderStream, installDir, null, true));

            oneloaderStream.Close();
        }
        
        Message = "Získávání překladu";
        string? translationUrl = await GetLatestReleaseZipAssetUrl("MicrogamerCz", "OmoriCz");
        if (string.IsNullOrEmpty(translationUrl)) {
            Environment.Exit(1);
            return;
        }
        
        Message = "Stahování překladu";
        
        wc.DownloadProgressChanged += (_, e) => LoadValue = e.ProgressPercentage / 10 + 1;
        byte[] translationZip = await wc.DownloadDataTaskAsync(translationUrl);
        
        Message = "Instalace překladu";
        using Stream stream = new MemoryStream(translationZip);
        
        if (!Directory.Exists(modsDir)) Directory.CreateDirectory(modsDir);
        await Task.Run(() => ZipFile.ExtractToDirectory(stream, modsDir, overwriteFiles: true));

        Message = " ";
        WinOpacity = 1;
        stream.Close();

        await Task.Delay(3000);
        Environment.Exit(0);
    }
}