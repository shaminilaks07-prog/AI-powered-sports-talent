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
  Users,
  Trophy
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
  const filtered =
    sportFilter === 'All'
      ? opportunities
      : opportunities.filter((o) => o.sport === sportFilter);

  return (
    <div className="space-y-6 animate-fade-in text-[#303831] max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-[#E6D8CB]">
        <h2 className="text-2xl font-black text-[#303831] tracking-tight">
          Verified Sports Trials & Opportunities
        </h2>
        <p className="text-xs md:text-sm text-[#766660]">
          Verified grassroots talent scouting camps, federation trials, and student sports schemes.
        </p>
      </div>

      {/* Notice Card */}
      <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] text-xs space-y-1 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-[#722F46] text-xs uppercase tracking-wider">
          <Shield size={16} /> Verified Grassroots Notice
        </div>
        <p className="text-xs text-[#766660] leading-relaxed">
          All listings are verified trials organized by public sports federations, schools, and academies. TalentPulse AI provides objective assessment preparation; the platform never sells fake selections or guarantees awards.
        </p>
      </div>

      {/* Filter Chips */}
      {sportsList.length > 2 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {sportsList.map((sp) => (
            <button
              key={sp}
              type="button"
              onClick={() => setSportFilter(sp)}
              className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap font-semibold transition-all ${
                sportFilter === sp
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
        <div className="text-center py-16 text-xs text-[#766660] flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-[#722F46] border-t-transparent rounded-full animate-spin" />
          <span>Loading verified opportunities...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#FFF9F2] border border-[#E6D8CB] text-center space-y-2 max-w-md mx-auto shadow-xs">
          <Trophy size={28} className="text-[#805044] mx-auto" />
          <h4 className="font-bold text-sm text-[#303831]">No Trials Found in this Category</h4>
          <p className="text-xs text-[#766660]">
            Verified federation scouting schedules are updated periodically as dates are announced.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#FFF9F2] border border-[#E6D8CB] shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFE4D8] text-[#4B2925]">
                    {item.sport}
                  </span>
                  <span className="text-[11px] text-[#278653] font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified Trial
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#303831] leading-snug">{item.title}</h3>

                <p className="text-xs text-[#766660] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E6D8CB] space-y-2">
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#766660]">
                  <div className="flex items-center gap-1.5 truncate">
                    <Building size={13} className="text-[#805044] shrink-0" />
                    <span className="truncate">{item.organizer}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin size={13} className="text-[#805044] shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar size={13} className="text-[#805044] shrink-0" />
                    <span>Deadline: {item.deadline}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Users size={13} className="text-[#805044] shrink-0" />
                    <span className="truncate">{item.eligibility}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectDrillForOpportunity && onSelectDrillForOpportunity(item.sport)}
                  className="w-full btn-wine text-xs py-2.5 flex items-center justify-center gap-1.5"
                >
                  <span>Practice Assessment for This Trial</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
