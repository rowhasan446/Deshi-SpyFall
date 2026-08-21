"use client";

import { useState } from "react";
import { X, HelpCircle, Languages, BookOpen } from "lucide-react";
import { getSoundEngine } from "../lib/sounds";

export default function InstructionsModal({ isOpen, onClose }) {
  const [lang, setLang] = useState("bn");
  const sfx = getSoundEngine();

  if (!isOpen) return null;

  const toggleLang = (newLang) => {
    sfx.play("click");
    setLang(newLang);
  };

  const enSteps = [
    {
      num: "01",
      title: "Reveal Secret Roles",
      body: "Hold down on your phone screen to see your secret role. Everyone except the Spy receives the secret Bangladeshi Location (e.g. Mirpur Stadium, Biye Bari) + a specific role. The Spy only sees \"Tumi Chor! 🕵️\".",
      numberColor: "text-deshi-blue dark:text-blue-400",
      cardStyle: "bg-blue-50/80 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/50",
    },
    {
      num: "02",
      title: "Question Round",
      body: "Ask each other subtle questions about the location without giving it away completely. The Spy must bluff and pretend to know where they are!",
      numberColor: "text-deshi-green dark:text-emerald-400",
      cardStyle: "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/50",
    },
    {
      num: "03",
      title: "Voting & Victory",
      body: "Call a vote when suspicious! If the group correctly votes out the Spy, the Spy gets 1 last chance to guess the location. If correct, the Spy steals the win!",
      numberColor: "text-deshi-red dark:text-red-400",
      cardStyle: "bg-red-50/80 dark:bg-red-950/40 border-red-200/60 dark:border-red-900/50",
    },
  ];

  const bnSteps = [
    {
      num: "০১",
      title: "কার্ড দেখা (Role Reveal)",
      body: "গেম শুরু হলে সবাই নিজের ফোনের স্ক্রিনে চেপে ধরে গোপন রোল দেখবে। চোর ছাড়া বাকি সবাই একই দেশী লোকেশন এবং একটি নির্দিষ্ট রোল দেখতে পাবে। চোর শুধু দেখবে \"তুমি চোর! 🕵️\"।",
      numberColor: "text-deshi-blue dark:text-blue-400",
      cardStyle: "bg-blue-50/80 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/50",
    },
    {
      num: "০২",
      title: "প্রশ্ন ও আলোচনা",
      body: "একজন অন্যজনকে লোকেশন সম্পর্কিত চতুর প্রশ্ন জিজ্ঞেস করবে। চোর চেষ্টা করবে লোকেশন সরাসরি না জেনেও বানানো উত্তর দিয়ে মিশে থাকতে!",
      numberColor: "text-deshi-green dark:text-emerald-400",
      cardStyle: "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/50",
    },
    {
      num: "০৩",
      title: "ভোট ও জয়ী হওয়া",
      body: "যে কেউ \"Vote Call\" করতে পারে। সবাই ভোট দিয়ে চোরকে ধরলে চোর শেষ সুযোগে সঠিক লোকেশন বলতে পারলে চোর জিতে যাবে! না পারলে সাধারণ খেলোয়াড়রা জিতবে।",
      numberColor: "text-deshi-red dark:text-red-400",
      cardStyle: "bg-red-50/80 dark:bg-red-950/40 border-red-200/60 dark:border-red-900/50",
    },
  ];

  const steps = lang === "bn" ? bnSteps : enSteps;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden flex flex-col max-h-[88vh] relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl"
      >
        {/* Top accent */}
        <div
          className="h-1 w-full shrink-0"
          style={{ background: "linear-gradient(90deg, #006A4E, #0F4C81, #DC2626, #F59E0B)" }}
        />

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60"
            >
              <BookOpen className="w-4 h-4 text-deshi-blue dark:text-blue-400" />
            </div>
            <div>
              <h2
                className="text-base font-black text-slate-900 dark:text-white leading-tight"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {lang === "bn" ? "কীভাবে খেলবেন?" : "How to Play"}
              </h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Deshi Spyfall Rules</p>
            </div>
          </div>
          <button
            onClick={() => { sfx.play("back"); onClose(); }}
            className="p-2 rounded-xl transition-all cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Toggle */}
        <div
          className="flex items-center gap-3 mx-6 mt-4 p-1.5 rounded-2xl shrink-0 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-1.5 pl-1">
            <Languages className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest" style={{ fontFamily: "'Sora', sans-serif" }}>
              Language
            </span>
          </div>
          <div className="flex gap-1 ml-auto">
            <button
              onClick={() => toggleLang("bn")}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              style={
                lang === "bn"
                  ? {
                      background: "linear-gradient(135deg, #006A4E, #059669)",
                      color: "#fff",
                      boxShadow: "0 2px 8px rgba(0,106,78,0.25)",
                      fontFamily: "'Sora', sans-serif",
                    }
                  : {
                      color: "#64748b",
                      fontFamily: "'Sora', sans-serif",
                    }
              }
            >
              🇧🇩 বাংলা
            </button>
            <button
              onClick={() => toggleLang("en")}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              style={
                lang === "en"
                  ? {
                      background: "linear-gradient(135deg, #0F4C81, #2563EB)",
                      color: "#fff",
                      boxShadow: "0 2px 8px rgba(15,76,129,0.25)",
                      fontFamily: "'Sora', sans-serif",
                    }
                  : {
                      color: "#64748b",
                      fontFamily: "'Sora', sans-serif",
                    }
              }
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Objective Banner */}
        <div className="px-6 pt-4 shrink-0">
          <div
            className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/50"
          >
            <p
              className="font-black text-sm text-emerald-950 dark:text-emerald-200 mb-0.5"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              🎯 {lang === "bn" ? "গেমের মূল লক্ষ্য:" : "Main Objective:"}
            </p>
            <p className="text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed font-medium">
              {lang === "bn"
                ? "সময় শেষ হওয়ার আগেই আপনার বন্ধুদের মধ্য থেকে চোর (Spy) কে চিনে বের করুন! আর আপনি চোর হলে গোপনে লোকেশন আন্দাজ করুন।"
                : "Find the secret Spy (Chor) among your group before time runs out! If you are the Spy, blend in and guess the location."}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className={`flex gap-4 p-4 rounded-2xl border ${step.cardStyle}`}
            >
              <div
                className={`text-2xl font-black shrink-0 leading-none mt-0.5 ${step.numberColor} opacity-70`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {step.num}
              </div>
              <div>
                <p
                  className="font-black text-sm text-slate-900 dark:text-white mb-1"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {step.title}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="px-6 pb-6 shrink-0">
          <button
            onClick={() => { sfx.play("click"); onClose(); }}
            className="deshi-btn-blue shimmer-sweep w-full"
          >
            {lang === "bn" ? "বুঝতে পেরেছি, খেলা শুরু করি! 🚀" : "Got it, let's play! 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}
