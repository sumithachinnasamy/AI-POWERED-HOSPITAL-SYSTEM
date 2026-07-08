import React, { useState } from "react";
import { api } from "../api.js";
import { Heart, Mail, Lock, User, Calendar, MapPin, Droplet, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const TAMIL_NADU_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
  "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
  "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
  "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
  "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
  "Vellore", "Viluppuram", "Virudhunagar"
];

export const CITIES_AND_HOSPITALS: Record<string, string[]> = {
  "Chennai": [
    "Apollo Hospitals Chennai",
    "Aura Medical - Chennai Main",
    "Fortis Malar Hospital",
    "Global Hospital Chennai"
  ],
  "Coimbatore": [
    "KGM Hospital Coimbatore",
    "Aura West Clinic & Urgent Care - Coimbatore",
    "Ganga Hospital",
    "PSG Hospitals Coimbatore"
  ],
  "Madurai": [
    "Meenakshi Mission Hospital Madurai",
    "Aura Care - Madurai Center",
    "Apollo Speciality Hospital Madurai"
  ],
  "Tiruchirappalli": [
    "Frontline Hospital Trichy",
    "Kaveri Hospital Trichy",
    "Maruti Hospital Trichy"
  ],
  "Vellore": [
    "CMC Hospital Vellore",
    "Nalam Clinic Vellore",
    "Apollo Clinic Vellore"
  ]
};

interface AuthPageProps {
  onAuthSuccess: (user: any) => void;
  onNavigateHome: () => void;
  initialMode?: "login" | "register";
}

export default function AuthPage({ onAuthSuccess, onNavigateHome, initialMode = "login" }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  
  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register States
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [preferredHospital, setPreferredHospital] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError("Please fill in both email and password.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const data = await api.login(loginEmail, loginPassword);
      onAuthSuccess(data.user);
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !firstName || !lastName || !district || !city || !preferredHospital) {
      setError("Please fill in all mandatory fields including district, city and preferred hospital.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const data = await api.register({
        email: regEmail,
        password: regPassword,
        firstName,
        lastName,
        dateOfBirth: dob,
        bloodGroup,
        address,
        district,
        city,
        preferredHospital
      });
      onAuthSuccess(data.user);
    } catch (err: any) {
      setError(err.message || "Registration failed. Email might already be taken.");
    } finally {
      setLoading(false);
    }
  };

  // Helper helper to populate demo account logins
  const handleQuickLogin = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setMode("login");
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-center items-center py-12 px-6 relative font-sans">
      
      {/* Background Photo with gradient overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/src/assets/images/doctor_patient_bg_1783016519169.jpg"
          alt="Clinic Doctor and Patient Background"
          className="w-full h-full object-cover opacity-[0.28]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-50/30 via-slate-50/85 to-teal-100/60" />
      </div>

      {/* Decorative ambient backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        
        {/* Brand Banner */}
        <div className="text-center space-y-2 cursor-pointer" onClick={onNavigateHome}>
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-md">
            <Heart className="w-6 h-6 fill-white/10" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-950 tracking-tight">AURA HEALTHCARE</h2>
            <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">Intelligent Medical Portal</p>
          </div>
        </div>

        {/* Auth Mode Tabs Switcher */}
        <div className="bg-white p-1 rounded-2xl border border-slate-150 shadow-sm flex">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer font-display ${mode === "login" ? "bg-teal-600 text-white shadow-md shadow-teal-600/15" : "text-slate-500 hover:text-slate-900"}`}
          >
            Access Portal
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer font-display ${mode === "register" ? "bg-teal-600 text-white shadow-md shadow-teal-600/15" : "text-slate-500 hover:text-slate-900"}`}
          >
            Register Patient
          </button>
        </div>

        {/* Core Auth Forms */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl space-y-6 premium-card">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest text-center border-b border-slate-100 pb-4 font-mono">
            {mode === "login" ? "Secure Portal Session" : "Patient File Creation"}
          </h3>

          {error && (
            <div className="flex gap-2 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <p className="font-semibold leading-relaxed">{error}</p>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    className="w-full rounded-xl border border-slate-250 pl-10 pr-4 py-3 text-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all text-slate-800 placeholder-slate-400 font-sans"
                    placeholder="physician@hospital.com or patient@hospital.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Security Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    className="w-full rounded-xl border border-slate-250 pl-10 pr-4 py-3 text-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all text-slate-800 placeholder-slate-400 font-sans"
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-500 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transition-all disabled:opacity-45 cursor-pointer hover:-translate-y-0.5"
              >
                {loading ? "Authenticating Token..." : "Secure Login"}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">First Name *</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none transition-all text-gray-800"
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Last Name *</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none transition-all text-gray-800"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Register Email *</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none transition-all text-gray-800"
                  placeholder="jane.doe@email.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Choose Password *</label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none transition-all text-gray-800"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Date of Birth</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none transition-all text-gray-800"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Blood Group</label>
                  <select
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none transition-all text-gray-800"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    <option value="">Select Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Choose District *</label>
                <select
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none transition-all text-gray-800"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                >
                  <option value="">Select District</option>
                  {TAMIL_NADU_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Choose City *</label>
                  <select
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none transition-all text-gray-800"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setPreferredHospital("");
                    }}
                    required
                  >
                    <option value="">Select City</option>
                    {Object.keys(CITIES_AND_HOSPITALS).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Preferred Hospital *</label>
                  <select
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none transition-all text-gray-800"
                    value={preferredHospital}
                    onChange={(e) => setPreferredHospital(e.target.value)}
                    disabled={!city}
                    required
                  >
                    <option value="">Select Hospital</option>
                    {city && CITIES_AND_HOSPITALS[city]?.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Home Address</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:outline-none transition-all text-gray-800"
                  placeholder="Street name, City, Zip"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all uppercase tracking-wider disabled:opacity-45"
              >
                {loading ? "Filing Patient Record..." : "Register Clinical Account"}
              </button>
            </form>
          )}
        </div>

        {/* Helper Quick Logins Grid for easy evaluation */}
        <div className="bg-slate-100/80 p-5 rounded-2xl border border-slate-200 space-y-3.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Quick Evaluation Access Keys
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {/* Patient Account */}
            <button
              onClick={() => handleQuickLogin("patient@hospital.com", "patient123")}
              className="flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-medium text-slate-700 text-left transition-all shadow-sm"
            >
              <div>
                <span className="font-bold text-teal-600 block">PATIENT PORTAL</span>
                <span className="text-gray-400 font-mono">patient@hospital.com • patient123</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
            </button>

            {/* Admin Account */}
            <button
              onClick={() => handleQuickLogin("admin@hospital.com", "admin123")}
              className="flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-medium text-slate-700 text-left transition-all shadow-sm"
            >
              <div>
                <span className="font-bold text-indigo-600 block">ADMINISTRATOR PORTAL</span>
                <span className="text-gray-400 font-mono">admin@hospital.com • admin123</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
