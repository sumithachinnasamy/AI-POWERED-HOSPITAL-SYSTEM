import React from "react";
import { Sparkles, Brain, Clock, ShieldCheck, Heart, User, ArrowRight, ShieldAlert, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onNavigate: (view: "login" | "register") => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans relative overflow-hidden">
      
      {/* Background Photo with gradient overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/src/assets/images/clinic_background_1783014527274.jpg"
          alt="Clinic Background"
          className="w-full h-full object-cover opacity-[0.14]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/40 via-slate-50/80 to-slate-50" />
      </div>

      {/* Decorative premium ambient glow blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-200/10 rounded-full blur-[120px] ambient-glow pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45%] h-[45%] bg-indigo-200/10 rounded-full blur-[130px] ambient-glow pointer-events-none" />

      {/* Top Professional Glass Header */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 px-8 py-4.5 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/10">
              <Heart className="w-5 h-5 fill-white/10" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight block font-display">AURA CLINIC</span>
              <span className="text-[9px] text-teal-600 font-bold uppercase tracking-widest block -mt-1 font-mono">Next-Gen Medical Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => onNavigate("login")}
              className="text-xs font-bold text-slate-600 hover:text-teal-600 transition-all px-3 py-1.5 uppercase tracking-wider cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate("register")}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg shadow-teal-600/15 hover:shadow-teal-600/25 transition-all cursor-pointer"
            >
              Register Portal
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Presentation Banner */}
      <section className="max-w-7xl mx-auto px-8 pt-20 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        <div className="lg:col-span-7 space-y-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-150 text-teal-700 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-teal-600" />
            Gemini Clinical Triaging Protocol Enabled
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1] font-display">
            AI-Driven Clinical <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600">Triage & Smart Scheduling</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-sans font-normal">
            Aura Clinic seamlessly integrates Gemini clinical NLP modeling to analyze patient symptoms, suggest appropriate medical departments, predict doctor appointment waiting times, and handle interactive conversational bookings.
          </p>

          <div className="flex flex-wrap gap-4 pt-3">
            <button
              onClick={() => onNavigate("register")}
              className="px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Get Started Instantly
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("login")}
              className="px-7 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-bold rounded-xl text-xs uppercase tracking-wider hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Physician & Admin Access
            </button>
          </div>

          <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-200/80 max-w-lg">
            <div>
              <span className="text-2xl font-extrabold text-teal-600 font-display">100%</span>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">HIPAA Compliant</p>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-teal-600 font-display">&lt; 10s</span>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">Instant Evaluation</p>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-teal-600 font-display">Active</span>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">Live Practitioner Rosters</p>
            </div>
          </div>
        </div>

        {/* Hero Visual Feature Panel */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-indigo-500 opacity-25 blur-2xl ambient-glow" />
          <div className="bg-white/95 rounded-2xl border border-slate-200/60 shadow-2xl p-7 relative space-y-6 premium-card">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-teal-600" />
                <span className="font-extrabold text-[11px] text-slate-900 tracking-widest uppercase font-mono">Dynamic Triage Sandbox</span>
              </div>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-4.5 border border-slate-100 space-y-3">
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-extrabold uppercase tracking-wider font-mono">
                <User className="w-3.5 h-3.5 text-slate-400" /> Patient Complaint Input
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed italic">
                "I have high blood pressure, occasional blurred vision, and chest tightness since yesterday evening."
              </p>
            </div>

            <div className="bg-teal-50/50 rounded-xl p-4.5 border border-teal-100 space-y-3">
              <div className="flex items-center gap-1.5 text-[9px] text-teal-600 font-extrabold uppercase tracking-wider font-mono">
                <Sparkles className="w-3.5 h-3.5" /> AI Recommended Response
              </div>
              <div className="space-y-2 text-xs">
                <p className="font-bold text-teal-950">
                  ⚡ Department: <span className="font-extrabold text-teal-600 font-display">Cardiology Specialty</span>
                </p>
                <p className="text-teal-900 leading-relaxed font-medium">
                  Recommendation: Highly recommended to evaluate cardiovascular integrity. Dr. Clara Williams specializes in arterial pressures and coronary care.
                </p>
                <div className="pt-2 flex justify-between text-[10px] font-bold text-teal-800 uppercase tracking-widest font-mono border-t border-teal-100/50">
                  <span>Smart Slot: Tomorrow 15:00</span>
                  <span>Wait Est: 12 Min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hospital Features Highlight */}
      <section className="bg-white border-t border-b border-slate-100 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8 space-y-16">
          <div className="text-center space-y-3.5 max-w-xl mx-auto">
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest font-mono block">Intelligent Architecture</span>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight font-display">
              Clinical Triage Reimagined
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">
              Engineered with modern language modeling algorithms to minimize patient scheduling friction, automate front-office triaging, and optimize physician calendars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* AI Triage */}
            <div className="bg-slate-50/50 p-7 rounded-2xl border border-slate-100 space-y-4 premium-card">
              <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shadow-sm">
                <Brain className="w-5.5 h-5.5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide font-display">Gemini Symptom Triage</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Translate descriptive patient symptoms into concrete clinical departments and matches practitioner specializations with maximum precision.
              </p>
            </div>

            {/* Smart Slotting */}
            <div className="bg-slate-50/50 p-7 rounded-2xl border border-slate-100 space-y-4 premium-card">
              <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shadow-sm">
                <Clock className="w-5.5 h-5.5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide font-display">Smart Booking Suggestions</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Automatically suggest optimal consult windows based on calendar load patterns, department densities, and user preference.
              </p>
            </div>

            {/* Wait Predictions */}
            <div className="bg-slate-50/50 p-7 rounded-2xl border border-slate-100 space-y-4 premium-card">
              <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shadow-sm">
                <Clock className="w-5.5 h-5.5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide font-display">AI Queue Predictor</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Accurately estimate clinic physical wait times by cross-referencing active rosters, current check-in densities, and specialty checkup speed.
              </p>
            </div>

            {/* Encryption & Security */}
            <div className="bg-slate-50/50 p-7 rounded-2xl border border-slate-100 space-y-4 premium-card">
              <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5.5 h-5.5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide font-display">RBAC Data Protocols</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Roles configured strictly for Patient privacy, Practitioner roster updates, and Administrator notification service telemetry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Disclaimer Footer Warning */}
      <footer className="mt-auto bg-slate-950 text-slate-400 text-xs py-16 px-8 border-t border-slate-900 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-white/10" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight uppercase font-display">Aura Clinic</span>
            </div>
            <p className="text-[11px] max-w-md text-left md:text-right font-sans">
              Secured Clinical AI scheduling. Intended strictly as booking guidance and triaging assistance.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-[10px] text-slate-400 space-y-2 font-mono">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold uppercase tracking-widest text-[9px]">
              <ShieldAlert className="w-4 h-4" />
              Regulatory Compliance Disclaimer
            </div>
            <p className="leading-relaxed">
              The AI modules built into this platform are predictive scheduling mechanisms powered by artificial intelligence models. They are designed to categorize scheduling intents and should never be used as a diagnostics decision tool, medication prescriber, or life-support emergency triage. If you are experiencing symptoms of chest constriction, physical shock, respiratory distress, or heavy trauma, please immediately contact local emergency medical rescue or proceed to the nearest emergency ward.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500">
            <span>© 2026 Aura Clinic Systems Inc. All rights reserved.</span>
            <div className="flex gap-5 font-mono uppercase tracking-wider">
              <span className="hover:text-white cursor-pointer transition-all">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-all">Roster Guidelines</span>
              <span className="hover:text-white cursor-pointer transition-all">Clinical API Logs</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
