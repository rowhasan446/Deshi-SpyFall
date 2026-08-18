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
      className="fixed bottom-14 right-4 z-50 p-2.5 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-deshi-blue hover:border-blue-200 shadow-md transition-all"
      title={muted ? "Unmute Sounds" : "Mute Sounds"}
      aria-label={muted ? "Unmute Sounds" : "Mute Sounds"}
    >
      {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  );
}
