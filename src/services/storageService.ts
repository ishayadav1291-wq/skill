import {
  AssessmentRecord,
  DigiLockerCertificate,
  InstitutionalBatch,
  MentorFeedbackRecord,
  ScoringWeights,
  StudentProfile,
} from '../types';

const STORAGE_KEYS = {
  PROFILE_PREFIX: 'skillsetu_profile_',
  ACTIVE_PERSONA: 'skillsetu_active_persona',
  ASSESSMENT_HISTORY: 'skillsetu_assessment_history',
  DIGILOCKER_CERTS: 'skillsetu_digilocker_certs',
  MENTOR_FEEDBACKS: 'skillsetu_mentor_feedbacks',
  BATCHES: 'skillsetu_institutional_batches',
  SCORING_WEIGHTS: 'skillsetu_scoring_weights',
  LAST_SYNC: 'skillsetu_last_sync',
};

// Default seed batches for Institutional TPO portal
export const INITIAL_INSTITUTIONAL_BATCHES: InstitutionalBatch[] = [
  {
    id: 'batch_elec_2025',
    name: 'Diploma Electrical Batch 2024-25',
    institutionName: 'Government Polytechnic Pune',
    trade: 'Electrical Engineering',
    academicYear: '2024-2025',
    studentCount: 68,
    avgReadiness: 68,
    topDeficitSkill: 'PLC Ladder Logic & SCADA',
    placedCount: 42,
    createdAt: '2025-08-15T09:00:00.000Z',
  },
  {
    id: 'batch_mech_2025',
    name: 'ITI Fitter / Turner Final Year',
    institutionName: 'Industrial Training Institute Aundh',
    trade: 'Fitter & Machinist',
    academicYear: '2024-2025',
    studentCount: 54,
    avgReadiness: 74,
    topDeficitSkill: 'CNC G-Code Programming',
    placedCount: 38,
    createdAt: '2025-09-01T10:30:00.000Z',
  },
  {
    id: 'batch_copa_2025',
    name: 'COPA / IT Trade Batch 2025',
    institutionName: 'Government ITI Nashik',
    trade: 'Computer Operator & Programming Assistant',
    academicYear: '2024-2025',
    studentCount: 45,
    avgReadiness: 79,
    topDeficitSkill: 'Advanced SQL JOINs & Indexing',
    placedCount: 31,
    createdAt: '2025-10-10T11:15:00.000Z',
  },
];

