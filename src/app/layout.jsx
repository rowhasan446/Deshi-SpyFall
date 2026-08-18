import "./globals.css";
import ThemeToggle from "../components/ThemeToggle";

export const metadata = {
  title: "Deshi Spyfall — Party Game",
  description: "Mobile-first multiplayer party game with Bangladeshi locations. Find the Spy!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Deshi Spyfall",
  },
};

export const viewport = {
  themeColor: "#006A4E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('deshi_spyfall_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-[100dvh] flex flex-col bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 relative overflow-x-hidden transition-colors duration-300">

        {/* Rickshaw Art Background Collage */}
        <div className="bg-rickshaw-art" />

        {/* Top accent stripe — Bangladeshi flag colours */}
        <div className="relative z-10 w-full flex shrink-0">
          <div className="h-1.5 bg-deshi-green flex-1" style={{ backgroundColor: '#006A4E' }} />
          <div className="h-1.5 bg-deshi-red flex-1" style={{ backgroundColor: '#DC2626' }} />
        </div>

        {/* Sticky page header */}
        <header className="relative z-20 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800 px-5 py-3 flex items-center justify-between shadow-sm transition-colors duration-300 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🕵️‍♂️</span>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">Deshi </span>
              <span className="text-base font-black text-deshi-red">Spyfall</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="text-[11px] font-bold text-deshi-blue dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 px-2.5 py-1 rounded-full">
              Party Game
            </span>
          </div>
        </header>

        {/* Main content with generous mobile padding for virtual keyboard scroll */}
        <main className="relative z-10 flex-1 flex flex-col justify-center items-center p-4 pb-[60vh] sm:pb-12 max-w-md mx-auto w-full overflow-y-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-10 w-full text-center py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm shrink-0">
          Developed by{" "}
          <span className="font-extrabold text-deshi-blue dark:text-blue-400">Rownak</span>
        </footer>
      </body>
    </html>
  );
}
