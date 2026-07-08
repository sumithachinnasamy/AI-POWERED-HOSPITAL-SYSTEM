import React, { useState, useEffect } from "react";
import { api } from "../api.js";
import { UserRole } from "../types.js";
import { Heart, User, Mail, ShieldAlert, Key, MapPin, Droplet, Calendar, HeartPulse } from "lucide-react";
import { CITIES_AND_HOSPITALS } from "./AuthPage.js";

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

interface ProfileSettingsProps {
  user: any;
  onProfileUpdated: (updatedUser: any) => void;
  onNavigateBack: () => void;
}

export default function ProfileSettings({ user, onProfileUpdated, onNavigateBack }: ProfileSettingsProps) {
  // Common states
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [email, setEmail] = useState(user.email || "");

  // Patient states
  const [dob, setDob] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [preferredHospital, setPreferredHospital] = useState("");

  // Doctor states
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [fee, setFee] = useState("");
  const [bio, setBio] = useState("");

  // Password modification state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfileExt() {
      try {
        const profile = await api.getMe();
        // Set specific fields
        if (user.role === UserRole.PATIENT && profile.patientProfile) {
          setDob(profile.patientProfile.dateOfBirth || "");
          setBloodGroup(profile.patientProfile.bloodGroup || "");
          setAddress(profile.patientProfile.address || "");
          setDistrict(profile.patientProfile.district || "");
          setCity(profile.patientProfile.city || "");
          setPreferredHospital(profile.patientProfile.preferredHospital || "");
        } else if (user.role === UserRole.DOCTOR && profile.doctorProfile) {
          setSpecialization(profile.doctorProfile.specialization || "");
          setExperience(profile.doctorProfile.experienceYears || "");
          setFee(profile.doctorProfile.consultationFee || "");
          setBio(profile.doctorProfile.bio || "");
        }
      } catch (err) {
        console.error("Failed to load extended role profiles:", err);
      }
    }
    loadProfileExt();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload: any = {
        firstName,
        lastName,
        email
      };

      if (user.role === UserRole.PATIENT) {
        payload.dateOfBirth = dob;
        payload.bloodGroup = bloodGroup;
        payload.address = address;
        payload.district = district;
        payload.city = city;
        payload.preferredHospital = preferredHospital;
      } else if (user.role === UserRole.DOCTOR) {
        payload.specialization = specialization;
        payload.experienceYears = Number(experience) || 1;
        payload.consultationFee = Number(fee) || 50;
        payload.bio = bio;
      }

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const response = await api.updateProfile(payload);
      setSuccess("Your account configurations have been successfully saved.");
      setCurrentPassword("");
      setNewPassword("");
      onProfileUpdated(response.user);
    } catch (err: any) {
      setError(err.message || "Failed to update configurations. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Header Ribbon */}
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateBack}
            className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-all flex items-center gap-1 cursor-pointer"
          >
            ← Back to Workspace
          </button>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Account Settings</span>
        </div>

        {/* Settings Container card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-50">
            <HeartPulse className="w-6 h-6 text-teal-600" />
            <div>
              <h1 className="font-extrabold text-gray-900 text-lg tracking-tight">Configure User File</h1>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">SECURED PATIENT & STAFF CREDENTIALS</p>
            </div>
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{error}</p>}
          {success && <p className="text-xs text-emerald-600 bg-emerald-50 p-2.5 rounded font-medium">{success}</p>}

          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Common Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">First Name</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none text-gray-800"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Last Name</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none text-gray-800"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
              <input
                type="email"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Patient Specific Fields */}
            {user.role === UserRole.PATIENT && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none text-gray-800"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Blood Group</label>
                    <select
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none text-gray-800"
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

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Home District</label>
                  <select
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none text-gray-800"
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
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Home City</label>
                    <select
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none text-gray-800"
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

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Preferred Hospital</label>
                    <select
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none text-gray-800"
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

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Home Address</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none text-gray-800"
                    placeholder="Residential address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Doctor Specific Fields */}
            {user.role === UserRole.DOCTOR && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Physician Specialization</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-gray-800"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Years of Experience</label>
                    <input
                      type="number"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-gray-800"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Consultation Fee ($)</label>
                    <input
                      type="number"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-gray-800"
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Professional Bio</label>
                  <textarea
                    rows={2}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none text-gray-800 resize-none"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Password Modification block */}
            <div className="border-t border-gray-50 pt-4 space-y-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-500" /> Optional: Reset Authorization Key
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Current Password</label>
                  <input
                    type="password"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none text-gray-800"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">New Security Password</label>
                  <input
                    type="password"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none text-gray-800"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all uppercase tracking-wider disabled:opacity-45"
            >
              {loading ? "Saving Configurations..." : "Synchronize Profile Record"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
