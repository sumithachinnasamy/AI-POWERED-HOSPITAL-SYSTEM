import React, { useState } from "react";
import { api } from "../api.js";
import { DoctorWithProfile } from "../types.js";
import { Activity, Sparkles, Clock, Calendar, ShieldAlert, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface SymptomAnalyzerProps {
  doctors: DoctorWithProfile[];
  onBookSuggested: (doctorId: string, date: string, slot: string, symptoms: string) => void;
}

export default function SymptomAnalyzer({ doctors, onBookSuggested }: SymptomAnalyzerProps) {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);
  const [booked, setBooked] = useState(false);

  const handleAnalyze = async () => {
    if (symptoms.trim().length < 5) {
      setError("Please write a detailed description of what you are feeling (minimum 5 characters).");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    setBooked(false);

    try {
      const data = await api.analyzeSymptoms(symptoms);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookInstant = async () => {
    if (!result) return;
    try {
      // Find recommendation match or default to doc1
      const docId = result.recommendedDoctorId || "d_doc1";
      const rawDate = result.suggestedTimeSlot || "Tomorrow morning";
      
      // Parse a standard date representation
      let dateString = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]; // Tomorrow
      let timeString = "10:00"; // default

      if (rawDate.toLowerCase().includes("tuesday")) {
        // Simple mock dates for easy slot pairing
        const nextTues = new Date();
        nextTues.setDate(nextTues.getDate() + ((2 + 7 - nextTues.getDay()) % 7 || 7));
        dateString = nextTues.toISOString().split("T")[0];
        timeString = "14:30";
      } else if (rawDate.toLowerCase().includes("wednesday")) {
        const nextWed = new Date();
        nextWed.setDate(nextWed.getDate() + ((3 + 7 - nextWed.getDay()) % 7 || 7));
        dateString = nextWed.toISOString().split("T")[0];
        timeString = "11:15";
      } else if (rawDate.toLowerCase().includes("thursday")) {
        const nextThur = new Date();
        nextThur.setDate(nextThur.getDate() + ((4 + 7 - nextThur.getDay()) % 7 || 7));
        dateString = nextThur.toISOString().split("T")[0];
        timeString = "16:00";
      } else if (rawDate.toLowerCase().includes("monday")) {
        const nextMon = new Date();
        nextMon.setDate(nextMon.getDate() + ((1 + 7 - nextMon.getDay()) % 7 || 7));
        dateString = nextMon.toISOString().split("T")[0];
        timeString = "15:15";
      }

      onBookSuggested(docId, dateString, timeString, `AI Analyzed: ${symptoms}`);
      setBooked(true);
    } catch (err: any) {
      setError(err.message || "Instant booking failed.");
    }
  };

  // Find the details of recommended doctor
  const recommendedDoctor = result
    ? doctors.find(d => d.id === result.recommendedDoctorId)
    : null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-tr from-teal-500/10 via-emerald-500/5 to-indigo-500/5 rounded-2xl p-7 border border-teal-500/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3 mb-2.5">
          <div className="p-2 bg-teal-500/15 rounded-xl text-teal-600 shadow-sm">
            <Sparkles className="w-5 h-5 animate-pulse text-teal-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">AI Clinical Symptom Analyzer</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
          State your symptoms or medical conditions naturally (e.g., "My 6-year old child has high fever, dry cough, and is crying"). Our Gemini-powered AI triaging module will extract clinical findings, match department specialty, suggest specific doctors, recommend optimal slot times, and predict wait hours dynamically.
        </p>
      </div>

      {/* Mandatory Prominent Medical Disclaimer */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 flex gap-3.5 shadow-sm">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest font-mono block">Mandatory Medical Notice</span>
          <p className="text-xs text-amber-700 leading-relaxed">
            All AI output is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Never disregard professional medical advice or delay in seeking it because of something you have read or processed on this platform. If you think you may have a medical emergency, call your doctor or local emergency services immediately.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100 space-y-5 premium-card">
        <div>
          <label htmlFor="symptom-input" className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2.5">
            Describe symptoms or conditions:
          </label>
          <textarea
            id="symptom-input"
            rows={4}
            className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all resize-none text-slate-800 leading-relaxed placeholder-slate-400 font-sans"
            placeholder="Describe pain levels, duration, localized signs, age of patient, or general clinical concerns..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
        </div>

        {error && <p className="text-xs text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 font-medium">{error}</p>}

        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-tr from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-teal-600/15 hover:shadow-teal-600/25 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                AI Triage in Progress...
              </>
            ) : (
              <>
                <Activity className="w-4.5 h-4.5" />
                Analyze Symptoms
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* AI Output Card */}
          <div className="bg-white rounded-xl shadow-md border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold text-sm tracking-wide">GEMINI AI RECOMMENDATIONS</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 bg-white/20 rounded-full font-mono">Matched & Evaluated</span>
            </div>

            <div className="p-6 space-y-6">
              {/* Recognized Symptoms & Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Identified Symptoms</span>
                  <p className="text-sm text-gray-800 font-medium">{result.analyzedSymptoms || symptoms}</p>
                </div>
                <div className="bg-teal-50/50 p-4 rounded-lg border border-teal-100/50">
                  <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider block mb-1">Recommended Specialty Department</span>
                  <p className="text-lg font-bold text-teal-950">{result.recommendedDepartment}</p>
                </div>
              </div>

              {/* Assessment Explanation */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900">Clinical Reasoning</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{result.specialtyExplanation}</p>
              </div>

              {/* Suggested Doctor & Smart Slot */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Recommended Care Provider</h4>
                {recommendedDoctor ? (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
                        {recommendedDoctor.firstName[0]}{recommendedDoctor.lastName[0]}
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 text-sm">Dr. {recommendedDoctor.firstName} {recommendedDoctor.lastName}</h5>
                        <p className="text-xs text-gray-500">{recommendedDoctor.specialization}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Exp: {recommendedDoctor.experienceYears} Years • Consultation Fee: ${recommendedDoctor.consultationFee}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-left md:text-right">
                      <div className="flex items-center md:justify-end gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit md:ml-auto">
                        <Calendar className="w-3.5 h-3.5" />
                        AI Smart Suggested Slot: {result.suggestedTimeSlot || "Tomorrow 10:00 AM"}
                      </div>
                      <div className="flex items-center md:justify-end gap-1.5 text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full w-fit md:ml-auto">
                        <Clock className="w-3.5 h-3.5" />
                        AI Wait-Time Prediction: ~{result.waitPredictionMinutes || 15} minutes
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No specific doctor profile matched, but you can book with any available specialist in {result.recommendedDepartment}.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-2">
                {booked ? (
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Appointment Booking Request Submitted!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleBookInstant}
                    className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow"
                  >
                    Instantly Schedule with Suggested Specialist
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Medical Disclaimer Section */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wide">Strict Clinical Disclaimer</h5>
                  <p className="text-xs text-amber-700 leading-relaxed mt-0.5">
                    {result.disclaimer || "This AI evaluation tool is powered by machine learning algorithms to assist clinical direction. It is not designed to yield diagnoses, prescribe medication, or substitute for a certified physician's consultation. In case of serious symptoms or respiratory difficulty, please contact emergency medical providers immediately."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
