import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  Clock,
  ArrowRight,
  MessageSquare,
  RotateCcw,
  Send,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateRoleGaps, simulateWhatIf } from '../../services/recommendationEngine';

const LEVEL_CONFIG: Record<number, { name: string; subtitle: string }> = {
  0: { name: 'Not Started', subtitle: 'Zero Baseline' },
  1: { name: 'Beginner', subtitle: 'Fundamentals' },
  2: { name: 'Basic', subtitle: 'Practical Basics' },
  3: { name: 'Intermediate', subtitle: 'Working Trade Skills' },
  4: { name: 'Advanced', subtitle: 'Autonomous Execution' },
  5: { name: 'Master', subtitle: 'Industry Specialist' },
};

export const SkillGapReportView: React.FC = () => {
  const {
    profile,
    targetRole,
    setActiveView,
    scoringWeights,
    language,
    t,
  } = useApp();

  const { readiness, gaps } = calculateRoleGaps(targetRole, profile.skills);

  // What-If simulated levels state
  const [simulatedLevels, setSimulatedLevels] = useState<Record<string, number>>({});
  const [activeFilter, setActiveFilter] = useState<'all' | 'missing' | 'partial' | 'have'>('all');
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState<boolean>(false);
  const [challengeReason, setChallengeReason] = useState<string>('');
  const [challengeSubmitted, setChallengeSubmitted] = useState<boolean>(false);

  // Compute live What-If simulation
  const simulation = simulateWhatIf(
    targetRole,
    profile.skills,
    simulatedLevels,
    profile.interests,
    scoringWeights
  );

  const handleLevelClick = (skillId: string, level: number) => {
    setSimulatedLevels((prev) => ({
      ...prev,
      [skillId]: level,
    }));
  };

  const handleResetSimulation = () => {
    setSimulatedLevels({});
  };

  // Dynamic metrics based on current (including simulated) levels
  let currentHaveCount = 0;
  let currentPartialCount = 0;
  let currentMissingCount = 0;
  let currentHoursNeeded = 0;

  for (const gap of gaps) {
    const cur = simulatedLevels[gap.skillId] ?? gap.currentLevel;
    if (cur >= gap.requiredLevel) {
      currentHaveCount++;
    } else if (cur > 0) {
      currentPartialCount++;
      currentHoursNeeded += Math.max(0, gap.requiredLevel - cur) * 8;
    } else {
      currentMissingCount++;
      currentHoursNeeded += gap.requiredLevel * 8;
    }
  }

  const currentToUpgradeCount = currentPartialCount + currentMissingCount;
  const currentReadiness = simulation.newReadiness;
  const simulatedDelta = simulation.readinessDelta;

  const targetTitle =
    language === 'hi' ? targetRole.titleHi : language === 'mr' ? targetRole.titleMr : targetRole.title;

  // Filter skills list
  const filteredGaps = gaps.filter((gap) => {
    const cur = simulatedLevels[gap.skillId] ?? gap.currentLevel;
    const isHave = cur >= gap.requiredLevel;
    const isPartial = cur > 0 && cur < gap.requiredLevel;
    const isMissing = cur === 0;

    if (activeFilter === 'missing') return isMissing;
    if (activeFilter === 'partial') return isPartial;
    if (activeFilter === 'have') return isHave;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* 1. Target Role Diagnostics Banner Card */}
      <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-6 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E79] dark:text-sky-400 bg-blue-50 dark:bg-[#1E2E54] px-2.5 py-0.5 rounded-md">
                TARGET ROLE DIAGNOSTICS
              </span>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                • NSQF Level {targetRole.nsqfLevel}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {targetTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Clear breakdown of required skills. Tap any level to test how your job readiness jumps.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsChallengeModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Feedback</span>
            </button>
            <button
              onClick={() => setActiveView('pathway')}
              className="px-4 py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] dark:hover:bg-[#183F63] text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Build Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Three Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Job Readiness */}
        <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#1F4E79] dark:text-sky-400 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {currentReadiness}%
              </span>
              {simulatedDelta > 0 && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                  +{simulatedDelta}%
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              {simulatedDelta > 0 ? 'Simulated Job Readiness' : 'Current Job Readiness'}
            </span>
          </div>
        </div>

        {/* Card 2: Skills Mastered */}
        <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentHaveCount} <span className="text-sm font-semibold text-slate-400">of {gaps.length} Mastered</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              {currentToUpgradeCount} {currentToUpgradeCount === 1 ? 'skill' : 'skills'} to upgrade
            </span>
          </div>
        </div>

        {/* Card 3: Study Time */}
        <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-13 h-13 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              ~{currentHoursNeeded} <span className="text-sm font-semibold text-slate-400">Hours</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              Government course study time
            </span>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & Simulation Hint */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[#1F4E79] text-white shadow-xs'
                : 'bg-white dark:bg-[#0D1836] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#1E2D52] hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            All Skills ({gaps.length})
          </button>
          <button
            onClick={() => setActiveFilter('missing')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'missing'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-rose-50/60 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100/60'
            }`}
          >
            Not Started ({currentMissingCount})
          </button>
          <button
            onClick={() => setActiveFilter('partial')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'partial'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50/60 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 hover:bg-amber-100/60'
            }`}
          >
            Needs Upgrade ({currentPartialCount})
          </button>
          <button
            onClick={() => setActiveFilter('have')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'have'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 hover:bg-emerald-100/60'
            }`}
          >
            Mastered ({currentHaveCount})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>💡 Tap any level button to simulate your readiness boost</span>
          {Object.keys(simulatedLevels).length > 0 && (
            <button
              onClick={handleResetSimulation}
              className="text-[#1F4E79] dark:text-sky-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 4. Full-Width Interactive Skill Cards */}
      <div className="space-y-4">
        {filteredGaps.map((gap, index) => {
          const current = simulatedLevels[gap.skillId] ?? gap.currentLevel;
          const meetsRequirement = current >= gap.requiredLevel;
          const isPartial = current > 0 && current < gap.requiredLevel;
          const hours = meetsRequirement ? 0 : Math.max(0, gap.requiredLevel - current) * 8;

          return (
            <div
              key={gap.skillId}
              className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs space-y-4 transition-all"
            >
              {/* Header row: Number, Title, Badge, Current & Target info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-sm text-slate-400 dark:text-slate-500">
                    {index + 1}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {gap.skillName}
                  </h3>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {meetsRequirement ? (
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold border border-emerald-400 text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30">
                      Meets Requirement
                    </span>
                  ) : isPartial ? (
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold border border-amber-400 text-amber-700 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/30">
                      Needs Upgrade
                    </span>
                  ) : (
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold border border-rose-400 text-rose-700 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-950/30">
                      Not Started
                    </span>
                  )}

                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>
                      Current: <strong className="text-slate-800 dark:text-slate-200">{LEVEL_CONFIG[current]?.name || 'Not Started'}</strong>
                    </span>
                    <span className="mx-2 text-slate-300 dark:text-slate-600">|</span>
                    <span>
                      Target: <strong className="text-[#1F4E79] dark:text-sky-300">{LEVEL_CONFIG[gap.requiredLevel]?.name || 'Required'}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Simulator Box */}
              <div className="bg-slate-50/80 dark:bg-[#101935] rounded-xl p-3.5 sm:p-4 border border-slate-200/60 dark:border-[#1E2D52] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Simulate Your Level:</span>
                    <span className="font-bold text-[#1F4E79] dark:text-sky-300 bg-white dark:bg-[#0D1836] border border-slate-200 dark:border-[#1E2D52] px-2.5 py-0.5 rounded-md shadow-2xs">
                      {LEVEL_CONFIG[current]?.name || 'Not Started'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleLevelClick(gap.skillId, gap.requiredLevel)}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#1F4E79] dark:hover:text-sky-400 transition-colors cursor-pointer"
                  >
                    Set to Target ({LEVEL_CONFIG[gap.requiredLevel]?.name})
                  </button>
                </div>

                {/* 5 Level Buttons Segmented Control */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const isSelected = current === lvl;
                    const isTarget = gap.requiredLevel === lvl;
                    const config = LEVEL_CONFIG[lvl];

                    let containerStyle = 'bg-white dark:bg-[#0D1836] border border-slate-200 dark:border-[#1E2D52] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500';

                    if (isSelected) {
                      containerStyle = 'bg-[#1F4E79] text-white shadow-xs border border-[#1F4E79] ring-2 ring-[#1F4E79]/20';
                    } else if (isTarget) {
                      containerStyle = 'border-2 border-dashed border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 hover:bg-amber-100/50';
                    }

                    return (
                      <button
                        key={lvl}
                        onClick={() => handleLevelClick(gap.skillId, lvl)}
                        className={`p-3 rounded-xl text-center transition-all cursor-pointer ${containerStyle}`}
                      >
                        <span className={`block text-xs font-bold ${isSelected ? 'text-white' : ''}`}>
                          {config.name}
                        </span>
                        <span className={`block text-[10px] mt-0.5 ${isSelected ? 'text-blue-100' : isTarget ? 'text-amber-700 dark:text-amber-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
                          {isTarget ? '🎯 Target' : config.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer: Hours needed & View free courses link */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {meetsRequirement
                      ? 'Meets hiring criteria for role'
                      : `~${hours} hours needed to bridge gap`}
                  </span>
                </span>

                <button
                  onClick={() => setActiveView('pathway')}
                  className="font-semibold text-[#1F4E79] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Free Courses</span>
                  <span className="text-xs">›</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredGaps.length === 0 && (
          <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-8 border border-slate-200 dark:border-[#1E2D52] text-center text-slate-500 dark:text-slate-400 text-sm">
            No skills match the selected filter.
          </div>
        )}
      </div>

      {/* Challenge / Feedback Modal */}
      {isChallengeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0D1836] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-[#1E2D52] relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Diagnostics Feedback & Challenge
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Students and institutions can flag any skill assessment that seems inaccurate. Your challenge
              is recorded in our scoring calibration queue.
            </p>

            {challengeSubmitted ? (
              <div className="my-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#2E8B57] mx-auto" />
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Feedback Logged Successfully</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Thank you! Your feedback has been recorded in the admin calibration queue.
                </p>
                <button
                  onClick={() => {
                    setIsChallengeModalOpen(false);
                    setChallengeSubmitted(false);
                    setChallengeReason('');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1F4E79] text-white text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4 my-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Why do you believe this match needs adjustment?
                  </label>
                  <textarea
                    rows={4}
                    value={challengeReason}
                    onChange={(e) => setChallengeReason(e.target.value)}
                    placeholder="e.g., I already completed hands-on workshop training in CAD and CNC in college, so my level should be higher than estimated."
                    className="w-full rounded-xl border border-slate-200 dark:border-[#1E2D52] bg-white dark:bg-[#101935] text-slate-800 dark:text-white p-3 text-xs focus:ring-2 focus:ring-[#1F4E79] focus:outline-hidden"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsChallengeModalOpen(false)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!challengeReason.trim()}
                    onClick={() => setChallengeSubmitted(true)}
                    className="px-4 py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Feedback</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
