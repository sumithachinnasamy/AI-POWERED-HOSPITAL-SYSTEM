import React, { useState, useEffect } from "react";
import { api } from "../api.js";
import { 
  DoctorWithProfile, 
  Department, 
  AppointmentDetail, 
  AppointmentStatus,
  UserRole 
} from "../types.js";
import AnalyticsCharts from "../components/AnalyticsCharts.js";
import { CITIES_AND_HOSPITALS } from "./AuthPage.js";
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Brain, 
  PlusCircle, 
  Trash2, 
  Activity, 
  LogOut, 
  ShieldAlert, 
  Briefcase,
  Layers,
  Settings,
  Mail,
  Lock,
  RefreshCw
} from "lucide-react";

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
  onNavigateToSettings: () => void;
}

export default function AdminDashboard({ user, onLogout, onNavigateToSettings }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "doctors" | "patients" | "appointments" | "notifications">("analytics");
  const [analytics, setAnalytics] = useState<any>(null);
  const [doctors, setDoctors] = useState<DoctorWithProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<AppointmentDetail[]>([]);
  const [serviceStatus, setServiceStatus] = useState<any>(null);
  const [serviceChecking, setServiceChecking] = useState(false);

  // Onboarding Doctor form inputs
  const [docEmail, setDocEmail] = useState("");
  const [docPassword, setDocPassword] = useState("");
  const [docFirst, setDocFirst] = useState("");
  const [docLast, setDocLast] = useState("");
  const [docDept, setDocDept] = useState("");
  const [docSpec, setDocSpec] = useState("");
  const [docExp, setDocExp] = useState("");
  const [docFee, setDocFee] = useState("");
  const [docBio, setDocBio] = useState("");
  const [docCity, setDocCity] = useState("Chennai");
  const [docHospital, setDocHospital] = useState("Apollo Hospitals Chennai");

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const statsData = await api.getAnalytics();
        const docsData = await api.getDoctors();
        const deptsData = await api.getDepartments();
        const patientsData = await api.getPatients();
        const appsData = await api.getAppointments();

        setAnalytics(statsData);
        setDoctors(docsData);
        setDepartments(deptsData);
        setPatients(patientsData);
        setAppointments(appsData);

        try {
          const status = await api.getNotificationServiceStatus();
          setServiceStatus(status);
        } catch (e) {
          console.error("Failed to load service status", e);
        }
      } catch (err) {
        console.error("Failed to fetch admin workspace configurations:", err);
      }
    }
    loadAdminData();
  }, [refreshTrigger]);

  const handleTriggerServiceCheck = async () => {
    setServiceChecking(true);
    try {
      const result = await api.triggerNotificationServiceCheck();
      alert(`Automated reminders check complete! Sent: ${result.sentCount} reminders.`);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      alert(`Failed to trigger service check: ${err.message}`);
    } finally {
      setServiceChecking(false);
    }
  };

  const handleToggleService = async () => {
    try {
      const result = await api.toggleNotificationService();
      alert(result.message);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      alert(`Failed to toggle service: ${err.message}`);
    }
  };

  const handleRegisterDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docEmail || !docPassword || !docFirst || !docLast || !docDept) {
      setFormError("Email, Password, Names, and Department selection are mandatory.");
      return;
    }

    setFormError("");
    setFormSuccess("");
    setFormLoading(true);

    try {
      await api.addDoctor({
        email: docEmail,
        password: docPassword,
        firstName: docFirst,
        lastName: docLast,
        deptId: docDept,
        specialization: docSpec,
        experienceYears: Number(docExp) || 1,
        consultationFee: Number(docFee) || 50,
        bio: docBio,
        city: docCity,
        hospital: docHospital
      });

      setFormSuccess("Doctor registered and assigned to clinical roster successfully!");
      setDocEmail("");
      setDocPassword("");
      setDocFirst("");
      setDocLast("");
      setDocDept("");
      setDocSpec("");
      setDocExp("");
      setDocFee("");
      setDocBio("");
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setFormError(err.message || "Failed to onboard medical specialist.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm("Are you sure you want to dismiss this practitioner profile? This will delete associate rosters.")) return;
    try {
      await api.deleteDoctor(id);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this patient medical file?")) return;
    try {
      await api.deletePatient(id);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminCancelApp = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment as Administrator?")) return;
    try {
      await api.updateAppointmentStatus(id, { status: AppointmentStatus.CANCELLED });
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col lg:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-slate-900 text-white shrink-0 flex flex-col justify-between">
        <div className="p-6 space-y-8">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 flex items-center justify-center text-white">
              <Activity className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm block tracking-wide">AURA MEDICAL</span>
              <span className="text-[9px] text-indigo-400 font-bold block uppercase tracking-wider">Admin Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === "analytics" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <Activity className="w-4 h-4" />
              Portal Analytics
            </button>
            <button
              onClick={() => setActiveTab("doctors")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === "doctors" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <UserCheck className="w-4 h-4" />
              Onboard Doctors
            </button>
            <button
              onClick={() => setActiveTab("patients")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === "patients" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <Users className="w-4 h-4" />
              Manage Patients
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === "appointments" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <Calendar className="w-4 h-4" />
              Manage Bookings
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === "notifications" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <Mail className="w-4 h-4" />
              Reminder Service
            </button>
          </nav>
        </div>

        {/* User Account controls */}
        <div className="p-6 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-indigo-300 flex items-center justify-center font-bold text-sm border border-slate-700">
              AD
            </div>
            <div className="truncate">
              <span className="font-semibold text-xs text-white block truncate">{user.firstName} {user.lastName}</span>
              <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wider">Administrator</span>
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
              className="px-2 py-1.5 bg-red-950 hover:bg-red-900 text-red-200 text-[10px] font-bold rounded-lg text-center transition-all border border-red-900/40"
            >
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Frame */}
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
        
        {/* Upper Ribbon Nav */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-150 px-8 py-5 flex items-center justify-between shadow-sm shrink-0 relative z-10">
          <h1 className="text-lg font-bold text-slate-900 font-sans tracking-tight">
            {activeTab === "analytics" && "Clinical Ecosystem Analytics"}
            {activeTab === "doctors" && "Practitioner Registrations & Profiles"}
            {activeTab === "patients" && "EHR Patient Database"}
            {activeTab === "appointments" && "Master Booking Ledger"}
            {activeTab === "notifications" && "Appointment Notification Service"}
          </h1>
          <button 
            onClick={() => setRefreshTrigger(prev => prev + 1)} 
            className="p-1.5 hover:bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-800 cursor-pointer"
            title="Reload Records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {/* Workspace Display */}
        <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full relative z-10">
          
          {/* ANALYTICS BLOCK */}
          {activeTab === "analytics" && (
            analytics ? (
              <AnalyticsCharts analyticsData={analytics} appointments={appointments} />
            ) : (
              <p className="text-xs text-gray-400 italic text-center py-12">Loading ecological clinic records...</p>
            )
          )}

          {/* DOCTORS ONBOARDING BLOCK */}
          {activeTab === "doctors" && (
            <div className="space-y-8">
              
              {/* Add doctor form */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-gray-950 text-sm border-b border-gray-50 pb-3 uppercase tracking-wider">Register Specialist Physician</h3>

                {formError && <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{formError}</p>}
                {formSuccess && <p className="text-xs text-emerald-600 bg-emerald-50 p-2.5 rounded font-medium">{formSuccess}</p>}

                <form onSubmit={handleRegisterDoctor} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">First Name *</label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none text-gray-800"
                        value={docFirst}
                        onChange={(e) => setDocFirst(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Last Name *</label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none text-gray-800"
                        value={docLast}
                        onChange={(e) => setDocLast(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Specialist Email *</label>
                      <input
                        type="email"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none text-gray-800"
                        value={docEmail}
                        onChange={(e) => setDocEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Set Password *</label>
                      <input
                        type="password"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none text-gray-800"
                        value={docPassword}
                        onChange={(e) => setDocPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Specialty Department *</label>
                      <select
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none text-gray-800"
                        value={docDept}
                        onChange={(e) => setDocDept(e.target.value)}
                        required
                      >
                        <option value="">Select Dept</option>
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Experience (Yrs)</label>
                      <input
                        type="number"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none text-gray-800"
                        value={docExp}
                        onChange={(e) => setDocExp(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Fee ($)</label>
                      <input
                        type="number"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none text-gray-800"
                        value={docFee}
                        onChange={(e) => setDocFee(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">City *</label>
                      <select
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none text-gray-800"
                        value={docCity}
                        onChange={(e) => {
                          setDocCity(e.target.value);
                          setDocHospital(CITIES_AND_HOSPITALS[e.target.value]?.[0] || "");
                        }}
                        required
                      >
                        {Object.keys(CITIES_AND_HOSPITALS).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Hospital *</label>
                      <select
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none text-gray-800"
                        value={docHospital}
                        onChange={(e) => setDocHospital(e.target.value)}
                        disabled={!docCity}
                        required
                      >
                        {docCity && CITIES_AND_HOSPITALS[docCity]?.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Doctor specialization area</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none text-gray-800"
                      placeholder="e.g. Interventional Cardiology, Pediatric Orthopedics"
                      value={docSpec}
                      onChange={(e) => setDocSpec(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Staff Biography</label>
                    <textarea
                      rows={2}
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:border-indigo-500 focus:outline-none text-gray-800 resize-none"
                      value={docBio}
                      onChange={(e) => setDocBio(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow transition-all uppercase tracking-wider"
                  >
                    Onboard Professional
                  </button>
                </form>
              </div>

              {/* Doctors Registry List */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-gray-950 text-sm border-b border-gray-50 pb-3 uppercase tracking-wider">Active Staff Practitioners</h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">PHYSICIAN NAME</th>
                        <th className="py-3 px-4">DEPARTMENT</th>
                        <th className="py-3 px-4">SPECIALIZATION</th>
                        <th className="py-3 px-4">EXP (YRS)</th>
                        <th className="py-3 px-4">CONSULT FEE</th>
                        <th className="py-3 px-4 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700">
                      {doctors.map((d) => (
                        <tr key={d.id} className="hover:bg-gray-50/40">
                          <td className="py-4 px-4 font-semibold text-gray-950">
                            Dr. {d.firstName} {d.lastName}
                          </td>
                          <td className="py-4 px-4 font-medium text-gray-500">
                            {d.departmentName}
                          </td>
                          <td className="py-4 px-4 italic text-gray-400">
                            {d.specialization}
                          </td>
                          <td className="py-4 px-4 text-center font-bold">
                            {d.experienceYears}
                          </td>
                          <td className="py-4 px-4 text-center font-bold text-emerald-600">
                            ${d.consultationFee}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleDeleteDoctor(d.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* MANAGING PATIENTS TAB */}
          {activeTab === "patients" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-gray-950 text-sm border-b border-gray-50 pb-3 uppercase tracking-wider">Clinical Patient Registry Files</h3>

              {patients.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-12">No patient clinical files loaded.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                        <th className="py-3.5 px-4">PATIENT NAME</th>
                        <th className="py-3.5 px-4">EMAIL</th>
                        <th className="py-3.5 px-4">BLOOD SEGMENT</th>
                        <th className="py-3.5 px-4">DATE OF BIRTH</th>
                        <th className="py-3.5 px-4">RESIDENT ADDRESS</th>
                        <th className="py-3.5 px-4 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700">
                      {patients.map((pat) => (
                        <tr key={pat.id} className="hover:bg-gray-50/50">
                          <td className="py-4 px-4 font-semibold text-gray-950">
                            {pat.firstName} {pat.lastName}
                          </td>
                          <td className="py-4 px-4 font-mono text-gray-500">
                            {pat.email}
                          </td>
                          <td className="py-4 px-4 text-center font-bold text-red-600">
                            {pat.bloodGroup || "N/A"}
                          </td>
                          <td className="py-4 px-4 font-mono text-gray-400">
                            {pat.dateOfBirth || "N/A"}
                          </td>
                          <td className="py-4 px-4 max-w-[200px] truncate text-gray-400">
                            {pat.address || "No address on file"}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleDeletePatient(pat.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* MASTER APPOINTMENTS LEDGER */}
          {activeTab === "appointments" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-gray-950 text-sm border-b border-gray-50 pb-3 uppercase tracking-wider">Active Ecological Bookings</h3>

              {appointments.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-12 font-medium">No bookings logged in system.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                        <th className="py-3.5 px-4">PATIENT</th>
                        <th className="py-3.5 px-4">ASSIGNED PROVIDER</th>
                        <th className="py-3.5 px-4">DEPARTMENT</th>
                        <th className="py-3.5 px-4">DATE & HOUR</th>
                        <th className="py-3.5 px-4 text-center">STATUS</th>
                        <th className="py-3.5 px-4 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700">
                      {appointments.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50/40">
                          <td className="py-4 px-4">
                            <span className="font-semibold text-gray-950 block">{app.patientName}</span>
                            <span className="text-[10px] text-gray-400 font-mono block">{app.patientEmail}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-semibold text-gray-900 block">{app.doctorName}</span>
                            <span className="text-[10px] text-gray-400 block italic">{app.doctorSpecialization}</span>
                          </td>
                          <td className="py-4 px-4 font-medium text-gray-500">
                            {app.departmentName}
                          </td>
                          <td className="py-4 px-4 font-semibold text-teal-700 font-mono">
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
                          <td className="py-4 px-4 text-right">
                            {(app.status === AppointmentStatus.PENDING || app.status === AppointmentStatus.CONFIRMED) && (
                              <button
                                onClick={() => handleAdminCancelApp(app.id)}
                                className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-[10px] font-bold transition-all"
                              >
                                Cancel
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

          {/* AUTOMATED REMINDERS BLOCK */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              
              {/* Service Status and Operations Panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Service Engine Status</h4>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`w-3 h-3 rounded-full ${serviceStatus?.isRunning ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}></span>
                      <span className="font-extrabold text-sm text-gray-900">
                        {serviceStatus?.isRunning ? "ACTIVE BACKGROUND RUNNER" : "DEACTIVATED"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      When active, the background daemon periodically scans for appointments in the upcoming 24-30 hour window to dispatch automated notifications.
                    </p>
                  </div>
                  <button
                    onClick={handleToggleService}
                    className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition-all shadow cursor-pointer ${
                      serviceStatus?.isRunning 
                        ? "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200" 
                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    {serviceStatus?.isRunning ? "Deactivate Background Checker" : "Activate Background Checker"}
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Simulate / Manual Trigger</h4>
                    <p className="text-xs text-gray-500 mb-4">
                      Force-execute the automated notification checker immediately. It scans the roster, generates patient warnings, and outputs diagnostic result logs.
                    </p>
                  </div>
                  <button
                    onClick={handleTriggerServiceCheck}
                    disabled={serviceChecking}
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    {serviceChecking ? "Scanning & Dispatching..." : "Run Reminder Scan Now"}
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Service Metadata</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-gray-50 pb-1">
                        <span className="text-gray-400">Scanner Interval:</span>
                        <span className="font-semibold text-gray-700">Every {serviceStatus?.checkIntervalMs ? serviceStatus.checkIntervalMs / 1000 : 60}s</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-50 pb-1">
                        <span className="text-gray-400">Last Execution:</span>
                        <span className="font-semibold text-gray-700 font-mono text-[10px]">
                          {serviceStatus?.lastCheck ? new Date(serviceStatus.lastCheck).toLocaleTimeString() : "Never"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Target Range:</span>
                        <span className="font-semibold text-indigo-600">Upcoming 24-30 Hours</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400 italic mt-4 text-center">
                    Automated Appointment Notification Service
                  </div>
                </div>

              </div>

              {/* Roster & Reminder status lists */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-950 text-sm border-b border-gray-50 pb-3 uppercase tracking-wider mb-4">
                  Scheduled Appointments Reminders Status
                </h3>
                
                {appointments.length === 0 ? (
                  <p className="text-xs text-gray-400 italic text-center py-8">No appointments registered to track reminders.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                          <th className="py-2.5 px-4">PATIENT</th>
                          <th className="py-2.5 px-4">ASSIGNED PROVIDER</th>
                          <th className="py-2.5 px-4">DATE & TIME</th>
                          <th className="py-2.5 px-4 text-center">STATUS</th>
                          <th className="py-2.5 px-4 text-center">AUTO REMINDER</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-gray-700">
                        {appointments.map((app) => (
                          <tr key={app.id} className="hover:bg-gray-50/20">
                            <td className="py-3 px-4 font-semibold text-gray-950">{app.patientName}</td>
                            <td className="py-3 px-4">{app.doctorName} ({app.departmentName})</td>
                            <td className="py-3 px-4 font-mono text-teal-700 font-semibold">{app.appointmentDate} @ {app.slotTime}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                app.status === AppointmentStatus.CONFIRMED ? "bg-blue-50 text-blue-600" :
                                app.status === AppointmentStatus.PENDING ? "bg-amber-50 text-amber-600" :
                                app.status === AppointmentStatus.COMPLETED ? "bg-emerald-50 text-emerald-600" :
                                "bg-red-50 text-red-600"
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {app.reminderSent ? (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[9px]">
                                  Sent (✓)
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-400 font-medium rounded-full text-[9px]">
                                  Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Database Notification Queue Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-4">
                  <div>
                    <h3 className="font-bold text-gray-950 text-sm uppercase tracking-wider">
                      Automated Notification Queue (Database Table Records)
                    </h3>
                    <p className="text-[10px] text-gray-400 font-medium">REAL-TIME STATUS OF PERSISTED SCHEDULER ENTRIES</p>
                  </div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {serviceStatus?.queue?.length || 0} Records Total
                  </span>
                </div>

                {!serviceStatus?.queue || serviceStatus.queue.length === 0 ? (
                  <p className="text-xs text-gray-400 italic text-center py-8">No scheduled notification database table records found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                          <th className="py-2.5 px-4">RECORD ID</th>
                          <th className="py-2.5 px-4">PATIENT</th>
                          <th className="py-2.5 px-4">MESSAGE PREVIEW</th>
                          <th className="py-2.5 px-4">SCHEDULED SEND TIME</th>
                          <th className="py-2.5 px-4 text-center">DISPATCH STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-gray-700">
                        {serviceStatus.queue.map((item: any) => (
                          <tr key={item.id} className="hover:bg-gray-50/20">
                            <td className="py-3 px-4 font-mono text-[10px] text-gray-500">{item.id}</td>
                            <td className="py-3 px-4 font-semibold text-gray-950">{item.patientName}</td>
                            <td className="py-3 px-4 max-w-xs truncate text-gray-600" title={item.message}>{item.message}</td>
                            <td className="py-3 px-4 font-mono text-slate-500 text-[10px]">{new Date(item.scheduledAt).toLocaleString()}</td>
                            <td className="py-3 px-4 text-center">
                              {item.isSent ? (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[9px]">
                                  Dispatched (✓)
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-full text-[9px] animate-pulse">
                                  Scheduled
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Service Logs */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-md p-6 text-white font-mono text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                    <span className="font-bold text-gray-200">DAEMON SERVICE DIAGNOSTIC LOGS</span>
                  </div>
                  <button 
                    onClick={() => setRefreshTrigger(prev => prev + 1)}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Refresh Logs
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {!serviceStatus?.logs || serviceStatus.logs.length === 0 ? (
                    <div className="text-slate-500 text-center py-6">No logs generated yet. Trigger a scan or wait for background automation.</div>
                  ) : (
                    serviceStatus.logs.map((log: any, idx: number) => (
                      <div key={idx} className="border-l-2 border-slate-700 pl-3 py-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between text-[10px] text-slate-400">
                          <span>[{new Date(log.timestamp).toLocaleString()}] {log.action}</span>
                        </div>
                        <p className="text-slate-200 text-xs mt-0.5">{log.details}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

    </div>
  );
}
