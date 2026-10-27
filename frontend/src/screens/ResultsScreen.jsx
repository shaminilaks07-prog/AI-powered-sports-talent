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
  Info,
  ChevronRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitCoachFeedback } from '../services/api';

export default function ResultsScreen({ result, onRetake, onGoToHistory, onBackToHome }) {
  const [coachNote, setCoachNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState(false);

  const isLowConfidence =
    !result ||
    result.detection_confidence < 60 ||
    result.assessment_status === 'Detection Warning - Reposition Camera';

  useEffect(() => {
    try {
      // Only celebrate if confidence is high and score is solid
      if (result && !isLowConfidence && result.overall_score >= 70) {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      // ignore
    }
  }, [result, isLowConfidence]);

  if (!result) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] flex items-center justify-center mx-auto text-[#766660]">
          <Info size={22} />
        </div>
        <p className="text-[#766660] text-xs">No active biomechanical assessment report to display.</p>
        <button onClick={onRetake} className="btn-wine text-xs py-2.5 px-5">
          Start Video Assessment
        </button>
      </div>
    );
  }

  const score = result.overall_score || 0;

  const getScoreTier = (sc) => {
    if (sc >= 90) return { label: 'Elite Grassroots Tier', bg: 'bg-[#278653]/15', text: 'text-[#278653]', border: 'border-[#278653]/30' };
    if (sc >= 80) return { label: 'High Potential / Advanced', bg: 'bg-[#722F46]/15', text: 'text-[#722F46]', border: 'border-[#722F46]/30' };
    if (sc >= 70) return { label: 'Intermediate Prospect', bg: 'bg-[#805044]/15', text: 'text-[#805044]', border: 'border-[#805044]/30' };
    return { label: 'Developmental Athlete', bg: 'bg-[#C47A32]/15', text: 'text-[#C47A32]', border: 'border-[#C47A32]/30' };
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
    <div className="space-y-6 animate-fade-in text-[#303831] max-w-4xl mx-auto">
      {/* Header Breadcrumbs */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E6D8CB]">
        <div>
          <h2 className="text-2xl font-black text-[#303831] tracking-tight">
            Biomechanics & Talent Report
          </h2>
          <p className="text-xs text-[#766660]">
            Detailed joint kinematics, repetition analysis, and technical evaluation.
          </p>
        </div>

        <button
          onClick={onBackToHome}
          className="btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>

      {/* INSUFFICIENT CONFIDENCE / BODY VISIBILITY CHECK */}
      {isLowConfidence ? (
        <div className="p-6 md:p-8 rounded-3xl bg-[#FFF9F2] border-2 border-[#C47A32] shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C47A32]/15 text-[#C47A32] flex items-center justify-center shrink-0">
              <ShieldAlert size={26} />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#C47A32]/15 text-[#C47A32] text-[10px] font-bold uppercase tracking-wider mb-1">
                Validation Warning
              </div>
              <h3 className="text-lg font-black text-[#303831]">
                Talent Score Withheld – Insufficient Pose Landmark Visibility
              </h3>
              <p className="text-xs text-[#766660] mt-1 leading-relaxed">
                The MediaPipe computer vision model detected lower landmark tracking confidence ({result.detection_confidence || 35}%). Key skeletal joints (shoulders, hips, or knees) were either partially out of frame, obscured, or recorded under inadequate lighting.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F0E7] border border-[#E6D8CB] space-y-2 text-xs">
            <span className="font-bold text-[#303831] block">
              Why wasn't a talent score assigned?
            </span>
            <p className="text-[#766660] leading-relaxed text-[11px]">
              To maintain scientific integrity and prevent biased or false evaluations for grassroots athletes, TalentPulse AI does not estimate a talent score when limb visibility is compromised.
            </p>
            <div className="pt-2 border-t border-[#E6D8CB] space-y-1 text-[11px] text-[#303831]">
              <p className="font-semibold text-[#4B2925]">How to record a valid video:</p>
              <ul className="list-disc list-inside space-y-1 text-[#766660]">
                <li>Position phone or webcam on a steady surface at waist/mat level, 2.5–3m away.</li>
                <li>Ensure full body from head to feet remains visible during the full range of motion.</li>
                <li>Record in bright, even daylight or well-lit indoor area (avoid backlighting).</li>
                <li>Wear clothing that contrasts with your flooring or background.</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onRetake}
              className="btn-wine text-xs py-3 px-6 flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} /> Upload a Better Video
            </button>
            <button
              onClick={onBackToHome}
              className="btn-outline text-xs py-3 px-5 flex items-center justify-center gap-1.5"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* SUFFICIENT CONFIDENCE - OFFICIAL REPORT */
        <>
          {/* Main Score & Athlete Tier Card */}
          <div className="relative overflow-hidden rounded-3xl bg-[#FFF9F2] p-6 md:p-8 border border-[#E6D8CB] text-center shadow-xs space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#722F46]/10 text-[#722F46] border border-[#722F46]/20">
              <Sparkles size={13} /> {result.sport} Assessment
            </div>

            {/* Repetitions, Duration & Cadence */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-[#766660] font-medium">
              {result.reps_count > 0 && (
                <span className="flex items-center gap-1.5 font-bold text-[#722F46]">
                  <Activity size={15} /> {result.reps_count} Repetitions Completed
                </span>
              )}
              {result.duration_sec > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock size={15} /> {result.duration_sec}s Duration
                </span>
              )}
              {result.cadence_rpm > 0 && (
                <span className="flex items-center gap-1.5">
                  • {result.cadence_rpm} reps/min cadence
                </span>
              )}
            </div>

            {/* Circular Biomechanics Score Gauge */}
            <div className="relative w-36 h-36 mx-auto my-2 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#E6D8CB]"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#722F46]"
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
                <span className="text-[9px] text-[#766660] font-bold uppercase tracking-widest">/ 100 PTS</span>
              </div>
            </div>

            <div className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold border ${tier.bg} ${tier.text} ${tier.border}`}>
              {tier.label}
            </div>

            {/* Confidence Stamp */}
            <div className="flex justify-center items-center gap-1.5 text-[11px] text-[#766660] pt-1">
              <ShieldCheck size={14} className="text-[#278653]" />
              <span>Computer Vision Tracking Confidence: {result.detection_confidence || 88}%</span>
            </div>
          </div>

          {/* Evaluated Video Clip */}
          {videoUrl && (
            <div className="p-5 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#303831]">
                <Video size={16} className="text-[#722F46]" /> Evaluated Video Recording
              </div>
              <div className="rounded-xl overflow-hidden bg-black max-h-60 flex items-center justify-center">
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  className="w-full max-h-60 object-contain"
                />
              </div>
            </div>
          )}

          {/* Biomechanical Measurements Breakdown */}
          <div className="p-6 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#766660] uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-[#722F46]" /> Biomechanical Measurement Breakdown
            </h3>

            <div className="space-y-4">
              {result.metrics?.map((m, idx) => (
                <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-[#F7F0E7] border border-[#E6D8CB]">
                  <div className="flex justify-between items-baseline text-xs font-bold">
                    <span className="text-[#303831]">{m.name}</span>
                    <span className="text-[#722F46] font-mono font-black text-sm">
                      {m.score} {m.unit}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E6D8CB] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#722F46] transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, m.score))}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#766660] leading-relaxed pt-0.5">{m.feedback}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Strengths & Areas for Refinement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] border-l-4 border-l-[#278653] shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-[#278653] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={15} /> Key Technical Strengths
              </h3>
              <ul className="space-y-2 pt-1">
                {result.strengths?.map((str, idx) => (
                  <li key={idx} className="text-xs text-[#303831] flex items-start gap-2">
                    <span className="text-[#278653] font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] border-l-4 border-l-[#C47A32] shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-[#C47A32] uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={15} /> Areas for Refinement
              </h3>
              <ul className="space-y-2 pt-1">
                {result.weaknesses?.map((wk, idx) => (
                  <li key={idx} className="text-xs text-[#303831] flex items-start gap-2">
                    <span className="text-[#C47A32] font-bold">•</span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Coach Action Plan */}
          <div className="p-6 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#4B2925] uppercase tracking-wider flex items-center gap-2">
              <Lightbulb size={16} className="text-[#722F46]" /> AI Coach Training Drills
            </h3>
            <ul className="space-y-2 pt-1">
              {result.suggestions?.map((sug, idx) => (
                <li
                  key={idx}
                  className="text-xs text-[#303831] flex items-start gap-2.5 bg-[#F7F0E7] p-3 rounded-xl border border-[#E6D8CB]"
                >
                  <span className="w-5 h-5 rounded-full bg-[#722F46] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{sug}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Coach Notes & Review */}
          <div className="p-6 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#303831] flex items-center gap-2">
              <span>👨‍🏫 Coach Feedback & Trial Notes</span>
            </h3>

            {result.coach_notes ? (
              <div className="p-3.5 rounded-xl bg-[#F7F0E7] text-xs text-[#303831] border border-[#E6D8CB]">
                <p className="text-[10px] text-[#766660] font-bold uppercase mb-1">Recorded Coach Observation:</p>
                <p className="italic">"{result.coach_notes}"</p>
              </div>
            ) : (
              <form onSubmit={handleSaveCoachNote} className="space-y-2.5">
                <textarea
                  value={coachNote}
                  onChange={(e) => setCoachNote(e.target.value)}
                  placeholder="Coach or trial evaluator: add biomechanical feedback notes..."
                  rows={2}
                  className="sport-input text-xs"
                />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="text-[10px] text-[#766660]">Controlled by athlete privacy permissions</span>
                  <button
                    type="submit"
                    disabled={savingNote || !coachNote.trim()}
                    className="btn-wine text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    <Send size={13} /> {savingNote ? 'Saving...' : 'Save Coach Feedback'}
                  </button>
                </div>
                {noteSuccess && (
                  <p className="text-[11px] text-[#278653] font-bold">Coach feedback saved successfully!</p>
                )}
              </form>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={onRetake}
              className="btn-outline text-xs py-3 flex items-center justify-center gap-2"
            >
              <RefreshCw size={15} /> Retake Assessment
            </button>
            <button
              onClick={onGoToHistory}
              className="btn-wine text-xs py-3 flex items-center justify-center gap-2"
            >
              View Assessment History
            </button>
          </div>
        </>
      )}
    </div>
  );
}
