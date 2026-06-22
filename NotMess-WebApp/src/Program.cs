namespace NotMess;

static class Program
{
    [STAThread]
    static void Main()
    {
        ApplicationConfiguration.Initialize();
        AppSystemEvents.Initialize();
        Application.Run(new MainForm());
    }    
}