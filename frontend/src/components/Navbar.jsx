import React from 'react';
import { ArrowLeft, User as UserIcon, Award } from 'lucide-react';

export default function Navbar({ title, showBack, onBack, user, onProfileClick }) {
  return (
    <div className="w-full px-4 py-3 flex items-center justify-between border-b border-[#E5E7E2] bg-[#FFFFFF]/95 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-[#F3F1E8] hover:bg-[#DCE8D8] flex items-center justify-center text-[#303831] transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={16} />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-[#46664F] flex items-center justify-center text-white font-black text-sm shadow-sm">
            🏃‍♂️
          </div>
        )}
        <div>
          <h2 className="text-sm font-bold text-[#303831] tracking-tight truncate max-w-[190px]">
            {title || 'TalentPulse AI'}
          </h2>
          <p className="text-[10px] text-[#5A655C] leading-none">Sports Assessment</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <button
            onClick={onProfileClick}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3F1E8] hover:bg-[#DCE8D8] border border-[#E5E7E2] transition-all text-xs font-semibold text-[#303831]"
          >
            <div className="w-5 h-5 rounded-full bg-[#46664F] text-white font-bold flex items-center justify-center text-[10px]">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="max-w-[75px] truncate font-medium">{user.name?.split(' ')[0]}</span>
          </button>
        ) : (
          <div className="text-xs font-semibold text-[#5A655C] px-2 py-0.5 rounded-full bg-[#F3F1E8]">
            Grassroots
          </div>
        )}
      </div>
    </div>
  );
}
