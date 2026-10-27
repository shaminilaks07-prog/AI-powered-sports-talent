import React, { useState, useEffect } from 'react';
import {
  Clock,
  Award,
  ChevronRight,
  Calendar,
  Trash2,
  Zap,
  Activity,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileBarChart2
} from 'lucide-react';
import { fetchUserAssessments, deleteAssessmentById, deleteUserAssessments } from '../services/api';

export default function HistoryScreen({ user, onSelectAssessment, onNewScan }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSport, setFilterSport] = useState('All');
  const [actionMsg, setActionMsg] = useState('');

  const loadHistory = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await fetchUserAssessments(user.id);
      setHistory(data || []);
    } catch (e) {
      console.error('History load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  const handleDeleteItem = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this assessment record from your history?')) return;
    try {
      await deleteAssessmentById(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      setActionMsg('Assessment record deleted successfully.');
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert('Could not delete assessment: ' + err.message);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL assessment history? This cannot be undone.')) return;
    try {
      await deleteUserAssessments(user.id);
      localStorage.removeItem(`history_${user.id}`);
      setHistory([]);
      setActionMsg('All assessment records cleared.');
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert('Could not clear history: ' + err.message);
    }
  };

  const sportsPresent = ['All', ...new Set(history.map((h) => h.sport))];
  const filteredHistory =
    filterSport === 'All'
      ? history
      : history.filter((h) => h.sport === filterSport);

  return (
    <div className="space-y-6 animate-fade-in text-[#303831] max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E6D8CB]">
        <div>
          <h2 className="text-2xl font-black text-[#303831] tracking-tight">
            Talent Reports & History
          </h2>
          <p className="text-xs md:text-sm text-[#766660]">
            Persistent biomechanical evaluations, repetition logs, and coach feedback records.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-2 rounded-xl bg-[#FFF9F2] hover:bg-[#570F22]/10 border border-[#E6D8CB] text-[#766660] hover:text-[#570F22] transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Clear all records"
            >
              <Trash2 size={14} /> Clear History
            </button>
          )}

          <button
            onClick={onNewScan}
            className="btn-wine text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <Zap size={14} /> New Test
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3.5 rounded-xl bg-[#278653]/15 border border-[#278653]/30 text-[#278653] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Sport Filter Chips */}
      {sportsPresent.length > 2 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {sportsPresent.map((sp) => (
            <button
              key={sp}
              type="button"
              onClick={() => setFilterSport(sp)}
              className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap font-semibold transition-all ${
                filterSport === sp
                  ? 'bg-[#722F46] text-white shadow-xs'
                  : 'bg-[#FFF9F2] border border-[#E6D8CB] text-[#766660] hover:bg-[#EFE4D8]'
              }`}
            >
              {sp}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-[#766660] text-xs flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-[#722F46] border-t-transparent rounded-full animate-spin" />
          <span>Retrieving persistent assessment reports...</span>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#FFF9F2] border border-[#E6D8CB] space-y-3 max-w-md mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#F7F0E7] text-[#722F46] flex items-center justify-center mx-auto border border-[#E6D8CB]">
            <Clock size={22} />
          </div>
          <h3 className="text-base font-bold text-[#303831]">No Assessment Logs Found</h3>
          <p className="text-xs text-[#766660] leading-relaxed">
            Record or upload an athletic video to generate persistent computer vision assessment logs and biomechanical scores.
          </p>
          <button
            onClick={onNewScan}
            className="btn-wine text-xs py-2.5 px-5 mt-2 inline-flex items-center gap-2"
          >
            <Zap size={14} /> Record First Drill
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const dateStr = item.created_at
              ? new Date(item.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'Recent Session';

            return (
              <div
                key={item.id}
                onClick={() => onSelectAssessment(item)}
                className="p-4 md:p-5 rounded-2xl bg-[#FFF9F2] hover:bg-[#fff6ec] border border-[#E6D8CB] hover:border-[#805044] transition-all cursor-pointer flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#EFE4D8] border border-[#E6D8CB] flex flex-col items-center justify-center text-[#722F46] shrink-0">
                    <span className="text-lg font-black leading-none">{item.overall_score}</span>
                    <span className="text-[8px] uppercase font-bold text-[#766660] mt-1">Score</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#303831] group-hover:text-[#722F46] transition-colors">
                      {item.sport}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#766660]">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} /> {dateStr}
                      </span>
                      {item.reps_count > 0 && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-[#722F46]">{item.reps_count} reps counted</span>
                        </>
                      )}
                      {item.duration_sec > 0 && (
                        <>
                          <span>•</span>
                          <span>{item.duration_sec}s</span>
                        </>
                      )}
                      {item.coach_notes && (
                        <>
                          <span>•</span>
                          <span className="text-[#278653] font-semibold">Coach Reviewed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={(e) => handleDeleteItem(e, item.id)}
                    className="p-2 rounded-lg text-[#766660] hover:text-[#570F22] hover:bg-[#570F22]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete record"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="w-8 h-8 rounded-xl bg-[#F7F0E7] flex items-center justify-center text-[#766660] group-hover:text-white group-hover:bg-[#722F46] transition-all">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
