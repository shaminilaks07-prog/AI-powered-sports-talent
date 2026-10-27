import React, { useState, useEffect } from 'react';
import {
  Award,
  Calendar,
  MapPin,
  Building,
  CheckCircle2,
  ExternalLink,
  Shield,
  Filter,
  Users
} from 'lucide-react';
import { fetchVerifiedOpportunities } from '../services/api';

export default function OpportunitiesScreen({ onSelectDrillForOpportunity }) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sportFilter, setSportFilter] = useState('All');

  useEffect(() => {
    async function loadOpps() {
      setLoading(true);
      try {
        const data = await fetchVerifiedOpportunities();
        setOpportunities(data || []);
      } catch (err) {
        console.warn('Opportunities load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOpps();
  }, []);

  const sportsList = ['All', ...new Set(opportunities.map((o) => o.sport))];
  const filtered = sportFilter === 'All'
    ? opportunities
    : opportunities.filter((o) => o.sport === sportFilter);

  return (
    <div className="space-y-4 animate-fade-in pb-4 text-[#303831]">
      <div>
        <h2 className="text-lg font-black text-[#303831]">Sports Opportunities & Trials</h2>
        <p className="text-xs text-[#5A655C]">
          Verified grassroots talent trials, sports federation scouting camps, and development schemes.
        </p>
      </div>

      {/* Ethics & Transparency Alert */}
      <div className="p-3 rounded-xl bg-[#F3F1E8] border border-[#E5E7E2] text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-[#46664F] text-[11px] uppercase">
          <Shield size={13} /> Verified Grassroots Notice
        </div>
        <p className="text-[11px] text-[#5A655C] leading-snug">
          All listings are verified trials organized by public sports bodies, schools, and federations. The platform does not guarantee team selection or sell fake scholarship promises.
        </p>
      </div>

      {/* Filter Chips */}
      {sportsList.length > 2 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {sportsList.map((sp) => (
            <button
              key={sp}
              type="button"
              onClick={() => setSportFilter(sp)}
              className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                sportFilter === sp
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
        <div className="text-center py-10 text-xs text-[#5A655C] flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-[#46664F] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading verified opportunities...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7E2] text-center space-y-2">
          <Award size={24} className="text-[#8FB8AC] mx-auto" />
          <h4 className="font-bold text-xs text-[#303831]">No Trials Found in this Category</h4>
          <p className="text-[11px] text-[#5A655C]">
            New verified government and academy trial schedules are updated as schedules are finalized.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-[#E5E7E2] shadow-xs space-y-2.5"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="badge-sage text-[9px]">{item.sport}</span>
                    <span className="text-[10px] text-[#3E8A5E] font-bold flex items-center gap-0.5">
                      <CheckCircle2 size={11} /> Verified Trial
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#303831] leading-snug">{item.title}</h3>
                </div>
              </div>

              <p className="text-xs text-[#5A655C] leading-relaxed">
                {item.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5A655C] pt-1 border-t border-[#E5E7E2]">
                <div className="flex items-center gap-1.5">
                  <Building size={13} className="text-[#8FB8AC] shrink-0" />
                  <span className="truncate">{item.organizer}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#8FB8AC] shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#8FB8AC] shrink-0" />
                  <span>Deadline: {item.deadline}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={13} className="text-[#8FB8AC] shrink-0" />
                  <span className="truncate">{item.eligibility}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectDrillForOpportunity && onSelectDrillForOpportunity(item.sport)}
                className="w-full btn-sage text-xs py-2 flex items-center justify-center gap-1 mt-1"
              >
                Practice Assessment for This Trial <ExternalLink size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
