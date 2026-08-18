"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { getSoundEngine } from "../lib/sounds";

export default function SoundEffects() {
  const [muted, setMuted] = useState(false);
  const engine = getSoundEngine();

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    engine.setMuted(next);
    if (!next) engine.play("click");
  };

  return (
    <button
      onClick={toggle}
      className="fixed bottom-14 right-4 z-50 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-500 dark:text-slate-300 hover:text-deshi-blue dark:hover:text-blue-400 shadow-lg transition-all cursor-pointer"
      title={muted ? "Unmute Sounds" : "Mute Sounds"}
      aria-label={muted ? "Unmute Sounds" : "Mute Sounds"}
    >
      {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  );
}
