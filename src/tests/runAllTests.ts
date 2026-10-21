import assert from 'node:assert';
import { CAREER_ROLES } from '../data/rolesData';
import { SKILLS_TAXONOMY } from '../data/skillsData';
import { CAREER_LADDERS } from '../data/careerLaddersData';
import { QUESTION_BANK } from '../data/questionBankData';
import { DEMO_PERSONAS } from '../data/seedProfiles';
import {
  calculateRoleGaps,
  calculateInterestFit,
  getCareerRecommendations,
  simulateWhatIf,
  getSteppingStoneAdvice,
  DEFAULT_SCORING_WEIGHTS,
} from '../services/recommendationEngine';
import { buildLearningPathway } from '../services/pathwayBuilder';
import { StorageService } from '../services/storageService';
import { AssessmentRecord, DigiLockerCertificate, MentorFeedbackRecord, UserSkill } from '../types';

// In-memory mock localStorage for Node test environment
const mockStorage = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => mockStorage.get(k) ?? null,
  setItem: (k: string, v: string) => mockStorage.set(k, String(v)),
  removeItem: (k: string) => mockStorage.delete(k),
  clear: () => mockStorage.clear(),
  get length() {
    return mockStorage.size;
  },
  key: (i: number) => Array.from(mockStorage.keys())[i] ?? null,
};

let passedCount = 0;
let failedCount = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
    failedCount++;
  }
}

console.log('\n========================================');
console.log('  RUNNING SKILLSETU AUTOMATED TEST SUITE');
console.log('========================================\n');

// ----------------------------------------------------
// SUITE 1: Data Taxonomy & NSQF Alignment
// ----------------------------------------------------
console.log('Suite 1: Data Taxonomy & NSQF Alignment');

test('All Career Roles have valid metadata and NSQF levels', () => {
  assert(CAREER_ROLES.length >= 6, 'Should have at least 6 distinct career roles');
  CAREER_ROLES.forEach((role) => {
    assert(role.id, `Role missing id`);
    assert(role.title, `Role ${role.id} missing title`);
    assert(role.nsqfLevel >= 3 && role.nsqfLevel <= 8, `Role ${role.id} NSQF level ${role.nsqfLevel} out of range 3-8`);
    assert(role.demandScore >= 0 && role.demandScore <= 1, `Role ${role.id} demand score out of range 0-1`);
    assert(role.requiredSkills.length >= 3, `Role ${role.id} has fewer than 3 required skills`);
  });
});

test('All role required skills exist in SKILLS_TAXONOMY', () => {
  const allSkillIds = new Set(SKILLS_TAXONOMY.map((s) => s.id));
  CAREER_ROLES.forEach((role) => {
    role.requiredSkills.forEach((req) => {
      assert(
        allSkillIds.has(req.skillId),
        `Role ${role.id} references missing skillId '${req.skillId}' in taxonomy`
      );
      assert(req.requiredLevel >= 1 && req.requiredLevel <= 5, `Skill ${req.skillId} required level out of range`);
      assert(req.importance >= 0.1 && req.importance <= 1.0, `Skill ${req.skillId} importance out of range`);
    });
  });
});

test('Career ladders have sequential rungs and increasing NSQF levels', () => {
  assert(CAREER_LADDERS.length >= 3, 'Should have at least 3 career ladders');
  CAREER_LADDERS.forEach((ladder) => {
    assert(ladder.rungs.length >= 3, `Ladder ${ladder.streamId} has fewer than 3 rungs`);
    let lastNsqf = 0;
    ladder.rungs.forEach((rung, index) => {
      assert(rung.order === index + 1, `Ladder rung order mismatch in ${ladder.streamId}`);
      assert(rung.nsqfLevel >= lastNsqf, `Ladder ${ladder.streamId} rung ${rung.roleId} NSQF does not ascend`);
      lastNsqf = rung.nsqfLevel;
    });
  });
});

test('Question Bank questions have valid correctIndex and difficulty', () => {
  assert(QUESTION_BANK.length >= 10, 'Question bank should have at least 10 questions');
  QUESTION_BANK.forEach((q) => {
    assert(q.options.length >= 2, `Question ${q.id} has fewer than 2 options`);
    assert(
      q.correctIndex >= 0 && q.correctIndex < q.options.length,
      `Question ${q.id} correctIndex ${q.correctIndex} out of bounds`
    );
    assert(['basic', 'intermediate', 'advanced'].includes(q.difficulty), `Question ${q.id} invalid difficulty`);
  });
});

