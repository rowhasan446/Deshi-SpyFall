"use client";

import { useState } from "react";
import { X, HelpCircle, Languages, Globe } from "lucide-react";
import { getSoundEngine } from "../lib/sounds";

export default function InstructionsModal({ isOpen, onClose }) {
  const [lang, setLang] = useState("bn"); // 'bn' | 'en'
  const sfx = getSoundEngine();

  if (!isOpen) return null;

  const toggleLang = (newLang) => {
    sfx.play("click");
    setLang(newLang);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col relative text-slate-900 dark:text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-deshi-blue dark:text-blue-400" />
            <h2 className="text-lg font-black tracking-tight">
              {lang === "bn" ? "কীভাবে খেলবেন? (নিয়মাবলী)" : "How to Play (Game Rules)"}
            </h2>
          </div>
          <button
            onClick={() => { sfx.play("back"); onClose(); }}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Translation Toggle Bar */}
        <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl shrink-0 border border-slate-200/80 dark:border-slate-700">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-2 flex items-center gap-1.5">
            <Languages className="w-4 h-4 text-deshi-blue dark:text-blue-400" /> Language / ভাষা:
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => toggleLang("bn")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                lang === "bn"
                  ? "bg-deshi-green text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700"
              }`}
            >
              🇧🇩 বাংলা
            </button>
            <button
              onClick={() => toggleLang("en")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-deshi-blue text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700"
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Rules Content */}
        <div className="overflow-y-auto space-y-4 pr-1 text-xs leading-relaxed flex-1">
          {lang === "bn" ? (
            <>
              {/* Bangla Content */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-3.5 rounded-2xl text-emerald-900 dark:text-emerald-200 space-y-1">
                <p className="font-extrabold text-sm">🎯 গেমের মূল লক্ষ্য:</p>
                <p>সময় শেষ হওয়ার আগেই আপনার বন্ধুদের মধ্য থেকে **চোর (Spy)** কে চিনে বের করুন! আর আপনি চোর হলে গোপনে লোকেশন আন্দাজ করুন।</p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <p className="font-extrabold text-slate-900 dark:text-white text-xs">১. কার্ড দেখা (Role Reveal):</p>
                  <p className="text-slate-600 dark:text-slate-300">
                    গেম শুরু হলে সবাই নিজের ফোনের স্ক্রিনে চেপে ধরে গোপন রোল দেখবে। চোর ছাড়া বাকি সবাই একই **দেশী লোকেশন** (যেমন: মিরপুর স্টেডিয়াম, বিয়ে বাড়ি, ইত্যাদি) এবং একটি নির্দিষ্ট রোল দেখতে পাবে। চোর শুধু দেখবে **"তুমি চোর! 🕵️"**।
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <p className="font-extrabold text-slate-900 dark:text-white text-xs">২. প্রশ্ন ও আলোচনা (Asking Questions):</p>
                  <p className="text-slate-600 dark:text-slate-300">
                    একজন অন্যজনকে লোকেশন সম্পর্কিত চতুর প্রশ্ন জিজ্ঞেস করবে। চোর চেষ্টা করবে লোকেশন সরাসরি না জেনেও বানানো উত্তর দিয়ে মিশে থাকতে!
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <p className="font-extrabold text-slate-900 dark:text-white text-xs">৩. ভোট ও জয়ী হওয়া (Voting & Winning):</p>
                  <p className="text-slate-600 dark:text-slate-300">
                    যে কাউ "Vote Call" করতে পারে। সবাই ভোট দিয়ে চোরকে ধরলে চোর শেষ সুযোগে সঠিক লোকেশন বলতে পারলে **চোর জিতে যাবে**! না বলতে পারলে **সাধারণ খেলোয়াড়রা জিতবে**।
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* English Content */}
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 p-3.5 rounded-2xl text-blue-900 dark:text-blue-200 space-y-1">
                <p className="font-extrabold text-sm">🎯 Main Objective:</p>
                <p>Find the secret **Spy (Chor)** among your group before time runs out! If you are the Spy, blend in and guess the location.</p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <p className="font-extrabold text-slate-900 dark:text-white text-xs">1. Reveal Secret Roles:</p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Hold down on your phone screen to see your secret role. Everyone except the Spy receives the secret **Bangladeshi Location** (e.g. Mirpur Stadium, Biye Bari) + a specific role. The Spy only sees **"Tumi Chor! 🕵️"**.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <p className="font-extrabold text-slate-900 dark:text-white text-xs">2. Question Round:</p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Ask each other subtle questions about the location without giving it away completely. The Spy must bluff and pretend to know where they are!
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <p className="font-extrabold text-slate-900 dark:text-white text-xs">3. Voting & Victory:</p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Call a vote when suspicious! If the group correctly votes out the Spy, the Spy gets 1 last chance to guess the location. If correct, the Spy steals the win!
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <button
          onClick={() => { sfx.play("click"); onClose(); }}
          className="deshi-btn-blue w-full py-3.5 text-sm shrink-0"
        >
          {lang === "bn" ? "বুঝতে পেরেছি, খেলা শুরু করি! 🚀" : "Got it, let's play! 🚀"}
        </button>

      </div>
    </div>
  );
}
