import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';

export default function DeviceFrame({ children, isConnected }) {
  const [deviceMode, setDeviceMode] = useState('phone'); // 'phone' | 'full'

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-0 md:p-4 bg-[#060911] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Top Controls Bar for Desktop Review */}
      <header className="w-full max-w-4xl py-3 px-4 flex items-center justify-between border-b border-white/10 mb-2 md:mb-4 bg-slate-900/60 backdrop-blur-md rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-black text-lg shadow-lg shadow-cyan-500/30">
            ⚡
          </div>
          <div>
            <h1 className="text-sm md:text-base font-bold text-white tracking-wide flex items-center gap-2">
              TalentPulse AI
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Mobile Platform
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">AI-Powered Sports Talent Assessment</p>
          </div>
        </div>

        {/* Status & View Toggles */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Backend Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 border border-white/10">
            {isConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-400 text-[11px] hidden sm:inline">Backend Online</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="text-amber-300 text-[11px] hidden sm:inline">Local / Standalone</span>
              </>
            )}
          </div>

          {/* Toggle View Mode */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setDeviceMode('phone')}
              title="Mobile Mockup View"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                deviceMode === 'phone'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} />
              <span className="hidden sm:inline">Phone Frame</span>
            </button>
            <button
              onClick={() => setDeviceMode('full')}
              title="Responsive View"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                deviceMode === 'full'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor size={14} />
              <span className="hidden sm:inline">Full Width</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="w-full flex justify-center items-center">
        {deviceMode === 'phone' ? (
          <div className="phone-mockup-frame">
            {/* Phone Notch */}
            <div className="phone-notch">
              <div className="phone-notch-camera"></div>
            </div>
            {/* Mobile Viewport Screen */}
            <div className="w-full h-full pt-6 flex flex-col bg-[#0b0f19] overflow-hidden relative">
              {children}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md min-h-[750px] bg-[#0b0f19] rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative flex flex-col">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