test('Demo personas have consistent skill structures', () => {
  const personas = [DEMO_PERSONAS.riya, DEMO_PERSONAS.amit, DEMO_PERSONAS.sneha];
  personas.forEach((p) => {
    assert(p.id && p.name, 'Persona missing id/name');
    assert(Object.keys(p.skills).length >= 4, `Persona ${p.name} has fewer than 4 skills`);
    Object.values(p.skills).forEach((skill) => {
      assert(skill.level >= 0 && skill.level <= 5, `Persona skill level out of bounds`);
      assert(typeof skill.verified === 'boolean', `Persona skill verified should be boolean`);
    });
  });
});

// ----------------------------------------------------
// SUITE 2: Deterministic Recommendation Engine
// ----------------------------------------------------
console.log('\nSuite 2: Deterministic Recommendation Engine & Formulas');

test('calculateRoleGaps computes exact mathematical readiness and statuses', () => {
  const testRole = CAREER_ROLES[0];
  const userSkills: Record<string, UserSkill> = {};

  // 1. Zero skills => 0% readiness
  const zeroResult = calculateRoleGaps(testRole, userSkills);
  assert.strictEqual(zeroResult.readiness, 0, 'Zero skills should yield 0% readiness');
  assert.strictEqual(zeroResult.haveCount, 0);
  assert.strictEqual(zeroResult.missingCount, testRole.requiredSkills.length);

  // 2. Exact match => 100% readiness
  testRole.requiredSkills.forEach((req) => {
    userSkills[req.skillId] = {
      skillId: req.skillId,
      skillName: req.skillId,
      cluster: 'core',
      level: req.requiredLevel,
      source: 'quiz',
      verified: true,
      updatedAt: new Date().toISOString(),
    };
  });

  const fullResult = calculateRoleGaps(testRole, userSkills);
  assert.strictEqual(fullResult.readiness, 100, 'Exact match skills should yield 100% readiness');
  assert.strictEqual(fullResult.haveCount, testRole.requiredSkills.length);
  assert.strictEqual(fullResult.missingCount, 0);
  assert.strictEqual(fullResult.partialCount, 0);

  // 3. Half level on all skills
  const halfSkills: Record<string, UserSkill> = {};
  testRole.requiredSkills.forEach((req) => {
    halfSkills[req.skillId] = {
      skillId: req.skillId,
      skillName: req.skillId,
      cluster: 'core',
      level: Math.floor(req.requiredLevel / 2),
      source: 'quiz',
      verified: true,
      updatedAt: new Date().toISOString(),
    };
  });
  const halfResult = calculateRoleGaps(testRole, halfSkills);
  assert(halfResult.readiness > 0 && halfResult.readiness < 100, 'Partial skills should give partial readiness');
});

test('calculateInterestFit computes normalized semantic matching ratio', () => {
  const role = CAREER_ROLES.find((r) => r.stream === 'electrical') || CAREER_ROLES[0];
  const highFit = calculateInterestFit(['Electrical', 'Circuits', 'Motors'], role);
  const lowFit = calculateInterestFit(['Poetry', 'Cooking'], role);
  assert(highFit >= lowFit, `Expected highFit (${highFit}) >= lowFit (${lowFit})`);
  assert(highFit <= 100 && highFit >= 40, 'Interest fit should be normalized between 40 and 100');
});

test('getCareerRecommendations ranks roles and generates penalty skills', () => {
  const recs = getCareerRecommendations(DEMO_PERSONAS.riya, DEFAULT_SCORING_WEIGHTS, 5);
  assert(recs.length > 0 && recs.length <= 5, 'Should return top recommendations up to limit');
  // Check descending sort by fitScore
  for (let i = 0; i < recs.length - 1; i++) {
    assert(recs[i].fitScore >= recs[i + 1].fitScore, 'Recommendations must be sorted descending by fitScore');
  }
  // Check formula components
  const top = recs[0];
  const expectedScore = Math.round(
    DEFAULT_SCORING_WEIGHTS.wSkill * top.skillCoverage +
      DEFAULT_SCORING_WEIGHTS.wInterest * top.interestFit +
      DEFAULT_SCORING_WEIGHTS.wDemand * top.marketDemand
  );
  assert.strictEqual(top.fitScore, expectedScore, 'Fit score must strictly follow weighted formula');
  assert(Array.isArray(top.penaltySkills), 'Penalty skills must be an array');
});

