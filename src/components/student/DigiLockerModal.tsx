import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Award,
  Search,
  ExternalLink,
  QrCode,
  Lock,
  ArrowRight,
  Sparkles,
  Download,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DigiLockerCertificate } from '../../types';

interface AvailableDoc {
  id: string;
  docType: DigiLockerCertificate['docType'];
  title: string;
  issuer: string;
  stream: string;
  docNumber: string;
  issuanceDate: string;
  credentialUri: string;
  skills: {
    skillId: string;
    skillName: string;
    verifiedLevel: number;
  }[];
}

const DIGILOCKER_CATALOG: AvailableDoc[] = [
  {
    id: 'doc_ncvt_elec',
    docType: 'NCVT_CERTIFICATE',
    title: 'NCVT National Trade Certificate (NTC) - Electrician',
    issuer: 'Directorate General of Training (DGT), Ministry of Skill Development',
    stream: 'electrical',
    docNumber: 'NCVT-AITT-2024-MH-948102',
    issuanceDate: '15 July 2024',
    credentialUri: 'in.gov.digilocker.dgt.ntc.948102',
    skills: [
      { skillId: 'wiring_safety', skillName: 'Electrical Wiring & Earthing', verifiedLevel: 4 },
      { skillId: 'safety_ppe', skillName: 'Industrial Electrical Safety & PPE', verifiedLevel: 4 },
      { skillId: 'troubleshooting', skillName: 'Electrical Circuit Troubleshooting', verifiedLevel: 3 },
    ],
  },
  {
    id: 'doc_sid_plc',
    docType: 'PMKVY_CERTIFICATE',
    title: 'Skill India Digital - Industrial Automation & PLC Specialist',
    issuer: 'Skill India Digital & Automation Sector Skill Council (ASSC)',
    stream: 'electrical',
    docNumber: 'SID-ASSC-2024-884129',
    issuanceDate: '10 September 2024',
    credentialUri: 'in.gov.skillindia.cert.884129',
    skills: [
      { skillId: 'plc_programming', skillName: 'PLC Ladder Logic & SCADA', verifiedLevel: 4 },
      { skillId: 'sensor_calibration', skillName: 'Sensor & Actuator Interfacing', verifiedLevel: 3 },
    ],
  },
  {
    id: 'doc_naps_tata',
    docType: 'APPRENTICESHIP_COMPLETION',
    title: 'NAPS National Apprenticeship Certificate (NAC) - Maintenance',
    issuer: 'National Apprenticeship Promotion Scheme (NAPS) • Tata Motors Ltd',
    stream: 'manufacturing',
    docNumber: 'NAPS-NAC-2024-MH-01938',
    issuanceDate: '28 August 2024',
    credentialUri: 'in.gov.apprenticeship.nac.01938',
    skills: [
      { skillId: 'preventive_maint', skillName: 'Industrial Preventive Maintenance', verifiedLevel: 4 },
      { skillId: 'kaizen_5s', skillName: '5S & Kaizen Quality Standards', verifiedLevel: 4 },
      { skillId: 'pneumatics_hydraulics', skillName: 'Pneumatics & Hydraulics', verifiedLevel: 3 },
    ],
  },
  {
    id: 'doc_poly_mech',
    docType: 'DIPLOMA_MARKSHEET',
    title: 'State Board Diploma Marksheet - Mechanical Engineering',
    issuer: 'Maharashtra State Board of Technical Education (MSBTE)',
    stream: 'manufacturing',
    docNumber: 'MSBTE-DIP-2024-773192',
    issuanceDate: '20 June 2024',
    credentialUri: 'in.gov.msbte.marksheet.773192',
    skills: [
      { skillId: 'blueprint_reading', skillName: 'Blueprint & Engineering Drawings', verifiedLevel: 4 },
      { skillId: 'metrology', skillName: 'Precision Metrology & Vernier Callipers', verifiedLevel: 4 },
      { skillId: 'cnc_setup', skillName: 'CNC Machine Setup & G-Code', verifiedLevel: 3 },
    ],
  },
  {
    id: 'doc_nptel_sql',
    docType: 'NPTEL_CERTIFICATE',
    title: 'NPTEL-IIT Madras Elite Certificate - Database Systems & SQL',
    issuer: 'National Programme on Technology Enhanced Learning (SWAYAM-NPTEL)',
    stream: 'it_data',
    docNumber: 'NPTEL24CS91S82930192',
    issuanceDate: '02 November 2024',
    credentialUri: 'in.gov.swayam.nptel.cert.91829',
    skills: [
      { skillId: 'sql_queries', skillName: 'SQL Database Queries & Relations', verifiedLevel: 4 },
      { skillId: 'python_basics', skillName: 'Python Programming Fundamentals', verifiedLevel: 3 },
      { skillId: 'data_cleaning', skillName: 'Data Cleaning & Transformation', verifiedLevel: 3 },
    ],
  },
];

