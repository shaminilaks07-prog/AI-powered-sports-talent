import React from 'react';
import { Home, Video, FolderClock, User, Compass, TrendingUp } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'assess', label: 'Analyze', icon: Video, highlight: true },
    { id: 'history', label: 'History', icon: FolderClock },
    { id: 'stats', label: 'Stats', icon: TrendingUp },
    { id: 'drills', label: 'Drills', icon: Compass },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#321B1A]/95 backdrop-blur-md border-t border-[#4B2925] px-2 flex items-center justify-around z-40 shadow-lg text-[#F7F0E7]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        if (tab.highlight) {
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative -top-3 flex flex-col items-center group focus:outline-none"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all duration-200 ${
                  isActive
                    ? 'bg-[#722F46] text-white scale-105 shadow-[#722F46]/40 ring-3 ring-[#E6D8CB]'
                    : 'bg-[#722F46] text-white hover:scale-105 shadow-[#722F46]/30'
                }`}
              >
                <Icon size={22} className="stroke-[2.2]" />
              </div>
              <span
                className={`text-[9px] font-bold mt-0.5 tracking-wide ${
                  isActive ? 'text-[#FFF9F2]' : 'text-[#E6D8CB]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-0.5 transition-colors py-1 px-1.5 ${
              isActive ? 'text-[#FFF9F2] font-bold' : 'text-[#E6D8CB]/70 hover:text-[#FFF9F2]'
            }`}
          >
            <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-[#722F46]' : ''}`}>
              <Icon size={18} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
            </div>
            <span className="text-[9px] font-medium leading-none">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