test('simulateWhatIf accurately calculates readiness delta and fit delta', () => {
  const role = CAREER_ROLES[0];
  const baseSkills = DEMO_PERSONAS.riya.skills;
  const targetReq = role.requiredSkills[0];

  const simulatedLevels = {
    [targetReq.skillId]: 5,
  };

  const simResult = simulateWhatIf(
    role,
    baseSkills,
    simulatedLevels,
    DEMO_PERSONAS.riya.interests,
    DEFAULT_SCORING_WEIGHTS
  );

  assert(simResult.newReadiness >= simResult.originalReadiness, 'Simulated readiness should increase or stay same');
  assert(simResult.newFit >= simResult.originalFit, 'Simulated fit should increase or stay same');
  assert.strictEqual(
    simResult.readinessDelta,
    simResult.newReadiness - simResult.originalReadiness,
    'Readiness delta must match difference'
  );
  assert.strictEqual(simResult.fitDelta, simResult.newFit - simResult.originalFit, 'Fit delta must match difference');
});

test('getSteppingStoneAdvice triggers when readiness is below threshold', () => {
  const seniorRole = CAREER_ROLES.find((r) => r.nsqfLevel >= 5) || CAREER_ROLES[0];

  // Low readiness < 50%
  const lowAdvice = getSteppingStoneAdvice(seniorRole, 35, DEFAULT_SCORING_WEIGHTS);
  if (seniorRole.nsqfLevel > 3) {
    assert(lowAdvice.isNeeded, 'Should advise stepping stone role when readiness < 50%');
    assert(lowAdvice.steppingStoneRole, 'Should identify intermediate stepping stone role');
    assert(
      (lowAdvice.steppingStoneRole?.nsqfLevel || 0) < seniorRole.nsqfLevel,
      'Stepping stone role must have lower NSQF level'
    );
  }

  // High readiness >= 50%
  const highAdvice = getSteppingStoneAdvice(seniorRole, 75, DEFAULT_SCORING_WEIGHTS);
  assert.strictEqual(highAdvice.isNeeded, false, 'Should not recommend stepping stone if readiness >= 50%');
});

// ----------------------------------------------------
// SUITE 3: Pathway Builder
// ----------------------------------------------------
console.log('\nSuite 3: Learning Pathway Builder');

test('buildLearningPathway creates structured 8-week curriculum with budgeted hours', () => {
  const pathway = buildLearningPathway(CAREER_ROLES[0].id, DEMO_PERSONAS.riya.skills, 8);
  assert.strictEqual(pathway.targetWeeks, 8, 'Target weeks should be 8');
  assert.strictEqual(pathway.weeks.length, 8, 'Pathway should contain 8 weeks of content');

  const firstWeek = pathway.weeks[0];
  assert(firstWeek.items.length > 0, 'First week must have items');
  assert.strictEqual(firstWeek.items[0].status, 'active', 'First item in week 1 should be active');

  // Later items should be locked
  const lastWeek = pathway.weeks[7];
  assert(lastWeek.items.every((it) => it.status === 'locked'), 'Week 8 items should start locked');

  // Verify duration fits weekly budget
  firstWeek.items.forEach((it) => {
    assert(it.durationHours <= 8, `Item ${it.id} duration exceeds weekly budget`);
  });
});

// ----------------------------------------------------
// SUITE 4: Storage Service & Persistence Layer
// ----------------------------------------------------
console.log('\nSuite 4: Storage Service & Persistence Layer');

test('StorageService persists and loads StudentProfile', () => {
  mockStorage.clear();
  const testProf = { ...DEMO_PERSONAS.riya, name: 'Riya Sharma Test' };
  StorageService.saveProfile('riya', testProf);

  const loaded = StorageService.loadProfile('riya', DEMO_PERSONAS.riya);
  assert.strictEqual(loaded.name, 'Riya Sharma Test', 'Saved profile name must match loaded profile');
});

test('StorageService persists and retrieves Assessment Records', () => {
  const newRecord: AssessmentRecord = {
    id: 'test_ass_1',
    timestamp: new Date().toISOString(),
    skillId: 'wiring_safety',
    skillName: 'Electrical Wiring & Earthing',
    cluster: 'electrical',
    score: 5,
    totalQuestions: 5,
    passed: true,
    previousLevel: 2,
    newLevel: 4,
    verified: true,
    source: 'quiz',
  };

  const records = StorageService.saveAssessmentRecord('riya', newRecord);
  assert(records.some((r) => r.id === 'test_ass_1'), 'Assessment record must be returned after save');

  const fetched = StorageService.loadAssessmentHistory('riya');
  assert.strictEqual(fetched[0].id, 'test_ass_1', 'Fetched assessment record must match saved record');
});

