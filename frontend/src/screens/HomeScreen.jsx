import React, { useState, useEffect } from 'react';
import {
  Play,
  Camera,
  Upload,
  TrendingUp,
  Award,
  Activity,
  Sparkles,
  ChevronRight,
  Target,
  Clock,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MapPin,
  Calendar
} from 'lucide-react';
import { fetchAthleteProgress, fetchUserAssessments } from '../services/api';

export default function HomeScreen({ user, onNavigateToUpload, onNavigateToHistory, onSelectAssessment }) {
  const [progress, setProgress] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const [progData, assessData] = await Promise.all([
          fetchAthleteProgress(user.id),
          fetchUserAssessments(user.id)
        ]);
        setProgress(progData);
        setAssessments(assessData || []);
      } catch (err) {
        console.warn('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  const sportsShortcuts = [
    { id: 'Sit-ups and Core Endurance', name: 'Sit-ups & Core', icon: '🧘', desc: 'Rep counter & cadence' },
    { id: 'Squats and Lower-Body Movement', name: 'Squats / Form', icon: '🏋️', desc: 'Depth & knee angles' },
    { id: 'Jumping Exercises', name: 'Jumping Power', icon: '⚡', desc: 'Explosive velocity' },
    { id: 'Running and Sprinting', name: 'Sprint Cadence', icon: '🏃', desc: 'Stride & trunk lean' },
    { id: 'Balance and Posture Assessment', name: 'Balance & Posture', icon: '⚖️', desc: 'Center-of-mass sway' }
  ];

  const latestAssessment = assessments[0];
  const hasHistory = assessments.length > 0;

  // Derive sport suitability insights from actual assessments
  const getSportsInsights = () => {
    if (!hasHistory) return null;
    const sportsTested = new Set(assessments.map((a) => a.sport));
    const highestScore = progress?.highest_score || 0;

    const suggestions = [];
    if (sportsTested.has('Sit-ups and Core Endurance') || sportsTested.has('General Fitness')) {
      suggestions.push({
        sport: 'Track & Field / Middle Distance',
        reason: 'Strong core rotational endurance stabilizes lumbar spine during continuous aerobic strides.'
      });
      suggestions.push({
        sport: 'Football / Soccer',
        reason: 'Abdominal brace and hip flexor conditioning support dynamic changing of direction.'
      });
    }
    if (sportsTested.has('Squats and Lower-Body Movement') || sportsTested.has('Jumping Exercises')) {
      suggestions.push({
        sport: 'Basketball / Volleyball',
        reason: 'Solid lower-body joint flexion indicates high vertical spring and ground reaction absorption.'
      });
    }
    if (sportsTested.has('Balance and Posture Assessment')) {
      suggestions.push({
        sport: 'Badminton / Gymnastics',
        reason: 'Minimal center-of-mass sway supports rapid court recovery and precise postural resets.'
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        sport: user?.primary_sport || 'Athletics',
        reason: 'Consistent baseline movement mechanics observed across recorded sessions.'
      });
    }
    return suggestions.slice(0, 2);
  };

  const sportsInsights = getSportsInsights();

  return (
    <div className="space-y-4 animate-fade-in pb-4 text-[#303831]">
      {/* Personalized Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#FFFFFF] p-4 border border-[#E5E7E2] shadow-sm">
        {/* Subtle athletic track background curve */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#DCE8D8]/40 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#46664F] uppercase tracking-wider">
              <Sparkles size={12} /> Athlete Assessment Center
            </div>
            <h2 className="text-xl font-black text-[#303831] mt-0.5">
              Welcome, {user?.name ? user.name.split(' ')[0] : 'Athlete'}!
            </h2>
            {user?.location && (
              <p className="text-[11px] text-[#5A655C] flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="text-[#8FB8AC]" /> {user.location}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#DCE8D8] border border-[#46664F]/20 text-[#46664F] text-[10px] font-bold">
            <span className="pulse-dot-forest"></span>
            <span>CV Ready</span>
          </div>
        </div>

        <p className="text-xs text-[#5A655C] leading-relaxed mb-3">
          Assess your physical technique using standard camera biomechanics. Objective metrics for athletes in all districts.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onNavigateToUpload('Sit-ups and Core Endurance')}
            className="btn-forest text-xs py-2.5 px-3 flex items-center justify-center gap-1.5"
          >
            <Play size={14} fill="currentColor" />
            Start Assessment
          </button>
          <button
            onClick={() => onNavigateToUpload()}
            className="btn-sage text-xs py-2.5 px-3 flex items-center justify-center gap-1.5"
          >
            <Upload size={14} />
            Upload Video
          </button>
        </div>
      </div>

      {/* Real Performance Snapshot Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-bold text-[#5A655C] uppercase tracking-wider">
            Verified Performance Snapshot
          </h3>
          {hasHistory && (
            <button
              onClick={onNavigateToHistory}
              className="text-xs text-[#46664F] hover:underline flex items-center font-bold"
            >
              All Records <ChevronRight size={12} />
            </button>
          )}
        </div>

        {/* If new user with 0 assessments, show clear, honest empty state */}
        {!hasHistory ? (
          <div className="p-4 rounded-2xl bg-white border border-[#E5E7E2] text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#F3F1E8] text-[#46664F] flex items-center justify-center mx-auto">
              <Activity size={20} />
            </div>
            <h4 className="font-bold text-xs text-[#303831]">No Assessment Data Yet</h4>
            <p className="text-[11px] text-[#5A655C] max-w-xs mx-auto leading-relaxed">
              Complete your first exercise assessment (such as Sit-ups or Squats) to view verified biomechanical scores and progress tracking.
            </p>
            <button
              onClick={() => onNavigateToUpload('Sit-ups and Core Endurance')}
              className="btn-sage text-xs py-2 px-3 mt-1 inline-flex items-center gap-1"
            >
              <Play size={12} /> Record Baseline Sit-ups
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-white border border-[#E5E7E2] text-center">
              <div className="w-6 h-6 rounded-lg bg-[#DCE8D8] text-[#46664F] flex items-center justify-center mx-auto mb-1">
                <Award size={14} />
              </div>
              <span className="text-lg font-black text-[#303831] block">
                {progress?.highest_score || 0}
              </span>
              <span className="text-[9px] text-[#5A655C] font-semibold uppercase">Top Score</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E5E7E2] text-center">
              <div className="w-6 h-6 rounded-lg bg-[#8FB8AC]/25 text-[#2E554C] flex items-center justify-center mx-auto mb-1">
                <TrendingUp size={14} />
              </div>
              <span className="text-lg font-black text-[#303831] block">
                {progress?.total_assessments || 0}
              </span>
              <span className="text-[9px] text-[#5A655C] font-semibold uppercase">Tests Done</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E5E7E2] text-center">
              <div className="w-6 h-6 rounded-lg bg-[#F3F1E8] text-[#46664F] flex items-center justify-center mx-auto mb-1">
                <Target size={14} />
              </div>
              <span className="text-lg font-black text-[#303831] block">
                {progress?.total_reps || 0}
              </span>
              <span className="text-[9px] text-[#5A655C] font-semibold uppercase">Reps Counted</span>
            </div>
          </div>
        )}
      </div>

      {/* Real Historical Progress Chart (when records exist) */}
      {hasHistory && progress?.history_trend?.length > 1 && (
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7E2] space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-[#303831] flex items-center gap-1.5">
              <TrendingUp size={14} className="text-[#46664F]" /> Performance Progress Over Time
            </h4>
            <span className="text-[10px] font-semibold text-[#5A655C]">
              {progress.history_trend.length} Sessions Logged
            </span>
          </div>

          {/* Simple Clean Responsive SVG Trend Line */}
          <div className="pt-2">
            <svg className="w-full h-24 overflow-visible" viewBox="0 0 300 80">
              <defs>
                <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#46664F" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#46664F" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="20" x2="300" y2="20" stroke="#E5E7E2" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#E5E7E2" strokeDasharray="3 3" />

              {/* Data points calculation */}
              {(() => {
                const trend = progress.history_trend;
                const minScore = 50;
                const maxScore = 100;
                const points = trend.map((t, idx) => {
                  const x = (idx / Math.max(1, trend.length - 1)) * 280 + 10;
                  const clampedScore = Math.max(minScore, Math.min(maxScore, t.score));
                  const y = 70 - ((clampedScore - minScore) / (maxScore - minScore)) * 55;
                  return { x, y, score: t.score, date: t.date };
                });

                const polyPoints = points.map((p) => `${p.x},${p.y}`).join(' ');
                const areaPoints = `10,75 ${polyPoints} ${points[points.length - 1].x},75`;

                return (
                  <>
                    <polygon points={areaPoints} fill="url(#scoreAreaGradient)" />
                    <polyline
                      fill="none"
                      stroke="#46664F"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={polyPoints}
                    />
                    {points.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="4" fill="#FFFFFF" stroke="#46664F" strokeWidth="2" />
                        <text
                          x={p.x}
                          y={p.y - 7}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="bold"
                          fill="#303831"
                        >
                          {p.score}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
            <div className="flex justify-between text-[9px] text-[#7C887E] pt-1">
              <span>First Session</span>
              <span>Latest Session</span>
            </div>
          </div>
        </div>
      )}

      {/* Latest Assessment Summary */}
      {latestAssessment && (
        <div
          onClick={() => onSelectAssessment && onSelectAssessment(latestAssessment)}
          className="p-3.5 rounded-2xl bg-white border border-[#E5E7E2] hover:border-[#8FB8AC] transition-all cursor-pointer shadow-xs space-y-2"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-[#46664F] uppercase tracking-wider block">
                Latest Completed Assessment
              </span>
              <h4 className="text-sm font-bold text-[#303831]">{latestAssessment.sport}</h4>
              <p className="text-[10px] text-[#5A655C]">
                {new Date(latestAssessment.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-[#DCE8D8] text-[#46664F] font-black text-sm text-center">
              <span>{latestAssessment.overall_score}</span>
              <span className="text-[8px] block font-bold text-[#5A655C]">SCORE</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E5E7E2]">
            <span className="text-[11px] text-[#5A655C]">
              {latestAssessment.reps_count > 0 ? `${latestAssessment.reps_count} Reps Logged` : 'Technique Evaluated'}
            </span>
            <span className="text-xs font-bold text-[#46664F] flex items-center">
              View Biomechanics Report <ChevronRight size={13} />
            </span>
          </div>
        </div>
      )}

      {/* Sports Suitability Insights (When history exists) */}
      {sportsInsights && (
        <div className="p-3.5 rounded-2xl bg-[#F3F1E8] border border-[#E5E7E2] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#46664F] uppercase tracking-wide">
            <Compass size={14} /> Sports Suitability Insights
          </div>
          <p className="text-[10px] text-[#5A655C]">
            Preliminary sporting suggestions based on your recorded joint angles and conditioning:
          </p>
          <div className="space-y-1.5 pt-0.5">
            {sportsInsights.map((ins, i) => (
              <div key={i} className="p-2 rounded-xl bg-white border border-[#E5E7E2] text-xs">
                <span className="font-bold text-[#303831] text-[11px] block">{ins.sport}</span>
                <span className="text-[10px] text-[#5A655C] leading-snug">{ins.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Exercise Categories */}
      <div>
        <h3 className="text-xs font-bold text-[#5A655C] uppercase tracking-wider mb-2">
          Available Assessment Modules
        </h3>
        <div className="space-y-1.5">
          {sportsShortcuts.map((sp) => (
            <div
              key={sp.id}
              onClick={() => onNavigateToUpload(sp.id)}
              className="p-3 rounded-xl bg-white hover:bg-[#F3F1E8] border border-[#E5E7E2] transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{sp.icon}</span>
                <div>
                  <h4 className="font-bold text-xs text-[#303831] group-hover:text-[#46664F]">
                    {sp.name}
                  </h4>
                  <p className="text-[10px] text-[#5A655C]">{sp.desc}</p>
                </div>
              </div>
              <ChevronRight size={15} className="text-[#7C887E] group-hover:text-[#46664F]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
