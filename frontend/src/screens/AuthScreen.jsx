import React, { useState } from 'react';
import { LogIn, UserPlus, KeyRound, Mail, User, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function AuthScreen({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: 18,
    gender: 'Male',
    primary_sport: 'Cricket',
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
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    try {
      const res = await loginUser({ email: 'athlete@demo.com', password: 'password123' });
      onAuthSuccess(res.user);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-[600px] p-2 animate-fade-in">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-cyan-500/30 mb-3">
          ⚡
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">TalentPulse AI</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-[260px] mx-auto">
          Democratizing Sports Talent Assessment with Computer Vision & Biomechanics
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex bg-slate-900/90 p-1 rounded-xl border border-white/10 mb-5">
        <button
          type="button"
          onClick={() => { setIsLogin(true); setErrorMsg(''); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            isLogin ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setIsLogin(false); setErrorMsg(''); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            !isLogin ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Create Account
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
          {errorMsg}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {!isLogin && (
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Athlete Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="input-field pl-10"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="athlete@example.com"
              className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-field pl-10"
            />
          </div>
        </div>

        {!isLogin && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Primary Sport
              </label>
              <select
                name="primary_sport"
                value={formData.primary_sport}
                onChange={handleChange}
                className="input-field text-xs py-3"
              >
                <option value="Cricket">Cricket</option>
                <option value="Basketball">Basketball</option>
                <option value="Sprinting">Sprinting</option>
                <option value="Fitness/Squats">Fitness / Form</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                min="10"
                max="60"
                value={formData.age}
                onChange={handleChange}
                className="input-field py-3 text-xs"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary mt-2 py-3.5 text-sm"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : isLogin ? (
            <>
              <LogIn size={16} /> Sign In to Platform
            </>
          ) : (
            <>
              <UserPlus size={16} /> Register Athlete Profile
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Login Option */}
      <div className="mt-5 pt-4 border-t border-white/10 text-center">
        <p className="text-[11px] text-slate-400 mb-2">College Demo / Fast Testing:</p>
        <button
          type="button"
          onClick={handleQuickDemo}
          className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Sparkles size={14} /> Quick Demo Account (1-Click Login)
        </button>
      </div>
    </div>
  );
}
