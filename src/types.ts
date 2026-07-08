export enum UserRole {
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  ADMIN = "ADMIN"
}

export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED"
}

export interface User {
  id: string;
  email: string;
  passwordHash?: string; // Kept hidden on the backend
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
}

export interface Doctor {
  id: string; // matches User ID (role: DOCTOR) or unique ID
  userId: string;
  deptId: string;
  specialization: string;
  experienceYears: number;
  consultationFee: number;
  bio: string;
  city?: string;
  hospital?: string;
}

export interface Patient {
  id: string; // matches User ID (role: PATIENT) or unique ID
  userId: string;
  dateOfBirth: string;
  bloodGroup: string;
  address: string;
  district?: string;
  city?: string;
  preferredHospital?: string;
}

export interface Appointment {
  id: string;
  patientId: string; // User ID of patient
  doctorId: string; // Doctor entity ID or doctor user ID
  appointmentDate: string; // YYYY-MM-DD
  slotTime: string; // HH:MM
  status: AppointmentStatus;
  symptomsDescription: string;
  aiSuggested: boolean;
  waitingTimeMinutes: number; // predicted waiting time
  createdAt: string;
  reminderSent?: boolean;
  forFamilyMember?: string;
  city?: string;
  hospital?: string;
}

export interface DoctorAvailability {
  id: string;
  doctorId: string;
  dayOfWeek: string; // Monday, Tuesday, etc.
  startTime: string; // HH:MM
  endTime: string; // HH:MM
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: "REMINDER" | "STATUS_UPDATE" | "SYSTEM";
  isRead: boolean;
  createdAt: string;
  scheduledAt?: string; // ISO string when this reminder should trigger
  isSent?: boolean; // whether the daemon has dispatched it
  appointmentId?: string; // link to the corresponding appointment
}

export interface AILog {
  id: string;
  userId: string;
  query: string;
  response: string;
  recommendationType: "SYMPTOM_ANALYZER" | "SLOT_RECOMMENDATION" | "WAITING_TIME" | "CHAT_ASSISTANT" | "PERSONALIZED_WELLNESS_TIPS";
  createdAt: string;
}

// Composite / Unified Types for UI ease of use
export interface DoctorWithProfile {
  id: string;
  userId: string;
  deptId: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  experienceYears: number;
  consultationFee: number;
  bio: string;
  departmentName: string;
  availabilities: DoctorAvailability[];
  city?: string;
  hospital?: string;
}

export interface AppointmentDetail extends Appointment {
  patientName: string;
  patientEmail: string;
  doctorName: string;
  doctorSpecialization: string;
  departmentName: string;
  city?: string;
  hospital?: string;
}
