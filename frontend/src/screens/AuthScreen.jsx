import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  KeyRound,
  Mail,
  User,
  Compass,
  MapPin,
  Target,
  ArrowLeft,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function AuthScreen({ onAuthSuccess, onBackToLanding }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: 18,
    gender: 'Male',
    primary_sport: 'Sit-ups and Core Endurance',
    location: '',
    fitness_goals: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        const res = await loginUser({ email: formData.email, password: formData.password });
        onAuthSuccess(res.user);
      } else {
        const res = await registerUser(formData);
        onAuthSuccess(res.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await loginUser({ email: 'arjun.patel@sports.org', password: 'password123' });
      onAuthSuccess(res.user);
    } catch (err) {
      try {
        // Fallback demo account
        const res = await loginUser({ email: 'athlete@demo.com', password: 'password123' });
        onAuthSuccess(res.user);
      } catch (e) {
        setErrorMsg('Could not log into demo account. Please verify FastAPI backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-[560px] p-2 animate-fade-in">
      {/* Back to landing */}
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="self-start mb-3 text-xs text-[#5A655C] hover:text-[#303831] flex items-center gap-1 font-semibold"
        >
          <ArrowLeft size={14} /> Back to Overview
        </button>
      )}

      {/* Brand Header */}
      <div className="text-center mb-5">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-[#46664F] items-center justify-center text-white font-black text-2xl shadow-sm mb-2.5">
          🏃‍♂️
        </div>
        <h2 className="text-xl font-black text-[#303831] tracking-tight">TalentPulse AI</h2>
        <p className="text-xs text-[#5A655C] mt-0.5 max-w-[260px] mx-auto">
          Accessible Sports Biomechanics & Performance Assessment Platform
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex bg-[#F3F1E8] p-1 rounded-xl border border-[#E5E7E2] mb-4">
        <button
          type="button"
          onClick={() => { setIsLogin(true); setErrorMsg(''); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            isLogin ? 'bg-[#46664F] text-white shadow-sm' : 'text-[#5A655C] hover:text-[#303831]'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setIsLogin(false); setErrorMsg(''); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            !isLogin ? 'bg-[#46664F] text-white shadow-sm' : 'text-[#5A655C] hover:text-[#303831]'
          }`}
        >
          Create Profile
        </button>
      </div>

      {errorMsg && (
        <div className="mb-3.5 p-3 rounded-xl bg-[#C85A48]/10 border border-[#C85A48]/20 text-[#C85A48] text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {!isLogin && (
          <div>
            <label className="block text-[11px] font-bold text-[#5A655C] uppercase tracking-wider mb-1">
              Athlete Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 text-[#7C887E]" size={15} />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Arjun Patel"
                className="sport-input pl-10"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-bold text-[#5A655C] uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 text-[#7C887E]" size={15} />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="athlete@example.com"
              className="sport-input pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#5A655C] uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-3.5 text-[#7C887E]" size={15} />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="sport-input pl-10"
            />
          </div>
        </div>

        {!isLogin && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-[#5A655C] uppercase tracking-wider mb-1">
                  Primary Sport
                </label>
                <select
                  name="primary_sport"
                  value={formData.primary_sport}
                  onChange={handleChange}
                  className="sport-input text-xs py-2.5"
                >
                  <option value="Sit-ups and Core Endurance">Sit-ups & Core</option>
                  <option value="Squats and Lower-Body Movement">Squats / Legs</option>
                  <option value="Jumping Exercises">Jumping / Explosive</option>
                  <option value="Running and Sprinting">Sprinting & Cadence</option>
                  <option value="Balance and Posture Assessment">Balance & Posture</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Basketball">Basketball</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5A655C] uppercase tracking-wider mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  min="10"
                  max="60"
                  value={formData.age}
                  onChange={handleChange}
                  className="sport-input py-2.5 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A655C] uppercase tracking-wider mb-1">
                Location (District / State)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 text-[#7C887E]" size={14} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Ranchi, Jharkhand"
                  className="sport-input pl-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A655C] uppercase tracking-wider mb-1">
                Fitness & Athletic Goal
              </label>
              <div className="relative">
                <Target className="absolute left-3.5 top-3 text-[#7C887E]" size={14} />
                <input
                  type="text"
                  name="fitness_goals"
                  value={formData.fitness_goals}
                  onChange={handleChange}
                  placeholder="e.g. Build core strength for state trials"
                  className="sport-input pl-9 text-xs"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-forest mt-3 py-3 text-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : isLogin ? (
            <>
              <LogIn size={15} /> Sign In to Athlete Dashboard
            </>
          ) : (
            <>
              <UserPlus size={15} /> Register Athlete Profile
            </>
          )}
        </button>
      </form>

      {/* 1-Click Demo Testing Option */}
      <div className="mt-4 pt-3.5 border-t border-[#E5E7E2] text-center">
        <p className="text-[11px] text-[#5A655C] mb-2">College Demo / Fast Examiner Testing:</p>
        <button
          type="button"
          onClick={handleQuickDemo}
          disabled={loading}
          className="w-full py-2.5 px-3 rounded-xl bg-[#DCE8D8] hover:bg-[#cde0c7] border border-[#46664F]/25 text-[#46664F] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Sparkles size={14} /> Quick Demo Account (1-Click Login)
        </button>
      </div>
    </div>
  );
}
