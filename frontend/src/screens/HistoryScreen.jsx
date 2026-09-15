import React, { useState, useEffect } from 'react';
import { Clock, Award, ChevronRight, Play, Calendar, Trash2, Zap } from 'lucide-react';
import { fetchUserAssessments } from '../services/api';

export default function HistoryScreen({ user, onSelectAssessment, onNewScan }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchUserAssessments(user?.id || 1);
      setHistory(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  const handleClearHistory = () => {
    if (window.confirm('Clear all local assessment history?')) {
      localStorage.removeItem(`history_${user?.id || 1}`);
      setHistory([]);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-white">Assessment Logs</h2>
          <p className="text-xs text-slate-400">Track your athletic progression over time</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
            title="Clear history"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading past assessments...</div>
      ) : history.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
            <Clock size={24} />
          </div>
          <h3 className="text-sm font-bold text-white">No Assessments Yet</h3>
          <p className="text-xs text-slate-400 max-w-[240px] mx-auto">
            Upload your first sports motion clip to see AI scoring and progress analytics.
          </p>
          <button onClick={onNewScan} className="btn-primary text-xs py-2.5 px-4 mt-2">
            <Zap size={14} /> Start First Assessment
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {history.map((item, idx) => {
            const dateStr = item.created_at
              ? new Date(item.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent';

            return (
              <div
                key={idx}
                onClick={() => onSelectAssessment(item)}
                className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col items-center justify-center text-cyan-400">
                    <span className="text-base font-black leading-tight">{item.overall_score}</span>
                    <span className="text-[8px] uppercase font-bold text-slate-400">Score</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.sport} Motion
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {dateStr}
                      </span>
                      <span>•</span>
                      <span>{item.metrics?.length || 4} Metrics</span>
                    </div>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