// Default seed mentor feedback notes
export const INITIAL_MENTOR_FEEDBACKS: MentorFeedbackRecord[] = [
  {
    id: 'fb_1',
    timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    studentId: 'student_riya_sharma',
    studentName: 'Riya Sharma',
    mentorName: 'Vikram Deshmukh',
    company: 'Tata AutoComp Systems Ltd',
    role: 'Lead Automation Engineer',
    notes:
      'Excellent grasp of electrical safety standards and motor starter wiring. Recommended completing the 18-hr PLC Ladder Logic module to qualify for the Junior Automation Apprenticeship at our Chakan Plant.',
    endorsedSkills: ['Wiring & Earthing', 'Industrial Safety & PPE'],
    rating: 5,
  },
];

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[SkillSetu Storage] Failed to load ${key}:`, err);
    return fallback;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  } catch (err) {
    console.warn(`[SkillSetu Storage] Failed to save ${key}:`, err);
  }
}

export const StorageService = {
  // Profiles
  loadProfile(personaKey: string, fallback: StudentProfile): StudentProfile {
    const key = `${STORAGE_KEYS.PROFILE_PREFIX}${personaKey}`;
    return safeGetItem<StudentProfile>(key, fallback);
  },

  saveProfile(personaKey: string, profile: StudentProfile): void {
    const key = `${STORAGE_KEYS.PROFILE_PREFIX}${personaKey}`;
    safeSetItem(key, profile);
  },

  // Active persona
  loadActivePersona(fallback: string = 'riya'): string {
    return safeGetItem<string>(STORAGE_KEYS.ACTIVE_PERSONA, fallback);
  },

  saveActivePersona(personaKey: string): void {
    safeSetItem(STORAGE_KEYS.ACTIVE_PERSONA, personaKey);
  },

  // Assessment History
  loadAssessmentHistory(personaKey: string): AssessmentRecord[] {
    const key = `${STORAGE_KEYS.ASSESSMENT_HISTORY}_${personaKey}`;
    return safeGetItem<AssessmentRecord[]>(key, []);
  },

  saveAssessmentRecord(personaKey: string, record: AssessmentRecord): AssessmentRecord[] {
    const existing = this.loadAssessmentHistory(personaKey);
    const updated = [record, ...existing.filter((r) => r.id !== record.id)];
    const key = `${STORAGE_KEYS.ASSESSMENT_HISTORY}_${personaKey}`;
    safeSetItem(key, updated);
    return updated;
  },

  // DigiLocker Verified Certificates
  loadDigiLockerCertificates(personaKey: string): DigiLockerCertificate[] {
    const key = `${STORAGE_KEYS.DIGILOCKER_CERTS}_${personaKey}`;
    return safeGetItem<DigiLockerCertificate[]>(key, []);
  },

  saveDigiLockerCertificate(personaKey: string, cert: DigiLockerCertificate): DigiLockerCertificate[] {
    const existing = this.loadDigiLockerCertificates(personaKey);
    const updated = [cert, ...existing.filter((c) => c.id !== cert.id)];
    const key = `${STORAGE_KEYS.DIGILOCKER_CERTS}_${personaKey}`;
    safeSetItem(key, updated);
    return updated;
  },

  // Mentor Feedbacks
  loadMentorFeedbacks(): MentorFeedbackRecord[] {
    return safeGetItem<MentorFeedbackRecord[]>(STORAGE_KEYS.MENTOR_FEEDBACKS, INITIAL_MENTOR_FEEDBACKS);
  },

  saveMentorFeedback(feedback: MentorFeedbackRecord): MentorFeedbackRecord[] {
    const existing = this.loadMentorFeedbacks();
    const updated = [feedback, ...existing.filter((f) => f.id !== feedback.id)];
    safeSetItem(STORAGE_KEYS.MENTOR_FEEDBACKS, updated);
    return updated;
  },

  // Institutional Batches
  loadBatches(): InstitutionalBatch[] {
    return safeGetItem<InstitutionalBatch[]>(STORAGE_KEYS.BATCHES, INITIAL_INSTITUTIONAL_BATCHES);
  },

  saveBatch(batch: InstitutionalBatch): InstitutionalBatch[] {
    const existing = this.loadBatches();
    const updated = [batch, ...existing.filter((b) => b.id !== batch.id)];
    safeSetItem(STORAGE_KEYS.BATCHES, updated);
    return updated;
  },

  // Scoring Weights
  loadScoringWeights(fallback: ScoringWeights): ScoringWeights {
    return safeGetItem<ScoringWeights>(STORAGE_KEYS.SCORING_WEIGHTS, fallback);
  },

  saveScoringWeights(weights: ScoringWeights): void {
    safeSetItem(STORAGE_KEYS.SCORING_WEIGHTS, weights);
  },

  // Last sync timestamp
  getLastSyncTime(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || new Date().toISOString();
  },

  // Export all application state to downloadable JSON backup
  exportAllState(): string {
    const dump: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('skillsetu_')) {
        try {
          dump[key] = JSON.parse(localStorage.getItem(key) || 'null');
        } catch {
          dump[key] = localStorage.getItem(key);
        }
      }
    }
    return JSON.stringify(dump, null, 2);
  },

  // Import application state from JSON
  importAllState(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString) as Record<string, unknown>;
      Object.entries(parsed).forEach(([key, val]) => {
        if (key.startsWith('skillsetu_')) {
          localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
        }
      });
      return true;
    } catch (err) {
      console.error('[SkillSetu Storage] Failed to import state:', err);
      return false;
    }
  },

  // Clear all SkillSetu data
  clearAllState(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('skillsetu_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  },
};
