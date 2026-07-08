import React, { useState, useEffect } from "react";
import { api } from "../api.js";
import { AppointmentDetail, DoctorAvailability, AppointmentStatus, UserRole } from "../types.js";
import { 
  Calendar, 
  Clock, 
  UserCheck, 
  PlusCircle, 
  Trash2, 
  Activity, 
  LogOut, 
  Check, 
  X, 
  CheckCircle2, 
  Search, 
  FileText,
  User,
  MapPin,
  CalendarDays,
  Menu
} from "lucide-react";
import { motion } from "motion/react";

interface DoctorDashboardProps {
  user: any;
  onLogout: () => void;
  onNavigateToSettings: () => void;
}

export default function DoctorDashboard({ user, onLogout, onNavigateToSettings }: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState<"appointments" | "availability" | "patients">("appointments");
  const [appointments, setAppointments] = useState<AppointmentDetail[]>([]);
  const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  
  // Roster inputs
  const [newDay, setNewDay] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function loadDoctorData() {
      try {
        const appsData = await api.getAppointments();
        const availsData = await api.getAvailabilities();
        const patientsData = await api.getPatients();

        setAppointments(appsData);
        setAvailabilities(availsData);
        setPatients(patientsData);
      } catch (err) {
        console.error("Failed to load doctor dashboard stats:", err);
      }
    }
    loadDoctorData();
  }, [refreshTrigger]);

  const handleUpdateStatus = async (appId: string, status: AppointmentStatus) => {
    try {
      await api.updateAppointmentStatus(appId, { status });
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Failed to update appointment status:", err);
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDay || !newStart || !newEnd) return;

    try {
      await api.addAvailability({
        dayOfWeek: newDay,
        startTime: newStart,
        endTime: newEnd
      });
      setNewDay("");
      setNewStart("");
      setNewEnd("");
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Failed to add physician working slot:", err);
    }
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      await api.deleteAvailability(id);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Failed to delete availability slot:", err);
    }
  };

  // Filter patients associated with the doctor (have an appointment with this doctor)
  const doctorPatients = patients.filter(p => 
    appointments.some(a => a.patientEmail.toLowerCase() === p.email.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col lg:flex-row font-sans">
      
      {/* Sidebar Navigation Panel */}
      <aside className="w-full lg:w-64 bg-slate-900 text-white shrink-0 flex flex-col justify-between">
        <div className="p-6 space-y-8">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
              <Activity className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm block tracking-wide">AURA MEDICAL</span>
              <span className="text-[9px] text-blue-400 font-bold block uppercase tracking-wider">Physician Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === "appointments" ? "bg-blue-600 text-white shadow" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <Calendar className="w-4 h-4" />
              Clinical Schedule
            </button>
            <button
              onClick={() => setActiveTab("availability")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === "availability" ? "bg-blue-600 text-white shadow" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <Clock className="w-4 h-4" />
              Roster Availability
            </button>
            <button
              onClick={() => setActiveTab("patients")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${activeTab === "patients" ? "bg-blue-600 text-white shadow" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <User className="w-4 h-4" />
              Patient Records
            </button>
          </nav>
        </div>

        {/* User Account Controls */}
        <div className="p-6 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-blue-300 flex items-center justify-center font-bold text-sm border border-slate-700">
              Dr
            </div>
            <div className="truncate">
              <span className="font-semibold text-xs text-white block truncate">Dr. {user.firstName} {user.lastName}</span>
              <span className="text-[10px] text-blue-400 font-bold block uppercase tracking-wider">Clinical Staff</span>
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

      {/* Main Panel Content Area */}
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
        
        {/* Navigation Top Bar Ribbon */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-150 px-8 py-5 flex items-center justify-between shadow-sm shrink-0 relative z-10">
          <h1 className="text-lg font-bold text-slate-900 font-sans tracking-tight">
            {activeTab === "appointments" && "Interactive Clinical Queue"}
            {activeTab === "availability" && "Clinic Roster Schedule"}
            {activeTab === "patients" && "Electronic Patient Directory"}
          </h1>
          <div className="text-right">
            <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider">Staff Terminal</span>
            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">ROSTER SYNCED</span>
          </div>
        </header>

        {/* Workspace Panels */}
        <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full relative z-10">
          
          {/* APPOINTMENTS QUEUE TAB */}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              
              {/* Performance Indicator Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Total Patients File</span>
                  <span className="text-2xl font-black text-gray-900 block mt-1">{doctorPatients.length}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Active Queued Bookings</span>
                  <span className="text-2xl font-black text-blue-600 block mt-1">
                    {appointments.filter(a => a.status === AppointmentStatus.PENDING || a.status === AppointmentStatus.CONFIRMED).length}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Total Completed Visits</span>
                  <span className="text-2xl font-black text-emerald-600 block mt-1">
                    {appointments.filter(a => a.status === AppointmentStatus.COMPLETED).length}
                  </span>
                </div>
              </div>

              {/* Patient Queue Cards Container */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-gray-950 text-sm border-b border-gray-50 pb-3 uppercase tracking-wider">Current Scheduled Consultations</h3>

                {appointments.length === 0 ? (
                  <p className="text-xs text-gray-400 italic text-center py-12">No patient visit allocations booked for this profile.</p>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((app) => (
                      <div key={app.id} className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-200 transition-all">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-950 text-sm">{app.patientName}</h4>
                            <span className="text-[10px] text-gray-400 font-mono">ID: {app.patientId}</span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium">Inquiry Symptoms: <span className="text-gray-700 italic">"{app.symptomsDescription || "No notes supplied"}"</span></p>
                          <div className="flex flex-wrap items-center gap-2 pt-1.5">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                              app.status === AppointmentStatus.PENDING ? "bg-amber-100 text-amber-700" :
                              app.status === AppointmentStatus.CONFIRMED ? "bg-blue-100 text-blue-700" :
                              app.status === AppointmentStatus.COMPLETED ? "bg-emerald-100 text-emerald-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {app.status}
                            </span>
                            {app.aiSuggested && (
                              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 font-extrabold text-[9px] uppercase rounded-full flex items-center gap-1">
                                AI Suggested Roster
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col md:items-end justify-between gap-3 shrink-0 w-full md:w-auto">
                          <div className="text-left md:text-right">
                            <span className="text-xs font-bold text-gray-800 block flex items-center gap-1 md:justify-end">
                              <CalendarDays className="w-3.5 h-3.5 shrink-0" /> {app.appointmentDate}
                            </span>
                            <span className="text-xs font-medium text-gray-400 block flex items-center gap-1 md:justify-end mt-0.5">
                              <Clock className="w-3.5 h-3.5 shrink-0" /> {app.slotTime} (Wait: ~{app.waitingTimeMinutes}m)
                            </span>
                          </div>

                          {/* Action Controllers */}
                          <div className="flex items-center gap-2.5 w-full md:w-auto">
                            {app.status === AppointmentStatus.PENDING && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(app.id, AppointmentStatus.CONFIRMED)}
                                  className="flex-1 md:flex-initial px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition-all flex items-center justify-center gap-1"
                                >
                                  <Check className="w-3 h-3" /> Confirm Slot
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(app.id, AppointmentStatus.CANCELLED)}
                                  className="flex-1 md:flex-initial px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                                >
                                  <X className="w-3 h-3" /> Decline
                                </button>
                              </>
                            )}

                            {app.status === AppointmentStatus.CONFIRMED && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, AppointmentStatus.COMPLETED)}
                                className="w-full md:w-auto px-4.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition-all flex items-center justify-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Consultation Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* AVAILABILITY SCHEDULER TAB */}
          {activeTab === "availability" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Register Slot Form */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 h-fit">
                <h3 className="font-bold text-gray-950 text-sm border-b border-gray-50 pb-3 uppercase tracking-wider">Configure Working Slot</h3>
                
                <form onSubmit={handleAddSlot} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Day of Week</label>
                    <select
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none transition-all text-gray-800"
                      value={newDay}
                      onChange={(e) => setNewDay(e.target.value)}
                      required
                    >
                      <option value="">Select Day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Start Hour</label>
                    <input
                      type="time"
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none transition-all text-gray-800"
                      value={newStart}
                      onChange={(e) => setNewStart(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">End Hour</label>
                    <input
                      type="time"
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none transition-all text-gray-800"
                      value={newEnd}
                      onChange={(e) => setNewEnd(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition-all uppercase tracking-wider"
                  >
                    Add Roster Hours
                  </button>
                </form>
              </div>

              {/* Roster Overview List */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:col-span-2 space-y-4">
                <h3 className="font-bold text-gray-950 text-sm border-b border-gray-50 pb-3 uppercase tracking-wider">Scheduled Weekly Hours</h3>

                {availabilities.length === 0 ? (
                  <p className="text-xs text-gray-400 italic text-center py-12">No active weekly roster configured.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {availabilities.map((av) => (
                      <div key={av.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/40 flex justify-between items-center hover:border-gray-250 transition-all">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-gray-900 block">{av.dayOfWeek}</span>
                          <span className="text-[11px] text-gray-400 font-semibold font-mono block">{av.startTime} - {av.endTime}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteSlot(av.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* PATIENT RECORDS TAB */}
          {activeTab === "patients" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-gray-950 text-sm border-b border-gray-50 pb-3 uppercase tracking-wider">Associated Medical Patients Directory</h3>

              {doctorPatients.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-12">No patients files currently associated with your clinical consultation logs.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                        <th className="py-3.5 px-4">PATIENT FULL NAME</th>
                        <th className="py-3.5 px-4">EMAIL ADDRESS</th>
                        <th className="py-3.5 px-4">BLOOD SEGMENT</th>
                        <th className="py-3.5 px-4">DATE OF BIRTH</th>
                        <th className="py-3.5 px-4">RESIDENT ADDRESS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700">
                      {doctorPatients.map((pat) => (
                        <tr key={pat.id} className="hover:bg-gray-50/50">
                          <td className="py-4 px-4 font-semibold text-gray-950">
                            {pat.firstName} {pat.lastName}
                          </td>
                          <td className="py-4 px-4 font-mono text-gray-500">
                            {pat.email}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 font-bold rounded text-[10px]">
                              {pat.bloodGroup || "N/A"}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono text-gray-400">
                            {pat.dateOfBirth || "N/A"}
                          </td>
                          <td className="py-4 px-4 max-w-[200px] truncate text-gray-500">
                            {pat.address || "No address filed"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
