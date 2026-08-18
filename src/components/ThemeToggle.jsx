"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { getSoundEngine } from "../lib/sounds";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sfx = getSoundEngine();

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("deshi_spyfall_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored === "dark" || (!stored && prefersDark);
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    sfx.play("click");
    const nextDark = !isDark;
    setIsDark(nextDark);
    
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("deshi_spyfall_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("deshi_spyfall_theme", "light");
    }
  };

  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:text-deshi-blue dark:hover:text-amber-300 border border-slate-200 dark:border-slate-700 transition-all duration-200 shadow-sm flex items-center justify-center shrink-0 cursor-pointer"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
