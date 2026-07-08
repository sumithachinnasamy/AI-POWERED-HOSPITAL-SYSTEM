import { 
  User, 
  UserRole, 
  Department, 
  DoctorWithProfile, 
  AppointmentDetail, 
  DoctorAvailability, 
  Notification, 
  AILog 
} from "./types.js";

const API_BASE = "";

function getHeaders() {
  const token = localStorage.getItem("hospital_jwt");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // --- Authentication APIs ---
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    localStorage.setItem("hospital_jwt", data.token);
    return data;
  },

  register: async (payload: any) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    localStorage.setItem("hospital_jwt", data.token);
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Session expired");
    return data;
  },

  updateProfile: async (payload: any) => {
    const res = await fetch(`${API_BASE}/api/auth/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update profile");
    return data;
  },

  logout: () => {
    localStorage.removeItem("hospital_jwt");
  },

  // --- Department APIs ---
  getDepartments: async (): Promise<Department[]> => {
    const res = await fetch(`${API_BASE}/api/departments`);
    return res.json();
  },

  // --- Doctor APIs ---
  getDoctors: async (): Promise<DoctorWithProfile[]> => {
    const res = await fetch(`${API_BASE}/api/doctors`);
    return res.json();
  },

  addDoctor: async (payload: any) => {
    const res = await fetch(`${API_BASE}/api/doctors`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to add doctor");
    return data;
  },

  deleteDoctor: async (id: string) => {
    const res = await fetch(`${API_BASE}/api/doctors/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  // --- Patient APIs (Admin) ---
  getPatients: async (): Promise<any[]> => {
    const res = await fetch(`${API_BASE}/api/patients`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  deletePatient: async (id: string) => {
    const res = await fetch(`${API_BASE}/api/patients/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  // --- Appointment APIs ---
  getAppointments: async (): Promise<AppointmentDetail[]> => {
    const res = await fetch(`${API_BASE}/api/appointments`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  bookAppointment: async (payload: {
    doctorId: string;
    appointmentDate: string;
    slotTime: string;
    symptomsDescription: string;
    aiSuggested?: boolean;
    forFamilyMember?: string;
  }) => {
    const res = await fetch(`${API_BASE}/api/appointments`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to book appointment");
    return data;
  },

  updateAppointmentStatus: async (id: string, payload: { status: string; slotTime?: string; appointmentDate?: string }) => {
    const res = await fetch(`${API_BASE}/api/appointments/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update appointment");
    return data;
  },

  cancelAppointment: async (id: string) => {
    const res = await fetch(`${API_BASE}/api/appointments/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  // --- Doctor Availability APIs ---
  getAvailabilities: async (): Promise<DoctorAvailability[]> => {
    const res = await fetch(`${API_BASE}/api/doctors/availabilities`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  addAvailability: async (payload: { dayOfWeek: string; startTime: string; endTime: string }) => {
    const res = await fetch(`${API_BASE}/api/doctors/availabilities`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to add slot");
    return data;
  },

  deleteAvailability: async (id: string) => {
    const res = await fetch(`${API_BASE}/api/doctors/availabilities/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  // --- Notifications APIs ---
  getNotifications: async (): Promise<Notification[]> => {
    const res = await fetch(`${API_BASE}/api/notifications`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  markNotificationRead: async (id: string) => {
    const res = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
      method: "POST",
      headers: getHeaders(),
    });
    return res.json();
  },

  getNotificationServiceStatus: async () => {
    const res = await fetch(`${API_BASE}/api/notifications/service/status`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  triggerNotificationServiceCheck: async () => {
    const res = await fetch(`${API_BASE}/api/notifications/service/check`, {
      method: "POST",
      headers: getHeaders(),
    });
    return res.json();
  },

  toggleNotificationService: async () => {
    const res = await fetch(`${API_BASE}/api/notifications/service/toggle`, {
      method: "POST",
      headers: getHeaders(),
    });
    return res.json();
  },

  // --- Admin Analytics APIs ---
  getAnalytics: async () => {
    const res = await fetch(`${API_BASE}/api/admin/analytics`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch analytics");
    return data;
  },

  // --- AI Engines ---
  analyzeSymptoms: async (symptoms: string) => {
    const res = await fetch(`${API_BASE}/api/ai/analyze-symptoms`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ symptoms }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Symptom analysis failed");
    return data;
  },

  sendChatMessage: async (message: string, history?: { sender: "user" | "bot"; text: string }[]) => {
    const res = await fetch(`${API_BASE}/api/ai/chat`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ message, history }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "AI chat connection failed");
    return data;
  },

  // --- Family Members APIs ---
  getFamilyMembers: async () => {
    const res = await fetch(`${API_BASE}/api/family-members`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  addFamilyMember: async (payload: { name: string; relationship: string; age?: string; bloodGroup?: string }) => {
    const res = await fetch(`${API_BASE}/api/family-members`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to add family member");
    return data;
  },

  // --- Advanced AI Tools APIs ---
  analyzeReport: async (reportText: string, reportName?: string) => {
    const res = await fetch(`${API_BASE}/api/ai/analyze-report`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ reportText, reportName }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Report summary generation failed");
    return data;
  },

  getHealthTips: async (lang?: string) => {
    const res = await fetch(`${API_BASE}/api/ai/health-tips?lang=${lang || "English"}`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to retrieve health tips");
    return data;
  },

  getPersonalizedWellnessTips: async (wellnessFocus: string) => {
    const res = await fetch(`${API_BASE}/api/ai/personalized-tips`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ wellnessFocus }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to generate personalized wellness tips");
    return data;
  },
};
