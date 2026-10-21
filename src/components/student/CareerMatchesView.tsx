import React, { useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Columns2,
  X,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCareerRecommendations } from '../../services/recommendationEngine';
import { CAREER_ROLES } from '../../data/rolesData';
import { CareerRecommendation } from '../../types';

export const CareerMatchesView: React.FC = () => {
  const {
    profile,
    targetRole,
    setTargetRoleId,
    setActiveView,
    scoringWeights,
    language,
  } = useApp();

  const recommendations = getCareerRecommendations(profile, scoringWeights, 8);

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareRoleAId, setCompareRoleAId] = useState<string>(targetRole.id);
  const [compareRoleBId, setCompareRoleBId] = useState<string>(
    recommendations[1]?.role.id || recommendations[0]?.role.id
  );

  const [inspectedRec, setInspectedRec] = useState<CareerRecommendation | null>(null);

  const roleA = CAREER_ROLES.find((r) => r.id === compareRoleAId) || CAREER_ROLES[0];
  const roleB = CAREER_ROLES.find((r) => r.id === compareRoleBId) || CAREER_ROLES[1] || CAREER_ROLES[0];

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Career Recommendations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Roles tailored to your skills, interests, and industry demand.
            </p>
          </div>

          <button
            onClick={() => setIsCompareOpen(!isCompareOpen)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-center cursor-pointer"
          >
            <Columns2 className="w-4 h-4 text-[#F28C28]" />
            <span>{isCompareOpen ? 'Hide Comparison' : 'Compare 2 Roles'}</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      {isCompareOpen && (
        <div className="bg-slate-50 dark:bg-[#0F1D3F] rounded-2xl p-5 border border-blue-200 dark:border-[#1E2D52] space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1E2D52]">
            <h3 className="font-bold text-sm text-[#1F4E79] dark:text-sky-400 flex items-center gap-2">
              <Columns2 className="w-4 h-4" />
              <span>Role Comparison</span>
            </h3>
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column A */}
            <div className="bg-white dark:bg-[#0D1836] rounded-xl p-4 border border-slate-200 dark:border-[#1E2D52] space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Role A:
                </label>
                <select
                  value={compareRoleAId}
                  onChange={(e) => setCompareRoleAId(e.target.value)}
                  className="w-full text-xs font-bold p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white mt-1"
                >
                  {CAREER_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} (Level {r.nsqfLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Level {roleA.nsqfLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Salary:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{roleA.averageSalary}</span>
                </div>
                <div className="flex justify-between">
                  <span>Demand:</span>
                  <span className="font-bold text-[#2E8B57]">{roleA.demandTrend} ({Math.round(roleA.demandScore * 100)}%)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setTargetRoleId(roleA.id);
                  setIsCompareOpen(false);
                  setActiveView('gaps');
                }}
                className="w-full py-2 rounded-lg bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs cursor-pointer"
              >
                Set as My Target
              </button>
            </div>

            {/* Column B */}
            <div className="bg-white dark:bg-[#0D1836] rounded-xl p-4 border border-slate-200 dark:border-[#1E2D52] space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Role B:
                </label>
                <select
                  value={compareRoleBId}
                  onChange={(e) => setCompareRoleBId(e.target.value)}
                  className="w-full text-xs font-bold p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white mt-1"
                >
                  {CAREER_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} (Level {r.nsqfLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Level {roleB.nsqfLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Salary:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{roleB.averageSalary}</span>
                </div>
                <div className="flex justify-between">
                  <span>Demand:</span>
                  <span className="font-bold text-[#2E8B57]">{roleB.demandTrend} ({Math.round(roleB.demandScore * 100)}%)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setTargetRoleId(roleB.id);
                  setIsCompareOpen(false);
                  setActiveView('gaps');
                }}
                className="w-full py-2 rounded-lg bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs cursor-pointer"
              >
                Set as My Target
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const isTarget = rec.role.id === targetRole.id;
          const title =
            language === 'hi' ? rec.role.titleHi : language === 'mr' ? rec.role.titleMr : rec.role.title;
          const reason =
            language === 'hi' ? rec.reasonHi : language === 'mr' ? rec.reasonMr : rec.reason;

          return (
            <div
              key={rec.role.id}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isTarget
                  ? 'border-[#1F4E79] dark:border-sky-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-xs'
                  : 'border-slate-200 dark:border-[#1E2D52] bg-white dark:bg-[#0D1836] hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Level {rec.role.nsqfLevel} — {rec.role.averageSalary}
                  </span>
                  <span className="text-xs font-black text-[#1F4E79] dark:text-sky-400">
                    {rec.fitScore}% Match
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {reason}
                </p>

                {/* Score Breakdown Strip - clean 3-column grid without floating dots */}
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-[#1E2D52]">
                  <div>Skills: <strong className="text-slate-800 dark:text-slate-200">{rec.skillCoverage}%</strong></div>
                  <div className="text-center">Interest: <strong className="text-slate-800 dark:text-slate-200">{rec.interestFit}%</strong></div>
                  <div className="text-right">Market: <strong className="text-[#2E8B57]">{rec.marketDemand}%</strong></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-[#1E2D52]">
                <button
                  onClick={() => setInspectedRec(rec)}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#1F4E79] dark:hover:text-sky-400 flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#F28C28]" />
                  <span>Why this score?</span>
                </button>

                {isTarget ? (
                  <span className="text-xs font-bold text-[#2E8B57] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Current Target</span>
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setTargetRoleId(rec.role.id);
                      setActiveView('gaps');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Set as Target</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* "Why This Score" Clean Modal */}
      {inspectedRec && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0D1836] rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 dark:border-[#1E2D52] relative animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <button
              onClick={() => setInspectedRec(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Match Details: {inspectedRec.role.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Overall Fit: <strong className="text-slate-800 dark:text-slate-200">{inspectedRec.fitScore}%</strong>
              </p>
            </div>

            {/* Score Factors */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Skill Readiness</span>
                <span className="font-bold text-slate-900 dark:text-white">{inspectedRec.skillCoverage}%</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Interest Fit</span>
                <span className="font-bold text-slate-900 dark:text-white">{inspectedRec.interestFit}%</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Industry Demand</span>
                <span className="font-bold text-[#2E8B57]">{inspectedRec.marketDemand}%</span>
              </div>
            </div>

            {/* Key Skills to Improve */}
            {inspectedRec.penaltySkills.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-[#1E2D52]">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  Top Skills to Boost Score:
                </span>
                {inspectedRec.penaltySkills.slice(0, 2).map((p) => (
                  <div
                    key={p.skillId}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-[#121E3D] border border-slate-200 dark:border-[#1E2D52] flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-800 dark:text-slate-200">{p.skillName}</span>
                    <span className="text-rose-500 font-bold">Requires L{p.requiredLevel}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1E2D52]">
              <button
                onClick={() => setInspectedRec(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setTargetRoleId(inspectedRec.role.id);
                  setInspectedRec(null);
                  setActiveView('gaps');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>Simulate in What-If</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
