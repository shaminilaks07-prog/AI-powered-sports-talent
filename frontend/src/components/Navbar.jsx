import React from 'react';
import { ArrowLeft, Bell, Flame, User as UserIcon } from 'lucide-react';

export default function Navbar({ title, showBack, onBack, user, onProfileClick }) {
  return (
    <div className="w-full px-4 py-3 flex items-center justify-between border-b border-white/5 bg-[#0d1322]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-black font-black text-sm shadow-md shadow-cyan-500/20">
            <Flame size={18} className="text-black" />
          </div>
        )}
        <h2 className="text-base font-bold text-white tracking-tight truncate max-w-[180px]">
          {title || 'TalentPulse'}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-semibold text-slate-200"
          >
            <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-bold flex items-center justify-center text-[10px]">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="max-w-[70px] truncate">{user.name?.split(' ')[0]}</span>
          </button>
        ) : (
          <div className="text-xs font-medium text-slate-400">Guest</div>
        )}
      </div>
    </div>
  );
}
