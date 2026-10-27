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
  AlertCircle
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
      setActionMsg('Assessment deleted successfully.');
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
  const filteredHistory = filterSport === 'All'
    ? history
    : history.filter((h) => h.sport === filterSport);

  return (
    <div className="space-y-3.5 animate-fade-in pb-4 text-[#303831]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-[#303831]">Assessment History</h2>
          <p className="text-xs text-[#5A655C]">Persistent biomechanical evaluation records</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="p-1.5 rounded-lg bg-[#F3F1E8] hover:bg-[#C85A48]/15 text-[#5A655C] hover:text-[#C85A48] transition-colors"
            title="Clear all records"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {actionMsg && (
        <div className="p-2.5 rounded-xl bg-[#DCE8D8] text-[#46664F] text-xs font-semibold flex items-center gap-1.5">
          <CheckCircle2 size={14} />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Sport Filter Chips */}
      {sportsPresent.length > 2 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {sportsPresent.map((sp) => (
            <button
              key={sp}
              type="button"
              onClick={() => setFilterSport(sp)}
              className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                filterSport === sp
                  ? 'bg-[#46664F] text-white shadow-xs'
                  : 'bg-white border border-[#E5E7E2] text-[#5A655C] hover:bg-[#F3F1E8]'
              }`}
            >
              {sp}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-[#5A655C] text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-[#46664F] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading persistent assessment records...</span>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-white border border-[#E5E7E2] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F3F1E8] text-[#46664F] flex items-center justify-center mx-auto">
            <Clock size={22} />
          </div>
          <h3 className="text-sm font-bold text-[#303831]">No Assessment Logs Found</h3>
          <p className="text-xs text-[#5A655C] max-w-[260px] mx-auto leading-relaxed">
            Record or upload your movement video to generate persistent computer vision assessment logs.
          </p>
          <button onClick={onNewScan} className="btn-forest text-xs py-2.5 px-4 mt-1 inline-flex items-center gap-1.5">
            <Zap size={14} /> Record First Drill
          </button>
        </div>
      ) : (
        <div className="space-y-2">
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
                className="p-3.5 rounded-2xl bg-white hover:bg-[#F8F9F6] border border-[#E5E7E2] hover:border-[#8FB8AC] transition-all cursor-pointer flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#DCE8D8] border border-[#46664F]/20 flex flex-col items-center justify-center text-[#46664F] shrink-0">
                    <span className="text-base font-black leading-none">{item.overall_score}</span>
                    <span className="text-[8px] uppercase font-bold text-[#5A655C] mt-0.5">Score</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#303831] group-hover:text-[#46664F] transition-colors">
                      {item.sport}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#5A655C]">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {dateStr}
                      </span>
                      {item.reps_count > 0 && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-[#46664F]">{item.reps_count} reps</span>
                        </>
                      )}
                      {item.duration_sec > 0 && (
                        <>
                          <span>•</span>
                          <span>{item.duration_sec}s</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDeleteItem(e, item.id)}
                    className="p-1.5 rounded-lg text-[#7C887E] hover:text-[#C85A48] hover:bg-[#C85A48]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete item"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="w-7 h-7 rounded-full bg-[#F3F1E8] flex items-center justify-center text-[#5A655C] group-hover:text-[#46664F] group-hover:bg-[#DCE8D8] transition-all">
                    <ChevronRight size={14} />
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
