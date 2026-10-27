import React, { useState, useEffect } from 'react';
import {
  User,
  LogOut,
  Trophy,
  Activity,
  Mail,
  Calendar,
  ShieldCheck,
  MapPin,
  Target,
  Edit3,
  Save,
  CheckCircle2,
  Lock,
  Share2
} from 'lucide-react';
import { updateAthleteProfile, fetchAthleteProfile, fetchAthleteProgress } from '../services/api';

export default function ProfileScreen({ user, onUpdateUser, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || 18,
    gender: user?.gender || 'Male',
    primary_sport: user?.primary_sport || 'Sit-ups and Core Endurance',
    location: user?.location || '',
    fitness_goals: user?.fitness_goals || '',
    bio: user?.bio || '',
    coach_share_enabled: user?.coach_share_enabled || false
  });

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      try {
        const [prof, prog] = await Promise.all([
          fetchAthleteProfile(user.id),
          fetchAthleteProgress(user.id)
        ]);
        if (prof) {
          setFormData({
            name: prof.name || '',
            age: prof.age || 18,
            gender: prof.gender || 'Male',
            primary_sport: prof.primary_sport || 'Sit-ups and Core Endurance',
            location: prof.location || '',
            fitness_goals: prof.fitness_goals || '',
            bio: prof.bio || '',
            coach_share_enabled: prof.coach_share_enabled || false
          });
        }
        if (prog) {
          setProgress(prog);
        }
      } catch (e) {
        console.warn('Profile load err:', e);
      }
    }
    loadData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await updateAthleteProfile(user.id, formData);
      if (res.success && res.user) {
        setSuccessMsg('Profile updated and saved to database successfully!');
        if (onUpdateUser) onUpdateUser(res.user);
        setIsEditing(false);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in pb-4 text-[#303831]">
      {/* Top Profile Card */}
      <div className="p-5 rounded-3xl bg-white border border-[#E5E7E2] text-center relative overflow-hidden shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#DCE8D8] border-2 border-[#46664F]/30 p-1 mx-auto mb-2 flex items-center justify-center text-[#46664F] font-black text-2xl">
          {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
        </div>

        <h3 className="text-base font-black text-[#303831]">{formData.name || 'Athlete'}</h3>
        <p className="text-xs text-[#46664F] font-semibold">{formData.primary_sport}</p>

        {formData.location && (
          <p className="text-[11px] text-[#5A655C] flex items-center justify-center gap-1 mt-1">
            <MapPin size={11} className="text-[#8FB8AC]" /> {formData.location}
          </p>
        )}

        <div className="flex justify-center gap-1.5 mt-2.5">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F3F1E8] border border-[#E5E7E2] text-[#5A655C]">
            Age: {formData.age}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F3F1E8] border border-[#E5E7E2] text-[#5A655C]">
            {formData.gender}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCE8D8] border border-[#46664F]/20 text-[#46664F]">
            Verified Athlete
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-[#DCE8D8] text-[#46664F] text-xs font-semibold flex items-center gap-1.5">
          <CheckCircle2 size={14} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-[#C85A48]/10 text-[#C85A48] text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Personal Bests derived from real assessments */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5E7E2] space-y-2">
        <h4 className="text-[11px] font-bold text-[#5A655C] uppercase tracking-wider flex items-center gap-1">
          <Trophy size={13} className="text-[#D9822B]" /> Validated Personal Bests
        </h4>
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-2 rounded-xl bg-[#F3F1E8]">
            <span className="text-sm font-black text-[#303831] block">
              {progress?.highest_score || 0}
            </span>
            <span className="text-[9px] text-[#5A655C] font-semibold">Peak Form</span>
          </div>
          <div className="p-2 rounded-xl bg-[#F3F1E8]">
            <span className="text-sm font-black text-[#303831] block">
              {progress?.total_reps || 0}
            </span>
            <span className="text-[9px] text-[#5A655C] font-semibold">Total Reps</span>
          </div>
          <div className="p-2 rounded-xl bg-[#F3F1E8]">
            <span className="text-sm font-black text-[#303831] block">
              {progress?.total_assessments || 0}
            </span>
            <span className="text-[9px] text-[#5A655C] font-semibold">Sessions</span>
          </div>
        </div>
      </div>

      {/* Profile Details & Edit Mode */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5E7E2] space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-[11px] font-bold text-[#5A655C] uppercase tracking-wider">
            Athlete Information
          </h4>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-bold text-[#46664F] flex items-center gap-1 hover:underline"
          >
            <Edit3 size={13} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-2.5 pt-1">
            <div>
              <label className="block text-[10px] font-bold text-[#5A655C] uppercase mb-0.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="sport-input text-xs py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-[#5A655C] uppercase mb-0.5">Age</label>
                <input
                  type="number"
                  name="age"
                  min="10"
                  max="60"
                  value={formData.age}
                  onChange={handleChange}
                  className="sport-input text-xs py-2"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#5A655C] uppercase mb-0.5">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="sport-input text-xs py-2"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#5A655C] uppercase mb-0.5">Primary Sport</label>
              <select
                name="primary_sport"
                value={formData.primary_sport}
                onChange={handleChange}
                className="sport-input text-xs py-2"
              >
                <option value="Sit-ups and Core Endurance">Sit-ups and Core Endurance</option>
                <option value="Squats and Lower-Body Movement">Squats and Lower-Body Movement</option>
                <option value="Jumping Exercises">Jumping Exercises</option>
                <option value="Running and Sprinting">Running and Sprinting</option>
                <option value="Balance and Posture Assessment">Balance and Posture Assessment</option>
                <option value="Cricket">Cricket</option>
                <option value="Basketball">Basketball</option>
                <option value="General Fitness">General Fitness</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#5A655C] uppercase mb-0.5">Location (District / State)</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Coimbatore, Tamil Nadu"
                className="sport-input text-xs py-2"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#5A655C] uppercase mb-0.5">Fitness Goals</label>
              <input
                type="text"
                name="fitness_goals"
                value={formData.fitness_goals}
                onChange={handleChange}
                placeholder="e.g. Build core stamina for state trials"
                className="sport-input text-xs py-2"
              />
            </div>

            {/* Privacy Sharing Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="coach_share_enabled"
                name="coach_share_enabled"
                checked={formData.coach_share_enabled}
                onChange={handleChange}
                className="rounded accent-[#46664F] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="coach_share_enabled" className="text-xs text-[#303831] font-medium cursor-pointer">
                Allow authorized grassroots coaches to review assessment reports
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-forest text-xs py-2.5 mt-2 flex items-center justify-center gap-1.5"
            >
              <Save size={13} /> {loading ? 'Saving to Database...' : 'Save Changes to Profile'}
            </button>
          </form>
        ) : (
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#5A655C]">
              <Mail size={14} className="text-[#8FB8AC] shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            {formData.fitness_goals && (
              <div className="flex items-start gap-2 text-[#5A655C]">
                <Target size={14} className="text-[#8FB8AC] shrink-0 mt-0.5" />
                <span>Goal: {formData.fitness_goals}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-[#5A655C]">
              <Share2 size={14} className="text-[#8FB8AC] shrink-0" />
              <span>
                Coach Sharing: {formData.coach_share_enabled ? (
                  <strong className="text-[#3E8A5E]">Enabled</strong>
                ) : (
                  <strong className="text-[#7C887E]">Private by Default</strong>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* College Academic Mini-Project Note */}
      <div className="p-3.5 rounded-2xl bg-[#F3F1E8] border border-[#E5E7E2] text-xs space-y-1">
        <p className="font-bold text-[#46664F] flex items-center gap-1.5 text-[11px]">
          <Activity size={13} /> College Mini-Project Architecture
        </p>
        <p className="text-[11px] text-[#5A655C] leading-snug">
          AI-Powered Mobile Platform for Democratizing Sports Talent Assessment
        </p>
        <p className="text-[10px] text-[#7C887E]">
          Full-Stack: React (Vite) + FastAPI (Python 3.13) + MediaPipe Pose + SQLite3
        </p>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={onLogout}
        className="w-full py-2.5 rounded-xl bg-[#C85A48]/10 hover:bg-[#C85A48]/20 border border-[#C85A48]/25 text-[#C85A48] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
      >
        <LogOut size={14} /> Sign Out of Platform
      </button>
    </div>
  );
}
