import React, { useEffect } from 'react';
import { Award, CheckCircle2, AlertTriangle, Lightbulb, ArrowLeft, RefreshCw, Share2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResultsScreen({ result, onRetake, onGoToHistory }) {
  useEffect(() => {
    // Launch a celebratory confetti effect when results load
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!result) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-slate-400 text-sm">No assessment result to display.</p>
        <button onClick={onRetake} className="btn-primary text-xs">
          Start New Assessment
        </button>
      </div>
    );
  }

  const score = result.overall_score || 85;
  const getScoreTier = (sc) => {
    if (sc >= 90) return { label: 'Elite Tier', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
    if (sc >= 80) return { label: 'High Potential / Advanced', color: 'text-cyan-400', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' };
    if (sc >= 70) return { label: 'Intermediate Prospect', color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' };
    return { label: 'Developmental Athlete', color: 'text-rose-400', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
  };

  const tier = getScoreTier(score);

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* Top Score Summary Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-5 border border-white/10 text-center shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5 border backdrop-blur-md"
             style={{ backgroundColor: 'rgba(0, 242, 254, 0.08)', borderColor: 'rgba(0, 242, 254, 0.25)', color: '#00f2fe' }}>
          <Sparkles size={12} /> {result.sport || 'Sports'} Assessment Complete
        </div>

        {/* Score Ring */}
        <div className="relative w-32 h-32 mx-auto my-2 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-800"
              strokeWidth="3.2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-cyan-400"
              strokeDasharray={`${score}, 100`}
              strokeWidth="3.2"
              strokeLinecap="round"
              stroke="url(#cyanGradient)"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <defs>
              <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f2fe" />
                <stop offset="100%" stopColor="#4facfe" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white tracking-tight">{score}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">/ 100 PTS</span>
          </div>
        </div>

        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mt-1 ${tier.bg} ${tier.color} ${tier.border}`}>
          {tier.label}
        </div>
      </div>

      {/* Biomechanical Breakdown Metrics */}
      <div className="glass-card p-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Award size={14} className="text-cyan-400" /> Biomechanical Metrics
        </h3>

        <div className="space-y-3">
          {result.metrics?.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 font-semibold">{m.name}</span>
                <span className="text-cyan-400 font-mono font-bold">
                  {m.score} {m.unit}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, m.score)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight pt-0.5">{m.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Strengths */}
      <div className="glass-card p-4 border-l-4 border-l-emerald-400">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle2 size={14} /> Key Technical Strengths
        </h3>
        <ul className="space-y-1.5">
          {result.strengths?.map((str, idx) => (
            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Areas for Improvement */}
      <div className="glass-card p-4 border-l-4 border-l-amber-400">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <AlertTriangle size={14} /> Areas for Refinement
        </h3>
        <ul className="space-y-1.5">
          {result.weaknesses?.map((wk, idx) => (
            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
              <span className="text-amber-400 mt-0.5 font-bold">•</span>
              <span>{wk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* AI Coach Action Plan */}
      <div className="glass-card p-4 border-l-4 border-l-cyan-400 bg-cyan-950/20">
        <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Lightbulb size={14} /> AI Coach Training Drills
        </h3>
        <ul className="space-y-2">
          {result.suggestions?.map((sug, idx) => (
            <li key={idx} className="text-xs text-slate-200 flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-white/5">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{sug}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button onClick={onRetake} className="btn-secondary text-xs py-3">
          <RefreshCw size={14} /> Retake Test
        </button>
        <button onClick={onGoToHistory} className="btn-primary text-xs py-3">
          View History & Progress
        </button>
      </div>
    </div>
  );
}
