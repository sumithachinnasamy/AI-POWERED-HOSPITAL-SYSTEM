import React, { useState, useEffect } from "react";
import { api } from "../api.js";
import { 
  DoctorWithProfile, 
  AppointmentDetail, 
  Department, 
  Notification, 
  AppointmentStatus 
} from "../types.js";
import SymptomAnalyzer from "../components/SymptomAnalyzer.js";
import { CITIES_AND_HOSPITALS } from "./AuthPage.js";
import AIChatAssistant from "../components/AIChatAssistant.js";
import HealthTipsSidebar from "../components/HealthTipsSidebar.js";
import { 
  Calendar, 
  Clock, 
  Brain, 
  MessageSquare, 
  User, 
  FileText, 
  LogOut, 
  Activity, 
  Bell, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  PlusCircle,
  UserCheck,
  CheckCircle,
  CalendarDays,
  Menu,
  X,
  RefreshCw,
  Trash2,
  Users,
  Sparkles,
  ShieldAlert,
  Pill,
  FileSpreadsheet
} from "lucide-react";
import { motion } from "motion/react";

const translations: Record<string, Record<string, string>> = {
  English: {
    portal_overview: "Portal Overview",
    book_appointment: "Book Appointment",
    ai_symptom_analyzer: "AI Symptom Analyzer",
    ai_chat_scheduler: "AI Chat Scheduler",
    ai_report_summarizer: "AI Report Summarizer",
    family_members: "Family Members",
    medical_history: "Medical History",
    welcome_back: "Welcome Back",
    secured_session: "Secured Patient Session",
    clinical_ehr: "Your clinical EHR record is synchronized and encrypted. Choose services below.",
    book_consultation: "Book Consultation",
    active_booking: "Upcoming Scheduled Appointment",
    alerts_center: "Clinical Alerts Center",
    ai_medicine_reminders: "AI Medicine Reminders",
    morning: "Morning",
    evening: "Evening",
    night: "Night",
    health_tips: "Daily Preventative Health Tips",
    load_prediction: "Facility Waiting Load Predictions",
    emergency_advisor: "🚑 Emergency Facility Advisor",
    queue_tracking: "Live Queue Tracking",
    queue_position: "Your Position in Queue",
    people_ahead: "people ahead of you",
    est_wait: "Estimated examination ward entry",
  },
  Tamil: {
    portal_overview: "போர்டல் கண்ணோட்டம்",
    book_appointment: "சந்திப்பு முன்பதிவு",
    ai_symptom_analyzer: "AI நோய் கண்டறிதல்",
    ai_chat_scheduler: "AI அரட்டை முன்பதிவு",
    ai_report_summarizer: "AI மருத்துவ அறிக்கை சுருக்கம்",
    family_members: "குடும்ப உறுப்பினர்கள்",
    medical_history: "மருத்துவ வரலாறு",
    welcome_back: "மீண்டும் வருக",
    secured_session: "பாதுகாக்கப்பட்ட நோயாளி அமர்வு",
    clinical_ehr: "உங்கள் மருத்துவ EHR பதிவு ஒத்திசைக்கப்பட்டு குறியாக்கம் செய்யப்பட்டுள்ளது.",
    book_consultation: "ஆலோசனையை முன்பதிவு செய்க",
    active_booking: "வரவிருக்கும் திட்டமிடப்பட்ட சந்திப்பு",
    alerts_center: "மருத்துவ விழிப்பூட்டல்கள்",
    ai_medicine_reminders: "AI மருந்து நினைவூட்டல்கள்",
    morning: "காலை",
    evening: "மாலை",
    night: "இரவு",
    health_tips: "தினசரி தடுப்பு சுகாதார குறிப்புகள்",
    load_prediction: "மருத்துவமனை காத்திருப்பு சுமை கணிப்புகள்",
    emergency_advisor: "🚑 அவசர சிகிச்சை பிரிவு வழிகாட்டி",
    queue_tracking: "நேரடி வரிசை கண்காணிப்பு",
    queue_position: "வரிசையில் உங்கள் நிலை",
    people_ahead: "உங்களுக்கு முன்னால் உள்ள நபர்கள்",
    est_wait: "மதிப்பிடப்பட்ட பரிசோதனை அறை நுழைவு",
  },
  Hindi: {
    portal_overview: "पोर्टल अवलोकन",
    book_appointment: "अपॉइंटमेंट बुक करें",
    ai_symptom_analyzer: "AI लक्षण विश्लेषक",
    ai_chat_scheduler: "AI चैट शेड्यूलर",
    ai_report_summarizer: "AI रिपोर्ट सारांश",
    family_members: "परिवार के सदस्य",
    medical_history: "चिकित्सा इतिहास",
    welcome_back: "स्वागत हे",
    secured_session: "सुरक्षित रोगी सत्र",
    clinical_ehr: "आपका नैदानिक EHR रिकॉर्ड सिंक्रनाइज़ और एन्क्रिप्टेड है।",
    book_consultation: "अपॉइंटमेंट बुक करें",
    active_booking: "आगामी निर्धारित अपॉइंटमेंट",
    alerts_center: "नैदानिक अलर्ट केंद्र",
    ai_medicine_reminders: "AI दवा अनुस्मारक",
    morning: "सुबह",
    evening: "शाम",
    night: "रात",
    health_tips: "दैनिक स्वास्थ्य युक्तियाँ",
    load_prediction: "अस्पताल प्रतीक्षा भार भविष्यवाणियां",
    emergency_advisor: "🚑 आपातकालीन सुविधा सलाहकार",
    queue_tracking: "लाइव कतार केंट्रोल",
    queue_position: "कतार में आपकी स्थिति",
    people_ahead: "आपके आगे लोग",
    est_wait: "अनुमानित परीक्षा कक्ष प्रवेश",
  }
};

