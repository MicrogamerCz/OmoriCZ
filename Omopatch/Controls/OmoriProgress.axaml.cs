using System;
using System.Threading.Tasks;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Media.Imaging;
using Avalonia.Platform;

namespace Omopatch.Controls;

public partial class OmoriProgress : UserControl
{
    public static readonly StyledProperty<int> ValueProperty =
        AvaloniaProperty.Register<OmoriProgress, int>(
            nameof(Value),
            defaultValue: 1);
    public static readonly StyledProperty<Bitmap> ImageProperty =
        AvaloniaProperty.Register<OmoriProgress, Bitmap>(
            nameof(Image),
            defaultValue: new Bitmap(AssetLoader.Open(new Uri("avares://Omopatch/Assets/progress/a1.png"))));
    
    char variant = 'a';

    public int Value {
        get => GetValue(ValueProperty);
        set
        {
            if (value < 1 || value > 10) return;
            SetValue(ValueProperty, value);
            // Image = new Bitmap(AssetLoader.Open(new Uri($"avares://Omopatch/Assets/progress/{variant}{value}.png")));
        }
    }
    public Bitmap Image {
        get => GetValue(ImageProperty);
        set => SetValue(ImageProperty, value);
    }
    
    public OmoriProgress() {
        InitializeComponent();
        RunVariants();
    }

    async void RunVariants() {
        while (true)
        {
            await Task.Delay(200);
            
            if (Value < 1 || Value > 10) continue;
            
            variant = variant == 'a' ? 'b' : 'a';
            Image = new Bitmap(AssetLoader.Open(new Uri($"avares://Omopatch/Assets/progress/{variant}{Value}.png")));
        }
    }
}