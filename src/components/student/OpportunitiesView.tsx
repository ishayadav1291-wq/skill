import React from 'react';
import confetti from 'canvas-confetti';
import {
  Briefcase,
  MapPin,
  CheckCircle2,
  Building2,
  Award,
  Sparkles,
  ExternalLink,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OPPORTUNITIES_DATA } from '../../data/opportunitiesData';

export const OpportunitiesView: React.FC = () => {
  const { profile, applyOpportunity } = useApp();

  const handleApply = (id: string) => {
    applyOpportunity(id);
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#1F4E79', '#F28C28'],
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#1F4E79] text-xs font-bold mb-2">
              <Briefcase className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>NAPS Apprenticeships & Verified Openings</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Matched Industry Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Curated roles from the National Apprenticeship Promotion Scheme (NAPS), National Career Service (NCS),
              and industrial partners matched directly to your verified skills.
            </p>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {OPPORTUNITIES_DATA.map((opp) => {
          const isApplied = profile.appliedOpportunityIds.includes(opp.id);

          // Calculate how many skills student currently has
          const matchedCount = opp.matchingSkills.filter(
            (sk) => (profile.skills[sk]?.level || 0) >= 2
          ).length;
          const matchPercent = Math.round(
            (matchedCount / Math.max(1, opp.allRequiredSkills.length)) * 100
          );

          return (
            <div
              key={opp.id}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                isApplied
                  ? 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-100'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      opp.type === 'NAPS Apprenticeship'
                        ? 'bg-orange-100 text-orange-950'
                        : opp.type === 'Internship'
                        ? 'bg-blue-100 text-[#1F4E79]'
                        : 'bg-purple-100 text-purple-950'
                    }`}
                  >
                    {opp.type}
                  </span>

                  <span className="text-xs font-extrabold text-[#2E8B57] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {matchPercent}% Skill Match
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                  {opp.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{opp.company}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{opp.location}</span>
                </div>

                {/* Stipend */}
                <div className="mt-3 py-2 px-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Stipend / Package:</span>
                  <span className="font-black text-[#1F4E79]">{opp.stipendOrSalary}</span>
                </div>

                {/* Skill Badges */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {opp.allRequiredSkills.map((sk) => {
                    const hasSkill = (profile.skills[sk]?.level || 0) >= 2;
                    return (
                      <span
                        key={sk}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          hasSkill
                            ? 'bg-emerald-100 text-[#2E8B57]'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {hasSkill ? '✓ ' : ''}{sk.replace('_', ' ')}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Source: {opp.source}</span>

                {isApplied ? (
                  <span className="text-xs font-bold text-[#2E8B57] flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Interest Expressed</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleApply(opp.id)}
                    className="px-4 py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply with Verified Skills</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
