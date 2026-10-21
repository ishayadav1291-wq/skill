import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Lock,
  ExternalLink,
  Clock,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PathwayItem } from '../../types';

export const LearningPathwayView: React.FC = () => {
  const {
    pathway,
    markPathwayItemComplete,
    targetRole,
    profile,
    setProfile,
    language,
  } = useApp();

  const [activeMiniQuizItem, setActiveMiniQuizItem] = useState<PathwayItem | null>(null);
  const [miniQuizSelectedAnswer, setMiniQuizSelectedAnswer] = useState<number | null>(null);

  const handleCompleteItem = (item: PathwayItem) => {
    if (item.type === 'quiz') {
      setActiveMiniQuizItem(item);
      setMiniQuizSelectedAnswer(null);
      return;
    }

    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#1F4E79', '#F28C28', '#2E8B57'],
    });

    markPathwayItemComplete(item.id);
  };

  const handleMiniQuizSubmit = () => {
    if (activeMiniQuizItem) {
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#2E8B57', '#F28C28', '#1F4E79'],
      });

      markPathwayItemComplete(activeMiniQuizItem.id);
      setActiveMiniQuizItem(null);
    }
  };

  const handleHoursChange = (hrs: number) => {
    setProfile((prev) => ({
      ...prev,
      weeklyHours: hrs,
    }));
  };

  const targetTitle =
    language === 'hi' ? targetRole.titleHi : language === 'mr' ? targetRole.titleMr : targetRole.title;

  const completionPercentage = Math.round(
    (pathway.completedItemCount / Math.max(1, pathway.totalItemCount)) * 100
  );

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Learning Pathway
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Weekly modules to achieve job-readiness for <strong>{targetTitle}</strong>.
            </p>
          </div>

          {/* Hours per week buttons */}
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold mr-1">Study time:</span>
            {[4, 6, 8, 12].map((h) => (
              <button
                key={h}
                onClick={() => handleHoursChange(h)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  profile.weeklyHours === h
                    ? 'bg-[#1F4E79] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {h}h/wk
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-[#1E2D52]">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#2E8B57]" />
              <span>{completionPercentage}% Completed</span>
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Readiness: {pathway.readinessCurrent}%
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#1F4E79] via-[#2E8B57] to-[#2E8B57] h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Weeks List */}
      <div className="space-y-4">
        {pathway.weeks.map((week) => {
          const isWeekDone = week.items.every((i) => i.status === 'done');
          const isWeekActive = week.items.some((i) => i.status === 'active');

          return (
            <div
              key={week.weekNumber}
              className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                isWeekActive
                  ? 'bg-white dark:bg-[#0D1836] border-[#1F4E79] dark:border-sky-500 shadow-xs'
                  : isWeekDone
                  ? 'bg-slate-50/70 dark:bg-[#0B1530] border-slate-200 dark:border-[#1E2D52]'
                  : 'bg-white/80 dark:bg-[#0D1836]/60 border-slate-200 dark:border-[#1E2D52] opacity-80'
              }`}
            >
              {/* Week Header */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-[#1E2D52]">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isWeekDone
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-[#2E8B57]'
                        : isWeekActive
                        ? 'bg-[#1F4E79] text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    W{week.weekNumber}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Week {week.weekNumber}: {week.theme}
                  </h3>
                </div>

                {isWeekDone ? (
                  <span className="text-xs font-bold text-[#2E8B57] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                ) : isWeekActive ? (
                  <span className="text-xs font-bold text-[#1F4E79] dark:text-sky-400">
                    Current Focus
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </span>
                )}
              </div>

              {/* Items in this week */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {week.items.map((item) => {
                  const isDone = item.status === 'done';
                  const isActive = item.status === 'active';

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                        isDone
                          ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                          : isActive
                          ? 'bg-white dark:bg-[#101F44] border-slate-300 dark:border-[#2A3F70]'
                          : 'bg-slate-50 dark:bg-[#0B1530] border-slate-200 dark:border-[#1E2D52]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="font-semibold">{item.provider}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.durationHours} hrs</span>
                          </span>
                        </div>

                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {item.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Skill: <strong className="text-slate-700 dark:text-slate-300">{item.skillName}</strong>
                        </p>
                      </div>

                      {/* Card Actions */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#1E2D52] flex items-center justify-between text-xs">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#1F4E79] dark:text-sky-400 font-semibold hover:underline flex items-center gap-1"
                          >
                            <span>Open Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px]">
                            {item.type === 'quiz' ? 'Assessment' : 'Self Practice'}
                          </span>
                        )}

                        {isDone ? (
                          <span className="text-[#2E8B57] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </span>
                        ) : isActive ? (
                          <button
                            onClick={() => handleCompleteItem(item)}
                            className="px-3 py-1 rounded-lg bg-[#2E8B57] hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {item.type === 'quiz' ? (
                              <>
                                <HelpCircle className="w-3 h-3" />
                                <span>Quiz</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Mark Done</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px] flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini Quiz Modal */}
      {activeMiniQuizItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0D1836] rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 dark:border-[#1E2D52] space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Checkpoint Quiz: {activeMiniQuizItem.skillName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Answer correctly to complete this module and raise readiness.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                "When reviewing electrical systems before commissioning, what is the first step to confirm safety?"
              </span>

              <div className="space-y-1.5">
                {[
                  'Check for proper earth bonding and confirm lockout-tagout (LOTO) isolation',
                  'Turn power on immediately to see if circuits trip',
                  'Double the fuse rating to prevent tripping',
                  'Paint the distribution enclosure green',
                ].map((opt, oidx) => (
                  <button
                    key={oidx}
                    onClick={() => setMiniQuizSelectedAnswer(oidx)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      miniQuizSelectedAnswer === oidx
                        ? 'border-[#1F4E79] dark:border-sky-400 bg-blue-50 dark:bg-[#1E2E54] text-[#1F4E79] dark:text-white font-bold'
                        : 'border-slate-200 dark:border-[#1E2D52] bg-white dark:bg-[#0D1836] text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1E2D52]">
              <button
                onClick={() => setActiveMiniQuizItem(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                disabled={miniQuizSelectedAnswer === null}
                onClick={handleMiniQuizSubmit}
                className="px-3.5 py-1.5 rounded-xl bg-[#2E8B57] hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Submit (+6% Readiness)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
