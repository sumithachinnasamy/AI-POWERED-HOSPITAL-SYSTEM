import React, { useState, useEffect } from "react";
import { api } from "../api.js";
import { 
  Sparkles, 
  Brain, 
  Moon, 
  ShieldCheck, 
  Activity, 
  Heart, 
  AlertCircle, 
  Apple, 
  Dumbbell, 
  RefreshCw, 
  Check, 
  Flame,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HealthTipsSidebarProps {
  onClose?: () => void;
  user: any;
}

export default function HealthTipsSidebar({ onClose, user }: HealthTipsSidebarProps) {
  const [focus, setFocus] = useState<string>("Energy & Focus");
  const [loading, setLoading] = useState<boolean>(false);
  const [completedTips, setCompletedTips] = useState<Record<string, boolean>>({
    nutrition: false,
    activity: false,
    mindfulness: false,
  });
  const [tips, setTips] = useState<{
    personalizedSummary: string;
    nutritionTip: string;
    activityTip: string;
    stressTip: string;
    disclaimer: string;
  } | null>(null);

  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const focusOptions = [
    { name: "Energy & Focus", icon: Sparkles, color: "text-amber-500 bg-amber-500/10 border-amber-500/25" },
    { name: "Sleep & Recovery", icon: Moon, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/25" },
    { name: "Immune Defense", icon: ShieldCheck, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25" },
    { name: "Longevity & Healthspan", icon: Heart, color: "text-rose-500 bg-rose-500/10 border-rose-500/25" },
  ];

  // Fetch tips on component load or focus change
  const fetchPersonalizedTips = async (selectedFocus = focus) => {
    setLoading(true);
    setError("");
    setSuccessMsg("");
    // Reset checked tips
    setCompletedTips({ nutrition: false, activity: false, mindfulness: false });

    try {
      const data = await api.getPersonalizedWellnessTips(selectedFocus);
      setTips(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate personalized health tips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalizedTips();
  }, [focus]);

  const handleToggleTip = (key: string) => {
    setCompletedTips(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      
      // If all tips are checked, trigger a nice celebratory message!
      if (updated.nutrition && updated.activity && updated.mindfulness) {
        setSuccessMsg("Amazing work! You've completed your daily preventative wellness routines! 🎉");
      } else {
        setSuccessMsg("");
      }
      return updated;
    });
  };

  const getFocusIcon = () => {
    const matched = focusOptions.find(o => o.name === focus);
    return matched ? matched.icon : Sparkles;
  };

  const FocusIconComponent = getFocusIcon();

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-2xl rounded-2xl p-6 flex flex-col h-full overflow-y-auto space-y-6 relative transition-all duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-xl text-white shadow-md shadow-teal-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">AI Wellness Coach</h2>
            <p className="text-[10px] text-gray-400 font-medium">Empowered by Gemini Clinical AI</p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* PATIENT PROFILE CARD (GLASS PANEL STYLE) */}
      <div className="bg-gradient-to-br from-slate-50 to-teal-50/20 border border-slate-100 rounded-xl p-4 space-y-2 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Clinical Focus Profile</span>
          <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold">Encrypted EHR</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-xs font-semibold text-slate-700">{user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] text-gray-400">Blood Type: <span className="font-mono font-bold text-slate-600">{user?.patientProfile?.bloodGroup || "O+"}</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono font-semibold text-teal-600">Personalized</p>
            <p className="text-[10px] text-gray-400">Age: <span className="font-bold text-slate-600">{user?.patientProfile?.dateOfBirth ? (new Date().getFullYear() - new Date(user?.patientProfile?.dateOfBirth).getFullYear()) : 35} yrs</span></p>
          </div>
        </div>
      </div>

      {/* FOCUS OPTIONS TABS */}
      <div className="space-y-2 shrink-0">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Select Daily Focus Goal</label>
        <div className="grid grid-cols-2 gap-2">
          {focusOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = focus === opt.name;
            return (
              <button
                key={opt.name}
                onClick={() => setFocus(opt.name)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected 
                    ? "bg-teal-50/60 border-teal-500/30 text-teal-900 shadow-sm" 
                    : "bg-white/60 border-slate-100 hover:border-slate-200 text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? "text-teal-600" : "text-slate-400"}`} />
                <span className="text-[10px] font-bold tracking-tight leading-tight">{opt.name.split(" & ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TIPS VIEW SECTION WITH GLASS GLASS PANEL EFFECTS */}
      <div className="flex-1 min-h-[250px] relative">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center space-y-3 py-10"
            >
              <RefreshCw className="w-8 h-8 text-teal-500 animate-spin" />
              <div className="text-center">
                <p className="text-xs font-bold text-slate-700">Formulating Custom Tips...</p>
                <p className="text-[10px] text-gray-400">Gemini model analyzing health history</p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center space-y-2 text-center p-4"
            >
              <AlertCircle className="w-8 h-8 text-red-500" />
              <p className="text-xs font-semibold text-slate-700">{error}</p>
              <button 
                onClick={() => fetchPersonalizedTips()}
                className="mt-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold transition-all"
              >
                Retry Request
              </button>
            </motion.div>
          ) : tips ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-5 pb-4"
            >
              {/* INTRO SUMMARY */}
              <div className="text-xs text-slate-600 leading-relaxed italic bg-white/60 p-3.5 rounded-xl border border-slate-100/80 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-teal-500/5 rounded-full -mr-3 -mt-3" />
                <p>"{tips.personalizedSummary}"</p>
              </div>

              {/* CELEBRATORY BANNER */}
              {successMsg && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-[11px] font-semibold text-emerald-800"
                >
                  {successMsg}
                </motion.div>
              )}

              {/* THREE INTERACTIVE TIPS */}
              <div className="space-y-3.5">
                {/* 1. NUTRITION TIP */}
                <div 
                  onClick={() => handleToggleTip("nutrition")}
                  className={`group relative overflow-hidden border p-4 rounded-xl cursor-pointer transition-all duration-300 select-none ${
                    completedTips.nutrition 
                      ? "bg-teal-50/40 border-teal-500/20 shadow-sm opacity-85" 
                      : "bg-white/80 border-slate-100 hover:border-slate-200/80 hover:bg-white shadow-xs"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1.5 rounded-lg transition-all ${
                      completedTips.nutrition ? "bg-teal-500 text-white" : "bg-amber-50 text-amber-600 group-hover:scale-110"
                    }`}>
                      {completedTips.nutrition ? <Check className="w-3.5 h-3.5" /> : <Apple className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Nutrition Routine</span>
                        {completedTips.nutrition && <span className="text-[9px] font-bold text-teal-600">Done</span>}
                      </div>
                      <p className={`text-[11px] mt-1.5 leading-relaxed ${completedTips.nutrition ? "text-slate-400 line-through" : "text-slate-600 font-medium"}`}>
                        {tips.nutritionTip}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. ACTIVITY TIP */}
                <div 
                  onClick={() => handleToggleTip("activity")}
                  className={`group relative overflow-hidden border p-4 rounded-xl cursor-pointer transition-all duration-300 select-none ${
                    completedTips.activity 
                      ? "bg-teal-50/40 border-teal-500/20 shadow-sm opacity-85" 
                      : "bg-white/80 border-slate-100 hover:border-slate-200/80 hover:bg-white shadow-xs"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1.5 rounded-lg transition-all ${
                      completedTips.activity ? "bg-teal-500 text-white" : "bg-indigo-50 text-indigo-600 group-hover:scale-110"
                    }`}>
                      {completedTips.activity ? <Check className="w-3.5 h-3.5" /> : <Dumbbell className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Physical Vigor</span>
                        {completedTips.activity && <span className="text-[9px] font-bold text-teal-600">Done</span>}
                      </div>
                      <p className={`text-[11px] mt-1.5 leading-relaxed ${completedTips.activity ? "text-slate-400 line-through" : "text-slate-600 font-medium"}`}>
                        {tips.activityTip}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. MINDFULNESS TIP */}
                <div 
                  onClick={() => handleToggleTip("mindfulness")}
                  className={`group relative overflow-hidden border p-4 rounded-xl cursor-pointer transition-all duration-300 select-none ${
                    completedTips.mindfulness 
                      ? "bg-teal-50/40 border-teal-500/20 shadow-sm opacity-85" 
                      : "bg-white/80 border-slate-100 hover:border-slate-200/80 hover:bg-white shadow-xs"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1.5 rounded-lg transition-all ${
                      completedTips.mindfulness ? "bg-teal-500 text-white" : "bg-emerald-50 text-emerald-600 group-hover:scale-110"
                    }`}>
                      {completedTips.mindfulness ? <Check className="w-3.5 h-3.5" /> : <Brain className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Mindfulness Focus</span>
                        {completedTips.mindfulness && <span className="text-[9px] font-bold text-teal-600">Done</span>}
                      </div>
                      <p className={`text-[11px] mt-1.5 leading-relaxed ${completedTips.mindfulness ? "text-slate-400 line-through" : "text-slate-600 font-medium"}`}>
                        {tips.stressTip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RE-GENERATE BTN */}
              <div className="pt-2 text-center shrink-0">
                <button
                  onClick={() => fetchPersonalizedTips()}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                  disabled={loading}
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                  Refresh Personal Routines
                </button>
              </div>

              {/* CLINICAL DISCLAIMER (WITH OUTLINE GLOW) */}
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5 flex items-start gap-2.5 shrink-0">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[9px] text-amber-800 leading-relaxed font-medium">
                  {tips.disclaimer}
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
