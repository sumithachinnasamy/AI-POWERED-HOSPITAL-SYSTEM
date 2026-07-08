import React, { useState, useEffect } from "react";
import { api } from "./api.js";
import { UserRole } from "./types.js";
import LandingPage from "./pages/LandingPage.js";
import AuthPage from "./pages/AuthPage.js";
import PatientDashboard from "./pages/PatientDashboard.js";
import DoctorDashboard from "./pages/DoctorDashboard.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import ProfileSettings from "./pages/ProfileSettings.js";
import { Heart, Activity } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"landing" | "login" | "register" | "dashboard" | "settings">("landing");

  // Attempt to restore user session on initial paint
  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("hospital_jwt");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.getMe();
        setUser(response.user);
        setView("dashboard");
      } catch (err) {
        console.info("Session expired or invalid, clearing token.");
        localStorage.removeItem("hospital_jwt");
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const handleAuthSuccess = (authenticatedUser: any) => {
    setUser(authenticatedUser);
    setView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("hospital_jwt");
    setUser(null);
    setView("landing");
  };

  const handleProfileUpdated = (updatedUser: any) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen flex flex-col items-center justify-center text-white font-sans">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center mx-auto text-white shadow-xl animate-pulse">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-widest uppercase">AURA HOSPITAL SYSTEM</h1>
            <p className="text-[10px] text-gray-400 font-medium">Synchronizing secured clinical nodes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Router matching
  if (!user) {
    if (view === "login") {
      return (
        <AuthPage 
          initialMode="login"
          onAuthSuccess={handleAuthSuccess} 
          onNavigateHome={() => setView("landing")} 
        />
      );
    }
    if (view === "register") {
      return (
        <AuthPage 
          initialMode="register"
          onAuthSuccess={handleAuthSuccess} 
          onNavigateHome={() => setView("landing")} 
        />
      );
    }
    return <LandingPage onNavigate={(target) => setView(target)} />;
  }

  // Settings page routing
  if (view === "settings") {
    return (
      <ProfileSettings 
        user={user} 
        onProfileUpdated={handleProfileUpdated} 
        onNavigateBack={() => setView("dashboard")} 
      />
    );
  }

  // Dashboard role routing
  switch (user.role) {
    case UserRole.PATIENT:
      return (
        <PatientDashboard 
          user={user} 
          onLogout={handleLogout} 
          onNavigateToSettings={() => setView("settings")} 
        />
      );
    case UserRole.DOCTOR:
      return (
        <DoctorDashboard 
          user={user} 
          onLogout={handleLogout} 
          onNavigateToSettings={() => setView("settings")} 
        />
      );
    case UserRole.ADMIN:
      return (
        <AdminDashboard 
          user={user} 
          onLogout={handleLogout} 
          onNavigateToSettings={() => setView("settings")} 
        />
      );
    default:
      return (
        <div className="p-8 text-center text-xs text-red-500 font-bold bg-white min-h-screen flex flex-col justify-center items-center">
          Critical Authorization Error: Unknown Roster Role
          <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded">Logout</button>
        </div>
      );
  }
}
