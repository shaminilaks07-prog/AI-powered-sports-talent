import React from 'react';
import { User, LogOut, Trophy, Activity, Mail, Calendar, ShieldCheck, Heart } from 'lucide-react';

export default function ProfileScreen({ user, onLogout }) {
  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* Profile Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 text-center relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 p-1 mx-auto mb-3 shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-cyan-400 font-black text-2xl">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>

        <h3 className="text-lg font-black text-white">{user?.name || 'Athlete Profile'}</h3>
        <p className="text-xs text-cyan-400 font-medium">{user?.primary_sport || 'General'} Athlete</p>

        <div className="flex justify-center gap-2 mt-3">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
            Age: {user?.age || 18}
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
            Gender: {user?.gender || 'Male'}
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            Active Verified
          </span>
        </div>
      </div>

      {/* Account Info Details */}
      <div className="glass-card p-4 space-y-3">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account Details</h4>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <Mail size={16} className="text-cyan-400 shrink-0" />
          <span className="truncate">{user?.email || 'athlete@demo.com'}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <Trophy size={16} className="text-amber-400 shrink-0" />
          <span>Specialization: {user?.primary_sport || 'Cricket'}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <span>MediaPipe Pose Engine 0.10</span>
        </div>
      </div>

      {/* Mini Project Academic Details */}
      <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 space-y-1.5">
        <p className="font-bold text-cyan-300 flex items-center gap-1.5">
          <Activity size={14} /> College Mini-Project Info
        </p>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Title: <span className="text-slate-200">AI-Powered Mobile Platform for Democratizing Sports Talent Assessment</span>
        </p>
        <p className="text-[11px] text-slate-400">
          Architecture: <span className="text-slate-200">React (Vite) + FastAPI + MediaPipe + SQLite</span>
        </p>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
}
