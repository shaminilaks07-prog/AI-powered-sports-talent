import React, { useState } from 'react';
import { Smartphone, Monitor, Activity, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

export default function DeviceFrame({ children, isConnected }) {
  const [deviceMode, setDeviceMode] = useState('phone'); // 'phone' | 'full'

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-2 md:p-5 bg-[#FAFAF6] text-[#303831] selection:bg-[#DCE8D8] selection:text-[#303831]">
      {/* Top Application Header Bar */}
      <header className="w-full max-w-4xl py-3 px-4 flex items-center justify-between border border-[#E5E7E2] mb-3 md:mb-5 bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#46664F] flex items-center justify-center font-bold text-white text-lg shadow-sm">
            🏃‍♂️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-bold text-[#303831] tracking-tight">
                TalentPulse AI
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DCE8D8] text-[#46664F] border border-[#46664F]/20">
                Grassroots Sports Tech
              </span>
            </div>
            <p className="text-[11px] text-[#5A655C] hidden sm:block">
              AI-Powered Mobile Platform for Democratizing Sports Talent Assessment
            </p>
          </div>
        </div>

        {/* Status & View Mode Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Backend Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F3F1E8] border border-[#E5E7E2]">
            {isConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#3E8A5E] animate-pulse"></span>
                <span className="text-[#3E8A5E] text-[11px] font-semibold hidden sm:inline">Backend Online</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#D9822B]"></span>
                <span className="text-[#D9822B] text-[11px] font-semibold hidden sm:inline">Local / Standalone</span>
              </>
            )}
          </div>

          {/* Toggle View Mode */}
          <div className="flex bg-[#F3F1E8] p-1 rounded-xl border border-[#E5E7E2]">
            <button
              onClick={() => setDeviceMode('phone')}
              title="Mobile Device Mockup"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                deviceMode === 'phone'
                  ? 'bg-[#46664F] text-white shadow-sm'
                  : 'text-[#5A655C] hover:text-[#303831]'
              }`}
            >
              <Smartphone size={13} />
              <span className="hidden sm:inline">Mobile Frame</span>
            </button>
            <button
              onClick={() => setDeviceMode('full')}
              title="Full Responsive View"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                deviceMode === 'full'
                  ? 'bg-[#46664F] text-white shadow-sm'
                  : 'text-[#5A655C] hover:text-[#303831]'
              }`}
            >
              <Monitor size={13} />
              <span className="hidden sm:inline">Wide View</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="w-full flex justify-center items-center pb-6">
        {deviceMode === 'phone' ? (
          <div className="phone-mockup-frame">
            {/* Phone Notch */}
            <div className="phone-notch">
              <div className="phone-notch-camera"></div>
            </div>
            {/* Mobile Viewport Screen */}
            <div className="w-full h-full pt-5 flex flex-col bg-[#FAFAF6] overflow-hidden relative">
              {children}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl min-h-[780px] bg-[#FAFAF6] rounded-3xl border border-[#E5E7E2] shadow-xl overflow-hidden relative flex flex-col">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
