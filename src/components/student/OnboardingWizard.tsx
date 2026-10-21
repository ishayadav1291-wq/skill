import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Clock,
  Languages,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EducationLevel, Language } from '../../types';

export const OnboardingWizard: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, profile, setProfile, setLanguage } = useApp();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: profile.name,
    educationLevel: profile.educationLevel as EducationLevel,
    institutionName: profile.institutionName,
    branch: profile.branch,
    year: profile.year,
    interests: profile.interests,
    weeklyHours: profile.weeklyHours,
    preferredLanguage: profile.preferredLanguage as Language,
  });

  useEffect(() => {
    if (isOnboardingOpen) {
      setFormData({
        name: profile.name.startsWith('New') ? '' : profile.name,
        educationLevel: profile.educationLevel as EducationLevel,
        institutionName: profile.institutionName,
        branch: profile.branch || 'Electrical Engineering',
        year: profile.year || '1st Year',
        interests: profile.interests || ['Industrial Automation'],
        weeklyHours: profile.weeklyHours || 6,
        preferredLanguage: (profile.preferredLanguage as Language) || 'en',
      });
      setStep(1);
    }
  }, [isOnboardingOpen, profile.id]);

  if (!isOnboardingOpen) return null;

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter((i) => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const handleFinish = () => {
    setProfile((prev) => ({
      ...prev,
      name: formData.name,
      educationLevel: formData.educationLevel,
      institutionName: formData.institutionName,
      branch: formData.branch,
      year: formData.year,
      interests: formData.interests,
      weeklyHours: formData.weeklyHours,
      preferredLanguage: formData.preferredLanguage,
    }));
    setLanguage(formData.preferredLanguage);
    setIsOnboardingOpen(false);
  };

  const availableInterests = [
    'Industrial Automation',
    'Renewable & Solar Energy',
    'Plant Maintenance & Electrical',
    'Data Analytics & BI',
    'SQL Databases',
    'Python & Scripting',
    'CNC Machine Tooling',
    '3D CAD Design & GD&T',
    'Quality & Metrology Inspection',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s
                    ? 'bg-[#1F4E79] text-white shadow-xs'
                    : step > s
                    ? 'bg-emerald-100 text-[#2E8B57]'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > s ? '✓' : s}
              </span>
            ))}
          </div>

          <span className="text-xs font-bold text-slate-400">Step {step} of 3</span>
        </div>

        {/* STEP 1: EDUCATION */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Welcome to SkillSetu! Tell us about your background
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                We design personalized guidance for ITI, polytechnic diploma, and tier-2/3 college students.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1F4E79] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Education Level</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, educationLevel: e.target.value as EducationLevel })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="polytechnic_diploma">Polytechnic Diploma</option>
                  <option value="iti">ITI Certificate (CTS / Craftsman)</option>
                  <option value="degree_engineering">Engineering Degree (B.Tech / BE)</option>
                  <option value="degree_general">General Degree (BCA / B.Sc / B.Com)</option>
                  <option value="vocational">Vocational / Skill Training Center</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">College / ITI Name</label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Branch / Trade</label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Current Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-[#1F4E79] text-white font-bold text-xs flex items-center gap-1.5"
              >
                <span>Next: Career Interests</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: INTERESTS */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                What domains excite you most?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select areas you'd like to work in. This feeds the 25% interest alignment in your career fit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {availableInterests.map((interest) => {
                const selected = formData.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                      selected
                        ? 'border-[#1F4E79] bg-blue-50 text-[#1F4E79] font-bold shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{interest}</span>
                    {selected && <CheckCircle2 className="w-4 h-4 text-[#1F4E79]" />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                disabled={formData.interests.length === 0}
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-[#1F4E79] text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Next: Time & Language</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PREFERENCES & TIME */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Study Pace & Language Preferences
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                SkillSetu packs courses into a weekly roadmap tailored strictly to your availability.
              </p>
            </div>

            <div className="space-y-4 pt-2 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  How many hours can you dedicate each week?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[4, 6, 8, 12].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setFormData({ ...formData, weeklyHours: h })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        formData.weeklyHours === h
                          ? 'border-[#1F4E79] bg-blue-50 text-[#1F4E79] font-black'
                          : 'border-slate-200 bg-slate-50 text-slate-700 font-semibold'
                      }`}
                    >
                      <span className="text-sm block">{h} hrs</span>
                      <span className="text-[10px] text-slate-400">per week</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Preferred Platform Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'en', label: 'English', sub: 'Technical terms' },
                    { id: 'hi', label: 'हिन्दी', sub: 'सरल व्याख्या' },
                    { id: 'mr', label: 'मराठी', sub: 'स्थानिक भाषा' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, preferredLanguage: l.id as Language })
                      }
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.preferredLanguage === l.id
                          ? 'border-[#1F4E79] bg-blue-50 text-[#1F4E79] font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-xs block font-bold">{l.label}</span>
                      <span className="text-[10px] text-slate-400">{l.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-[#2E8B57] hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Generate My Career Plan</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
