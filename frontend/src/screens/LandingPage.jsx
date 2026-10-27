import React, { useState } from 'react';
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
  const [activeFaq, setActiveFaq] = useState(null);

  const steps = [
    {
      num: '01',
      title: 'Record Performance',
      desc: 'Use any smartphone camera or computer webcam. Set up on a steady surface and perform your exercise in daylight or normal lighting.',
      icon: Video,
      color: 'bg-[#DCE8D8] text-[#46664F]'
    },
    {
      num: '02',
      title: 'Analyze Biomechanics',
      desc: 'Our computer vision engine extracts 33 human joint coordinates, measuring angles, repetition cadence, depth, and kinetic symmetry.',
      icon: Activity,
      color: 'bg-[#8FB8AC]/25 text-[#2E554C]'
    },
    {
      num: '03',
      title: 'Actionable Improvement',
      desc: 'Receive transparent form scores, precise biomechanical breakdowns, targeted drill recommendations, and talent development insights.',
      icon: TrendingUp,
      color: 'bg-[#F3F1E8] text-[#46664F]'
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
    <div className="w-full bg-[#FAFAF6] text-[#303831] overflow-x-hidden animate-fade-in">
      {/* Top Landing Navigation */}
      <nav className="w-full border-b border-[#E5E7E2] bg-[#FFFFFF]/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#46664F] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            🏃‍♂️
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-[#303831] block">
              TalentPulse AI
            </span>
            <span className="text-[10px] text-[#5A655C] tracking-wide block -mt-0.5">
              Democratizing Sports Assessment
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLoginClick}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-[#46664F] hover:bg-[#DCE8D8] transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="btn-forest text-xs py-1.5 px-3.5"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 pt-8 pb-10 text-center overflow-hidden">
        {/* Subtle athletic track curves overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 flex justify-center items-center">
          <svg className="w-[600px] h-[400px]" viewBox="0 0 600 400" fill="none">
            <path d="M 50,200 C 150,50 450,50 550,200 C 450,350 150,350 50,200 Z" stroke="#46664F" strokeWidth="2" strokeDasharray="6 6" />
            <path d="M 100,200 C 180,90 420,90 500,200 C 420,310 180,310 100,200 Z" stroke="#8FB8AC" strokeWidth="1.5" />
            <path d="M 150,200 C 210,130 390,130 450,200 C 390,270 210,270 150,200 Z" stroke="#DCE8D8" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCE8D8] text-[#46664F] text-xs font-bold tracking-wide border border-[#46664F]/20">
            <Sparkles size={13} />
            <span>Accessible Computer Vision for Grassroots Athletes</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-[#303831] leading-tight tracking-tight">
            AI-Powered Sports Talent Assessment for Every Athlete
          </h1>

          <p className="text-xs md:text-sm text-[#5A655C] leading-relaxed max-w-md mx-auto">
            Helping students and aspiring athletes—especially in rural and underserved communities—evaluate physical performance and movement technique using an ordinary smartphone or laptop camera.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto btn-forest text-sm py-3 px-6 flex items-center justify-center gap-2"
            >
              <Play size={16} fill="currentColor" />
              Start Free Assessment
            </button>
            <button
              onClick={onLoginClick}
              className="w-full sm:w-auto btn-outline text-sm py-3 px-5 flex items-center justify-center gap-2"
            >
              Registered Athlete Login <ArrowRight size={14} />
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-4 grid grid-cols-3 gap-2 border-t border-[#E5E7E2]/80 mt-6 text-center">
            <div className="p-2">
              <span className="text-base font-extrabold text-[#46664F] block">Zero Lab</span>
              <span className="text-[10px] text-[#5A655C]">No expensive hardware</span>
            </div>
            <div className="p-2 border-x border-[#E5E7E2]">
              <span className="text-base font-extrabold text-[#46664F] block">33 Joints</span>
              <span className="text-[10px] text-[#5A655C]">MediaPipe Vision 3D</span>
            </div>
            <div className="p-2">
              <span className="text-base font-extrabold text-[#46664F] block">Rule-Based</span>
              <span className="text-[10px] text-[#5A655C]">Transparent scoring</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process: Record, Analyze, Improve */}
      <section className="px-4 py-8 bg-[#F3F1E8]/70 border-y border-[#E5E7E2]">
        <div className="max-w-xl mx-auto space-y-5">
          <div className="text-center">
            <span className="text-[11px] font-bold text-[#46664F] uppercase tracking-wider block">
              How It Works
            </span>
            <h2 className="text-xl font-bold text-[#303831] mt-0.5">
              Three Simple Steps to Assess & Excel
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.num}
                  className="p-4 rounded-2xl bg-white border border-[#E5E7E2] shadow-sm flex items-start gap-3.5"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${st.color}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#F3F1E8] text-[#5A655C]">
                        Step {st.num}
                      </span>
                      <h3 className="font-bold text-sm text-[#303831]">{st.title}</h3>
                    </div>
                    <p className="text-xs text-[#5A655C] mt-1 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported Exercise Assessments */}
      <section className="px-4 py-8 max-w-xl mx-auto space-y-5">
        <div className="text-center">
          <span className="text-[11px] font-bold text-[#46664F] uppercase tracking-wider block">
            Movement Modules
          </span>
          <h2 className="text-xl font-bold text-[#303831] mt-0.5">
            Supported Physical Assessments
          </h2>
          <p className="text-xs text-[#5A655C] mt-1">
            Activity-specific computer vision algorithms tailored to athletic biomechanics
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {sportsCatalog.map((sp) => (
            <div
              key={sp.name}
              className="p-3.5 rounded-2xl bg-white border border-[#E5E7E2] hover:border-[#8FB8AC] transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F3F1E8] flex items-center justify-center text-xl shrink-0">
                  {sp.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-[#303831]">{sp.name}</h4>
                    <span className="badge-sage text-[9px] px-1.5 py-0.2">
                      {sp.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5A655C] mt-0.5 leading-snug">{sp.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Underserved & Rural Community Empowerment Section */}
      <section className="px-4 py-8 bg-[#DCE8D8]/40 border-t border-[#E5E7E2]">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[#46664F]/20 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#46664F] font-bold text-xs uppercase tracking-wider">
              <Heart size={16} className="text-[#C85A48]" />
              <span>Democratizing Sports Talent Identification</span>
            </div>

            <h3 className="text-base font-bold text-[#303831] leading-snug">
              Bridging the Athletic Divide Between Rural & Urban Youth
            </h3>

            <p className="text-xs text-[#5A655C] leading-relaxed">
              In developing sports ecosystems, thousands of naturally gifted young athletes in rural districts lack access to sports science laboratories, high-speed biomechanics cameras, or certified strength coaches.
            </p>

            <p className="text-xs text-[#5A655C] leading-relaxed">
              TalentPulse AI turns any standard camera into an objective biomechanical evaluator. It provides fair, transparent metrics to showcase genuine physical conditioning and helps grassroots coaches discover talent.
            </p>

            <div className="pt-2 flex items-center gap-3 text-[11px] text-[#303831] font-semibold">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-[#3E8A5E]" /> Free for grassroots students
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-[#3E8A5E]" /> Private athlete data
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Ethics & Transparent AI Notice */}
      <section className="px-4 py-6 max-w-xl mx-auto">
        <div className="p-4 rounded-xl bg-[#F8F9F6] border border-[#E5E7E2] text-xs text-[#5A655C] space-y-1">
          <p className="font-bold text-[#303831] flex items-center gap-1.5">
            <Shield size={14} className="text-[#46664F]" /> Responsible AI & Ethics Statement
          </p>
          <p className="text-[11px] leading-relaxed">
            AI movement assessment is designed as an assistive training and screening tool. It does not replace professional coaches, medical doctors, or physiotherapists, nor does it guarantee tournament selections or sports scholarships.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-[#E5E7E2] bg-white text-center space-y-3 text-xs text-[#5A655C]">
        <div className="flex justify-center items-center gap-2 font-bold text-[#303831]">
          <span>🏃‍♂️ TalentPulse AI</span>
          <span>•</span>
          <span className="text-[11px] text-[#5A655C]">College Mini-Project Edition</span>
        </div>
        <p className="text-[11px] max-w-sm mx-auto">
          AI-Powered Mobile Platform for Democratizing Sports Talent Assessment. Built with React (Vite), FastAPI, MediaPipe Pose, and SQLite.
        </p>
        <div className="flex justify-center gap-4 text-[11px] text-[#46664F] font-medium pt-1">
          <span className="cursor-pointer hover:underline">Privacy Policy</span>
          <span>•</span>
          <span className="cursor-pointer hover:underline">Ethics Guidelines</span>
          <span>•</span>
          <span className="cursor-pointer hover:underline">Open API</span>
        </div>
        <p className="text-[10px] text-[#7C887E] pt-2">
          © 2026 TalentPulse AI Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
