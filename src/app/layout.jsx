import "./globals.css";

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
  themeColor: "#0F4C81",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900 relative overflow-x-hidden">

        {/* Rickshaw Art Background Collage */}
        <div className="bg-rickshaw-art" />

        {/* Top accent stripe — Bangladeshi flag colours */}
        <div className="relative z-10 w-full flex">
          <div className="h-1.5 bg-deshi-green flex-1" style={{ backgroundColor: '#006A4E' }} />
          <div className="h-1.5 bg-deshi-red flex-1" style={{ backgroundColor: '#DC2626' }} />
        </div>

        {/* Sticky page header */}
        <header className="relative z-10 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/70 px-5 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🕵️‍♂️</span>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900">Deshi </span>
              <span className="text-base font-black text-deshi-red">Spyfall</span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-deshi-blue bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
            Party Game
          </span>
        </header>

        {/* Main content */}
        <main className="relative z-10 flex-1 flex flex-col justify-center items-center p-4 max-w-md mx-auto w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-10 w-full text-center py-3 text-xs font-semibold text-slate-400 border-t border-slate-200/60 bg-white/60 backdrop-blur-sm">
          Developed by{" "}
          <span className="font-extrabold text-deshi-blue">Rownak</span>
        </footer>
      </body>
    </html>
  );
}
