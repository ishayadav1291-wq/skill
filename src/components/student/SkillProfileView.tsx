import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  Lock,
  FileCheck,
  History,
  MessageSquare,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RadarChart, RadarPoint } from '../ui/RadarChart';
import { SKILLS_TAXONOMY } from '../../data/skillsData';

export const SkillProfileView: React.FC = () => {
  const {
    profile,
    targetRole,
    setIsAssessmentOpen,
    setIsDigiLockerModalOpen,
    setActiveView,
    assessmentHistory,
    digilockerCertificates,
    mentorFeedbacks,
    resetAppState,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'digilocker' | 'history' | 'mentor'>('inventory');

  const radarData: RadarPoint[] = targetRole.requiredSkills.slice(0, 6).map((req) => {
    const userSkill = profile.skills[req.skillId];
    const skillDef = SKILLS_TAXONOMY.find((s) => s.id === req.skillId);

    return {
      axis: skillDef ? skillDef.name.split('&')[0].trim() : req.skillId,
      value: userSkill ? userSkill.level : 0,
      target: req.requiredLevel,
      verified: userSkill ? userSkill.verified : false,
    };
  });

  const verifiedSkillsCount = Object.values(profile.skills).filter((s) => s.verified).length;

  return (
    <div className="space-y-5 pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Skill Profile & Credentials
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Verified competency levels for {profile.name} (Levels 0 to 5).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={() => setIsDigiLockerModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>DigiLocker</span>
            </button>
            <button
              onClick={() => setIsAssessmentOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#F28C28] hover:bg-[#e07b1a] text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Take Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 dark:border-[#1E2D52] pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'bg-[#1F4E79] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Skills ({Object.keys(profile.skills).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('digilocker')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'digilocker'
              ? 'bg-[#1F4E79] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Certificates ({digilockerCertificates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-[#1F4E79] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Quiz Log ({assessmentHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mentor')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'mentor'
              ? 'bg-[#1F4E79] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Mentor Feedback ({mentorFeedbacks.length})</span>
        </button>
      </div>

      {/* Tab Content: Skills */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Radar */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs flex flex-col items-center justify-center">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
              Skill Radar vs {targetRole.title}
            </h3>
            <div className="py-2">
              <RadarChart data={radarData} size={280} />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-2">
              Orange outline = Target. Blue fill = Current.
            </p>
          </div>

          {/* List */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1E2D52]">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Skills Inventory
              </h3>
              <span className="text-xs font-semibold text-[#2E8B57]">
                {verifiedSkillsCount} of {Object.keys(profile.skills).length} Verified
              </span>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {Object.values(profile.skills).map((skill) => (
                <div
                  key={skill.skillId}
                  className="p-3 rounded-xl border border-slate-200 dark:border-[#1E2D52] bg-slate-50/60 dark:bg-[#101F44] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 dark:text-white">{skill.skillName}</h4>
                      {skill.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E8B57]" />
                      )}
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Level {skill.level} / 5 · {skill.verified ? 'Verified' : 'Self-Reported'}
                    </span>
                  </div>

                  {!skill.verified && (
                    <button
                      onClick={() => setIsAssessmentOpen(true)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[#1F4E79] dark:text-sky-400 font-bold text-[11px] hover:bg-slate-100 cursor-pointer"
                    >
                      Verify
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveView('gaps')}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span>View Gap Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: DigiLocker Certificates */}
      {activeTab === 'digilocker' && (
        <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1E2D52]">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Official Certificates
            </h3>
            <button
              onClick={() => setIsDigiLockerModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Import Certificate</span>
            </button>
          </div>

          {digilockerCertificates.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No DigiLocker documents imported yet. Connect your certificate to verify multiple skills at once.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {digilockerCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-[#1E2D52] bg-slate-50/50 dark:bg-[#101F44] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#2E8B57] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Document</span>
                    </span>
                    <span className="text-slate-400 text-[10px] font-mono">{cert.docNumber}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{cert.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">{cert.issuer} · {cert.issuanceDate}</p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {cert.verifiedSkills.map((sk) => (
                      <span
                        key={sk.skillId}
                        className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[11px]"
                      >
                        {sk.skillName} (L{sk.verifiedLevel})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1E2D52]">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Quiz & Assessment Log
            </h3>
            <button
              onClick={() => setIsAssessmentOpen(true)}
              className="px-3 py-1 rounded-xl bg-[#1F4E79] text-white font-bold text-xs cursor-pointer"
            >
              Take Quiz
            </button>
          </div>

          {assessmentHistory.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No assessment logs recorded yet.
            </div>
          ) : (
            <div className="space-y-2">
              {assessmentHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-[#1E2D52] bg-slate-50/50 dark:bg-[#101F44] flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="text-slate-900 dark:text-white block">{item.skillName}</strong>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Level {item.previousLevel} → {item.newLevel} · {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {item.score} / {item.totalQuestions}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Mentor Feedback */}
      {activeTab === 'mentor' && (
        <div className="bg-white dark:bg-[#0D1836] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E2D52] shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-[#1E2D52]">
            Industry Mentor Notes
          </h3>

          {mentorFeedbacks.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No mentor feedback logged yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {mentorFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-3.5 rounded-xl border border-blue-100 dark:border-[#1E2D52] bg-blue-50/20 dark:bg-[#101F44] text-xs space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <strong className="text-slate-900 dark:text-white">{fb.mentorName} ({fb.role}, {fb.company})</strong>
                    <span className="text-slate-400 text-[11px]">{new Date(fb.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 italic">"{fb.notes}"</p>
                  <div className="flex gap-1 pt-1">
                    {fb.endorsedSkills.map((sk) => (
                      <span key={sk} className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-[#2E8B57] text-[10px] font-bold">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Clean Reset Button Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
        <span>Persistent auto-sync enabled</span>
        <button
          onClick={resetAppState}
          className="text-slate-500 hover:text-red-500 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
};
