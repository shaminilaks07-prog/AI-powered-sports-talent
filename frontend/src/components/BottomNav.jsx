import React from 'react';
import { Home, Camera, Clock, User, Compass, Award } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'drills', label: 'Drills', icon: Compass },
    { id: 'assess', label: 'Assess', icon: Camera, highlight: true },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'opportunities', label: 'Trials', icon: Award },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E5E7E2] px-2 flex items-center justify-around z-40 shadow-sm">
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
                    ? 'bg-[#46664F] text-white scale-105 shadow-[#46664F]/30 ring-3 ring-[#DCE8D8]'
                    : 'bg-[#46664F] text-white hover:scale-105 shadow-[#46664F]/20'
                }`}
              >
                <Icon size={22} className="stroke-[2.2]" />
              </div>
              <span
                className={`text-[9px] font-bold mt-0.5 tracking-wide ${
                  isActive ? 'text-[#46664F]' : 'text-[#5A655C]'
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
              isActive ? 'text-[#46664F] font-bold' : 'text-[#7C887E] hover:text-[#303831]'
            }`}
          >
            <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-[#DCE8D8]' : ''}`}>
              <Icon size={18} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
            </div>
            <span className="text-[9px] font-medium leading-none">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
