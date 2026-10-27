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
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-120px)] p-4 animate-fade-in text-[#303831]">
      <div className="w-full max-w-md bg-[#FFF9F2] border border-[#E6D8CB] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        {/* Back to landing */}
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="text-xs text-[#766660] hover:text-[#303831] flex items-center gap-1.5 font-bold mb-1"
          >
            <ArrowLeft size={14} /> Back to Overview
          </button>
        )}

        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-[#4B2925] border border-[#722F46] items-center justify-center text-white font-black text-2xl shadow-xs mx-auto mb-2">
            🏃‍♂️
          </div>
          <h2 className="text-2xl font-black text-[#303831] tracking-tight">TalentPulse AI</h2>
          <p className="text-xs text-[#766660]">
            AI-Powered Sports Biomechanics & Talent Assessment
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-[#F7F0E7] p-1.5 rounded-xl border border-[#E6D8CB]">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              isLogin ? 'bg-[#722F46] text-white shadow-xs' : 'text-[#766660] hover:text-[#303831]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              !isLogin ? 'bg-[#722F46] text-white shadow-xs' : 'text-[#766660] hover:text-[#303831]'
            }`}
          >
            Create Profile
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-[#C47A32]/10 border border-[#C47A32]/25 text-[#C47A32] text-xs font-medium flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-[#766660] uppercase mb-1">
                Athlete Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-[#805044]" size={15} />
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
            <label className="block text-xs font-bold text-[#766660] uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-[#805044]" size={15} />
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
            <label className="block text-xs font-bold text-[#766660] uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3.5 text-[#805044]" size={15} />
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
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#766660] uppercase mb-1">
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
                  <label className="block text-xs font-bold text-[#766660] uppercase mb-1">
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
                <label className="block text-xs font-bold text-[#766660] uppercase mb-1">
                  Location (District / State)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 text-[#805044]" size={15} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Ranchi, Jharkhand"
                    className="sport-input pl-10 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#766660] uppercase mb-1">
                  Fitness & Athletic Goal
                </label>
                <div className="relative">
                  <Target className="absolute left-3.5 top-3.5 text-[#805044]" size={15} />
                  <input
                    type="text"
                    name="fitness_goals"
                    value={formData.fitness_goals}
                    onChange={handleChange}
                    placeholder="e.g. Build core strength for state trials"
                    className="sport-input pl-10 text-xs"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-wine py-3.5 text-sm flex items-center justify-center gap-2 shadow-sm font-bold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : isLogin ? (
              <>
                <LogIn size={16} /> Sign In to Athlete Dashboard
              </>
            ) : (
              <>
                <UserPlus size={16} /> Register Athlete Profile
              </>
            )}
          </button>
        </form>

        {/* 1-Click Fast Demo Login */}
        <div className="pt-3 border-t border-[#E6D8CB] text-center space-y-2">
          <p className="text-[11px] text-[#766660]">Fast Examiner / Demonstration Login:</p>
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={loading}
            className="w-full py-2.5 px-3 rounded-xl bg-[#EFE4D8] hover:bg-[#E6D8CB] border border-[#E6D8CB] text-[#4B2925] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles size={14} className="text-[#722F46]" /> 1-Click Demo Account Login
          </button>
        </div>
      </div>
    </div>
  );
}
