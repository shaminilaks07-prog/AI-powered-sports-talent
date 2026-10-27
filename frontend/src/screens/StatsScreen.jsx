import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Target,
  Activity,
  Calendar,
  Zap,
  ChevronRight,
  ShieldCheck,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { fetchAthleteProgress, fetchUserAssessments } from '../services/api';

export default function StatsScreen({ user, onNavigateToUpload, onSelectAssessment }) {
  const [progress, setProgress] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
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
        console.warn('Stats load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user]);

  const hasHistory = assessments.length > 0;
  const personalBests = progress?.personal_bests ? Object.entries(progress.personal_bests) : [];

  return (
    <div className="space-y-6 animate-fade-in text-[#303831] max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E6D8CB]">
        <div>
          <h2 className="text-2xl font-black text-[#303831] tracking-tight">
            Performance Statistics & Analytics
          </h2>
          <p className="text-xs md:text-sm text-[#766660]">
            Validated biomechanical records, historical progression trends, and personal bests.
          </p>
        </div>

        <button
          onClick={() => onNavigateToUpload()}
          className="btn-wine text-xs py-2.5 px-4 self-start md:self-auto"
        >
          <Zap size={14} /> New Performance Assessment
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-[#766660] text-xs flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-[#722F46] border-t-transparent rounded-full animate-spin" />
          <span>Aggregating athlete historical performance metrics...</span>
        </div>
      ) : !hasHistory ? (
        /* Empty State */
        <div className="p-8 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] text-center space-y-3 max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#F7F0E7] text-[#722F46] flex items-center justify-center mx-auto border border-[#E6D8CB]">
            <TrendingUp size={24} />
          </div>
          <h3 className="font-bold text-base text-[#303831]">No Statistics Available</h3>
          <p className="text-xs text-[#766660] leading-relaxed">
            There are no recorded assessments for this athlete yet. Complete an exercise test to unlock automatic metric tracking and progression analytics.
          </p>
          <button
            onClick={() => onNavigateToUpload('Sit-ups and Core Endurance')}
            className="btn-wine text-xs py-2.5 px-5 mt-2 inline-flex items-center gap-1.5"
          >
            <Zap size={14} /> Record Baseline Sit-ups
          </button>
        </div>
      ) : (
        <>
          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#766660] uppercase tracking-wider">
                  Peak Form Score
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#EFE4D8] text-[#722F46] flex items-center justify-center">
                  <Award size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-[#303831]">
                  {progress?.highest_score || 0}
                </span>
                <span className="text-xs text-[#766660] font-bold">/ 100 PTS</span>
              </div>
              <p className="text-[11px] text-[#278653] font-medium mt-1">Verified peak biomechanics</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#766660] uppercase tracking-wider">
                  Total Tests Logged
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#EFE4D8] text-[#805044] flex items-center justify-center">
                  <Activity size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-[#303831]">
                  {progress?.total_assessments || 0}
                </span>
                <span className="text-xs text-[#766660] font-bold">Sessions</span>
              </div>
              <p className="text-[11px] text-[#766660] mt-1">Recorded in database</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#766660] uppercase tracking-wider">
                  Total Valid Reps
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#EFE4D8] text-[#4B2925] flex items-center justify-center">
                  <Target size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-[#303831]">
                  {progress?.total_reps || 0}
                </span>
                <span className="text-xs text-[#766660] font-bold">Reps</span>
              </div>
              <p className="text-[11px] text-[#766660] mt-1">Computer vision counted</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#766660] uppercase tracking-wider">
                  Latest Score
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#EFE4D8] text-[#722F46] flex items-center justify-center">
                  <Flame size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-[#303831]">
                  {progress?.latest_score || 0}
                </span>
                <span className="text-xs text-[#766660] font-bold">/ 100 PTS</span>
              </div>
              <p className="text-[11px] text-[#766660] mt-1">Most recent session</p>
            </div>
          </div>

          {/* Historical Trend Chart */}
          {progress?.history_trend && progress.history_trend.length > 1 && (
            <div className="p-6 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#303831] flex items-center gap-2">
                    <TrendingUp size={16} className="text-[#722F46]" /> Biomechanical Score Progression
                  </h3>
                  <p className="text-xs text-[#766660]">Trajectory across completed test sessions</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EFE4D8] text-[#4B2925] border border-[#E6D8CB] self-start sm:self-auto">
                  {progress.history_trend.length} Sessions Logged
                </span>
              </div>

              {/* Progress Line Graph */}
              <div className="pt-4">
                <svg className="w-full h-36 overflow-visible" viewBox="0 0 600 100">
                  <defs>
                    <linearGradient id="statsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#722F46" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#722F46" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="600" y2="20" stroke="#E6D8CB" strokeDasharray="4 4" />
                  <line x1="0" y1="50" x2="600" y2="50" stroke="#E6D8CB" strokeDasharray="4 4" />
                  <line x1="0" y1="80" x2="600" y2="80" stroke="#E6D8CB" strokeDasharray="4 4" />

                  {/* Data Points Calculation */}
                  {(() => {
                    const trend = progress.history_trend;
                    const minScore = 50;
                    const maxScore = 100;
                    const points = trend.map((t, idx) => {
                      const x = (idx / Math.max(1, trend.length - 1)) * 560 + 20;
                      const clampedScore = Math.max(minScore, Math.min(maxScore, t.score));
                      const y = 85 - ((clampedScore - minScore) / (maxScore - minScore)) * 70;
                      return { x, y, score: t.score, sport: t.sport, date: t.date };
                    });

                    const polyPoints = points.map((p) => `${p.x},${p.y}`).join(' ');
                    const areaPoints = `20,95 ${polyPoints} ${points[points.length - 1].x},95`;

                    return (
                      <>
                        <polygon points={areaPoints} fill="url(#statsGradient)" />
                        <polyline
                          fill="none"
                          stroke="#722F46"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={polyPoints}
                        />
                        {points.map((p, i) => (
                          <g key={i}>
                            <circle cx={p.x} cy={p.y} r="5" fill="#FFF9F2" stroke="#722F46" strokeWidth="2.5" />
                            <text
                              x={p.x}
                              y={p.y - 9}
                              textAnchor="middle"
                              fontSize="10"
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

                <div className="flex justify-between text-[11px] text-[#766660] font-medium pt-2 border-t border-[#E6D8CB]/60">
                  <span>Initial Baseline</span>
                  <span>Latest Assessment</span>
                </div>
              </div>
            </div>
          )}

          {/* Personal Bests by Discipline */}
          {personalBests.length > 0 && (
            <div className="p-6 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#303831] flex items-center gap-2">
                <Award size={16} className="text-[#4B2925]" /> Validated Personal Bests by Discipline
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {personalBests.map(([sportName, pbData]) => (
                  <div
                    key={sportName}
                    className="p-4 rounded-xl bg-[#F7F0E7] border border-[#E6D8CB] space-y-1.5"
                  >
                    <span className="text-xs font-bold text-[#303831] block truncate">
                      {sportName}
                    </span>
                    <div className="flex justify-between items-baseline pt-1">
                      <div>
                        <span className="text-2xl font-black text-[#722F46]">
                          {pbData.highest_score}
                        </span>
                        <span className="text-[10px] text-[#766660] font-bold block">Peak Score</span>
                      </div>
                      {pbData.max_reps > 0 && (
                        <div className="text-right">
                          <span className="text-lg font-bold text-[#4B2925]">
                            {pbData.max_reps}
                          </span>
                          <span className="text-[10px] text-[#766660] font-medium block">Max Reps</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
