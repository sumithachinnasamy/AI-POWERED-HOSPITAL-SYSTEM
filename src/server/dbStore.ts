import fs from "fs";
import path from "path";
import { 
  User, 
  Doctor, 
  Patient, 
  Department, 
  Appointment, 
  DoctorAvailability, 
  Notification, 
  AILog,
  UserRole,
  AppointmentStatus
} from "../types.js";

const DB_FILE = path.join(process.cwd(), "src", "db.json");

interface DatabaseSchema {
  users: User[];
  departments: Department[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  availabilities: DoctorAvailability[];
  notifications: Notification[];
  aiLogs: AILog[];
}

// Global In-Memory Cache
let db: DatabaseSchema = {
  users: [],
  departments: [],
  doctors: [],
  patients: [],
  appointments: [],
  availabilities: [],
  notifications: [],
  aiLogs: []
};

function ensureDbDirectory() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function saveDb() {
  ensureDbDirectory();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

export function loadDb() {
  try {
    ensureDbDirectory();
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf8");
      db = JSON.parse(data);

      // Dynamically patch existing records with City/Hospital so we don't have blank values
      const defaultCities = ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Vellore"];
      const defaultHospitals: Record<string, string[]> = {
        "Chennai": ["Apollo Hospitals Chennai", "Aura Medical - Chennai Main", "Fortis Malar Hospital"],
        "Coimbatore": ["KGM Hospital Coimbatore", "Aura West Clinic & Urgent Care - Coimbatore", "Ganga Hospital"],
        "Madurai": ["Meenakshi Mission Hospital Madurai", "Aura Care - Madurai Center"],
        "Tiruchirappalli": ["Frontline Hospital Trichy", "Kaveri Hospital Trichy"],
        "Vellore": ["CMC Hospital Vellore", "Nalam Clinic Vellore"]
      };

      db.doctors = db.doctors.map((d, index) => {
        const city = d.city || defaultCities[index % defaultCities.length];
        const hosps = defaultHospitals[city] || ["Aura Medical - Chennai Main"];
        const hospital = d.hospital || hosps[index % hosps.length];
        return { ...d, city, hospital };
      });

      db.patients = db.patients.map((p, index) => {
        const city = p.city || "Chennai";
        const preferredHospital = p.preferredHospital || "Aura Medical - Chennai Main";
        const district = p.district || "Chennai";
        return { ...p, city, preferredHospital, district };
      });

      saveDb();
    } else {
      seedDefaultData();
    }
  } catch (error) {
    console.error("Error loading database, seeding default data instead:", error);
    seedDefaultData();
  }
}

function seedDefaultData() {
  console.log("Seeding default database records...");
  
  // 1. Departments
  const departments: Department[] = [
    { id: "dept_1", name: "General Medicine", description: "Primary care, health screenings, and general health management." },
    { id: "dept_2", name: "Pediatrics", description: "Specialized medical care for infants, children, and adolescents." },
    { id: "dept_3", name: "Cardiology", description: "Diagnosis and treatment of heart, artery, and vascular conditions." },
    { id: "dept_4", name: "Dermatology", description: "Specialized care for skin, hair, nails, and cosmetic issues." },
    { id: "dept_5", name: "Orthopedics", description: "Surgical and non-surgical treatment of bone and muscle injuries." },
    { id: "dept_6", name: "Neurology", description: "Assessment and treatment of brain and nervous system disorders." },
    { id: "dept_7", name: "Psychiatry", description: "Comprehensive mental health care and therapy services." }
  ];

  // 2. Users (Passwords are in-plain text in db.json for simplicity, or we can use standard hashes. We will check against plain text or mock secure match)
  const users: User[] = [
    // Admin
    { id: "u_admin", email: "admin@hospital.com", passwordHash: "admin123", firstName: "System", lastName: "Administrator", role: UserRole.ADMIN, createdAt: new Date().toISOString() },
    
    // Doctors
    { id: "u_doc1", email: "alice.smith@hospital.com", passwordHash: "doctor123", firstName: "Alice", lastName: "Smith", role: UserRole.DOCTOR, createdAt: new Date().toISOString() },
    { id: "u_doc2", email: "bob.johnson@hospital.com", passwordHash: "doctor123", firstName: "Bob", lastName: "Johnson", role: UserRole.DOCTOR, createdAt: new Date().toISOString() },
    { id: "u_doc3", email: "clara.williams@hospital.com", passwordHash: "doctor123", firstName: "Clara", lastName: "Williams", role: UserRole.DOCTOR, createdAt: new Date().toISOString() },
    { id: "u_doc4", email: "david.lee@hospital.com", passwordHash: "doctor123", firstName: "David", lastName: "Lee", role: UserRole.DOCTOR, createdAt: new Date().toISOString() },
    { id: "u_doc5", email: "emily.davis@hospital.com", passwordHash: "doctor123", firstName: "Emily", lastName: "Davis", role: UserRole.DOCTOR, createdAt: new Date().toISOString() },

    // Patients
    { id: "u_pat1", email: "patient@hospital.com", passwordHash: "patient123", firstName: "John", lastName: "Doe", role: UserRole.PATIENT, createdAt: new Date().toISOString() },
    { id: "u_pat2", email: "sarah.connor@hospital.com", passwordHash: "patient123", firstName: "Sarah", lastName: "Connor", role: UserRole.PATIENT, createdAt: new Date().toISOString() }
  ];

  // 3. Doctor Profiles
  const doctors: Doctor[] = [
    { id: "d_doc1", userId: "u_doc1", deptId: "dept_1", specialization: "Family Medicine & Chronic Care", experienceYears: 12, consultationFee: 50.00, bio: "Expert in primary care, chronic condition management, and family health wellness.", city: "Chennai", hospital: "Apollo Hospitals Chennai" },
    { id: "d_doc2", userId: "u_doc2", deptId: "dept_2", specialization: "Pediatric Care & Vaccinations", experienceYears: 8, consultationFee: 60.00, bio: "Dedicated pediatrician focused on physical growth, development, and pediatric immunization.", city: "Coimbatore", hospital: "KGM Hospital Coimbatore" },
    { id: "d_doc3", userId: "u_doc3", deptId: "dept_3", specialization: "Interventional Cardiology", experienceYears: 15, consultationFee: 120.00, bio: "Specialist in cardiovascular diseases, cardiac catheterization, and coronary artery treatments.", city: "Madurai", hospital: "Meenakshi Mission Hospital Madurai" },
    { id: "d_doc4", userId: "u_doc4", deptId: "dept_4", specialization: "Clinical & Aesthetic Dermatology", experienceYears: 10, consultationFee: 75.00, bio: "Providing diagnostic expertise in skin cancer prevention, acne therapy, and aesthetic procedures.", city: "Tiruchirappalli", hospital: "Kaveri Hospital Trichy" },
    { id: "d_doc5", userId: "u_doc5", deptId: "dept_5", specialization: "Sports Medicine & Joint Reconstruction", experienceYears: 9, consultationFee: 90.00, bio: "Focused on orthopedic trauma, joint disorders, and sports-related muscle/bone rehabilitation.", city: "Vellore", hospital: "CMC Hospital Vellore" }
  ];

  // 4. Patient Profiles
  const patients: Patient[] = [
    { id: "p_pat1", userId: "u_pat1", dateOfBirth: "1990-05-15", bloodGroup: "O+", address: "123 Health Ave, Medical District", district: "Chennai", city: "Chennai", preferredHospital: "Apollo Hospitals Chennai" },
    { id: "p_pat2", userId: "u_pat2", dateOfBirth: "1985-11-23", bloodGroup: "A-", address: "456 Sector 7, Cyberdyne Lane", district: "Coimbatore", city: "Coimbatore", preferredHospital: "KGM Hospital Coimbatore" }
  ];

  // 5. Availabilities
  const availabilities: DoctorAvailability[] = [];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slotHours = [
    { start: "09:00", end: "12:00" },
    { start: "14:00", end: "17:00" }
  ];

  let slotIdCounter = 1;
  doctors.forEach((doc) => {
    // Generate 3 random days of availability for each doctor
    const docDays = days.slice(0, 3 + (parseInt(doc.id.slice(-1)) % 3));
    docDays.forEach((day) => {
      slotHours.forEach((hour) => {
        availabilities.push({
          id: `slot_${slotIdCounter++}`,
          doctorId: doc.id,
          dayOfWeek: day,
          startTime: hour.start,
          endTime: hour.end
        });
      });
    });
  });

  // 6. Pre-filled Appointments
  const appointments: Appointment[] = [
    {
      id: "app_1",
      patientId: "u_pat1",
      doctorId: "d_doc1",
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Tomorrow
      slotTime: "10:30",
      status: AppointmentStatus.CONFIRMED,
      symptomsDescription: "I have had a mild fever and throat pain for three days.",
      aiSuggested: true,
      waitingTimeMinutes: 15,
      createdAt: new Date().toISOString()
    },
    {
      id: "app_2",
      patientId: "u_pat2",
      doctorId: "d_doc3",
      appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Day after tomorrow
      slotTime: "15:00",
      status: AppointmentStatus.PENDING,
      symptomsDescription: "Occasional mild chest tightness during morning walks.",
      aiSuggested: true,
      waitingTimeMinutes: 30,
      createdAt: new Date().toISOString()
    }
  ];

  // 7. Pre-filled Notifications
  const notifications: Notification[] = [
    {
      id: "n_1",
      userId: "u_pat1",
      message: "Your appointment with Dr. Alice Smith is scheduled for tomorrow at 10:30.",
      type: "REMINDER",
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ];

  // 8. AI Logs
  const aiLogs: AILog[] = [
    {
      id: "log_1",
      userId: "u_pat1",
      query: "I have fever, cough and headache.",
      response: "Based on your symptoms (fever, cough, headache), the most recommended specialty is General Medicine. Dr. Alice Smith is available tomorrow morning.",
      recommendationType: "SYMPTOM_ANALYZER",
      createdAt: new Date().toISOString()
    }
  ];

  db = {
    users,
    departments,
    doctors,
    patients,
    appointments,
    availabilities,
    notifications,
    aiLogs
  };

  saveDb();
}

// Database Helpers / Interface
export const dbStore = {
  getUsers: () => db.users,
  getDepartments: () => db.departments,
  getDoctors: () => db.doctors,
  getPatients: () => db.patients,
  getAppointments: () => db.appointments,
  getAvailabilities: () => db.availabilities,
  getNotifications: () => db.notifications,
  getAiLogs: () => db.aiLogs,

  addUser: (user: User) => { db.users.push(user); saveDb(); },
  addDoctor: (doc: Doctor) => { db.doctors.push(doc); saveDb(); },
  addPatient: (pat: Patient) => { db.patients.push(pat); saveDb(); },
  addAppointment: (app: Appointment) => { db.appointments.push(app); saveDb(); },
  addAvailability: (avail: DoctorAvailability) => { db.availabilities.push(avail); saveDb(); },
  addNotification: (noti: Notification) => { db.notifications.push(noti); saveDb(); },
  addAiLog: (log: AILog) => { db.aiLogs.push(log); saveDb(); },

  updateUser: (updatedUser: Partial<User> & { id: string }) => {
    db.users = db.users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u);
    saveDb();
  },
  updateDoctor: (updatedDoc: Partial<Doctor> & { id: string }) => {
    db.doctors = db.doctors.map(d => d.id === updatedDoc.id ? { ...d, ...updatedDoc } : d);
    saveDb();
  },
  updatePatient: (updatedPat: Partial<Patient> & { id: string }) => {
    db.patients = db.patients.map(p => p.id === updatedPat.id ? { ...p, ...updatedPat } : p);
    saveDb();
  },
  updateAppointment: (updatedApp: Partial<Appointment> & { id: string }) => {
    db.appointments = db.appointments.map(a => a.id === updatedApp.id ? { ...a, ...updatedApp } : a);
    saveDb();
  },
  updateAvailability: (id: string, updatedAvail: Partial<DoctorAvailability>) => {
    db.availabilities = db.availabilities.map(av => av.id === id ? { ...av, ...updatedAvail } : av);
    saveDb();
  },
  deleteAvailability: (id: string) => {
    db.availabilities = db.availabilities.filter(av => av.id !== id);
    saveDb();
  },
  deleteDoctor: (id: string) => {
    // Also delete user representation
    const doc = db.doctors.find(d => d.id === id);
    if (doc) {
      db.users = db.users.filter(u => u.id !== doc.userId);
    }
    db.doctors = db.doctors.filter(d => d.id !== id);
    saveDb();
  },
  deletePatient: (id: string) => {
    const pat = db.patients.find(p => p.id === id);
    if (pat) {
      db.users = db.users.filter(u => u.id !== pat.userId);
    }
    db.patients = db.patients.filter(p => p.id !== id);
    saveDb();
  },
  deleteAppointment: (id: string) => {
    db.appointments = db.appointments.filter(a => a.id !== id);
    saveDb();
  },
  markNotificationRead: (id: string) => {
    db.notifications = db.notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    saveDb();
  }
};

// Auto-Load on import
loadDb();