interface PatientDashboardProps {
  user: any;
  onLogout: () => void;
  onNavigateToSettings: () => void;
}

export default function PatientDashboard({ user, onLogout, onNavigateToSettings }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "book" | "analyzer" | "chat" | "history" | "reports" | "family">("overview");
  const [doctors, setDoctors] = useState<DoctorWithProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [appointments, setAppointments] = useState<AppointmentDetail[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Mobile navigation drawer toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Multilingual Support
  const [selectedLang, setSelectedLang] = useState<"English" | "Tamil" | "Hindi">("English");

  // Family Members Account management
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [familyLoading, setFamilyLoading] = useState(false);
  const [bookForFamily, setBookForFamily] = useState(""); // "" means Self
  
  // Inline family creation fields
  const [newFamName, setNewFamName] = useState("");
  const [newFamRelation, setNewFamRelation] = useState("");
  const [newFamAge, setNewFamAge] = useState("");
  const [newFamBloodGroup, setNewFamBloodGroup] = useState("");
  const [famError, setFamError] = useState("");
  const [famSuccess, setFamSuccess] = useState("");

  // AI Medical Report Summarizer states
  const [reportName, setReportName] = useState("");
  const [reportText, setReportText] = useState("");
  const [reportSummary, setReportSummary] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  // Daily AI Preventative Health Tips
  const [healthTips, setHealthTips] = useState("");
  const [healthTipsLoading, setHealthTipsLoading] = useState(false);
  const [isWellnessSidebarOpen, setIsWellnessSidebarOpen] = useState(false);

  // Live Queue tracking simulation
  const [liveQueuePos, setLiveQueuePos] = useState(5);

  // States for standard Booking Form
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDocId, setSelectedDocId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSlot, setBookingSlot] = useState("");
  const [bookingSymptoms, setBookingSymptoms] = useState("");
  
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  // Refresh trigger helper
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load all foundational data
  useEffect(() => {
    async function loadData() {
      try {
        const docsData = await api.getDoctors();
        const deptsData = await api.getDepartments();
        const appsData = await api.getAppointments();
        const notisData = await api.getNotifications();

        setDoctors(docsData);
        setDepartments(deptsData);
        setAppointments(appsData);
        setNotifications(notisData);
      } catch (err) {
        console.error("Failed to load patient dashboard dependencies:", err);
      }
    }
    loadData();
  }, [refreshTrigger]);

  // Load family members
  useEffect(() => {
    async function fetchFamily() {
      try {
        const data = await api.getFamilyMembers();
        setFamilyMembers(data || []);
      } catch (err) {
        console.error("Failed to load family members:", err);
      }
    }
    fetchFamily();
  }, [refreshTrigger]);

  // Load Daily Health Tips dynamically
  useEffect(() => {
    async function fetchHealthTips() {
      setHealthTipsLoading(true);
      try {
        const data = await api.getHealthTips(selectedLang);
        setHealthTips(data.tips || "");
      } catch (err) {
        console.error("Failed to fetch health tips:", err);
      } finally {
        setHealthTipsLoading(false);
      }
    }
    fetchHealthTips();
  }, [selectedLang, refreshTrigger]);

  // Handler to mark alert read
  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  // Handler to execute a booking
  const handleCreateBooking = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedDocId || !bookingDate || !bookingSlot) {
      setBookingError("Please fill out Doctor, Date, and Slot selection.");
      return;
    }

    setBookingError("");
    setBookingSuccess("");
    setBookingLoading(true);

    try {
      await api.bookAppointment({
        doctorId: selectedDocId,
        appointmentDate: bookingDate,
        slotTime: bookingSlot,
        symptomsDescription: bookingSymptoms,
        aiSuggested: false,
        forFamilyMember: bookForFamily
      });

      setBookingSuccess("Your booking request has been submitted successfully!");
      setBookingSymptoms("");
      setSelectedDocId("");
      setSelectedDept("");
      setBookingDate("");
      setBookingSlot("");
      setRefreshTrigger(prev => prev + 1);

      // Auto route to overview after delay
      setTimeout(() => {
        setActiveTab("overview");
        setBookingSuccess("");
      }, 2500);
    } catch (err: any) {
      setBookingError(err.message || "Failed to finalize booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Handler for deep-linked bookings from AI panels
  const handleAiBookingInjection = async (docId: string, date: string, slot: string, symptomsText: string) => {
    try {
      await api.bookAppointment({
        doctorId: docId,
        appointmentDate: date,
        slotTime: slot,
        symptomsDescription: symptomsText,
        aiSuggested: true
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error("AI injected appointment booking failed:", err);
    }
  };

  // Cancel Appointment handler
  const handleCancelApp = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await api.cancelAppointment(id);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter doctors based on selected city, hospital and department
  const filteredDoctors = doctors.filter(d => {
    if (selectedCity && d.city !== selectedCity) return false;
    if (selectedHospital && d.hospital !== selectedHospital) return false;
    if (selectedDept && d.deptId !== selectedDept) return false;
    return true;
  });

  // Active future appointment matching PENDING or CONFIRMED
  const activeAppointment = appointments
    .filter(a => a.status === AppointmentStatus.PENDING || a.status === AppointmentStatus.CONFIRMED)
    .sort((a, b) => new Date(`${a.appointmentDate}T${a.slotTime}`).getTime() - new Date(`${b.appointmentDate}T${b.slotTime}`).getTime())[0];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col lg:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-slate-900 text-white shrink-0 flex flex-col justify-between">
        <div className="p-6 space-y-8">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white">
              <Activity className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm block tracking-wide">AURA MEDICAL</span>
              <span className="text-[9px] text-teal-400 font-bold block uppercase tracking-wider">Patient Portal</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === "overview" ? "bg-teal-600 text-white shadow" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <Calendar className="w-4 h-4" />
              {translations[selectedLang].portal_overview}
            </button>
            <button
              onClick={() => { setActiveTab("book"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === "book" ? "bg-teal-600 text-white shadow" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <PlusCircle className="w-4 h-4" />
              {translations[selectedLang].book_appointment}
            </button>
            <button
              onClick={() => { setActiveTab("analyzer"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === "analyzer" ? "bg-teal-600 text-white shadow" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <Brain className="w-4 h-4" />
              {translations[selectedLang].ai_symptom_analyzer}
            </button>
            <button
              onClick={() => { setActiveTab("chat"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === "chat" ? "bg-teal-600 text-white shadow" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <MessageSquare className="w-4 h-4" />
              {translations[selectedLang].ai_chat_scheduler}
            </button>
            <button
              onClick={() => { setActiveTab("reports"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === "reports" ? "bg-teal-600 text-white shadow" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              {translations[selectedLang].ai_report_summarizer}
            </button>
            <button
              onClick={() => { setActiveTab("family"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === "family" ? "bg-teal-600 text-white shadow" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <Users className="w-4 h-4" />
              {translations[selectedLang].family_members}
            </button>
            <button
              onClick={() => { setActiveTab("history"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === "history" ? "bg-teal-600 text-white shadow" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <FileText className="w-4 h-4" />
              {translations[selectedLang].medical_history}
            </button>
          </nav>
        </div>

        {/* User control block */}
        <div className="p-6 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm border border-slate-700">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="truncate">
              <span className="font-semibold text-xs text-white block truncate">{user.firstName} {user.lastName}</span>
              <span className="text-[10px] text-teal-400 font-bold block uppercase tracking-wider">{user.role}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onNavigateToSettings}
              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-750 text-white text-[10px] font-bold rounded-lg text-center transition-all border border-slate-700"
            >
              Settings
            </button>
            <button
              onClick={onLogout}
              className="px-2 py-1.5 bg-red-950 hover:bg-red-900 text-red-200 text-[10px] font-bold rounded-lg text-center transition-all border border-red-900/40 flex items-center justify-center gap-1"
            >
              <LogOut className="w-3 h-3" /> Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Subtly faded background image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/src/assets/images/clinic_background_1783014527274.jpg"
            alt="Clinic Background"
            className="w-full h-full object-cover opacity-[0.06]"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Upper Portal Ribbon */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-150 px-8 py-5 flex items-center justify-between shadow-sm shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="lg:hidden p-1.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 font-sans tracking-tight">
              {activeTab === "overview" && (translations[selectedLang].portal_overview)}
              {activeTab === "book" && (translations[selectedLang].book_appointment)}
              {activeTab === "analyzer" && (translations[selectedLang].ai_symptom_analyzer)}
              {activeTab === "chat" && (translations[selectedLang].ai_chat_scheduler)}
              {activeTab === "history" && (translations[selectedLang].medical_history)}
              {activeTab === "reports" && (translations[selectedLang].ai_report_summarizer)}
              {activeTab === "family" && (translations[selectedLang].family_members)}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* AI Wellness Coach Toggle */}
            <button
              onClick={() => setIsWellnessSidebarOpen(prev => !prev)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isWellnessSidebarOpen 
                  ? "bg-teal-500 text-slate-950 border-teal-500 shadow-md shadow-teal-500/15" 
                  : "bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-teal-600" />
              <span>AI Wellness Coach</span>
            </button>

            {/* Multilingual Support Flag Picker */}
            <div className="flex items-center gap-2 border border-slate-200 bg-slate-50 rounded-xl px-2.5 py-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value as any)}
                className="bg-transparent border-none text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-0 cursor-pointer"
              >
                <option value="English">🇺🇸 English</option>
                <option value="Tamil">🇮🇳 தமிழ் (Tamil)</option>
                <option value="Hindi">🇮🇳 हिन्दी (Hindi)</option>
              </select>
            </div>

            <button 
              onClick={() => setRefreshTrigger(prev => prev + 1)} 
              className="p-1.5 hover:bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
              title="Refresh Workspace"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="text-right hidden sm:block">
              <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider">Session Key</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">ACTIVE SECURED</span>
            </div>
          </div>
        </header>

        {/* Workspace Display */}
        <div className={`flex-1 overflow-y-auto p-8 relative z-10 w-full transition-all duration-300 ${
          isWellnessSidebarOpen ? "max-w-7xl mx-auto flex flex-col xl:flex-row gap-8" : "max-w-5xl mx-auto"
        }`}>
          
          <div className="flex-1 min-w-0">
          
          {/* OVERVIEW MODULE */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              
              {/* Patient Welcome Greeting Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl shadow-slate-900/10 border border-slate-800">
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[85px] ambient-glow pointer-events-none" />
                <div className="absolute bottom-[-20%] left-[20%] w-60 h-60 bg-teal-600/10 rounded-full blur-[70px] ambient-glow pointer-events-none" />
                
                <div className="space-y-2 relative z-10">
                  <span className="text-[9px] text-teal-400 font-extrabold uppercase tracking-widest font-mono">Secured Patient Session</span>
                  <h2 className="text-3xl font-black text-white tracking-tight font-display">
                    Welcome Back, {user.firstName}!
                  </h2>
                  <p className="text-xs text-slate-300 max-w-xl font-sans leading-relaxed">
                    Your clinical EHR record is synchronized and encrypted. Initiate a natural language chat schedule, evaluate symptoms, or book standard consultations below.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("book")}
                  className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all hover:-translate-y-0.5 shrink-0 flex items-center gap-2 relative z-10 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Book Consultation
                </button>
              </div>

              {/* Grid: Alerts vs Active Bookings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Active Next Booking Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Upcoming Scheduled Appointment</span>
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  </div>

                  {activeAppointment ? (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="space-y-1">
                          <h4 className="font-bold text-gray-950 text-sm">{activeAppointment.doctorName}</h4>
                          <p className="text-xs text-gray-500 font-semibold">{activeAppointment.doctorSpecialization} ({activeAppointment.departmentName})</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-xs font-bold text-teal-600 block flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5 shrink-0" /> {activeAppointment.appointmentDate}
                          </span>
                          <span className="text-xs font-semibold text-gray-500 block flex items-center gap-1 sm:justify-end mt-0.5">
                            <Clock className="w-3.5 h-3.5 shrink-0" /> {activeAppointment.slotTime}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-150/40">
                          <span className="text-[10px] font-bold text-amber-800 block uppercase tracking-wider">AI Wait Prediction</span>
                          <span className="text-lg font-black text-amber-900 block mt-0.5">~{activeAppointment.waitingTimeMinutes} Mins</span>
                          <p className="text-[10px] text-amber-700/80 leading-tight mt-1">Expected waiting duration to enter the practitioner examination ward.</p>
                        </div>
                        <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-150/40">
                          <span className="text-[10px] font-bold text-blue-800 block uppercase tracking-wider">Registration Status</span>
                          <span className="text-xs font-bold text-blue-900 block mt-1 uppercase tracking-widest">{activeAppointment.status}</span>
                          <p className="text-[10px] text-blue-700/80 leading-tight mt-1.5">Your slot allocation is secured and pending nurse entry checks.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400 text-xs flex flex-col items-center justify-center gap-2">
                      <HelpCircle className="w-8 h-8 text-slate-300" />
                      <span>No upcoming medical appointments requested. Need general health support?</span>
                    </div>
                  )}
                </div>

                {/* Patient Alerts Center */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Security Alerts Center</span>
                    <Bell className="w-4.5 h-4.5 text-gray-400" />
                  </div>

                  <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-[11px] text-gray-400 text-center py-6 italic">No clinical security alerts logged.</p>
                    ) : (
                      notifications.map(noti => (
                        <div key={noti.id} className={`p-3 rounded-lg border text-xs relative ${noti.isRead ? "bg-gray-50/50 border-gray-100 text-gray-500" : "bg-teal-50/30 border-teal-100 text-teal-900"}`}>
                          <p className="leading-normal pr-5">{noti.message}</p>
                          {!noti.isRead && (
                            <button
                              onClick={() => handleMarkRead(noti.id)}
                              className="absolute top-2 right-2 text-[9px] font-bold text-teal-600 hover:text-teal-800 uppercase tracking-widest"
                            >
                              Dismiss
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Live Queue Tracking (Conditional on active booking) */}
              {activeAppointment && (
                <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl p-6 border border-teal-800 shadow-md">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-[10px] bg-teal-500/20 text-teal-300 font-extrabold uppercase tracking-widest block mb-1">
                        {translations[selectedLang].queue_tracking || "Live Queue Tracking"}
                      </span>
                      <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                        <Activity className="w-5 h-5 text-teal-400 animate-pulse" />
                        {translations[selectedLang].queue_position || "Your Position in Queue"}: #{liveQueuePos}
                      </h3>
                      <p className="text-xs text-teal-200 mt-1">
                        {liveQueuePos > 1 
                          ? `${liveQueuePos - 1} ${translations[selectedLang].people_ahead || "people ahead of you"}` 
                          : "You are next in line! Please prepare to enter examination ward."}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-teal-300 block uppercase font-bold">
                          {translations[selectedLang].est_wait || "Est. Entry"}
                        </span>
                        <span className="text-sm font-bold text-white block">
                          {liveQueuePos * 5} Mins
                        </span>
                      </div>
                      <button
                        onClick={() => setLiveQueuePos(prev => Math.max(1, prev - 1))}
                        className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Simulate Queue Step"
                      >
                        <RefreshCw className="w-3 h-3 animate-spin" /> Update Position
                      </button>
                    </div>
                  </div>

                  {/* Progress visualizer bar */}
                  <div className="mt-4 bg-slate-800/80 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-teal-400 h-full transition-all duration-500" 
                      style={{ width: `${Math.max(20, 100 - (liveQueuePos * 15))}%` }} 
                    />
                  </div>
                </div>
              )}

              {/* Emergency ED Advisor & Facility Load Predictor */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    {translations[selectedLang].emergency_advisor || "🚑 Emergency & Hospital Load Predictor"}
                  </span>
                  <span className="text-[10px] bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full font-bold uppercase">
                    AI Monitor Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Aura Medical Main Hospital */}
                  <div className="p-3.5 rounded-xl border border-gray-150 bg-slate-50 space-y-1">
                    <span className="text-xs font-bold text-slate-800 block">Aura Medical (Main)</span>
                    <div className="flex justify-between text-xs text-gray-500 font-semibold pt-1">
                      <span>Waiting Load:</span>
                      <span className="text-amber-600 font-extrabold uppercase">High (85% Peak)</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 font-semibold">
                      <span>Est. Emergency Wait:</span>
                      <span className="text-gray-800 font-bold">1 hr 45 mins</span>
                    </div>
                  </div>

                  {/* Aura West Urgent Care */}
                  <div className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/20 space-y-1">
                    <span className="text-xs font-bold text-teal-950 block">Aura West Clinic & Urgent Care</span>
                    <div className="flex justify-between text-xs text-teal-900 font-semibold pt-1">
                      <span>Waiting Load:</span>
                      <span className="text-emerald-600 font-extrabold uppercase">Minimal (20%)</span>
                    </div>
                    <div className="flex justify-between text-xs text-teal-900 font-semibold">
                      <span>Est. Emergency Wait:</span>
                      <span className="text-emerald-700 font-bold">12 Mins</span>
                    </div>
                  </div>
                </div>

                {/* Intelligent Warning banner based on input or general wellness */}
                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-150 text-[11px] text-amber-850 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 block">🚨 AI Priority Triaging System Notice</span>
                    If you are experiencing chest discomfort, sudden breathing difficulty, severe trauma, or signs of stroke, bypass this booking portal completely and visit the Emergency Ward at Aura Main immediately or dial 911. Your health and safety is our first priority.
                  </div>
                </div>
              </div>

              {/* Daily Preventative Health Tips & AI Medicine Reminders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Preventative health tips (dynamically localized) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-teal-500" />
                      {translations[selectedLang].health_tips || "Daily Preventative Health Tips"}
                    </span>
                    <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold uppercase">
                      Gemini Powered
                    </span>
                  </div>

                  {healthTipsLoading ? (
                    <div className="py-8 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 text-slate-300 animate-spin" />
                      <span>Generating wellness guidance in {selectedLang}...</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line prose prose-slate">
                        {healthTips}
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                        <span className="text-[10px] text-slate-400 font-medium leading-tight">Want interactive daily routines tailored to your EHR?</span>
                        <button
                          onClick={() => setIsWellnessSidebarOpen(true)}
                          className="text-[10px] bg-teal-50 hover:bg-teal-100 text-teal-700 px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          Open Personal AI Coach <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Medicine Reminders */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-teal-500" />
                      {translations[selectedLang].ai_medicine_reminders || "AI Medicine Reminders"}
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">
                      Clinically Tracked
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Morning medication */}
                    <div className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold">
                        🌅
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-bold text-slate-800 block">Atorvastatin (10mg)</span>
                        <span className="text-gray-400 block font-medium">Morning (After Breakfast)</span>
                      </div>
                      <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold">Take</span>
                    </div>

                    {/* Evening medication */}
                    <div className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        ☀️
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-bold text-slate-800 block">Vitamin D3 (1000 IU)</span>
                        <span className="text-gray-400 block font-medium">Evening (After Dinner)</span>
                      </div>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">Take</span>
                    </div>

                    {/* Bedtime medication */}
                    <div className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                        🌙
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-bold text-slate-800 block">Metformin (500mg)</span>
                        <span className="text-gray-400 block font-medium">Night (At Bedtime)</span>
                      </div>
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">Take</span>
                    </div>

                    {/* Smart AI Follow-up Aligner */}
                    <div className="mt-4 p-3 bg-slate-900 text-white rounded-xl border border-slate-800 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
                      <span className="text-[9px] text-teal-400 font-extrabold uppercase tracking-wider block mb-1">📅 AI Follow-up Scheduler</span>
                      <p className="text-[11px] text-teal-200 leading-normal">
                        Based on your cardiology consultation, Dr. Clara Williams recommended a follow-up review.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedDept("dept_3"); // Cardiology
                          setSelectedDocId("d_doc3"); // Dr. Clara Williams
                          const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
                          setBookingDate(nextWeek);
                          setBookingSlot("11:15");
                          setActiveTab("book");
                        }}
                        className="mt-2 text-[10px] text-white bg-teal-600 hover:bg-teal-500 px-3 py-1.5 rounded-lg font-bold transition-all block w-full text-center cursor-pointer"
                      >
                        Auto-schedule Follow-up (in 7 days)
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* AI Shortcuts Panel */}
              <div className="bg-slate-900 rounded-2xl p-6 text-white grid grid-cols-1 md:grid-cols-2 gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full -mr-16 -mt-16" />
                
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-teal-500/20 text-teal-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <Brain className="w-3 h-3" /> Gemini Neural Engine
                  </div>
                  <h3 className="text-xl font-bold font-sans tracking-tight">Need Medical Triaging or Slot Suggestions?</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Instantly analyze symptoms to pair them with specialist physicians, evaluate predicted waiting queue lengths, or schedule consults conversing naturally in plain text.
                  </p>
                </div>

                <div className="flex flex-col justify-center gap-2.5">
                  <button
                    onClick={() => setActiveTab("analyzer")}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Brain className="w-4 h-4" /> Run AI Symptom Assessment
                  </button>
                  <button
                    onClick={() => setActiveTab("chat")}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Chat with Virtual Scheduler
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STANDARD BOOKING FORM */}
          {activeTab === "book" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900 border-b border-gray-50 pb-3 font-sans tracking-tight">
                Schedule a Medical Consult
              </h2>

              {bookingError && <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{bookingError}</p>}
              {bookingSuccess && <p className="text-xs text-emerald-600 bg-emerald-50 p-3 rounded font-medium">{bookingSuccess}</p>}

              <form onSubmit={handleCreateBooking} className="space-y-5">
                {/* Unified Family Accounts: Whom is this booking for? */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    🧑‍⚕️ Patient Account Selection (Family Unified Booking)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setBookForFamily("")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${bookForFamily === "" ? "bg-teal-600 text-white border-teal-600 shadow" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                    >
                      Myself ({user.firstName} {user.lastName})
                    </button>
                    {familyMembers.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setBookForFamily(`${m.name} (${m.relationship})`)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${bookForFamily === `${m.name} (${m.relationship})` ? "bg-teal-600 text-white border-teal-600 shadow" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                      >
                        {m.name} ({m.relationship})
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setActiveTab("family")}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border border-dashed border-teal-400 bg-teal-50/50 text-teal-700 hover:bg-teal-50 transition-all flex items-center gap-1"
                    >
                      ➕ Add Family Member
                    </button>
                  </div>
                  {bookForFamily && (
                    <p className="text-[10px] text-teal-600 font-bold">
                      ✓ Selected patient: booking will be officially logged under family relative <strong>{bookForFamily}</strong>.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* City Select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Choose City</label>
                    <select
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:border-teal-500 focus:outline-none transition-all text-gray-800"
                      value={selectedCity}
                      onChange={(e) => {
                        setSelectedCity(e.target.value);
                        setSelectedHospital("");
                        setSelectedDocId("");
                      }}
                    >
                      <option value="">Any City</option>
                      {Object.keys(CITIES_AND_HOSPITALS).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Hospital Select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Choose Hospital</label>
                    <select
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:border-teal-500 focus:outline-none transition-all text-gray-800"
                      value={selectedHospital}
                      onChange={(e) => {
                        setSelectedHospital(e.target.value);
                        setSelectedDocId("");
                      }}
                      disabled={!selectedCity}
                    >
                      <option value="">Any Hospital</option>
                      {selectedCity && CITIES_AND_HOSPITALS[selectedCity]?.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Department Select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Clinical Department</label>
                    <select
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:border-teal-500 focus:outline-none transition-all text-gray-800"
                      value={selectedDept}
                      onChange={(e) => { setSelectedDept(e.target.value); setSelectedDocId(""); }}
                    >
                      <option value="">Choose Department</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Doctor Select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Available Physician Specialist</label>
                    <select
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:border-teal-500 focus:outline-none transition-all text-gray-800"
                      value={selectedDocId}
                      onChange={(e) => setSelectedDocId(e.target.value)}
                      disabled={filteredDoctors.length === 0}
                    >
                      <option value="">Choose Doctor</option>
                      {filteredDoctors.map(d => (
                        <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} ({d.specialization}) - {d.hospital}, {d.city} (${d.consultationFee})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Preferred Consultation Date</label>
                    <input
                      type="date"
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:border-teal-500 focus:outline-none transition-all text-gray-800"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {/* Slot Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Preferred Hour Slot</label>
                    <select
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:border-teal-500 focus:outline-none transition-all text-gray-800"
                      value={bookingSlot}
                      onChange={(e) => setBookingSlot(e.target.value)}
                    >
                      <option value="">Select Hour</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="09:30">09:30 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="10:30">10:30 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="11:30">11:30 AM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="14:30">02:30 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="15:30">03:30 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="16:30">04:30 PM</option>
                    </select>
                  </div>
                </div>

                {/* Symptom Description Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Briefly Describe Your Symptoms</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-teal-500 focus:outline-none transition-all text-gray-800 resize-none"
                    placeholder="E.g., intermittent throat irritation, dry cough for 3 days, no fever..."
                    value={bookingSymptoms}
                    onChange={(e) => setBookingSymptoms(e.target.value)}
                  />
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-50">
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all uppercase tracking-wider disabled:opacity-45"
                  >
                    {bookingLoading ? "Submitting Booking Request..." : "Request Appointment"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* AI SYMPTOM ANALYZER */}
          {activeTab === "analyzer" && (
            <SymptomAnalyzer 
              doctors={doctors} 
              onBookSuggested={async (docId, date, slot, symptoms) => {
                await handleAiBookingInjection(docId, date, slot, symptoms);
              }}
            />
          )}

          {/* AI CHAT SCHEDULER */}
          {activeTab === "chat" && (
            <AIChatAssistant 
              doctors={doctors} 
              onBookSuggested={async (docId, date, slot, symptoms) => {
                await handleAiBookingInjection(docId, date, slot, symptoms);
              }}
            />
          )}

          {/* MEDICAL HISTORY */}
          {activeTab === "history" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Appointment Archives & Logs</span>
                <span className="text-xs text-gray-400 font-mono">Count: {appointments.length} Total Visits</span>
              </div>

              {appointments.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-12">No clinical booking history requested.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                        <th className="py-3.5 px-4">PROVIDER</th>
                        <th className="py-3.5 px-4">DEPARTMENT</th>
                        <th className="py-3.5 px-4">DATE & HOUR</th>
                        <th className="py-3.5 px-4 text-center">STATUS</th>
                        <th className="py-3.5 px-4">SYMPTOMS</th>
                        <th className="py-3.5 px-4 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700">
                      {appointments.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50/40">
                          <td className="py-4 px-4 font-semibold text-gray-950">
                            <div>Dr. {app.doctorName}</div>
                            {app.forFamilyMember && (
                              <span className="inline-flex items-center gap-1 text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-extrabold mt-1">
                                <Users className="w-2.5 h-2.5" /> For: {app.forFamilyMember}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-gray-500 font-medium">
                            {app.departmentName}
                          </td>
                          <td className="py-4 px-4 text-teal-700 font-medium font-mono">
                            {app.appointmentDate} • {app.slotTime}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                              app.status === AppointmentStatus.PENDING ? "bg-amber-100 text-amber-700" :
                              app.status === AppointmentStatus.CONFIRMED ? "bg-blue-100 text-blue-700" :
                              app.status === AppointmentStatus.COMPLETED ? "bg-emerald-100 text-emerald-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 max-w-[150px] truncate italic text-gray-400">
                            "{app.symptomsDescription || "N/A"}"
                          </td>
                          <td className="py-4 px-4 text-right">
                            {app.status === AppointmentStatus.PENDING && (
                              <button
                                onClick={() => handleCancelApp(app.id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100 cursor-pointer"
                                title="Cancel Scheduled Roster"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* AI REPORT SUMMARIZER MODULE */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 space-y-6">
                <div className="border-b border-gray-150 pb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> Gemini Neural Vision & Lab Parser
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    AI Clinical Report Summarizer & Translator
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload or paste structured bio-laboratory clinical reports to generate a highly clear, patient-centric summary outlining high-alert biometrics, risk indicators, and wellness next-steps.
                  </p>
                </div>

                {/* Disclaimer banner */}
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-850 space-y-1">
                  <span className="font-bold text-amber-900 block flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    IMPORTANT CLINICAL SAFETY DISCLAIMER
                  </span>
                  <p className="leading-relaxed">
                    AI summaries are strictly for educational and informational purposes to assist you in understanding diagnostic reports. They are NOT official medical diagnoses and do NOT replace consultation with qualified healthcare professionals.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left form inputs */}
                  <div className="md:col-span-1 space-y-4 border-r border-gray-100 pr-0 md:pr-6">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">1. Choose Report Type</span>
                      <div className="flex flex-col gap-1.5 mt-1.5">
                        <button
                          onClick={() => {
                            setReportName("Metabolic Lipid & Serum Panel");
                            setReportText("LAB REF ID: L-94827\nDATE: 2026-06-15\nPATIENT: John Doe (Male, 45)\n\nLIPID METABOLIC TEST PANEL:\n- Fasting Serum Glucose: 112 mg/dL (Reference: 70 - 100 mg/dL) [HIGH]\n- Total Cholesterol: 242 mg/dL (Reference: < 200 mg/dL) [ELEVATED]\n- HDL Cholesterol: 41 mg/dL (Reference: > 40 mg/dL) [NORMAL]\n- LDL Cholesterol: 162 mg/dL (Reference: < 100 mg/dL) [HIGH]\n- Triglycerides: 195 mg/dL (Reference: < 150 mg/dL) [HIGH]\n\nPhysician notes: Patient shows borderline metabolic syndrome markers. Family history of coronary artery disease noted.");
                            setReportSummary("");
                          }}
                          className="w-full text-left p-2.5 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-50 bg-white transition-all flex items-center justify-between"
                        >
                          <span>🥗 Lipid & Blood Sugar Panel</span>
                          <span className="text-[9px] text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">Sample</span>
                        </button>

                        <button
                          onClick={() => {
                            setReportName("Brain Diagnostic MRI Scan");
                            setReportText("IMAGING LAB ID: IM-04822\nDATE: 2026-06-20\nPROCEDURE: 3T MRI of the Brain / Cerebral Cranium with and without contrast.\n\nFINDINGS:\n- Ventricles and sulci are within normal structural limits for age.\n- No evidence of acute intracranial hemorrhage, mass effect, or territorial infarction.\n- Locally persistent fluid-attenuated inversion recovery (FLAIR) hyperintensities in the posterior joint junction indicating mild, localized traumatic muscular/joint tissue inflammation.\n- No structural skull fracture or localized bleeding detected.\n\nIMPRESSION:\nFluid collection consistent with localized secondary muscle strain inflammation. Structural brain parenchymal integrity is fully preserved.");
                            setReportSummary("");
                          }}
                          className="w-full text-left p-2.5 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-50 bg-white transition-all flex items-center justify-between"
                        >
                          <span>🧠 Brain MRI Scan</span>
                          <span className="text-[9px] text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">Sample</span>
                        </button>

                        <button
                          onClick={() => {
                            setReportName("Hematology CBC Complete Blood Count");
                            setReportText("HEMATOLOGY REPORT ID: H-10292\nPATIENT: John Doe\n\nCOMPLETE BLOOD COUNT (CBC):\n- White Blood Cell (WBC): 7.2 x10^3/uL (Reference: 4.5 - 11.0) [NORMAL]\n- Red Blood Cell (RBC): 4.85 x10^6/uL (Reference: 4.30 - 5.90) [NORMAL]\n- Hemoglobin: 14.8 g/dL (Reference: 13.5 - 17.5) [NORMAL]\n- Hematocrit: 44.2% (Reference: 41.0 - 50.0) [NORMAL]\n- Platelets: 285 x10^3/uL (Reference: 150 - 450) [NORMAL]\n\nSummary: General hematological markers within expected safety baselines.");
                            setReportSummary("");
                          }}
                          className="w-full text-left p-2.5 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-50 bg-white transition-all flex items-center justify-between"
                        >
                          <span>🩸 General CBC Blood Panel</span>
                          <span className="text-[9px] text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">Sample</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Report Label/Title</label>
                      <input
                        type="text"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                        placeholder="e.g. June Metabolic Labwork"
                        className="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-teal-500 focus:outline-none text-gray-800"
                      />
                    </div>
                  </div>

                  {/* Center/Right text and actions */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">2. Paste Clinical Laboratory Text Findings</label>
                      <textarea
                        value={reportText}
                        onChange={(e) => setReportText(e.target.value)}
                        placeholder="Paste bloodwork laboratory telemetry details, MRI scan summaries, or CBC observations..."
                        rows={8}
                        className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-teal-500 focus:outline-none font-mono leading-relaxed text-gray-800"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        if (!reportText.trim()) {
                          setReportError("Please enter or select report text findings first.");
                          return;
                        }
                        setReportError("");
                        setReportLoading(true);
                        setSimulatedProgress(20);

                        const interval = setInterval(() => {
                          setSimulatedProgress(p => Math.min(95, p + 25));
                        }, 200);

                        try {
                          const res = await api.analyzeReport(reportText, reportName);
                          setReportSummary(res.summary);
                          setSimulatedProgress(100);
                        } catch (err: any) {
                          setReportError(err.message || "Laboratory document summarization failed.");
                        } finally {
                          clearInterval(interval);
                          setReportLoading(false);
                        }
                      }}
                      disabled={reportLoading}
                      className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {reportLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Gemini Advanced Clinical Summarizer Active... ({simulatedProgress}%)</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Gemini Medical Summary</span>
                        </>
                      )}
                    </button>

                    {reportError && (
                      <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{reportError}</p>
                    )}

                    {reportSummary && (
                      <div className="bg-slate-50 border border-slate-150 p-6 rounded-2xl space-y-3 prose prose-slate">
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">
                          ✓ Document Summary Synthesized
                        </span>
                        <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                          {reportSummary}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAMILY ACCOUNTS MODULE */}
          {activeTab === "family" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 space-y-6">
                <div className="border-b border-gray-150 pb-4">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Manage Family Unified Accounts
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Register and manage secondary relative account profiles under your primary secure credentials. Instantly book specialist doctor consults on behalf of children, parents, or spouses.
                  </p>
                </div>

                {famError && <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{famError}</p>}
                {famSuccess && <p className="text-xs text-emerald-600 bg-emerald-50 p-3 rounded font-medium">{famSuccess}</p>}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Form: Add family member */}
                  <div className="space-y-4 md:col-span-1 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                      Register a Family Member
                    </span>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          value={newFamName}
                          onChange={(e) => setNewFamName(e.target.value)}
                          placeholder="e.g. Robert Smith"
                          className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-teal-500 focus:outline-none text-gray-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Relationship</label>
                        <select
                          value={newFamRelation}
                          onChange={(e) => setNewFamRelation(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-teal-500 focus:outline-none text-gray-800"
                        >
                          <option value="">Select Relationship</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Child">Child</option>
                          <option value="Sibling">Sibling</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Age (Years)</label>
                          <input
                            type="text"
                            value={newFamAge}
                            onChange={(e) => setNewFamAge(e.target.value)}
                            placeholder="e.g. 68"
                            className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-teal-500 focus:outline-none text-gray-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Blood Group</label>
                          <input
                            type="text"
                            value={newFamBloodGroup}
                            onChange={(e) => setNewFamBloodGroup(e.target.value)}
                            placeholder="e.g. O+ve"
                            className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-teal-500 focus:outline-none text-gray-800"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          if (!newFamName.trim() || !newFamRelation) {
                            setFamError("Full Name and Relationship are required.");
                            return;
                          }
                          setFamError("");
                          setFamSuccess("");
                          setFamilyLoading(true);

                          try {
                            await api.addFamilyMember({
                              name: newFamName,
                              relationship: newFamRelation,
                              age: newFamAge,
                              bloodGroup: newFamBloodGroup
                            });
                            setFamSuccess("Family relative registered successfully!");
                            setNewFamName("");
                            setNewFamRelation("");
                            setNewFamAge("");
                            setNewFamBloodGroup("");
                            setRefreshTrigger(prev => prev + 1);
                          } catch (err: any) {
                            setFamError(err.message || "Failed to register relative.");
                          } finally {
                            setFamilyLoading(false);
                          }
                        }}
                        disabled={familyLoading}
                        className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {familyLoading ? "Adding..." : "Register Relative"}
                      </button>
                    </div>
                  </div>

                  {/* Right List: Display current family members */}
                  <div className="md:col-span-2 space-y-4">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                      Registered Family Members ({familyMembers.length})
                    </span>

                    {familyMembers.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl text-gray-400 text-xs flex flex-col items-center justify-center gap-2">
                        <Users className="w-8 h-8 text-gray-300" />
                        <span>No secondary family relatives registered. Get started using the panel.</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {familyMembers.map((m) => (
                          <div key={m.id} className="p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-all space-y-2 flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="text-xs font-black text-gray-950 block">{m.name}</span>
                              <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold uppercase">
                                {m.relationship}
                              </span>
                              <div className="text-[11px] text-gray-500 font-medium pt-1">
                                Age: {m.age} • Blood Group: {m.bloodGroup}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setBookForFamily(`${m.name} (${m.relationship})`);
                                setActiveTab("book");
                              }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-teal-600 hover:text-white text-gray-700 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                            >
                              Book Consult
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          </div>

          {isWellnessSidebarOpen && (
            <div className="w-full xl:w-96 shrink-0 xl:sticky xl:top-0 h-fit">
              <HealthTipsSidebar 
                user={user} 
                onClose={() => setIsWellnessSidebarOpen(false)} 
              />
            </div>
          )}

        </div>
      </main>

      {/* Responsive mobile sidebar drawer backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 lg:hidden flex">
          <div className="w-64 bg-slate-950 p-6 flex flex-col justify-between text-white relative">
            <button className="absolute top-4 right-4 text-white hover:text-gray-300 cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-8">
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white font-bold">A</div>
                <span className="font-extrabold text-white text-xs">AURA MEDICAL</span>
              </div>
              <nav className="space-y-1">
                <button onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "overview" ? "bg-teal-600 text-white" : "text-gray-400 hover:bg-white/5"}`}>Overview</button>
                <button onClick={() => { setActiveTab("book"); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "book" ? "bg-teal-600 text-white" : "text-gray-400 hover:bg-white/5"}`}>Book Slots</button>
                <button onClick={() => { setActiveTab("analyzer"); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "analyzer" ? "bg-teal-600 text-white" : "text-gray-400 hover:bg-white/5"}`}>AI Triage</button>
                <button onClick={() => { setActiveTab("chat"); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "chat" ? "bg-teal-600 text-white" : "text-gray-400 hover:bg-white/5"}`}>AI Scheduler</button>
                <button onClick={() => { setActiveTab("history"); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "history" ? "bg-teal-600 text-white" : "text-gray-400 hover:bg-white/5"}`}>History</button>
              </nav>
            </div>
            <div className="border-t border-white/10 pt-4">
              <button onClick={onLogout} className="w-full py-2 bg-red-950 text-red-200 rounded-lg text-xs font-bold border border-red-900/40">Log Out</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
