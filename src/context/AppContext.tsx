import React, { createContext, useContext, useEffect, useState } from 'react';
import { CAREER_ROLES } from '../data/rolesData';
import { DEMO_PERSONAS, INITIAL_NEW_STUDENT } from '../data/seedProfiles';
import { TRANSLATIONS } from '../locales/translations';
import { buildLearningPathway } from '../services/pathwayBuilder';
import { calculateRoleGaps, DEFAULT_SCORING_WEIGHTS } from '../services/recommendationEngine';
import {
  StorageService,
  INITIAL_INSTITUTIONAL_BATCHES,
  INITIAL_MENTOR_FEEDBACKS,
} from '../services/storageService';
import {
  AssessmentRecord,
  CareerRole,
  DigiLockerCertificate,
  InstitutionalBatch,
  Language,
  LearningPathway,
  MentorFeedbackRecord,
  ScoringWeights,
  StudentProfile,
  UserRole,
  UserSkill,
} from '../types';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  targetRole: CareerRole;
  setTargetRoleId: (roleId: string) => void;
  pathway: LearningPathway;
  scoringWeights: ScoringWeights;
  setScoringWeights: React.Dispatch<React.SetStateAction<ScoringWeights>>;
  updateUserSkill: (
    skillId: string,
    level: number,
    verified: boolean,
    source: 'quiz' | 'self' | 'resume' | 'course' | 'digilocker' | 'mentor'
  ) => void;
  markPathwayItemComplete: (itemId: string) => void;
  applyOpportunity: (oppId: string) => void;
  switchDemoPersona: (personaKey: 'riya' | 'amit' | 'sneha' | 'new') => void;
  activePersonaKey: string;
  t: (key: string) => string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isAssessmentOpen: boolean;
  setIsAssessmentOpen: (open: boolean) => void;
  assessmentInitialTab: 'quiz' | 'self' | 'resume';
  openAssessmentModal: (tab?: 'quiz' | 'self' | 'resume') => void;
  isDigiLockerModalOpen: boolean;
  setIsDigiLockerModalOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  login: (
    personaKey?: 'riya' | 'amit' | 'sneha' | 'new' | string,
    targetRole?: UserRole,
    customUserData?: { phone?: string; email?: string; name?: string }
  ) => void;
  logout: () => void;
  // Persistent additions
  assessmentHistory: AssessmentRecord[];
  addAssessmentRecord: (record: Omit<AssessmentRecord, 'id' | 'timestamp'>) => void;
  digilockerCertificates: DigiLockerCertificate[];
  importDigiLockerCertificate: (cert: DigiLockerCertificate) => void;
  mentorFeedbacks: MentorFeedbackRecord[];
  addMentorFeedback: (feedback: Omit<MentorFeedbackRecord, 'id' | 'timestamp'>) => void;
  institutionalBatches: InstitutionalBatch[];
  addInstitutionalBatch: (batch: Omit<InstitutionalBatch, 'id' | 'createdAt'>) => void;
  resetAppState: () => void;
  lastStorageSync: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>('student');
  const [language, setLanguage] = useState<Language>('hi');
  const [activeView, setActiveView] = useState<string>('home');
  const [activePersonaKey, setActivePersonaKey] = useState<string>(() => {
    return StorageService.loadActivePersona('riya');
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('skillsetu_theme') : null;
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('skillsetu_theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState<boolean>(false);
  const [assessmentInitialTab, setAssessmentInitialTab] = useState<'quiz' | 'self' | 'resume'>('quiz');
  const [isDigiLockerModalOpen, setIsDigiLockerModalOpen] = useState<boolean>(false);
  const [lastStorageSync, setLastStorageSync] = useState<string>(() => StorageService.getLastSyncTime());

  const openAssessmentModal = (tab: 'quiz' | 'self' | 'resume' = 'quiz') => {
    setAssessmentInitialTab(tab);
    setIsAssessmentOpen(true);
  };

  // Initialize profile with persistent storage
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const fallback = DEMO_PERSONAS[activePersonaKey as keyof typeof DEMO_PERSONAS] || DEMO_PERSONAS.riya;
    return StorageService.loadProfile(activePersonaKey, fallback);
  });

  // Persistent Assessment History
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentRecord[]>(() => {
    return StorageService.loadAssessmentHistory(activePersonaKey);
  });

  // Persistent DigiLocker certificates
  const [digilockerCertificates, setDigilockerCertificates] = useState<DigiLockerCertificate[]>(() => {
    return StorageService.loadDigiLockerCertificates(activePersonaKey);
  });

  // Persistent Mentor Feedbacks
  const [mentorFeedbacks, setMentorFeedbacks] = useState<MentorFeedbackRecord[]>(() => {
    return StorageService.loadMentorFeedbacks();
  });

  // Persistent Institutional Batches
  const [institutionalBatches, setInstitutionalBatches] = useState<InstitutionalBatch[]>(() => {
    return StorageService.loadBatches();
  });

  // Persistent Scoring Weights
  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>(() => {
    return StorageService.loadScoringWeights(DEFAULT_SCORING_WEIGHTS);
  });

  // Save profile and weights automatically on change
  useEffect(() => {
    StorageService.saveProfile(activePersonaKey, profile);
    StorageService.saveActivePersona(activePersonaKey);
    setLastStorageSync(new Date().toISOString());
  }, [profile, activePersonaKey]);

  useEffect(() => {
    StorageService.saveScoringWeights(scoringWeights);
  }, [scoringWeights]);

  // Target role resolution
  const targetRole =
    CAREER_ROLES.find((r) => r.id === profile.targetRoleId) ||
    CAREER_ROLES.find((r) => r.id === 'maintenance_technician') ||
    CAREER_ROLES[0];

  // Learning pathway state
  const [pathway, setPathway] = useState<LearningPathway>(() => {
    return buildLearningPathway(profile.targetRoleId || 'maintenance_technician', profile.skills, profile.weeklyHours);
  });

  // Rebuild pathway when target role changes
  const setTargetRoleId = (roleId: string) => {
    setProfile((prev) => ({
      ...prev,
      targetRoleId: roleId,
    }));
    const newPath = buildLearningPathway(roleId, profile.skills, profile.weeklyHours);
    setPathway(newPath);
  };

  const updateUserSkill = (
    skillId: string,
    level: number,
    verified: boolean,
    source: 'quiz' | 'self' | 'resume' | 'course' | 'digilocker' | 'mentor'
  ) => {
    setProfile((prev) => {
      const existing = prev.skills[skillId];
      const updatedSkill: UserSkill = {
        skillId,
        skillName: existing ? existing.skillName : skillId,
        cluster: existing ? existing.cluster : 'core',
        level,
        source: source === 'digilocker' ? 'course' : source,
        verified,
        updatedAt: new Date().toISOString(),
      };

      const newSkills = {
        ...prev.skills,
        [skillId]: updatedSkill,
      };

      return {
        ...prev,
        skills: newSkills,
      };
    });
  };

  // Add assessment record
  const addAssessmentRecord = (record: Omit<AssessmentRecord, 'id' | 'timestamp'>) => {
    const fullRecord: AssessmentRecord = {
      ...record,
      id: `ass_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    const updated = StorageService.saveAssessmentRecord(activePersonaKey, fullRecord);
    setAssessmentHistory(updated);
  };

  // Import DigiLocker certificate
  const importDigiLockerCertificate = (cert: DigiLockerCertificate) => {
    const updatedCerts = StorageService.saveDigiLockerCertificate(activePersonaKey, cert);
    setDigilockerCertificates(updatedCerts);

    // Inject all competencies into profile skills as verified
    setProfile((prev) => {
      const nextSkills = { ...prev.skills };

      cert.verifiedSkills.forEach((s) => {
        const curLevel = nextSkills[s.skillId]?.level || 0;
        const newLvl = Math.max(curLevel, s.verifiedLevel);

        nextSkills[s.skillId] = {
          skillId: s.skillId,
          skillName: s.skillName,
          cluster: nextSkills[s.skillId]?.cluster || 'core',
          level: newLvl,
          source: 'course',
          verified: true,
          updatedAt: new Date().toISOString(),
        };

        // Also append to assessment history
        addAssessmentRecord({
          skillId: s.skillId,
          skillName: s.skillName,
          cluster: nextSkills[s.skillId]?.cluster || 'core',
          score: s.verifiedLevel,
          totalQuestions: 5,
          passed: true,
          previousLevel: curLevel,
          newLevel: newLvl,
          verified: true,
          source: 'digilocker',
        });
      });

      return {
        ...prev,
        skills: nextSkills,
        digilockerCertificates: updatedCerts,
      };
    });

    // Refresh pathway
    const refreshedPathway = buildLearningPathway(
      profile.targetRoleId || 'maintenance_technician',
      profile.skills,
      profile.weeklyHours
    );
    setPathway(refreshedPathway);
  };

  // Add mentor feedback
  const addMentorFeedback = (feedback: Omit<MentorFeedbackRecord, 'id' | 'timestamp'>) => {
    const fullFeedback: MentorFeedbackRecord = {
      ...feedback,
      id: `fb_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updated = StorageService.saveMentorFeedback(fullFeedback);
    setMentorFeedbacks(updated);

    // If feedback endorses skills, mark them verified
    if (feedback.endorsedSkills && feedback.endorsedSkills.length > 0) {
      setProfile((prev) => {
        const nextSkills = { ...prev.skills };
        feedback.endorsedSkills.forEach((sName) => {
          const match = Object.values(nextSkills).find(
            (sk) => sk.skillName.toLowerCase() === sName.toLowerCase()
          );
          if (match) {
            nextSkills[match.skillId] = {
              ...match,
              verified: true,
              level: Math.min(5, Math.max(match.level, 3)),
              updatedAt: new Date().toISOString(),
            };
          }
        });
        return { ...prev, skills: nextSkills };
      });
    }
  };

  // Add institutional batch
  const addInstitutionalBatch = (batch: Omit<InstitutionalBatch, 'id' | 'createdAt'>) => {
    const fullBatch: InstitutionalBatch = {
      ...batch,
      id: `batch_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = StorageService.saveBatch(fullBatch);
    setInstitutionalBatches(updated);
  };

  // Reset all state to defaults
  const resetAppState = () => {
    StorageService.clearAllState();
    const defaultProf = DEMO_PERSONAS.riya;
    setProfile(defaultProf);
    setActivePersonaKey('riya');
    setScoringWeights(DEFAULT_SCORING_WEIGHTS);
    setAssessmentHistory([]);
    setDigilockerCertificates([]);
    setMentorFeedbacks(INITIAL_MENTOR_FEEDBACKS);
    setInstitutionalBatches(INITIAL_INSTITUTIONAL_BATCHES);
    setPathway(buildLearningPathway(defaultProf.targetRoleId || 'maintenance_technician', defaultProf.skills, defaultProf.weeklyHours));
    setLastStorageSync(new Date().toISOString());
  };

  // Recalculate pathway progress and student readiness when an item is marked done
  const markPathwayItemComplete = (itemId: string) => {
    setPathway((prev) => {
      let itemSkillId = '';
      let itemTargetLevel = 0;

      const newWeeks = prev.weeks.map((week) => {
        const newItems = week.items.map((item) => {
          if (item.id === itemId) {
            itemSkillId = item.skillId;
            itemTargetLevel = item.levelTarget;
            return { ...item, status: 'done' as const };
          }
          return item;
        });
        return { ...week, items: newItems };
      });

      // Unlock next item
      let foundNext = false;
      for (const w of newWeeks) {
        for (const it of w.items) {
          if (it.status === 'locked' && !foundNext) {
            it.status = 'active';
            foundNext = true;
          }
        }
      }

      // If the item has a skill and target level, level up the student's skill!
      if (itemSkillId && itemTargetLevel > 0) {
        const curLevel = profile.skills[itemSkillId]?.level || 0;
        const newLevel = Math.max(curLevel, itemTargetLevel);
        updateUserSkill(itemSkillId, newLevel, true, 'course');
      }

      const allItems = newWeeks.flatMap((w) => w.items);
      const completed = allItems.filter((i) => i.status === 'done').length;

      // Recalculate readiness
      const gapRes = calculateRoleGaps(targetRole, profile.skills);

      return {
        ...prev,
        weeks: newWeeks,
        completedItemCount: completed,
        readinessCurrent: gapRes.readiness,
      };
    });
  };

  const applyOpportunity = (oppId: string) => {
    setProfile((prev) => {
      if (prev.appliedOpportunityIds.includes(oppId)) return prev;
      return {
        ...prev,
        appliedOpportunityIds: [...prev.appliedOpportunityIds, oppId],
      };
    });
  };

  const switchDemoPersona = (personaKey: 'riya' | 'amit' | 'sneha' | 'new') => {
    setActivePersonaKey(personaKey);
    let newProf: StudentProfile;

    if (personaKey === 'riya') {
      newProf = StorageService.loadProfile('riya', DEMO_PERSONAS.riya);
      setLanguage('hi');
    } else if (personaKey === 'amit') {
      newProf = StorageService.loadProfile('amit', DEMO_PERSONAS.amit);
      setLanguage('en');
    } else if (personaKey === 'sneha') {
      newProf = StorageService.loadProfile('sneha', DEMO_PERSONAS.sneha);
      setLanguage('mr');
    } else {
      // Completely blank new student with 0 demo skills
      const blankProfile: StudentProfile = {
        id: `learner_${Date.now()}`,
        name: 'New Learner',
        phone: '',
        email: '',
        educationLevel: 'polytechnic_diploma',
        institutionName: '',
        branch: 'Electrical Engineering',
        year: '1st Year',
        interests: ['Industrial Automation', 'Electrical Safety'],
        preferredLanguage: 'en',
        weeklyHours: 6,
        targetRoleId: 'maintenance_technician',
        completedAssessments: [],
        appliedOpportunityIds: [],
        skills: {}, // EMPTY: 0 skills, no demo data!
        assessmentHistory: [],
        digilockerCertificates: [],
        mentorFeedbacks: [],
      };
      newProf = blankProfile;
      StorageService.saveProfile('new', blankProfile);
      setLanguage('en');
      setIsOnboardingOpen(true);
    }

    setProfile(newProf);
    setAssessmentHistory(StorageService.loadAssessmentHistory(personaKey));
    setDigilockerCertificates(StorageService.loadDigiLockerCertificates(personaKey));

    const target = newProf.targetRoleId || 'maintenance_technician';
    setPathway(buildLearningPathway(target, newProf.skills, newProf.weeklyHours));
    setActiveView('home');
  };

  const login = (
    personaKey?: 'riya' | 'amit' | 'sneha' | 'new' | string,
    targetRole?: UserRole,
    customUserData?: { phone?: string; email?: string; name?: string }
  ) => {
    const roleToSet = targetRole || 'student';
    setRole(roleToSet);

    if (customUserData && (customUserData.phone || customUserData.email)) {
      // Real user login with unique identifier - completely isolated from demo personas!
      const rawId = (customUserData.phone || customUserData.email || '').replace(/[^a-zA-Z0-9]/g, '_');
      const userKey = `user_${rawId}`;
      setActivePersonaKey(userKey);

      const blankNewProfile: StudentProfile = {
        id: `student_${rawId}`,
        name: customUserData.name || (customUserData.phone ? `Student (${customUserData.phone.slice(-4)})` : 'New Learner'),
        phone: customUserData.phone || '',
        email: customUserData.email || '',
        educationLevel: 'polytechnic_diploma',
        institutionName: '',
        branch: 'Electrical Engineering',
        year: '1st Year',
        interests: ['Industrial Automation', 'Electrical Safety'],
        preferredLanguage: language,
        weeklyHours: 6,
        targetRoleId: 'maintenance_technician',
        completedAssessments: [],
        appliedOpportunityIds: [],
        skills: {}, // EMPTY: 0 skills, no pre-filled demo data!
        assessmentHistory: [],
        digilockerCertificates: [],
        mentorFeedbacks: [],
      };

      const loadedProfile = StorageService.loadProfile(userKey, blankNewProfile);
      setProfile(loadedProfile);
      setAssessmentHistory(StorageService.loadAssessmentHistory(userKey));
      setDigilockerCertificates(StorageService.loadDigiLockerCertificates(userKey));

      const target = loadedProfile.targetRoleId || 'maintenance_technician';
      setPathway(buildLearningPathway(target, loadedProfile.skills, loadedProfile.weeklyHours));

      // If user is brand new with 0 skills, open onboarding wizard
      if (Object.keys(loadedProfile.skills).length === 0) {
        setIsOnboardingOpen(true);
      }
    } else if (personaKey) {
      if (personaKey === 'new') {
        switchDemoPersona('new');
      } else if (personaKey === 'riya' || personaKey === 'amit' || personaKey === 'sneha') {
        switchDemoPersona(personaKey);
      } else {
        const loaded = StorageService.loadProfile(personaKey, DEMO_PERSONAS.riya);
        setProfile(loaded);
        setActivePersonaKey(personaKey);
        setAssessmentHistory(StorageService.loadAssessmentHistory(personaKey));
        setDigilockerCertificates(StorageService.loadDigiLockerCertificates(personaKey));
      }
    }

    if (roleToSet === 'institution') setActiveView('institution');
    else if (roleToSet === 'mentor') setActiveView('mentor');
    else if (roleToSet === 'admin') setActiveView('admin');
    else setActiveView('home');

    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        role,
        setRole,
        language,
        setLanguage,
        activeView,
        setActiveView,
        profile,
        setProfile,
        targetRole,
        setTargetRoleId,
        pathway,
        scoringWeights,
        setScoringWeights,
        updateUserSkill,
        markPathwayItemComplete,
        applyOpportunity,
        switchDemoPersona,
        activePersonaKey,
        t,
        theme,
        toggleTheme,
        setTheme,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isAssessmentOpen,
        setIsAssessmentOpen,
        assessmentInitialTab,
        openAssessmentModal,
        isDigiLockerModalOpen,
        setIsDigiLockerModalOpen,
        assessmentHistory,
        addAssessmentRecord,
        digilockerCertificates,
        importDigiLockerCertificate,
        mentorFeedbacks,
        addMentorFeedback,
        institutionalBatches,
        addInstitutionalBatch,
        resetAppState,
        lastStorageSync,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
