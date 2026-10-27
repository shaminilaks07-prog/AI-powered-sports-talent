import React from 'react';
import {
  Menu,
  ArrowLeft,
  Video,
  User as UserIcon,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Navbar({
  title,
  showBack,
  onBack,
  user,
  onProfileClick,
  onToggleSidebar,
  isConnected,
  onNewAssessment
}) {
  return (
    <header className="w-full bg-[#321B1A] border-b border-[#4B2925] px-4 md:px-8 py-3 flex items-center justify-between text-[#F7F0E7] sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile hamburger & Screen Title */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-[#E6D8CB] hover:text-white hover:bg-[#4B2925] transition-colors"
            title="Toggle Menu"
          >
            <Menu size={20} />
          </button>
        )}

        {showBack ? (
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-[#4B2925] hover:bg-[#722F46] flex items-center justify-center text-[#FFF9F2] transition-colors shadow-xs"
            title="Go Back"
          >
            <ArrowLeft size={16} />
          </button>
        ) : (
          <div className="hidden sm:flex w-8 h-8 rounded-xl bg-[#4B2925] border border-[#722F46] items-center justify-center text-white text-sm">
            🏃‍♂️
          </div>
        )}

        <div>
          <h2 className="text-sm md:text-base font-bold text-[#FFF9F2] tracking-tight truncate max-w-[200px] sm:max-w-xs md:max-w-md">
            {title || 'Athlete Dashboard'}
          </h2>
          <p className="text-[10px] text-[#E6D8CB]/80 font-medium hidden sm:block">
            TalentPulse AI • Computer Vision Biomechanics
          </p>
        </div>
      </div>

      {/* Right: Status badge, Action button & User */}
      <div className="flex items-center gap-3">
        {/* Backend Status indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4B2925]/70 border border-[#4B2925] text-[11px] font-semibold text-[#E6D8CB]">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-[#278653]' : 'bg-[#C47A32]'
            }`}
          />
          <span className="hidden md:inline">
            {isConnected ? 'Backend Online' : 'Backend Offline'}
          </span>
        </div>

        {/* Quick New Assessment CTA */}
        {onNewAssessment && (
          <button
            onClick={onNewAssessment}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#722F46] hover:bg-[#5d2437] text-white text-xs font-bold transition-all shadow-xs"
          >
            <Video size={14} />
            <span>Analyze Video</span>
          </button>
        )}

        {/* User Avatar */}
        {user ? (
          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full bg-[#4B2925] hover:bg-[#570F22] border border-[#722F46] transition-all text-xs font-semibold text-[#FFF9F2]"
            title="View Profile"
          >
            <div className="w-6 h-6 rounded-full bg-[#722F46] text-white font-bold flex items-center justify-center text-[10px]">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="max-w-[80px] sm:max-w-[120px] truncate hidden xs:inline">
              {user.name?.split(' ')[0]}
            </span>
          </button>
        ) : (
          <div className="text-xs font-semibold text-[#E6D8CB] px-2.5 py-1 rounded-full bg-[#4B2925]">
            Grassroots AI
          </div>
        )}
      </div>
    </header>
  );
}