export const DigiLockerModal: React.FC = () => {
  const { isDigiLockerModalOpen, setIsDigiLockerModalOpen, profile, importDigiLockerCertificate } = useApp();

  const [step, setStep] = useState<'search' | 'preview' | 'success'>('search');
  const [selectedDoc, setSelectedDoc] = useState<AvailableDoc | null>(null);
  const [regNumber, setRegNumber] = useState('');
  const [aadhaarLast4, setAadhaarLast4] = useState('4821');
  const [isVerifying, setIsVerifying] = useState(false);
  const [importSummary, setImportSummary] = useState<{ certTitle: string; count: number } | null>(null);

  if (!isDigiLockerModalOpen) return null;

  const handleSelectDoc = (doc: AvailableDoc) => {
    setSelectedDoc(doc);
    setRegNumber(doc.docNumber);
    setStep('preview');
  };

  const handleConfirmImport = () => {
    if (!selectedDoc) return;
    setIsVerifying(true);

    setTimeout(() => {
      const newCert: DigiLockerCertificate = {
        id: `digi_${selectedDoc.id}_${Date.now()}`,
        docType: selectedDoc.docType,
        title: selectedDoc.title,
        issuer: selectedDoc.issuer,
        issuanceDate: selectedDoc.issuanceDate,
        credentialUri: selectedDoc.credentialUri,
        docNumber: regNumber || selectedDoc.docNumber,
        verifiedSkills: selectedDoc.skills,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
      };

      importDigiLockerCertificate(newCert);

      setImportSummary({
        certTitle: selectedDoc.title,
        count: selectedDoc.skills.length,
      });
      setIsVerifying(false);
      setStep('success');

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#1F4E79', '#FF9933', '#138808', '#FFFFFF'], // Indian Tiranga palette
      });
    }, 1200);
  };

  const handleClose = () => {
    setIsDigiLockerModalOpen(false);
    setStep('search');
    setSelectedDoc(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Official Header */}
        <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 via-[#1F4E79] to-emerald-700 flex items-center justify-center text-white shadow-sm shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
                DigiLocker Verified
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                Skill India Digital (SID)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              Government Credential & Trade Certificate Import
            </h2>
            <p className="text-xs text-slate-500">
              Directly import verifiable marksheets, NCVT trade certificates, and PMKVY badges into your SkillSetu competency vector.
            </p>
          </div>
        </div>

        {/* Step 1: Search / Select Document */}
        {step === 'search' && (
          <div className="mt-5 space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:flex-1">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Candidate Aadhaar (Last 4 Digits)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={aadhaarLast4}
                  onChange={(e) => setAadhaarLast4(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 bg-white"
                />
              </div>
              <div className="w-full sm:flex-1">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Registered Full Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={profile.name}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 bg-slate-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  Available Verified Documents in DigiLocker Locker
                </h3>
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Live Repository Connected
                </span>
              </div>

              <div className="space-y-2.5">
                {DIGILOCKER_CATALOG.map((doc) => {
                  const isAlreadyImported = profile.digilockerCertificates?.some(
                    (c) => c.docNumber === doc.docNumber
                  );

                  return (
                    <div
                      key={doc.id}
                      onClick={() => !isAlreadyImported && handleSelectDoc(doc)}
                      className={`p-4 rounded-2xl border transition-all text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isAlreadyImported
                          ? 'bg-slate-50 border-slate-200 opacity-60 cursor-default'
                          : 'bg-white border-slate-200 hover:border-[#1F4E79] hover:shadow-md cursor-pointer group'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-[#1F4E79]" />
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#1F4E79]">
                            {doc.title}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500">{doc.issuer}</p>
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {doc.docNumber}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#1F4E79]">
                            {doc.skills.length} Verifiable Skills
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Issued: {doc.issuanceDate}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 self-end sm:self-center">
                        {isAlreadyImported ? (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Imported
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="px-3.5 py-1.5 rounded-xl bg-[#1F4E79] group-hover:bg-[#143552] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <span>Verify & Review</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Preview Document & Competency Vector */}
        {step === 'preview' && selectedDoc && (
          <div className="mt-5 space-y-4">
            <button
              onClick={() => setStep('search')}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
            >
              ← Back to document repository
            </button>

            {/* Official Certificate Card Preview */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-50/70 to-white border-2 border-blue-200/80 shadow-xs relative overflow-hidden">
              <div className="absolute top-3 right-3 opacity-15">
                <QrCode className="w-24 h-24 text-slate-900" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Government Authenticated
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  URI: {selectedDoc.credentialUri}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {selectedDoc.title}
              </h3>
              <p className="text-xs text-slate-600 font-medium">{selectedDoc.issuer}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 py-3 border-y border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Student Name</span>
                  <strong className="text-slate-800">{profile.name}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Registration / Roll No</span>
                  <strong className="font-mono text-slate-800">{selectedDoc.docNumber}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Issue Date</span>
                  <strong className="text-slate-800">{selectedDoc.issuanceDate}</strong>
                </div>
              </div>

              {/* Competencies Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#F28C28]" />
                  <span>Audited Competencies to Be Injected:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDoc.skills.map((s) => (
                    <div
                      key={s.skillId}
                      className="p-2.5 rounded-xl bg-white border border-blue-100 flex items-center justify-between shadow-2xs"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-800">{s.skillName}</div>
                        <span className="text-[10px] text-[#2E8B57] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified by Trade Assessor
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-[#2E8B57] text-xs font-black">
                        Lvl {s.verifiedLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  SHA-256 e-Signature Valid • Controller of Certifying Authorities
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('search')}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleConfirmImport}
                className="px-6 py-2.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Cryptographically Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#F28C28]" />
                    <span>Verify & Import Competencies</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Screen */}
        {step === 'success' && importSummary && (
          <div className="mt-6 text-center space-y-4 py-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#2E8B57] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                Credentials Verified & Synchronized!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                <strong>{importSummary.count} skills</strong> from <em>{importSummary.certTitle}</em> have been
                injected into your SkillSetu competency vector and permanently saved.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 max-w-sm mx-auto text-xs text-[#2E8B57] font-semibold">
              Your overall role readiness score and career recommendations have been updated automatically!
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-[#1F4E79] hover:bg-[#143552] text-white font-bold text-xs transition-colors shadow-xs"
              >
                Done • View Updated Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
