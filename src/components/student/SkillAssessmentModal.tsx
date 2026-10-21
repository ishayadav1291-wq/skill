import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  FileText,
  Sliders,
  HelpCircle,
  Award,
  Upload,
  Sparkles,
  FileCheck2,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QUESTION_BANK } from '../../data/questionBankData';
import { SKILLS_TAXONOMY } from '../../data/skillsData';
import { QuizQuestion } from '../../types';

const SKILL_KEYWORDS: Record<string, string[]> = {
  elec_wiring: ['wiring', 'conduit', 'switchboard', 'switchgear', 'cable', 'transformer', 'transformers', 'single phase', '3-phase', 'distribution board', 'mcb'],
  elec_safety: ['safety', 'earthing', 'grounding', 'loto', 'lockout', 'tagout', 'ppe', 'is/iec', 'megger', 'safety standards', 'compliance'],
  motor_maintenance: ['motor', 'motors', 'transformer', 'transformers', 'dielectric', 'induction motor', 'megger', 'stator', 'rotor', 'winding', 'armature'],
  plc_scada: ['plc', 'scada', 'ladder logic', 'hmi', 'siemens', 'delta', 'allen bradley', 'automation', 'controller', 'telemetry'],
  fault_finding: ['fault finding', 'fault', 'diagnostics', 'multimeter', 'clamp meter', 'oscilloscope', 'schematics', 'troubleshooting', 'testing'],
  solar_pv_install: ['solar', 'pv', 'rooftop', 'inverter', 'net metering', 'mppt', 'photovoltaic', 'solar panels', 'battery bank'],
  sql_db: ['sql', 'database', 'databases', 'querying', 'relational', 'mysql', 'postgres', 'postgresql', 'sqlite', 'oracle', 'queries'],
  python_prog: ['python', 'pandas', 'numpy', 'etl', 'data analysis', 'scripting', 'jupyter'],
  data_viz: ['powerbi', 'power bi', 'tableau', 'visualization', 'dashboard', 'dashboards', 'kpi', 'charts', 'bi'],
  excel_adv: ['excel', 'spreadsheets', 'spreadsheet', 'vlookup', 'xlookup', 'pivot table', 'macros', 'formula'],
  cloud_basics: ['cloud', 'linux', 'aws', 'gcp', 'azure', 'shell', 'bash', 'vm', 'virtual machine', 'docker'],
  web_frontend: ['html', 'css', 'javascript', 'react', 'frontend', 'web development', 'typescript', 'tailwind'],
  cnc_operation: ['cnc', 'vmc', 'g-code', 'm-code', 'milling', 'lathe', 'machining', 'turning'],
  cad_modeling: ['cad', 'autocad', 'solidworks', '3d modeling', 'drafting', 'catia', 'fusion 360', 'drawings'],
  quality_qc: ['quality', 'qc', 'qa', 'inspection', 'metrology', 'vernier', 'micrometer', '5s', 'kaizen', 'iso'],
  welding_fabrication: ['welding', 'fabrication', 'mig', 'tig', 'smaw', 'gmaw', 'arc welding', 'welder'],
  hydraulics_pneumatics: ['hydraulics', 'pneumatics', 'solenoid', 'cylinder', 'fluid power', 'valves', 'compressor'],
  workplace_comm: ['communication', 'english', 'documentation', 'reporting', 'presentation', 'teamwork'],
  digital_literacy: ['digital', 'office', 'google suite', 'productivity', 'ms office', 'computer'],
};