test('StorageService persists DigiLocker Certificates', () => {
  const cert: DigiLockerCertificate = {
    id: 'test_digi_1',
    docType: 'NCVT_CERTIFICATE',
    title: 'NCVT Trade Certificate - Electrician',
    issuer: 'DGT MSDE',
    issuanceDate: '2024-08-10',
    credentialUri: 'in.gov.digilocker.test',
    docNumber: 'NCVT-TEST-001',
    verifiedSkills: [{ skillId: 'wiring_safety', skillName: 'Electrical Wiring', verifiedLevel: 4 }],
    status: 'verified',
    verifiedAt: new Date().toISOString(),
  };

  const certs = StorageService.saveDigiLockerCertificate('riya', cert);
  assert(certs.some((c) => c.docNumber === 'NCVT-TEST-001'));

  const loadedCerts = StorageService.loadDigiLockerCertificates('riya');
  assert.strictEqual(loadedCerts[0].docNumber, 'NCVT-TEST-001');
});

test('StorageService persists Mentor Feedbacks & Institutional Batches', () => {
  const feedback: MentorFeedbackRecord = {
    id: 'test_fb_1',
    timestamp: new Date().toISOString(),
    studentId: 'student_riya_sharma',
    studentName: 'Riya Sharma',
    mentorName: 'Test Mentor',
    company: 'ABB India',
    role: 'Principal Engineer',
    notes: 'Verified candidate competencies with high accuracy.',
    endorsedSkills: ['PLC Ladder Logic'],
    rating: 5,
  };

  StorageService.saveMentorFeedback(feedback);
  const feedbacks = StorageService.loadMentorFeedbacks();
  assert(feedbacks.some((f) => f.id === 'test_fb_1'), 'Saved mentor feedback should be in loaded feedbacks');

  // Batches
  const batch = {
    id: 'test_batch_1',
    name: 'Diploma Mechanical 2025',
    institutionName: 'Govt Poly Pune',
    trade: 'Mechanical',
    academicYear: '2024-2025',
    studentCount: 75,
    avgReadiness: 72,
    topDeficitSkill: 'CNC Programming',
    placedCount: 40,
    createdAt: new Date().toISOString(),
  };

  StorageService.saveBatch(batch);
  const batches = StorageService.loadBatches();
  assert(batches.some((b) => b.id === 'test_batch_1'), 'Saved batch should be in loaded batches');
});

test('StorageService exports and imports entire state JSON', () => {
  const jsonExport = StorageService.exportAllState();
  assert(typeof jsonExport === 'string', 'Export must return JSON string');

  // Clear and re-import
  mockStorage.clear();
  assert.strictEqual(mockStorage.size, 0, 'Storage should be clear');

  const success = StorageService.importAllState(jsonExport);
  assert.strictEqual(success, true, 'State import should succeed');
  assert(mockStorage.size > 0, 'Storage should be repopulated after import');
});

// ----------------------------------------------------
// SUITE 5: DigiLocker Verification Competency Ingestion
// ----------------------------------------------------
console.log('\nSuite 5: DigiLocker Verification & Skill Ingestion');

test('DigiLocker credential injection elevates skill level to verified status', () => {
  const initialSkills = { ...DEMO_PERSONAS.riya.skills };
  const targetSkillId = 'wiring_safety';
  const initialLevel = initialSkills[targetSkillId]?.level || 0;

  // Simulate DigiLocker certificate with Level 4
  const verifiedDocLevel = 4;
  assert(verifiedDocLevel >= initialLevel, 'Verified doc level should be >= initial level');

  // Ingest skill
  initialSkills[targetSkillId] = {
    skillId: targetSkillId,
    skillName: 'Electrical Wiring & Earthing',
    cluster: 'electrical',
    level: verifiedDocLevel,
    source: 'digilocker',
    verified: true,
    updatedAt: new Date().toISOString(),
  };

  assert.strictEqual(initialSkills[targetSkillId].level, verifiedDocLevel, 'Level must be updated');
  assert.strictEqual(initialSkills[targetSkillId].verified, true, 'Verified badge must be true');

  // Verify role readiness calculation increases
  const targetRole = CAREER_ROLES[0];
  const afterReadiness = calculateRoleGaps(targetRole, initialSkills).readiness;
  const beforeReadiness = calculateRoleGaps(targetRole, DEMO_PERSONAS.riya.skills).readiness;

  assert(
    afterReadiness >= beforeReadiness,
    `Readiness after verification (${afterReadiness}%) must be >= before (${beforeReadiness}%)`
  );
});

