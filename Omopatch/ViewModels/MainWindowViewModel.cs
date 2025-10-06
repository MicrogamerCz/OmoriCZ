using System;
using System.IO;

namespace Omopatch.ViewModels;

public partial class MainWindowViewModel : ViewModelBase
{
#if LINUXBUILD
    public string DefaultInstallPath { get; } = Environment.GetEnvironmentVariable("HOME") + "/.local/share/Steam/steamapps/common/OMORI";
#elif WINBUILD
    public string DefaultInstallPath { get; } = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\OMORI";
#else
    public string DefaultInstallPath { get; } = "~/Library/Application Support/Steam/steamapps/common";
#endif
}