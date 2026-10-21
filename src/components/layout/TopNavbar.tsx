import React, { useState } from 'react';
import {
  Compass,
  Moon,
  Sun,
  Languages,
  ChevronDown,
  Building2,
  Briefcase,
  Sliders,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';

export const TopNavbar: React.FC = () => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    activePersonaKey,
    switchDemoPersona,
    theme,
    toggleTheme,
    setActiveView,
    activeView,
    profile,
    t,
    logout,
  } = useApp();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const studentNavItems = [
    { id: 'home', label: t('navHome') },
    { id: 'ladder', label: t('navLadder') },
    { id: 'matches', label: t('navMatches') },
    { id: 'gaps', label: t('navGapReport') },
    { id: 'pathway', label: t('navPathway') },
    { id: 'opportunities', label: t('navOpportunities') },
    { id: 'chat', label: t('navChat') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0D1836]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-[#1E2D52] shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            onClick={() => setActiveView('home')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1F4E79] flex items-center justify-center text-white shadow-xs">
              <Compass className="w-5 h-5 text-[#F28C28]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-[#1F4E79] dark:text-white tracking-tight">
                  Skill<span className="text-[#F28C28]">Setu</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Bridging Skills to Careers
              </p>
            </div>
          </div>

          {/* Desktop Primary Nav (Student Mode) */}
          {role === 'student' && (
            <nav className="hidden lg:flex items-center space-x-1">
              {studentNavItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-[#1E2E54] text-[#1F4E79] dark:text-sky-300 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Controls: Theme Toggle, Language & Personas */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 shadow-xs transition-all cursor-pointer flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Language Switcher */}
            <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-lg p-0.5 border border-slate-200/80 dark:border-slate-700">
              {(['en', 'hi', 'mr'] as Language[]).map((lng) => (
                <button
                  key={lng}
                  onClick={() => setLanguage(lng)}
                  className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                    language === lng
                      ? 'bg-white dark:bg-slate-700 text-[#1F4E79] dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {lng === 'en' ? 'EN' : lng === 'hi' ? 'हिन्दी' : 'मराठी'}
                </button>
              ))}
            </div>

            {/* Persona Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsPersonaMenuOpen(!isPersonaMenuOpen);
                  setIsRoleMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#1F4E79] dark:text-sky-300 font-bold text-[10px] flex items-center justify-center">
                  {profile.name.charAt(0)}
                </div>
                <span className="font-semibold hidden sm:inline max-w-[90px] truncate">
                  {profile.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isPersonaMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0D1836] rounded-xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-[#1E2D52] py-1.5 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-[#1E2D52]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Switch Student Profile
                    </span>
                  </div>
                  <button
                    onClick={() => { switchDemoPersona('riya'); setIsPersonaMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-[#152347] flex items-center justify-between ${activePersonaKey === 'riya' ? 'font-bold text-[#1F4E79] dark:text-sky-400 bg-blue-50/50 dark:bg-[#1E2E54]' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    <div>
                      <span>Riya Sharma</span>
                      <span className="block text-[10px] text-slate-400">Diploma Electrical (Pune)</span>
                    </div>
                    {activePersonaKey === 'riya' && <span className="text-[#2E8B57] font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => { switchDemoPersona('amit'); setIsPersonaMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-[#152347] flex items-center justify-between ${activePersonaKey === 'amit' ? 'font-bold text-[#1F4E79] dark:text-sky-400 bg-blue-50/50 dark:bg-[#1E2E54]' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    <div>
                      <span>Amit Patil</span>
                      <span className="block text-[10px] text-slate-400">BCA Data Analyst (Nagpur)</span>
                    </div>
                    {activePersonaKey === 'amit' && <span className="text-[#2E8B57] font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => { switchDemoPersona('sneha'); setIsPersonaMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-[#152347] flex items-center justify-between ${activePersonaKey === 'sneha' ? 'font-bold text-[#1F4E79] dark:text-sky-400 bg-blue-50/50 dark:bg-[#1E2E54]' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    <div>
                      <span>Sneha Kulkarni</span>
                      <span className="block text-[10px] text-slate-400">ITI Machinist (Nashik)</span>
                    </div>
                    {activePersonaKey === 'sneha' && <span className="text-[#2E8B57] font-bold">✓</span>}
                  </button>
                  <div className="border-t border-slate-100 dark:border-[#1E2D52] mt-1 pt-1 space-y-0.5">
                    <button
                      onClick={() => { switchDemoPersona('new'); setIsPersonaMenuOpen(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-[#152347] text-slate-600 dark:text-slate-300 font-semibold"
                    >
                      + Create Fresh Profile...
                    </button>
                    <button
                      onClick={() => { logout(); setIsPersonaMenuOpen(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsRoleMenuOpen(!isRoleMenuOpen);
                  setIsPersonaMenuOpen(false);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  role !== 'student'
                    ? 'bg-[#1F4E79] text-white border-[#1F4E79]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200/70 dark:hover:bg-slate-700'
                }`}
              >
                {role === 'student' && <GraduationCap className="w-3.5 h-3.5" />}
                {role === 'institution' && <Building2 className="w-3.5 h-3.5" />}
                {role === 'mentor' && <Briefcase className="w-3.5 h-3.5" />}
                {role === 'admin' && <Sliders className="w-3.5 h-3.5" />}
                <span className="hidden md:inline font-bold">
                  {role === 'student' ? 'Student' : role === 'institution' ? 'TPO Portal' : role === 'mentor' ? 'Recruiter' : 'Admin'}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0D1836] rounded-xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-[#1E2D52] py-1.5 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-[#1E2D52]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Platform Roles
                    </span>
                  </div>
                  <button
                    onClick={() => { setRole('student'); setActiveView('home'); setIsRoleMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-[#152347] flex items-center gap-2 ${role === 'student' ? 'font-bold text-[#1F4E79] dark:text-sky-400 bg-blue-50/50 dark:bg-[#1E2E54]' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    <GraduationCap className="w-4 h-4 text-[#1F4E79] dark:text-sky-400" />
                    <span>Student View</span>
                  </button>
                  <button
                    onClick={() => { setRole('institution'); setActiveView('institution'); setIsRoleMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-[#152347] flex items-center gap-2 ${role === 'institution' ? 'font-bold text-[#1F4E79] dark:text-sky-400 bg-blue-50/50 dark:bg-[#1E2E54]' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    <Building2 className="w-4 h-4 text-[#1F4E79] dark:text-sky-400" />
                    <span>College TPO Dashboard</span>
                  </button>
                  <button
                    onClick={() => { setRole('mentor'); setActiveView('mentor'); setIsRoleMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-[#152347] flex items-center gap-2 ${role === 'mentor' ? 'font-bold text-[#1F4E79] dark:text-sky-400 bg-blue-50/50 dark:bg-[#1E2E54]' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    <Briefcase className="w-4 h-4 text-[#1F4E79] dark:text-sky-400" />
                    <span>Industry Recruiter</span>
                  </button>
                  <button
                    onClick={() => { setRole('admin'); setActiveView('admin'); setIsRoleMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-[#152347] flex items-center gap-2 ${role === 'admin' ? 'font-bold text-[#1F4E79] dark:text-sky-400 bg-blue-50/50 dark:bg-[#1E2E54]' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    <Sliders className="w-4 h-4 text-[#1F4E79] dark:text-sky-400" />
                    <span>Scoring Calibration</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