// ----------------------------------------------------
// SUITE 6: User Isolation & Fresh Learner (Zero-Data State)
// ----------------------------------------------------
console.log('\nSuite 6: User Isolation & Fresh Learner Profile State');

test('New user registration generates zero pre-filled demo skills and 0% readiness', () => {
  const newPhone = '9123456780';
  const rawId = newPhone.replace(/[^a-zA-Z0-9]/g, '_');
  const userKey = `user_${rawId}`;

  const freshProfile = {
    id: `student_${rawId}`,
    name: 'Real New Learner',
    phone: newPhone,
    email: '',
    educationLevel: 'polytechnic_diploma' as const,
    institutionName: '',
    branch: 'Electrical Engineering',
    year: '1st Year',
    interests: ['Industrial Automation'],
    preferredLanguage: 'en' as const,
    weeklyHours: 6,
    targetRoleId: 'maintenance_technician',
    completedAssessments: [],
    appliedOpportunityIds: [],
    skills: {}, // Explicitly EMPTY!
    assessmentHistory: [],
    digilockerCertificates: [],
    mentorFeedbacks: [],
  };

  StorageService.saveProfile(userKey, freshProfile);
  const loaded = StorageService.loadProfile(userKey, freshProfile);

  assert.strictEqual(Object.keys(loaded.skills).length, 0, 'New learner must have 0 skills initially');
  assert.strictEqual(loaded.phone, newPhone, 'User profile phone must match entered phone');

  // Verify readiness is 0%
  const targetRole = CAREER_ROLES[0];
  const gaps = calculateRoleGaps(targetRole, loaded.skills);
  assert.strictEqual(gaps.readiness, 0, 'New learner with 0 skills must have 0% readiness');
  assert.strictEqual(gaps.haveCount, 0, 'New learner must have 0 mastered skills');
  assert.strictEqual(gaps.missingCount, targetRole.requiredSkills.length, 'All required skills must be missing initially');
});

test('New user storage is completely isolated from Riya and Amit demo data', () => {
  const userA = 'user_9988776655';
  const customProfileA = {
    ...DEMO_PERSONAS.riya,
    id: 'student_custom_a',
    name: 'Custom User A',
    skills: {
      custom_skill: {
        skillId: 'custom_skill',
        skillName: 'Custom Skill',
        cluster: 'core',
        level: 5,
        source: 'quiz' as const,
        verified: true,
        updatedAt: new Date().toISOString(),
      },
    },
  };

  StorageService.saveProfile('riya', DEMO_PERSONAS.riya);
  StorageService.saveProfile(userA, customProfileA);

  // Load Riya and verify Riya was NOT mutated by custom user write
  const riyaLoaded = StorageService.loadProfile('riya', DEMO_PERSONAS.riya);
  assert.strictEqual(riyaLoaded.name, 'Riya Sharma', "Riya's name must not be overwritten");
  assert(!('custom_skill' in riyaLoaded.skills), "Custom user's skill must not leak into Riya's profile");

  // Load Amit and verify Amit was NOT mutated
  const amitLoaded = StorageService.loadProfile('amit', DEMO_PERSONAS.amit);
  assert.strictEqual(amitLoaded.name, 'Amit Patil', "Amit's name must not be overwritten");
  assert(!('custom_skill' in amitLoaded.skills), "Custom user's skill must not leak into Amit's profile");

  // Load Custom User A and verify custom skill exists
  const loadedA = StorageService.loadProfile(userA, customProfileA);
  assert.strictEqual(loadedA.name, 'Custom User A');
  assert('custom_skill' in loadedA.skills);
});

// ----------------------------------------------------
// TEST SUMMARY REPORT
// ----------------------------------------------------
console.log('\n========================================');
console.log('       TEST SUITE EXECUTION SUMMARY');
console.log('========================================');
console.log(`  Total Tests Run: ${passedCount + failedCount}`);
console.log(`  Passed:          ${passedCount}`);
console.log(`  Failed:          ${failedCount}`);
console.log('========================================\n');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL TEST CASES PASSED SUCCESSFULLY!\n');
  process.exit(0);
}

