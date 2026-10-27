import React from 'react';
import {
  LayoutDashboard,
  Video,
  FileBarChart2,
  FolderClock,
  TrendingUp,
  Compass,
  Trophy,
  User,
  Settings,
  LogOut,
  X,
  Activity,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  onTabChange,
  user,
  onLogout,
  hasActiveAssessment,
  isOpen,
  onClose
}) {
  const navItems = [
    { id: 'home', label: 'Dashboard Home', icon: LayoutDashboard },
    { id: 'assess', label: 'Video Analysis', icon: Video, badge: 'AI CV' },
    ...(hasActiveAssessment
      ? [{ id: 'results', label: 'Biomechanics Report', icon: FileBarChart2, highlight: true }]
      : []),
    { id: 'history', label: 'Talent Reports / History', icon: FolderClock },
    { id: 'stats', label: 'Performance Statistics', icon: TrendingUp },
    { id: 'drills', label: 'Exercise Guides & Drills', icon: Compass },
    { id: 'opportunities', label: 'Verified Trials', icon: Trophy },
    { id: 'profile', label: 'Athlete Profile', icon: User },
    { id: 'settings', label: 'Settings & Privacy', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#321B1A]/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#570F22] text-[#F7F0E7] flex flex-col border-r border-[#4B2925] shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#4B2925]/70 flex items-center justify-between bg-[#321B1A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4B2925] border border-[#722F46] flex items-center justify-center text-white shadow-inner font-black text-lg">
              🏃‍♂️
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-[#FFF9F2] leading-tight">
                TalentPulse AI
              </h1>
              <p className="text-[10px] text-[#E6D8CB] font-medium tracking-wide">
                Sports Talent Assessment
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#E6D8CB] hover:text-white hover:bg-[#4B2925] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-[#E6D8CB]/70 uppercase tracking-wider">
            Menu Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                  isActive
                    ? 'bg-[#722F46] text-[#FFFFFF] shadow-sm font-bold ring-1 ring-[#FFF9F2]/20'
                    : 'text-[#F7F0E7]/85 hover:bg-[#4B2925]/60 hover:text-[#FFFFFF]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-[#FFF9F2]' : 'text-[#E6D8CB] group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#4B2925] text-[#E6D8CB] border border-[#722F46]">
                    {item.badge}
                  </span>
                )}

                {item.highlight && (
                  <span className="w-2 h-2 rounded-full bg-[#278653] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* User Mini Profile & Logout */}
        {user && (
          <div className="p-3 border-t border-[#4B2925] bg-[#321B1A]/80">
            <div className="p-2.5 rounded-xl bg-[#4B2925]/50 border border-[#4B2925] flex items-center justify-between">
              <div
                onClick={() => {
                  onTabChange('profile');
                  if (onClose) onClose();
                }}
                className="flex items-center gap-2.5 cursor-pointer min-w-0"
              >
                <div className="w-8 h-8 rounded-lg bg-[#722F46] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#FFF9F2] truncate">{user.name}</p>
                  <p className="text-[10px] text-[#E6D8CB] truncate">{user.primary_sport || 'Athlete'}</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-[#E6D8CB] hover:text-white hover:bg-[#722F46] transition-colors shrink-0 ml-1"
                title="Sign Out"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
