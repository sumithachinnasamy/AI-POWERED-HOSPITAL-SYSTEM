import React, { useState, useRef, useEffect } from "react";
import { api } from "../api.js";
import { DoctorWithProfile } from "../types.js";
import { Send, Sparkles, Bot, User, Check, CalendarDays, Clock, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  extractedPayload?: {
    departmentName: string | null;
    doctorId: string | null;
    date: string | null;
    slotTime: string | null;
  };
  bookingSubmitted?: boolean;
}

interface AIChatAssistantProps {
  doctors: DoctorWithProfile[];
  onBookSuggested: (doctorId: string, date: string, slot: string, symptoms: string) => void;
}

export default function AIChatAssistant({ doctors, onBookSuggested }: AIChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m_welcome",
      sender: "bot",
      text: "Hello! I am your AI Health Assistant. Ask me anything, or try saying: 'Book a skin doctor tomorrow evening' or 'Arrange a children's physical check-up tomorrow morning'. I will extract the clinical department, recommend an available doctor, and prepare the scheduling card instantly!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userText = inputValue;
    setInputValue("");
    setSending(true);

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      const historyPayload = messages.map(m => ({
        sender: m.sender,
        text: m.text
      }));
      
      const response = await api.sendChatMessage(userText, historyPayload);
      
      const botMsg: Message = {
        id: `b_${Date.now()}`,
        sender: "bot",
        text: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        extractedPayload: response.intentExtracted ? response.extractedFields : undefined
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: `b_err_${Date.now()}`,
        sender: "bot",
        text: "I experienced a temporary network issue analyzing your request. Let's try once more, or feel free to book using the standard portal tab.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleExecuteChatBooking = (messageId: string, payload: any) => {
    // Find the ideal doctor or default
    let finalDocId = payload.doctorId || "d_doc1";
    if (!payload.doctorId && payload.departmentName) {
      const match = doctors.find(d => d.departmentName.toLowerCase().includes(payload.departmentName.toLowerCase()));
      if (match) finalDocId = match.id;
    }

    const finalDate = payload.date || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const finalSlot = payload.slotTime || "10:00";

    onBookSuggested(finalDocId, finalDate, finalSlot, `AI Chat Reservation: Natural language request`);

    // Mark as submitted
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, bookingSubmitted: true } : m));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col h-[650px] premium-card">
      {/* Chat Header */}
      <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-teal-950 px-6 py-5 text-white flex items-center justify-between shadow-sm relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2.5 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-400">
            <Bot className="w-5.5 h-5.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm tracking-widest font-display">CLINICAL AI AGENT</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider font-mono">Synced • Gemini Clinical Core</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-teal-300 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-widest relative z-10">
          <Sparkles className="w-3 h-3 text-teal-400" />
          Auto-Triage Active
        </div>
      </div>

      {/* Messages Scroll Panel */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/40">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3.5 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm transition-all ${msg.sender === "user" ? "bg-gradient-to-tr from-teal-600 to-emerald-600" : "bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700"}`}>
              {msg.sender === "user" ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
            </div>

            <div className="space-y-1.5">
              {/* Message Bubble */}
              <div className={`rounded-2xl px-4.5 py-3.5 text-xs sm:text-sm shadow-sm leading-relaxed ${msg.sender === "user" ? "bg-teal-600 text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none border border-slate-100"}`}>
                <p className="font-sans font-normal">{msg.text}</p>
              </div>

              {/* Timestamp */}
              <span className="text-[9px] text-slate-400 font-bold font-mono block px-1 uppercase tracking-wider">{msg.timestamp}</span>

              {/* Extraction Intent Recommendation Box */}
              {msg.extractedPayload && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-teal-50/50 border border-teal-150/40 rounded-2xl p-4.5 mt-2.5 space-y-3.5"
                >
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-teal-700 uppercase tracking-widest font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    Interactive Appointment Prepared
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 bg-white p-3.5 rounded-xl border border-teal-100/50 shadow-sm">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-widest font-mono">Department</span>
                      <span className="text-xs font-bold text-slate-800">{msg.extractedPayload.departmentName || "General Practice"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-widest font-mono">Specialist</span>
                      <span className="text-xs font-bold text-slate-800">
                        {doctors.find(d => d.id === msg.extractedPayload?.doctorId)?.firstName 
                          ? `Dr. ${doctors.find(d => d.id === msg.extractedPayload?.doctorId)?.firstName} ${doctors.find(d => d.id === msg.extractedPayload?.doctorId)?.lastName}`
                          : "Primary Roster Doctor"
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 border-t border-slate-100 pt-2 font-mono">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-600">{msg.extractedPayload.date || "Tomorrow"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 border-t border-slate-100 pt-2 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-600">{msg.extractedPayload.slotTime || "10:00 AM"}</span>
                    </div>
                  </div>

                  {msg.bookingSubmitted ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-2.5 rounded-xl border border-emerald-100 text-xs font-bold uppercase tracking-wider font-mono">
                      <Check className="w-4.5 h-4.5 stroke-[3]" />
                      Slot Reservation Secured!
                    </div>
                  ) : (
                    <button
                      onClick={() => handleExecuteChatBooking(msg.id, msg.extractedPayload)}
                      className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Lock In This Appointment
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex gap-3.5 max-w-[85%]">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-teal-400 flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div className="bg-white text-slate-800 rounded-2xl rounded-tl-none px-4.5 py-3.5 text-sm shadow-sm border border-slate-100 flex items-center gap-2.5">
              <span className="text-slate-400 text-xs font-mono font-bold uppercase tracking-widest">Core Thinking...</span>
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-75" />
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-150" />
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2.5"
        >
          <input
            type="text"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all text-slate-850 placeholder-slate-400 font-sans"
            placeholder="E.g., Arrange a pediatrics visit for tomorrow afternoon..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !inputValue.trim()}
            className="p-3 bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all disabled:opacity-45 shadow-md hover:shadow-lg shadow-teal-500/10 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
