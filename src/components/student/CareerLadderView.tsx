import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CAREER_LADDERS } from '../../data/careerLaddersData';
import { CAREER_ROLES } from '../../data/rolesData';
import { calculateRoleGaps, simulateWhatIf } from '../../services/recommendationEngine';
import { CareerRole } from '../../types';

export const CareerLadderView: React.FC = () => {
  const {
    profile,
    targetRole,
    setTargetRoleId,
    setActiveView,
    language,
    t,
    scoringWeights,
  } = useApp();

  const [selectedStreamId, setSelectedStreamId] = useState<'electrical' | 'it_data' | 'manufacturing'>(
    targetRole.stream || 'electrical'
  );

  const activeLadder =
    CAREER_LADDERS.find((l) => l.streamId === selectedStreamId) || CAREER_LADDERS[0];

  const [whyNotRungRole, setWhyNotRungRole] = useState<CareerRole | null>(null);
  const [sliderVal, setSliderVal] = useState<number>(3);

  const ladderTitle =
    language === 'hi'
      ? activeLadder.streamNameHi
      : language === 'mr'
      ? activeLadder.streamNameMr
      : activeLadder.streamName;

  const handleOpenWhyNot = (roleId: string) => {
    const role = CAREER_ROLES.find((r) => r.id === roleId);
    if (role) {
      setWhyNotRungRole(role);
      setSliderVal(3);
    }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('careerLadderTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Promotion milestones and salary growth for {ladderTitle}.
            </p>
          </div>

          {/* Stream Selector */}
          <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
            {CAREER_LADDERS.map((lad) => (
              <button
                key={lad.streamId}
                onClick={() => setSelectedStreamId(lad.streamId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedStreamId === lad.streamId
                    ? 'bg-[#1F4E79] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {lad.streamId === 'electrical'
                  ? 'Electrical'
                  : lad.streamId === 'it_data'
                  ? 'IT & Data'
                  : 'Manufacturing'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Ladder Cards */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1E2D52]">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Levels 4 → 7 Career Progression
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {profile.weeklyHours}h/week study pace
              </span>
            </div>

            <div className="space-y-3">
              {[...activeLadder.rungs].reverse().map((rung) => {
                const isTarget = rung.roleId === targetRole.id;
                const rungRole = CAREER_ROLES.find((r) => r.id === rung.roleId);
                const { readiness } = rungRole
                  ? calculateRoleGaps(rungRole, profile.skills)
                  : { readiness: 0 };

                const rungTitle =
                  language === 'hi' ? rung.titleHi : language === 'mr' ? rung.titleMr : rung.title;

                return (
                  <div
                    key={rung.roleId}
                    className={`p-4 rounded-xl border transition-all ${
                      isTarget
                        ? 'border-[#1F4E79] dark:border-sky-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-xs'
                        : 'border-slate-200 dark:border-[#1E2D52] bg-white dark:bg-[#0F1D3F]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          Level {rung.nsqfLevel}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {rungTitle}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Readiness: <strong className="text-[#1F4E79] dark:text-sky-400">{readiness}%</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
                      <span>{rung.salaryBand}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#F28C28]" />
                        <span>~{rung.estimatedWeeksAt6Hrs} Weeks</span>
                      </span>
                    </div>

                    {/* Key Skills */}
                    <div className="flex flex-wrap gap-1 text-[11px] mb-3">
                      {rung.keySkills.slice(0, 3).map((sk, sidx) => (
                        <span
                          key={sidx}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1E2D52] text-xs">
                      <button
                        onClick={() => handleOpenWhyNot(rung.roleId)}
                        className="text-slate-600 dark:text-slate-300 hover:text-[#1F4E79] dark:hover:text-sky-400 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-[#F28C28]" />
                        <span>What-If Simulator</span>
                      </button>

                      {isTarget ? (
                        <span className="text-xs font-bold text-[#2E8B57] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Target</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setTargetRoleId(rung.roleId);
                            setActiveView('gaps');
                          }}
                          className="px-3 py-1 rounded-lg bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>Set Target</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Quick What-If Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs space-y-4">
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-[#1E2D52]">
              <Sliders className="w-4 h-4 text-[#F28C28]" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {whyNotRungRole ? whyNotRungRole.title : 'Live Simulator'}
              </h3>
            </div>

            {whyNotRungRole ? (
              (() => {
                const { readiness, gaps } = calculateRoleGaps(whyNotRungRole, profile.skills);
                const topPenalty = gaps.find((g) => g.status !== 'have') || gaps[0];
                const simulatedLevels = topPenalty ? { [topPenalty.skillId]: sliderVal } : {};
                const simulation = simulateWhatIf(
                  whyNotRungRole,
                  profile.skills,
                  simulatedLevels,
                  profile.interests,
                  scoringWeights
                );

                return (
                  <div className="space-y-3 text-xs">
                    <p className="text-slate-600 dark:text-slate-300">
                      Current Readiness: <strong>{readiness}%</strong> · Overall Fit: <strong>{simulation.originalFit}%</strong>
                    </p>

                    {topPenalty && (
                      <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            Learn: {topPenalty.skillName}
                          </span>
                          <span className="font-bold text-[#F28C28]">L{sliderVal}/5</span>
                        </div>

                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={sliderVal}
                          onChange={(e) => setSliderVal(parseInt(e.target.value, 10))}
                          className="w-full accent-[#F28C28] cursor-pointer"
                        />

                        <div className="flex justify-between text-[11px] pt-1">
                          <span className="text-slate-600 dark:text-slate-300">
                            Readiness: <strong>{simulation.originalReadiness}% → {simulation.newReadiness}%</strong>
                          </span>
                          <span className="font-bold text-[#2E8B57]">+{simulation.fitDelta}% Fit</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setTargetRoleId(whyNotRungRole.id);
                        setActiveView('pathway');
                      }}
                      className="w-full py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Build Pathway →</span>
                    </button>
                  </div>
                );
              })()
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">
                Click <strong>"What-If Simulator"</strong> on any ladder role to see interactive score gains.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
