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
    <div className="space-y-6 animate-fade-in text-[#303831] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E6D8CB]">
        <div>
          <h2 className="text-2xl font-black text-[#303831] tracking-tight">
            Athlete Profile
          </h2>
          <p className="text-xs md:text-sm text-[#766660]">
            Manage personal athlete information, verified statistics, and regional registration.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="btn-outline text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Edit3 size={14} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      {/* Top Profile Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#FFF9F2] border border-[#E6D8CB] text-center relative overflow-hidden shadow-xs space-y-3">
        <div className="w-20 h-20 rounded-2xl bg-[#EFE4D8] border-2 border-[#722F46] p-1 mx-auto flex items-center justify-center text-[#722F46] font-black text-3xl shadow-sm">
          {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
        </div>

        <div>
          <h3 className="text-xl font-black text-[#303831]">{formData.name || 'Athlete'}</h3>
          <p className="text-xs text-[#722F46] font-bold mt-0.5">{formData.primary_sport}</p>
          {formData.location && (
            <p className="text-xs text-[#766660] flex items-center justify-center gap-1.5 mt-1 font-medium">
              <MapPin size={13} className="text-[#805044]" /> {formData.location}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2 pt-1">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F7F0E7] border border-[#E6D8CB] text-[#766660]">
            Age: {formData.age}
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F7F0E7] border border-[#E6D8CB] text-[#766660]">
            Gender: {formData.gender}
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#278653]/15 border border-[#278653]/30 text-[#278653] flex items-center gap-1">
            <ShieldCheck size={13} /> Verified Athlete
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-[#278653]/15 border border-[#278653]/30 text-[#278653] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-[#C47A32]/10 border border-[#C47A32]/20 text-[#C47A32] text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Validated Personal Bests */}
      <div className="p-6 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-[#766660] uppercase tracking-wider flex items-center gap-1.5">
          <Trophy size={14} className="text-[#C47A32]" /> Validated Personal Bests
        </h4>

        <div className="grid grid-cols-3 gap-3 text-center pt-1">
          <div className="p-3.5 rounded-xl bg-[#F7F0E7] border border-[#E6D8CB]">
            <span className="text-xl font-black text-[#722F46] block">
              {progress?.highest_score || 0}
            </span>
            <span className="text-[10px] text-[#766660] font-bold uppercase mt-0.5 block">Peak Form</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7F0E7] border border-[#E6D8CB]">
            <span className="text-xl font-black text-[#4B2925] block">
              {progress?.total_reps || 0}
            </span>
            <span className="text-[10px] text-[#766660] font-bold uppercase mt-0.5 block">Total Reps</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7F0E7] border border-[#E6D8CB]">
            <span className="text-xl font-black text-[#303831] block">
              {progress?.total_assessments || 0}
            </span>
            <span className="text-[10px] text-[#766660] font-bold uppercase mt-0.5 block">Sessions Logged</span>
          </div>
        </div>
      </div>

      {/* Profile Details & Form */}
      <div className="p-6 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-[#766660] uppercase tracking-wider">
          Athlete Details & Bio
        </h4>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#766660] uppercase mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="sport-input text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#766660] uppercase mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  min="10"
                  max="60"
                  value={formData.age}
                  onChange={handleChange}
                  className="sport-input text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#766660] uppercase mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="sport-input text-xs"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#766660] uppercase mb-1">Primary Discipline</label>
              <select
                name="primary_sport"
                value={formData.primary_sport}
                onChange={handleChange}
                className="sport-input text-xs"
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
              <label className="block text-xs font-bold text-[#766660] uppercase mb-1">Location (District / State)</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Coimbatore, Tamil Nadu"
                className="sport-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#766660] uppercase mb-1">Fitness Goals</label>
              <input
                type="text"
                name="fitness_goals"
                value={formData.fitness_goals}
                onChange={handleChange}
                placeholder="e.g. Build core stamina for state trials"
                className="sport-input text-xs"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#F7F0E7] border border-[#E6D8CB] flex items-center gap-3">
              <input
                type="checkbox"
                id="coach_share_enabled"
                name="coach_share_enabled"
                checked={formData.coach_share_enabled}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-[#722F46] cursor-pointer"
              />
              <label htmlFor="coach_share_enabled" className="text-xs text-[#303831] font-medium cursor-pointer">
                Allow authorized grassroots coaches to review biomechanics assessment reports
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-wine text-xs py-3 flex items-center justify-center gap-2"
            >
              <Save size={14} /> {loading ? 'Saving to Database...' : 'Save Changes to Profile'}
            </button>
          </form>
        ) : (
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2.5 text-[#766660]">
              <Mail size={16} className="text-[#805044] shrink-0" />
              <span className="font-medium text-[#303831]">{user?.email}</span>
            </div>

            {formData.fitness_goals && (
              <div className="flex items-start gap-2.5 text-[#766660]">
                <Target size={16} className="text-[#805044] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#303831]">Goal:</strong> {formData.fitness_goals}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2.5 text-[#766660]">
              <Share2 size={16} className="text-[#805044] shrink-0" />
              <span>
                Coach Review Access:{' '}
                {formData.coach_share_enabled ? (
                  <strong className="text-[#278653]">Enabled</strong>
                ) : (
                  <strong className="text-[#766660]">Private to Athlete</strong>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sign Out Button */}
      <button
        onClick={onLogout}
        className="w-full py-3 rounded-xl bg-[#570F22]/10 hover:bg-[#570F22]/20 border border-[#570F22]/30 text-[#570F22] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut size={15} /> Sign Out of Platform
      </button>
    </div>
  );
}
