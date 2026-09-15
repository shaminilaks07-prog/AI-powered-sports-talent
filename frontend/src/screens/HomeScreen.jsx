import React from 'react';
import { Play, TrendingUp, Award, Activity, Sparkles, ChevronRight, Target } from 'lucide-react';

export default function HomeScreen({ user, onNavigateToUpload, onNavigateToHistory }) {
  const sports = [
    { id: 'Cricket', name: 'Cricket', icon: '🏏', subtitle: 'Bowling & Batting stance', badge: 'Popular' },
    { id: 'Basketball', name: 'Basketball', icon: '🏀', subtitle: 'Jump shot & Free throw', badge: 'Vision AI' },
    { id: 'Sprinting', name: 'Sprinting', icon: '⚡', subtitle: 'Stride cadence & start', badge: 'High Speed' },
    { id: 'Fitness/Squats', name: 'Fitness / Form', icon: '🏋️', subtitle: 'Squat depth & alignment', badge: 'Biomechanics' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 p-5 border border-cyan-500/20 shadow-xl shadow-cyan-950/40">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={12} /> AI Talent Scout
            </span>
            <h2 className="text-xl font-black text-white mt-0.5">
              Ready to assess, {user?.name ? user.name.split(' ')[0] : 'Athlete'}?
            </h2>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold">
            <span className="radar-live-dot"></span>
            <span>Live CV</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Upload or record your sports motion. Our computer vision model tracks 33 body landmarks to score your technique.
        </p>

        <button
          onClick={() => onNavigateToUpload()}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-opacity"
        >
          <Play size={16} fill="currentColor" />
          Start New Assessment
        </button>
      </div>

      {/* Quick Stats Overview */}
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Performance Snapshot
          </h3>
          <button
            onClick={onNavigateToHistory}
            className="text-xs text-cyan-400 hover:underline flex items-center font-medium"
          >
            View History <ChevronRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-1">
              <Award size={16} />
            </div>
            <span className="text-lg font-black text-white">88.4</span>
            <span className="text-[10px] text-slate-400 font-medium">Top Score</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1">
              <TrendingUp size={16} />
            </div>
            <span className="text-lg font-black text-white">+12%</span>
            <span className="text-[10px] text-slate-400 font-medium">Form Growth</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-1">
              <Activity size={16} />
            </div>
            <span className="text-lg font-black text-white">6</span>
            <span className="text-[10px] text-slate-400 font-medium">Sessions</span>
          </div>
        </div>
      </div>

      {/* Select Sport Section */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2.5">
          Select Sport Category
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {sports.map((sport) => (
            <div
              key={sport.id}
              onClick={() => onNavigateToUpload(sport.id)}
              className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/5 group-hover:bg-cyan-500/10 text-2xl flex items-center justify-center transition-colors">
                  {sport.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      {sport.name}
                    </h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                      {sport.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{sport.subtitle}</p>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-all">
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
