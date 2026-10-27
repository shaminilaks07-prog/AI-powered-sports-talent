import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Share2,
  Database,
  Cpu,
  User,
  CheckCircle2,
  AlertCircle,
  Save,
  LogOut,
  Info
} from 'lucide-react';
import { updateAthleteProfile } from '../services/api';

export default function SettingsScreen({ user, onUpdateUser, onLogout }) {
  const [coachShare, setCoachShare] = useState(user?.coach_share_enabled || false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleToggleCoachShare = async (e) => {
    const newVal = e.target.checked;
    setCoachShare(newVal);
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await updateAthleteProfile(user.id, {
        coach_share_enabled: newVal
      });
      if (res.success && res.user) {
        if (onUpdateUser) onUpdateUser(res.user);
        setSuccessMsg('Privacy preferences updated successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setErrorMsg('Failed to update privacy settings: ' + err.message);
      setCoachShare(!newVal); // revert
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#303831] max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-[#E6D8CB]">
        <h2 className="text-2xl font-black text-[#303831] tracking-tight">
          Settings & Platform Configuration
        </h2>
        <p className="text-xs md:text-sm text-[#766660]">
          Manage your athlete privacy, scout visibility, and inspect system telemetry.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-[#278653]/15 border border-[#278653]/30 text-[#278653] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-[#C47A32]/15 border border-[#C47A32]/30 text-[#C47A32] text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Athlete Privacy & Data Sharing Card */}
      <div className="p-6 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#303831]">
          <Shield size={18} className="text-[#722F46]" />
          <span>Athlete Privacy & Grassroots Scouting Rights</span>
        </div>

        <p className="text-xs text-[#766660] leading-relaxed">
          You retain 100% ownership of your biomechanical assessment recordings. Choose whether verified state and school coaches can review your technique reports.
        </p>

        <div className="p-4 rounded-xl bg-[#F7F0E7] border border-[#E6D8CB] flex items-start gap-3">
          <input
            type="checkbox"
            id="share_toggle"
            checked={coachShare}
            disabled={saving}
            onChange={handleToggleCoachShare}
            className="w-5 h-5 rounded mt-0.5 accent-[#722F46] cursor-pointer"
          />
          <label htmlFor="share_toggle" className="text-xs text-[#303831] cursor-pointer space-y-0.5 block">
            <span className="font-bold block">
              Allow authorized coaches to review assessment reports
            </span>
            <span className="text-[#766660] text-[11px] block">
              When enabled, verified talent evaluators from sports federations can discover your scores for scouting trials.
            </span>
          </label>
        </div>
      </div>

      {/* Account Information Card */}
      <div className="p-6 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#303831]">
          <User size={18} className="text-[#4B2925]" />
          <span>Current Account Profile</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          <div className="p-3 rounded-xl bg-[#F7F0E7] border border-[#E6D8CB]">
            <span className="text-[10px] text-[#766660] font-bold uppercase block">Registered Name</span>
            <span className="text-sm font-bold text-[#303831] mt-0.5 block">{user?.name}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F0E7] border border-[#E6D8CB]">
            <span className="text-[10px] text-[#766660] font-bold uppercase block">Email Address</span>
            <span className="text-sm font-bold text-[#303831] mt-0.5 block truncate">{user?.email}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F0E7] border border-[#E6D8CB]">
            <span className="text-[10px] text-[#766660] font-bold uppercase block">Primary Sport</span>
            <span className="text-sm font-bold text-[#722F46] mt-0.5 block">{user?.primary_sport || 'General Fitness'}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F0E7] border border-[#E6D8CB]">
            <span className="text-[10px] text-[#766660] font-bold uppercase block">District / Location</span>
            <span className="text-sm font-bold text-[#303831] mt-0.5 block">{user?.location || 'Not Specified'}</span>
          </div>
        </div>
      </div>

      {/* Platform & AI Engine Telemetry Card */}
      <div className="p-6 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#303831]">
          <Cpu size={18} className="text-[#805044]" />
          <span>System & Computer Vision Telemetry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-[#F7F0E7] border border-[#E6D8CB]">
            <span className="text-[10px] text-[#766660] font-bold uppercase block">FastAPI Server</span>
            <span className="font-mono text-xs text-[#278653] font-bold mt-0.5 block">http://127.0.0.1:8000</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F0E7] border border-[#E6D8CB]">
            <span className="text-[10px] text-[#766660] font-bold uppercase block">Pose Model</span>
            <span className="text-xs text-[#303831] font-bold mt-0.5 block">MediaPipe Pose (33 Joints)</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F0E7] border border-[#E6D8CB]">
            <span className="text-[10px] text-[#766660] font-bold uppercase block">Storage Engine</span>
            <span className="text-xs text-[#303831] font-bold mt-0.5 block">SQLite3 + File Storage</span>
          </div>
        </div>
      </div>

      {/* Sign Out Card */}
      <div className="p-5 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h4 className="text-xs font-bold text-[#303831]">Sign Out of Session</h4>
          <p className="text-[11px] text-[#766660]">End current session on this device.</p>
        </div>
        <button
          onClick={onLogout}
          className="btn-outline text-xs py-2 px-4 text-[#722F46] border-[#722F46]/30 hover:bg-[#722F46]/10"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );
}
