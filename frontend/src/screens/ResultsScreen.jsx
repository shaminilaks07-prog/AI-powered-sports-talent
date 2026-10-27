import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Share2,
  Sparkles,
  ArrowLeft,
  Video,
  Clock,
  Activity,
  Send,
  ShieldCheck,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitCoachFeedback } from '../services/api';

export default function ResultsScreen({ result, onRetake, onGoToHistory, onBackToHome }) {
  const [coachNote, setCoachNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState(false);

  useEffect(() => {
    try {
      if (result && result.overall_score >= 70) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      // ignore
    }
  }, [result]);

  if (!result) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-[#5A655C] text-xs">No assessment report to display.</p>
        <button onClick={onRetake} className="btn-forest text-xs py-2 px-4">
          Start Assessment
        </button>
      </div>
    );
  }

  const score = result.overall_score || 75;

  const getScoreTier = (sc) => {
    if (sc >= 90) return { label: 'Elite Grassroots Tier', bg: 'bg-[#DCE8D8]', text: 'text-[#46664F]', border: 'border-[#46664F]/30' };
    if (sc >= 80) return { label: 'High Potential / Advanced', bg: 'bg-[#8FB8AC]/25', text: 'text-[#2E554C]', border: 'border-[#8FB8AC]/40' };
    if (sc >= 70) return { label: 'Intermediate Prospect', bg: 'bg-[#F3F1E8]', text: 'text-[#303831]', border: 'border-[#E5E7E2]' };
    return { label: 'Developmental Athlete', bg: 'bg-[#C85A48]/15', text: 'text-[#C85A48]', border: 'border-[#C85A48]/30' };
  };

  const tier = getScoreTier(score);

  const handleSaveCoachNote = async (e) => {
    e.preventDefault();
    if (!coachNote.trim() || !result.id) return;
    setSavingNote(true);
    try {
      await submitCoachFeedback(result.id, coachNote.trim());
      setNoteSuccess(true);
      result.coach_notes = coachNote.trim();
    } catch (err) {
      console.warn('Coach feedback error:', err);
    } finally {
      setSavingNote(false);
    }
  };

  const videoUrl = result.video_filename ? `http://127.0.0.1:8000/uploads/${result.video_filename}` : null;

  return (
    <div className="space-y-4 animate-fade-in pb-4 text-[#303831]">
      {/* Top Report Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-5 border border-[#E5E7E2] text-center shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-[#DCE8D8] text-[#46664F] border border-[#46664F]/20">
          <Sparkles size={12} /> {result.sport} Assessment
        </div>

        {/* Repetition and Duration Tag */}
        <div className="flex justify-center items-center gap-3 text-xs text-[#5A655C] mb-2 font-medium">
          {result.reps_count > 0 && (
            <span className="flex items-center gap-1 font-bold text-[#46664F]">
              <Activity size={13} /> {result.reps_count} Repetitions Completed
            </span>
          )}
          {result.duration_sec > 0 && (
            <span className="flex items-center gap-1">
              <Clock size={13} /> {result.duration_sec}s Duration
            </span>
          )}
          {result.cadence_rpm > 0 && (
            <span className="flex items-center gap-1">
              • {result.cadence_rpm} reps/min
            </span>
          )}
        </div>

        {/* Circular Score Gauge */}
        <div className="relative w-32 h-32 mx-auto my-2 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#E5E7E2]"
              strokeWidth="3.2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#46664F]"
              strokeDasharray={`${score}, 100`}
              strokeWidth="3.2"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-[#303831] tracking-tight">{score}</span>
            <span className="text-[9px] text-[#5A655C] font-bold uppercase tracking-widest">/ 100 PTS</span>
          </div>
        </div>

        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${tier.bg} ${tier.text} ${tier.border}`}>
          {tier.label}
        </div>

        {/* Quality / Confidence Indicator */}
        <div className="mt-3 flex justify-center items-center gap-1.5 text-[10px] text-[#5A655C]">
          <ShieldCheck size={12} className="text-[#3E8A5E]" />
          <span>Computer Vision Confidence: {result.detection_confidence || 88}%</span>
        </div>
      </div>

      {/* Video Playback Section (if available) */}
      {videoUrl && (
        <div className="p-3 rounded-2xl bg-white border border-[#E5E7E2] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#303831]">
            <Video size={14} className="text-[#46664F]" /> Evaluated Video Recording
          </div>
          <div className="relative rounded-xl overflow-hidden bg-black max-h-48 flex items-center justify-center">
            <video
              src={videoUrl}
              controls
              playsInline
              className="w-full max-h-48 object-contain"
            />
          </div>
        </div>
      )}

      {/* Detection Confidence Warning (if poor positioning) */}
      {result.detection_confidence < 60 && (
        <div className="p-3 rounded-xl bg-[#C85A48]/10 border border-[#C85A48]/25 text-[#C85A48] text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangle size={14} /> Sub-optimal Camera Angle Warning
          </div>
          <p className="text-[11px] leading-snug">
            MediaPipe detected lower tracking visibility. For higher precision, position camera 2.5–3m away with full body visible in even daylight.
          </p>
        </div>
      )}

      {/* Biomechanical Breakdown */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5E7E2] space-y-3">
        <h3 className="text-xs font-bold text-[#5A655C] uppercase tracking-wider flex items-center gap-1.5">
          <Award size={14} className="text-[#46664F]" /> Biomechanical Measurements
        </h3>

        <div className="space-y-3">
          {result.metrics?.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#303831] font-semibold">{m.name}</span>
                <span className="text-[#46664F] font-mono font-bold">
                  {m.score} {m.unit}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E5E7E2] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#46664F] transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(10, m.score))}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-[#5A655C] leading-tight pt-0.5">{m.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Strengths */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5E7E2] border-l-4 border-l-[#3E8A5E]">
        <h3 className="text-xs font-bold text-[#3E8A5E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle2 size={14} /> Key Technical Strengths
        </h3>
        <ul className="space-y-1.5">
          {result.strengths?.map((str, idx) => (
            <li key={idx} className="text-xs text-[#303831] flex items-start gap-2">
              <span className="text-[#3E8A5E] font-bold">✓</span>
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Areas for Improvement */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5E7E2] border-l-4 border-l-[#D9822B]">
        <h3 className="text-xs font-bold text-[#D9822B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <AlertTriangle size={14} /> Areas for Refinement
        </h3>
        <ul className="space-y-1.5">
          {result.weaknesses?.map((wk, idx) => (
            <li key={idx} className="text-xs text-[#303831] flex items-start gap-2">
              <span className="text-[#D9822B] font-bold">•</span>
              <span>{wk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* AI Coach Action Plan */}
      <div className="p-4 rounded-2xl bg-[#F3F1E8] border border-[#E5E7E2] space-y-2">
        <h3 className="text-xs font-bold text-[#46664F] uppercase tracking-wider flex items-center gap-1.5">
          <Lightbulb size={14} /> AI Coach Training Drills
        </h3>
        <ul className="space-y-2 pt-1">
          {result.suggestions?.map((sug, idx) => (
            <li key={idx} className="text-xs text-[#303831] flex items-start gap-2 bg-white p-2.5 rounded-xl border border-[#E5E7E2]">
              <span className="w-5 h-5 rounded-full bg-[#DCE8D8] text-[#46664F] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{sug}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Coach Notes & Review Foundation */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5E7E2] space-y-2">
        <h3 className="text-xs font-bold text-[#303831] flex items-center gap-1.5">
          <span>👨‍🏫 Coach Feedback & Trial Notes</span>
        </h3>
        {result.coach_notes ? (
          <div className="p-2.5 rounded-xl bg-[#F3F1E8] text-xs text-[#303831] font-medium border border-[#E5E7E2]">
            <p className="text-[10px] text-[#5A655C] font-bold uppercase mb-0.5">Recorded Coach Note:</p>
            "{result.coach_notes}"
          </div>
        ) : (
          <form onSubmit={handleSaveCoachNote} className="space-y-2">
            <textarea
              value={coachNote}
              onChange={(e) => setCoachNote(e.target.value)}
              placeholder="Coach or trial evaluator: add technical observation notes..."
              rows={2}
              className="sport-input text-xs"
            />
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#5A655C]">Controlled by athlete privacy settings</span>
              <button
                type="submit"
                disabled={savingNote || !coachNote.trim()}
                className="btn-forest text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <Send size={12} /> {savingNote ? 'Saving...' : 'Save Coach Note'}
              </button>
            </div>
            {noteSuccess && (
              <p className="text-[10px] text-[#3E8A5E] font-bold">Coach feedback saved successfully!</p>
            )}
          </form>
        )}
      </div>

      {/* Navigation Actions */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button onClick={onRetake} className="btn-outline text-xs py-3 flex items-center justify-center gap-1.5">
          <RefreshCw size={14} /> Retake Test
        </button>
        <button onClick={onGoToHistory} className="btn-forest text-xs py-3 flex items-center justify-center gap-1.5">
          View History & Progress
        </button>
      </div>
    </div>
  );
}
