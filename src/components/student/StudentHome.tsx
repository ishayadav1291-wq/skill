import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  TrendingUp,
  GitFork,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Sliders,
  ShieldCheck,
  Award,
  Zap,
  Star,
  X,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../ui/CircularProgress';
import { calculateRoleGaps, getCareerRecommendations, getSteppingStoneAdvice } from '../../services/recommendationEngine';

export const StudentHome: React.FC = () => {
  const {
    profile,
    targetRole,
    setTargetRoleId,
    pathway,
    setActiveView,
    setIsAssessmentOpen,
    openAssessmentModal,
    setIsDigiLockerModalOpen,
    updateUserSkill,
    scoringWeights,
    t,
    language,
  } = useApp();

  const { readiness, haveCount, partialCount, missingCount } = calculateRoleGaps(
    targetRole,
    profile.skills
  );

  const topRecommendations = getCareerRecommendations(profile, scoringWeights, 3);
  const steppingStone = getSteppingStoneAdvice(targetRole, readiness, scoringWeights);

  const activeWeek = pathway.weeks.find((w) => w.items.some((i) => i.status === 'active')) || pathway.weeks[0];
  const activeItem = activeWeek?.items.find((i) => i.status === 'active') || activeWeek?.items[0];

  const targetTitle =
    language === 'hi' ? targetRole.titleHi : language === 'mr' ? targetRole.titleMr : targetRole.title;

  // Initial vocational level
  const initialLevel = profile.educationLevel === 'iti' ? 4 : profile.educationLevel === 'polytechnic_diploma' ? 5 : 6;
  const [currentLevel, setCurrentLevel] = useState<number>(initialLevel);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [selectedRungInfo, setSelectedRungInfo] = useState<number | null>(null);

  // 4 concise vocational ladder steps
  const ladderSteps = [
    {
      level: 4,
      name: 'Starter',
      role: 'Junior Technician',
      salary: '₹15,000 - ₹20,000/mo',
      summary: 'Practical workshop basics & equipment safety.',
    },
    {
      level: 5,
      name: 'Technician',
      role: 'Maintenance Technician',
      salary: '₹20,000 - ₹28,000/mo',
      summary: 'Preventive maintenance, schematics & repairs.',
    },
    {
      level: 6,
      name: 'Supervisor',
      role: 'Plant / Line Supervisor',
      salary: '₹28,000 - ₹42,000/mo',
      summary: 'Team coordination, quality inspection & automation.',
    },
    {
      level: 7,
      name: 'Specialist',
      role: 'Lead Project Engineer',
      salary: '₹45,000 - ₹70,000/mo',
      summary: 'System architecture, commissioning & optimization.',
    },
  ];

  const currentLevelIndex = Math.max(0, currentLevel - 4);
  const nextLevelProgress = currentLevel < 7 ? Math.min(100, readiness) : 100;
  const totalPercent = Math.min(
    100,
    Math.round(((currentLevelIndex + (currentLevel < 7 ? nextLevelProgress / 100 : 1)) / 3) * 100)
  );

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
      });
    } catch {
      // Audio unavailable
    }
  };

  const handleLevelUp = () => {
    if (isLevelingUp) return;
    setIsLevelingUp(true);
    playChime();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#F28C28', '#1F4E79', '#2E8B57', '#FFA64D'],
    });

    const nextLvl = currentLevel < 7 ? currentLevel + 1 : 4;

    setTimeout(() => {
      setCurrentLevel(nextLvl);
      setIsLevelingUp(false);
      setShowCelebrationModal(true);

      const gapSkills = targetRole.requiredSkills.map((r) => r.skillId);
      if (gapSkills.length > 0) {
        updateUserSkill(gapSkills[0], Math.min(5, nextLvl), true, 'quiz');
      }
    }, 450);
  };

  const currentStepData = ladderSteps.find((s) => s.level === currentLevel) || ladderSteps[1];
  const nextStepData = ladderSteps.find((s) => s.level === currentLevel + 1);

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-6">
      {/* 1. Fresh Account Quick Prompt (Only if 0 skills) */}
      {Object.keys(profile.skills).length === 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/60 dark:from-slate-800 dark:to-slate-900 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Welcome, {profile.name}!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Verify your skills with DigiLocker or take a 2-min quiz to calculate your readiness.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsDigiLockerModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>DigiLocker</span>
            </button>
            <button
              onClick={() => setIsAssessmentOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#F28C28] hover:bg-[#e07b1a] text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Take Quiz</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Top Overview: Greeting + Readiness */}
      <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2.5 flex-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {profile.institutionName ? `${profile.institutionName} · ` : ''}{profile.branch}
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t('greetingNamaste')}, {profile.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Target: <strong className="text-slate-800 dark:text-slate-200">{targetTitle}</strong> (Level {targetRole.nsqfLevel})
              </p>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => setActiveView('gaps')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#1F4E79] hover:bg-[#143552] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>View Skill Gaps</span>
              </button>

              <button
                onClick={() => setActiveView('ladder')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <GitFork className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Change Target</span>
              </button>
            </div>
          </div>

          {/* Simple Circular Progress Dial */}
          <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-[#121E3D] rounded-2xl border border-slate-100 dark:border-[#1E2D52] min-w-[170px] self-center md:self-auto">
            <CircularProgress
              value={readiness}
              size={96}
              strokeWidth={8}
              label={language === 'hi' ? 'तैयारी' : language === 'mr' ? 'तयारी' : 'Readiness'}
            />
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-600 dark:text-slate-300">
              <span className="text-[#2E8B57] font-bold">{haveCount} Mastered</span>
              <span className="text-slate-400">/</span>
              <span className="text-[#F28C28] font-bold">{partialCount} Learning</span>
              <span className="text-slate-400">/</span>
              <span className="text-rose-500 font-bold">{missingCount} Needed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Career Ladder Card */}
      <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#F28C28]" />
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Career Ladder
              </h2>
              <span className="text-xs font-bold text-[#1F4E79] dark:text-sky-400 ml-1">
                Level {currentLevel} ({currentStepData.name})
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentLevel < 7 ? (
                <>Next goal: <strong>{nextStepData?.name}</strong> at 100% readiness</>
              ) : (
                <span className="text-[#2E8B57] font-semibold">Highest career level reached!</span>
              )}
            </p>
          </div>

          {/* Level Up Button */}
          <button
            onClick={handleLevelUp}
            disabled={isLevelingUp}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
              isLevelingUp
                ? 'bg-[#2E8B57] text-white scale-105'
                : 'bg-gradient-to-r from-[#F28C28] to-amber-500 hover:from-[#e07b1a] hover:to-amber-600 text-slate-950 active:scale-95'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isLevelingUp ? 'animate-bounce text-white' : 'text-slate-950 fill-slate-950'}`} />
            <span>{isLevelingUp ? 'Upgrading...' : 'Level Up ⚡'}</span>
          </button>
        </div>

        {/* Stepped Progress Track */}
        <div className="pt-2 pb-1">
          <div className="relative">
            <div className="absolute top-4 left-6 right-6 h-2 bg-slate-100 dark:bg-slate-800 rounded-full z-0" />
            <div
              className="absolute top-4 left-6 h-2 bg-gradient-to-r from-[#1F4E79] via-[#2E8B57] to-[#F28C28] rounded-full transition-all duration-700 ease-out z-0"
              style={{ width: `calc(${totalPercent}% - 3rem)` }}
            />

            <div className="relative z-10 flex items-start justify-between">
              {ladderSteps.map((step) => {
                const isCompleted = step.level < currentLevel;
                const isCurrent = step.level === currentLevel;

                return (
                  <button
                    key={step.level}
                    type="button"
                    onClick={() => setSelectedRungInfo(step.level === selectedRungInfo ? null : step.level)}
                    className="flex flex-col items-center group cursor-pointer focus:outline-hidden"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        isCompleted
                          ? 'bg-[#2E8B57] text-white shadow-xs'
                          : isCurrent
                          ? 'bg-[#1F4E79] text-white ring-3 ring-blue-100 dark:ring-blue-900 scale-105'
                          : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      ) : isCurrent ? (
                        <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                      ) : (
                        `L${step.level}`
                      )}
                    </div>

                    <span
                      className={`text-[11px] mt-1.5 font-bold ${
                        isCurrent
                          ? 'text-[#1F4E79] dark:text-sky-400'
                          : isCompleted
                          ? 'text-[#2E8B57]'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Step Mini Detail Sheet */}
        {selectedRungInfo && (
          <div className="bg-slate-50 dark:bg-[#121E3D] border border-slate-200 dark:border-[#1E2D52] rounded-xl p-3 text-xs text-slate-700 dark:text-slate-200 flex items-start justify-between gap-3 animate-in fade-in duration-150">
            {(() => {
              const info = ladderSteps.find((s) => s.level === selectedRungInfo)!;
              return (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 dark:text-white font-bold">
                      Level {info.level}: {info.name} ({info.role})
                    </strong>
                    <span className="text-[11px] font-semibold text-[#2E8B57]">
                      {info.salary}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{info.summary}</p>
                </div>
              );
            })()}
            <button
              onClick={() => setSelectedRungInfo(null)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Stepping-Stone Tip (if readiness < 50%) */}
      {steppingStone.isNeeded && steppingStone.steppingStoneRole && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#F28C28] shrink-0" />
            <p className="text-slate-700 dark:text-slate-200">
              Tip: Start with <strong>{steppingStone.steppingStoneRole.title}</strong> for a faster transition.
            </p>
          </div>
          <button
            onClick={() => setTargetRoleId(steppingStone.steppingStoneRole!.id)}
            className="px-3 py-1 bg-[#F28C28] hover:bg-[#e07b1a] text-slate-950 font-bold rounded-lg whitespace-nowrap cursor-pointer"
          >
            Switch Role
          </button>
        </div>
      )}

      {/* 4. Two-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Skill Assessment (Above) + Up Next */}
        <div className="lg:col-span-7 space-y-4">
          {/* 1. Skill Assessment & Calibration - Prominently Above */}
          <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[#1E2D52]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2E8B57]" />
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Skill Assessment & Verification
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Verify trade skills via quiz or resume upload to unlock badges.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Assessment Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => openAssessmentModal('quiz')}
                className="px-3.5 py-2 bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Award className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>Diagnostic Quiz</span>
              </button>

              <button
                onClick={() => openAssessmentModal('resume')}
                className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#1F4E79] dark:text-sky-300 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Upload Resume</span>
              </button>

              <button
                onClick={() => setActiveView('gaps')}
                className="px-3.5 py-2 bg-[#F28C28] hover:bg-[#e07b1a] text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>What-If Simulator</span>
              </button>
            </div>
          </div>

          {/* 2. Up Next Learning Module */}
          <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#1F4E79] dark:text-sky-400" />
                  <span>Up Next</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Week {activeWeek?.weekNumber || 1}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {activeItem?.title || 'Safety Standards & Electrical Practice'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {activeItem?.provider || 'SWAYAM'} — {activeItem?.durationHours || 4} hrs — Focus: {activeItem?.skillName}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1E2D52] flex items-center justify-between">
              <span className="text-xs text-[#2E8B57] font-semibold">
                +6% readiness on completion
              </span>
              <button
                onClick={() => setActiveView('pathway')}
                className="px-3.5 py-1.5 bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Continue Pathway</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Recommended Careers */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1E2D52]">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#F28C28]" />
              <span>Recommended Careers</span>
            </h3>
            <button
              onClick={() => setActiveView('matches')}
              className="text-xs font-semibold text-[#1F4E79] dark:text-sky-400 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {topRecommendations.map((rec) => {
              const isTarget = rec.role.id === targetRole.id;
              const title =
                language === 'hi' ? rec.role.titleHi : language === 'mr' ? rec.role.titleMr : rec.role.title;

              return (
                <div
                  key={rec.role.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isTarget
                      ? 'border-[#1F4E79] dark:border-sky-500 bg-blue-50/20 dark:bg-blue-950/20'
                      : 'border-slate-200 dark:border-[#1E2D52] bg-white dark:bg-[#0F1D3F]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[190px]">
                      {title}
                    </span>
                    <span className="text-[11px] font-bold text-[#1F4E79] dark:text-sky-400">
                      {rec.fitScore}% Match
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-100 dark:border-[#1E2D52] mt-1.5">
                    <span>Level {rec.role.nsqfLevel} — {rec.role.averageSalary}</span>
                    {isTarget ? (
                      <span className="font-bold text-[#2E8B57] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setTargetRoleId(rec.role.id)}
                        className="font-bold text-[#1F4E79] dark:text-sky-400 hover:underline cursor-pointer"
                      >
                        Set Target →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Level-Up Celebration Modal */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0D1836] rounded-3xl p-6 sm:p-7 max-w-sm w-full border border-slate-200 dark:border-[#1E2D52] shadow-2xl space-y-4 text-center relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowCelebrationModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 ring-6 ring-amber-50 dark:ring-amber-900/20">
              <Zap className="w-7 h-7 fill-amber-500 text-amber-500" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Level {currentLevel}: {currentStepData.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You’ve advanced toward <strong>{currentStepData.role}</strong> credentials.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#121E3D] rounded-xl p-3 text-left text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <div>Salary: <strong className="text-slate-900 dark:text-white">{currentStepData.salary}</strong></div>
              <div>{currentStepData.summary}</div>
            </div>

            <button
              onClick={() => setShowCelebrationModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
