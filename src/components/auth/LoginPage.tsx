import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Phone,
  Mail,
  Moon,
  Sun,
  Lock,
  CheckCircle2,
  Sparkles,
  Building2,
  GraduationCap,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language, UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, language, setLanguage, t, theme, toggleTheme } = useApp();

  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    if (!otpSent) {
      setOtpSent(true);
      setOtpCode('1234');
    } else {
      // Authenticates with their unique phone number - fresh profile with 0 demo data!
      login(undefined, 'student', { phone: phoneNumber.trim() });
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Authenticates with their unique email - fresh profile with 0 demo data!
    login(undefined, 'student', { email: email.trim() });
  };

  const handleQuickDemoFill = () => {
    if (authMode === 'phone') {
      setPhoneNumber('9823456789');
    } else {
      setEmail('student@polytech.ac.in');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F7F9FC] dark:bg-[#070D1E] px-4 py-8 transition-colors duration-150">
      {/* Top Bar Language Selector & Theme Toggle */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1F4E79] flex items-center justify-center text-white shadow-xs">
            <Compass className="w-4 h-4 text-[#F28C28]" />
          </div>
          <span className="font-extrabold text-base text-[#1F4E79] dark:text-white tracking-tight">
            Skill<span className="text-[#F28C28]">Setu</span>
          </span>
        </div>

        {/* Right side: Theme toggle and Language Switcher */}
        <div className="flex items-center gap-2">
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

          {/* Minimal Language Switcher */}
          <div className="inline-flex bg-slate-100 dark:bg-slate-800/90 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
            {(['en', 'hi', 'mr'] as Language[]).map((lng) => (
              <button
                key={lng}
                onClick={() => setLanguage(lng)}
                className={`px-2 py-0.5 text-xs font-bold rounded transition-all ${
                  language === lng
                    ? 'bg-white dark:bg-slate-700 text-[#1F4E79] dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {lng === 'en' ? 'EN' : lng === 'hi' ? 'हिन्दी' : 'मराठी'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-white dark:bg-[#0D1836] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-[#1E2D52] shadow-sm dark:shadow-2xl space-y-6 transition-colors">
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {language === 'hi'
                ? 'स्किलसेतु में प्रवेश करें'
                : language === 'mr'
                ? 'कौशलसेतूवर लॉग इन करा'
                : 'Welcome to SkillSetu'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'hi'
                ? 'व्यावसायिक कौशल और करियर रोडमैप'
                : language === 'mr'
                ? 'व्यावसायिक कौशल्य आणि करिअर रोडमॅप'
                : 'AI-Based Career Guidance & Skill-Gap Platform'}
            </p>
          </div>

          {/* Phone / Email Toggle */}
          <div className="flex bg-slate-100 dark:bg-[#121E3D] p-1 rounded-xl border border-slate-200 dark:border-[#1E2D52] text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('phone');
                setOtpSent(false);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'phone'
                  ? 'bg-white dark:bg-[#1E2E54] text-[#1F4E79] dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile OTP</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('email');
                setOtpSent(false);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'email'
                  ? 'bg-white dark:bg-[#1E2E54] text-[#1F4E79] dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email / Institutional ID</span>
            </button>
          </div>

          {/* Form */}
          {authMode === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Mobile Number
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickDemoFill}
                    className="text-[11px] text-[#1F4E79] dark:text-sky-400 hover:underline font-semibold"
                  >
                    Quick fill test number
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-400 dark:text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-12 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D52] bg-white dark:bg-[#101935] text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#1F4E79] dark:focus:ring-sky-500"
                  />
                </div>
              </div>

              {otpSent && (
                <div className="animate-in fade-in duration-200">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Enter Verification OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1234"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D52] bg-white dark:bg-[#101935] text-xs font-bold text-slate-800 dark:text-white tracking-widest text-center focus:outline-hidden focus:ring-2 focus:ring-[#1F4E79] dark:focus:ring-sky-500"
                  />
                  <span className="text-[10px] text-[#2E8B57] font-semibold mt-1 block">
                    ✓ Test OTP auto-filled (1234)
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] dark:hover:bg-[#183F63] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>{otpSent ? 'Verify OTP & Enter' : 'Get OTP'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickDemoFill}
                    className="text-[11px] text-[#1F4E79] dark:text-sky-400 hover:underline font-semibold"
                  >
                    Quick fill test email
                  </button>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D52] bg-white dark:bg-[#101935] text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#1F4E79] dark:focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D52] bg-white dark:bg-[#101935] text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#1F4E79] dark:focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] dark:hover:bg-[#183F63] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Sign In as New User</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Demo Personas */}
          <div className="pt-4 border-t border-slate-100 dark:border-[#1E2D52] space-y-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block text-center mb-2">
                Or Test with Sample Personas (Pre-Populated Data):
              </span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => login('riya', 'student')}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D52] bg-white dark:bg-[#101935] hover:border-[#1F4E79] dark:hover:border-sky-400 hover:bg-blue-50/50 dark:hover:bg-[#152347] transition-colors text-center group cursor-pointer"
                >
                  <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-[#1F4E79] dark:group-hover:text-sky-300 block">
                    Riya Sharma
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 block">Diploma (Elec)</span>
                </button>

                <button
                  type="button"
                  onClick={() => login('amit', 'student')}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D52] bg-white dark:bg-[#101935] hover:border-[#1F4E79] dark:hover:border-sky-400 hover:bg-blue-50/50 dark:hover:bg-[#152347] transition-colors text-center group cursor-pointer"
                >
                  <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-[#1F4E79] dark:group-hover:text-sky-300 block">
                    Amit Patil
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 block">BCA (Data)</span>
                </button>

                <button
                  type="button"
                  onClick={() => login('sneha', 'student')}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D52] bg-white dark:bg-[#101935] hover:border-[#1F4E79] dark:hover:border-sky-400 hover:bg-blue-50/50 dark:hover:bg-[#152347] transition-colors text-center group cursor-pointer"
                >
                  <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-[#1F4E79] dark:group-hover:text-sky-300 block">
                    Sneha K.
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 block">ITI (Mech)</span>
                </button>
              </div>

              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => login('riya', 'institution')}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#1F4E79] dark:hover:text-sky-400 font-medium transition-colors cursor-pointer"
                >
                  Log in as <strong>College TPO / Placement Officer →</strong>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-400 dark:text-slate-500">
        SkillSetu • AI Career Guidance Platform
      </div>
    </div>
  );
};
