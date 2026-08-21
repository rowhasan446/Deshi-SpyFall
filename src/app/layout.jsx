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
      <body className="antialiased min-h-[100dvh] flex flex-col bg-slate-50 dark:bg-[#080D16] text-slate-900 dark:text-slate-100 relative overflow-x-hidden transition-colors duration-300">

        {/* Rickshaw Art Background */}
        <div className="bg-rickshaw-art" />

        {/* Subtle radial vignette overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(15,76,129,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Bangladeshi Flag Accent Stripe */}
        <div className="relative z-10 w-full flex shrink-0" style={{ height: "2px" }}>
          <div className="flex-1" style={{ background: "linear-gradient(90deg, #005a41, #006A4E)" }} />
          <div className="flex-1" style={{ background: "linear-gradient(90deg, #DC2626, #b91c1c)" }} />
        </div>

        {/* ── Sticky Header ── */}
        <header className="relative z-20 w-full shrink-0 transition-colors duration-300">
          <div className="deshi-header-glass w-full px-5 py-3 flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{
                  background: "linear-gradient(135deg, #0F4C81 0%, #1a6bb5 100%)",
                  boxShadow: "0 2px 10px rgba(15,76,129,0.3)",
                }}
              >
                🕵️‍♂️
              </div>
              <div className="flex flex-col leading-none">
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-base font-black tracking-tight text-slate-900 dark:text-white"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    Deshi
                  </span>
                  <span
                    className="text-base font-black"
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      background: "linear-gradient(135deg, #DC2626, #ef4444)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    Spyfall
                  </span>
                </div>
                <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-px">
                  Party Game
                </span>
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div
                className="deshi-badge-blue"
                style={{ fontSize: "0.65rem" }}
              >
                🇧🇩 Deshi
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 flex-1 flex flex-col justify-center items-center p-4 pb-[60vh] sm:pb-12 max-w-md mx-auto w-full overflow-y-auto">
          {children}
        </main>

        {/* ── Sticky Footer ── */}
        <footer className="deshi-footer-glass sticky bottom-0 z-30 w-full py-2.5 px-4 shrink-0 transition-colors duration-300">
          <p className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
            Crafted with ❤️ by{" "}
            <span
              className="font-extrabold"
              style={{
                background: "linear-gradient(90deg, #0F4C81, #2563EB)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Rownak
            </span>
          </p>
        </footer>
      </body>
    </html>
  );
}
