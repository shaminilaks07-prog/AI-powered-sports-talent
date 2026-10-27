import React from 'react';
import {
  Play,
  Video,
  Award,
  TrendingUp,
  Shield,
  Heart,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Activity,
  Users,
  Compass,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function LandingPage({ onGetStarted, onLoginClick }) {
  const steps = [
    {
      num: '01',
      title: 'Record Athlete Performance',
      desc: 'Use any smartphone camera or computer webcam. Position on a flat surface 2.5–3m away and perform your exercise in daylight or normal lighting.',
      icon: Video,
      color: 'bg-[#EFE4D8] text-[#722F46]'
    },
    {
      num: '02',
      title: 'Analyze Biomechanics in Real Time',
      desc: 'Our computer vision engine extracts 33 human joint coordinates, measuring angles, repetition cadence, depth, and kinetic symmetry.',
      icon: Activity,
      color: 'bg-[#EFE4D8] text-[#4B2925]'
    },
    {
      num: '03',
      title: 'Targeted Actionable Improvement',
      desc: 'Receive transparent form scores, precise biomechanical breakdowns, targeted drill recommendations, and talent scouting insights.',
      icon: TrendingUp,
      color: 'bg-[#EFE4D8] text-[#805044]'
    }
  ];

  const sportsCatalog = [
    {
      name: 'Sit-ups & Core Endurance',
      desc: 'Calculates hip flexion angles and counts completed repetitions with rhythm and cadence tracking.',
      badge: 'Prioritized Core',
      icon: '🧘'
    },
    {
      name: 'Squats & Lower-Body Power',
      desc: 'Measures knee flexion depth, bilateral knee symmetry, and upright spinal posture during descent and ascent.',
      badge: 'Biomechanics',
      icon: '🏋️'
    },
    {
      name: 'Jumping & Explosive Velocity',
      desc: 'Tracks countermovement knee dip loading, explosive vertical takeoff speed, and landing absorption.',
      badge: 'Kinetic Chain',
      icon: '⚡'
    },
    {
      name: 'Sprinting & Running Cadence',
      desc: 'Analyzes high knee drive angles, forward trunk acceleration lean, and ground contact stride rhythm.',
      badge: 'Speed & Stride',
      icon: '🏃'
    },
    {
      name: 'Balance & Posture Assessment',
      desc: 'Evaluates center-of-mass lateral sway variance, spinal verticality, and bilateral shoulder/pelvis alignment.',
      badge: 'Stability',
      icon: '⚖️'
    }
  ];

  return (
    <div className="w-full bg-[#F7F0E7] text-[#303831] overflow-x-hidden animate-fade-in min-h-screen">
      {/* Top Landing Navigation */}
      <nav className="w-full border-b border-[#4B2925] bg-[#321B1A] sticky top-0 z-30 px-6 md:px-12 py-3.5 flex items-center justify-between text-[#F7F0E7] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4B2925] border border-[#722F46] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            🏃‍♂️
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-[#FFF9F2] block leading-tight">
              TalentPulse AI
            </span>
            <span className="text-[10px] text-[#E6D8CB] tracking-wide block">
              Sports Talent Assessment
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLoginClick}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-[#E6D8CB] hover:text-white hover:bg-[#4B2925] transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="btn-wine text-xs py-2 px-4 shadow-sm"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 pt-12 pb-16 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF9F2] text-[#722F46] text-xs font-bold tracking-wide border border-[#E6D8CB] shadow-xs">
          <Sparkles size={14} />
          <span>Accessible Computer Vision for Grassroots & Rural Athletes</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#303831] leading-tight tracking-tight">
          AI-Powered Sports Talent Assessment for Every Athlete
        </h1>

        <p className="text-sm md:text-base text-[#766660] leading-relaxed max-w-2xl mx-auto">
          Helping student athletes and coaches—especially in rural and underserved districts—evaluate physical performance and movement mechanics using an ordinary smartphone or laptop camera.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto btn-wine text-sm py-3.5 px-8 flex items-center justify-center gap-2 shadow-md font-bold"
          >
            <Play size={16} fill="currentColor" />
            <span>Start Free Assessment</span>
          </button>
          <button
            onClick={onLoginClick}
            className="w-full sm:w-auto btn-outline text-sm py-3.5 px-6 flex items-center justify-center gap-2 font-bold"
          >
            <span>Registered Athlete Login</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#E6D8CB] text-center max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs">
            <span className="text-lg font-black text-[#722F46] block">Zero Lab Equipment</span>
            <span className="text-xs text-[#766660]">Standard camera video input</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs">
            <span className="text-lg font-black text-[#4B2925] block">33 Pose Joints</span>
            <span className="text-xs text-[#766660]">MediaPipe 3D Kinematics</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs">
            <span className="text-lg font-black text-[#570F22] block">Transparent Scoring</span>
            <span className="text-xs text-[#766660]">Explainable biomechanical rules</span>
          </div>
        </div>
      </section>

      {/* 3-Step Process: Record, Analyze, Improve */}
      <section className="px-4 py-12 bg-[#FFF9F2] border-y border-[#E6D8CB]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-[#722F46] uppercase tracking-wider block">
              Methodology
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#303831]">
              Three Simple Steps to Assess & Excel
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.num}
                  className="p-6 rounded-2xl bg-[#F7F0E7] border border-[#E6D8CB] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${st.color}`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#FFF9F2] text-[#4B2925] border border-[#E6D8CB]">
                      Step {st.num}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#303831]">{st.title}</h3>
                  <p className="text-xs text-[#766660] leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported Movement Modules */}
      <section className="px-4 py-12 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-[#722F46] uppercase tracking-wider block">
            Drill Catalog
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#303831]">
            Supported Physical Assessments
          </h2>
          <p className="text-xs text-[#766660]">
            Activity-specific computer vision algorithms tailored to sports biomechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {sportsCatalog.map((sp) => (
            <div
              key={sp.name}
              className="p-5 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] hover:border-[#722F46] transition-all flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#EFE4D8] flex items-center justify-center text-2xl shrink-0">
                  {sp.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-[#303831]">{sp.name}</h4>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#EFE4D8] text-[#722F46]">
                      {sp.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#766660] mt-1 leading-relaxed">{sp.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Underserved & Rural Community Empowerment */}
      <section className="px-4 py-12 bg-[#321B1A] text-[#F7F0E7] border-t border-[#4B2925]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="p-6 md:p-8 rounded-3xl bg-[#4B2925] border border-[#722F46]/50 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-[#E6D8CB] font-bold text-xs uppercase tracking-wider">
              <Heart size={16} className="text-[#C47A32]" />
              <span>Democratizing Sports Talent Identification</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-[#FFF9F2] leading-snug">
              Bridging the Athletic Divide Between Rural & Urban Youth
            </h3>

            <p className="text-xs md:text-sm text-[#E6D8CB] leading-relaxed">
              In developing sports ecosystems, thousands of naturally gifted young athletes in rural districts lack access to costly sports science laboratories, high-speed biomechanics cameras, or certified strength coaches.
            </p>

            <p className="text-xs md:text-sm text-[#E6D8CB] leading-relaxed">
              TalentPulse AI turns any standard camera into an objective biomechanical evaluator. It provides fair, transparent metrics to showcase genuine physical conditioning and helps grassroots coaches discover talent.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#FFF9F2] font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#278653]" /> Free for grassroots students
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#278653]" /> 100% athlete data privacy
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-[#E6D8CB] bg-[#FFF9F2] text-center space-y-2 text-xs text-[#766660]">
        <p className="font-bold text-[#303831]">
          🏃‍♂️ TalentPulse AI – AI-Powered Sports Talent Assessment
        </p>
        <p className="text-[11px] text-[#766660]">
          Built with React (Vite) + FastAPI (Python 3.13) + MediaPipe Pose + SQLite3
        </p>
        <p className="text-[10px] text-[#766660]/70 pt-2">
          © 2026 TalentPulse AI Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