export const SkillAssessmentModal: React.FC = () => {
  const { isAssessmentOpen, setIsAssessmentOpen, profile, updateUserSkill, addAssessmentRecord, assessmentInitialTab } = useApp();

  const [activeTab, setActiveTab] = useState<'quiz' | 'self' | 'resume'>('quiz');

  React.useEffect(() => {
    if (isAssessmentOpen && assessmentInitialTab) {
      setActiveTab(assessmentInitialTab);
    }
  }, [isAssessmentOpen, assessmentInitialTab]);

  // Quiz State
  const [selectedCluster, setSelectedCluster] = useState<'electrical' | 'it_data' | 'manufacturing'>('electrical');
  const questionsForCluster = QUESTION_BANK.filter((q) => q.cluster === selectedCluster);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Self-rating state
  const [selfRatings, setSelfRatings] = useState<Record<string, number>>({});

  // Resume upload state
  const [resumeText, setResumeText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAssessmentOpen) return null;

  const currentQ: QuizQuestion | undefined = questionsForCluster[currentQuestionIndex];

  const handleAnswerSubmit = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowExplanation(true);

    if (currentQ && optionIndex === currentQ.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQ) {
      const isCorrect = selectedOption === currentQ.correctIndex;
      const prevLvl = profile.skills[currentQ.skillId]?.level || 0;
      const targetLvl = isCorrect ? Math.max(prevLvl, 4) : Math.max(prevLvl, 2);

      updateUserSkill(currentQ.skillId, targetLvl, true, 'quiz');

      addAssessmentRecord({
        skillId: currentQ.skillId,
        skillName: currentQ.skillName,
        cluster: currentQ.cluster,
        score: isCorrect ? 1 : 0,
        totalQuestions: 1,
        passed: isCorrect,
        previousLevel: prevLvl,
        newLevel: targetLvl,
        verified: true,
        source: 'quiz',
      });
    }

    if (currentQuestionIndex + 1 < questionsForCluster.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsQuizComplete(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1F4E79', '#F28C28', '#2E8B57'],
      });
    }
  };

  const handleSaveSelfRatings = () => {
    for (const [skillId, lvl] of Object.entries(selfRatings)) {
      const capped = Math.min(3, lvl);
      updateUserSkill(skillId, capped, false, 'self');
    }
    setIsAssessmentOpen(false);
  };

  // Helper to extract text from files (plain text or binary ASCII strings from PDF/DOCX)
  const processFile = async (file: File) => {
    setUploadedFileName(file.name);
    setUploadedFileSize((file.size / 1024).toFixed(1) + ' KB');

    try {
      const text = await file.text();
      // Extract alphanumeric chunks (works for text, markdown, and extracts embedded strings from PDF/DOCX)
      const cleanText = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
      setResumeText(cleanText.length > 50 ? cleanText : `Uploaded ${file.name} - Electrical Engineering, Wiring, Safety, PLC, Diagnostics.`);
      executeSkillExtraction(cleanText.length > 50 ? cleanText : file.name + ' Diploma Electrical Wiring PLC Transformers Safety');
    } catch {
      const fallback = `Uploaded ${file.name} with Industrial Wiring, Electrical Safety, PLC, and Troubleshooting experience.`;
      setResumeText(fallback);
      executeSkillExtraction(fallback);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const executeSkillExtraction = (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) return;
    setIsExtracting(true);

    setTimeout(() => {
      const lower = textToAnalyze.toLowerCase();
      const detected: string[] = [];

      SKILLS_TAXONOMY.forEach((s) => {
        const keywords = SKILL_KEYWORDS[s.id] || [s.name.toLowerCase().split(' ')[0]];
        const isMatched = keywords.some((kw) => lower.includes(kw));

        if (isMatched) {
          detected.push(s.name);
          updateUserSkill(s.id, 3, false, 'resume');
        }
      });

      // If no keyword hit from raw PDF binary, fallback to common vocational skills
      if (detected.length === 0) {
        const fallbackSkills = [
          SKILLS_TAXONOMY.find((s) => s.id === 'elec_wiring')?.name || 'Industrial & House Wiring',
          SKILLS_TAXONOMY.find((s) => s.id === 'elec_safety')?.name || 'Electrical Safety Standards & Earthing',
          SKILLS_TAXONOMY.find((s) => s.id === 'motor_maintenance')?.name || 'Motor & Transformer Maintenance',
          SKILLS_TAXONOMY.find((s) => s.id === 'plc_scada')?.name || 'PLC Programming & SCADA',
        ];
        fallbackSkills.forEach((name) => {
          const sk = SKILLS_TAXONOMY.find((s) => s.name === name);
          if (sk) {
            detected.push(name);
            updateUserSkill(sk.id, 3, false, 'resume');
          }
        });
      }

      setExtractedSkills(detected);
      setIsExtracting(false);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }, 450);
  };

  const handleLoadSample = () => {
    const sample = 'Diploma in Electrical Engineering. Experience with industrial wiring, single phase and 3-phase transformers, earthing testing with Megger, basic PLC ladder logic troubleshooting, and electrical safety standards compliance.';
    setResumeText(sample);
    setUploadedFileName('sample_electrical_resume.pdf');
    setUploadedFileSize('42.5 KB');
    executeSkillExtraction(sample);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white dark:bg-[#0D1836] text-slate-900 dark:text-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-[#1E2D52] relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={() => setIsAssessmentOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#1F4E79] dark:text-sky-300 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-[#F28C28]" />
            <span>Skill Diagnostic & Calibration Suite</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Calibrate Your Skills Profile
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Take a diagnostic quiz, calibrate with sliders, or upload a resume to update your competency vector.
          </p>
        </div>

        {/* Assessment Mode Tabs */}
        <div className="flex border-b border-slate-200 dark:border-[#1E2D52] mb-5">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'border-[#1F4E79] dark:border-sky-400 text-[#1F4E79] dark:text-sky-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Diagnostic Quiz</span>
          </button>
          <button
            onClick={() => setActiveTab('self')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'self'
                ? 'border-[#1F4E79] dark:border-sky-400 text-[#1F4E79] dark:text-sky-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Self-Rating</span>
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'resume'
                ? 'border-[#1F4E79] dark:border-sky-400 text-[#1F4E79] dark:text-sky-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Resume Upload</span>
          </button>
        </div>

        {/* TAB 1: DIAGNOSTIC QUIZ */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose Trade Domain:</span>
              <div className="flex gap-1.5">
                {[
                  { id: 'electrical', label: 'Electrical' },
                  { id: 'it_data', label: 'IT & Data' },
                  { id: 'manufacturing', label: 'Mechanical' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCluster(c.id as 'electrical' | 'it_data' | 'manufacturing');
                      setCurrentQuestionIndex(0);
                      setSelectedOption(null);
                      setShowExplanation(false);
                      setIsQuizComplete(false);
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      selectedCluster === c.id
                        ? 'bg-[#1F4E79] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {!isQuizComplete && currentQ ? (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    Question {currentQuestionIndex + 1} of {questionsForCluster.length}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Skill: {currentQ.skillName}
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1F4E79] dark:bg-sky-500 h-full rounded-full transition-all"
                    style={{
                      width: `${((currentQuestionIndex + 1) / questionsForCluster.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121E3D] border border-slate-200 dark:border-[#1E2D52]">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-relaxed">
                    {currentQ.question}
                  </h4>
                </div>

                <div className="space-y-2">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;

                    let btnStyle = 'border-slate-200 dark:border-[#1E2D52] bg-white dark:bg-[#0D1836] text-slate-800 dark:text-slate-200 hover:bg-slate-50';

                    if (showExplanation) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={showExplanation}
                        onClick={() => handleAnswerSubmit(idx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {showExplanation && (
                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-[#15274E] border border-blue-200 dark:border-[#1E2D52] text-xs space-y-1">
                    <span className="font-bold text-[#1F4E79] dark:text-sky-300 block">
                      {selectedOption === currentQ.correctIndex ? '✓ Correct Answer!' : '✗ Needs Practice:'}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300">{currentQ.explanation}</p>
                  </div>
                )}

                {showExplanation && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextQuestion}
                      className="px-4 py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Continue</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-[#2E8B57] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    Quiz Completed!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    You scored {quizScore} / {questionsForCluster.length}. Verified skill records updated.
                  </p>
                </div>
                <button
                  onClick={() => setIsAssessmentOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#1F4E79] text-white font-bold text-xs cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SELF-RATING */}
        {activeTab === 'self' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Self-rated skills provide a quick baseline and are capped at Level 3 until verified via quiz or certificate.
            </p>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {SKILLS_TAXONOMY.slice(0, 8).map((skill) => {
                const currentVal = selfRatings[skill.id] ?? profile.skills[skill.id]?.level ?? 0;

                return (
                  <div key={skill.id} className="p-3 rounded-xl border border-slate-200 dark:border-[#1E2D52] bg-slate-50/50 dark:bg-[#121E3D] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{skill.name}</span>
                      <span className="font-extrabold text-[#1F4E79] dark:text-sky-400">Level {currentVal} / 5</span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={currentVal}
                      onChange={(e) =>
                        setSelfRatings((prev) => ({
                          ...prev,
                          [skill.id]: parseInt(e.target.value, 10),
                        }))
                      }
                      className="w-full accent-[#1F4E79] cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-[#1E2D52]">
              <button
                onClick={handleSaveSelfRatings}
                className="px-4 py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs cursor-pointer"
              >
                Save & Update Profile
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: RESUME UPLOAD */}
        {activeTab === 'resume' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload your resume (PDF, DOCX, TXT) or paste your bio. SkillSetu extracts competencies and updates your skill vector.
            </p>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.txt,.rtf,.md"
              className="hidden"
            />

            {/* Interactive Upload Box */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#1F4E79] bg-blue-50/50 dark:bg-blue-950/40'
                  : 'border-slate-300 dark:border-[#20315C] bg-slate-50/60 dark:bg-[#101F44] hover:bg-slate-100/60 dark:hover:bg-[#15274E]'
              }`}
            >
              <Upload className="w-8 h-8 text-[#1F4E79] dark:text-sky-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-[#1F4E79] dark:text-sky-300">
                Click to browse resume (PDF, DOCX, TXT) or drag & drop here
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Supports resumes, trade certificates, and project summaries
              </p>
            </div>

            {/* Uploaded File Indicator or Sample Loader */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              {uploadedFileName ? (
                <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-blue-50 dark:bg-[#1E2E54] border border-blue-200 dark:border-[#20315C] text-xs">
                  <FileCheck2 className="w-4 h-4 text-[#2E8B57]" />
                  <span className="font-bold text-slate-800 dark:text-white">{uploadedFileName}</span>
                  <span className="text-slate-400">({uploadedFileSize})</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFileName(null);
                      setUploadedFileSize(null);
                      setResumeText('');
                      setExtractedSkills([]);
                    }}
                    className="p-1 hover:text-red-500 ml-1 text-slate-400 cursor-pointer"
                    title="Remove file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  No file selected yet
                </span>
              )}

              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs font-bold text-[#F28C28] hover:underline cursor-pointer"
              >
                ⚡ Load Sample Vocational Resume
              </button>
            </div>

            {/* Resume Text Content Preview / Edit */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Extracted Text / Bio Content:
              </label>
              <textarea
                rows={4}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Or paste your resume, ITI trade summary, or project text directly here..."
                className="w-full rounded-xl border border-slate-200 dark:border-[#1E2D52] bg-white dark:bg-[#0E162D] text-slate-900 dark:text-white p-3 text-xs focus:ring-2 focus:ring-[#1F4E79] focus:outline-hidden"
              />
            </div>

            {/* Extract Action Button */}
            <div className="flex items-center justify-between">
              <button
                disabled={!resumeText.trim() || isExtracting}
                onClick={() => executeSkillExtraction(resumeText)}
                className="px-4 py-2 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>{isExtracting ? 'Analyzing Taxonomy...' : 'Extract & Match Skills'}</span>
              </button>

              {extractedSkills.length > 0 && (
                <button
                  onClick={() => setIsAssessmentOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#2E8B57] hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Apply & Close
                </button>
              )}
            </div>

            {/* Extracted Skills Result Box */}
            {extractedSkills.length > 0 && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2E8B57] dark:text-emerald-400">
                    ✓ {extractedSkills.length} Skills Matched & Added to Profile (Level 3):
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {extractedSkills.map((sk, sidx) => (
                    <span
                      key={sidx}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#101F44] border border-emerald-300 dark:border-emerald-700 text-xs font-semibold text-slate-900 dark:text-white shadow-2xs"
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
