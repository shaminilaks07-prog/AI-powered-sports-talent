import React from 'react';
import { Home, Zap, Clock, User } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'upload', label: 'Scan AI', icon: Zap, highlight: true },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#090d16]/95 backdrop-blur-lg border-t border-white/10 px-4 flex items-center justify-around z-40">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        if (tab.highlight) {
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative -top-4 flex flex-col items-center group focus:outline-none"
            >
              <div
                className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-200 ${
                  isActive
                    ? 'bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 scale-105 shadow-cyan-500/40'
                    : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 hover:scale-105 shadow-cyan-500/25'
                }`}
                style={{ width: '52px', height: '52px' }}
              >
                <Icon size={24} className="stroke-[2.5]" />
              </div>
              <span
                className={`text-[10px] font-bold mt-1 tracking-wide ${
                  isActive ? 'text-cyan-400' : 'text-slate-400'
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
            className={`flex flex-col items-center gap-1 transition-colors py-1 px-3 ${
              isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
