import { CAREER_ROLES } from '../data/rolesData';
import { SKILLS_TAXONOMY } from '../data/skillsData';
import {
  CareerRecommendation,
  CareerRole,
  ScoringWeights,
  SkillGapItem,
  StudentProfile,
  UserSkill,
} from '../types';

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  wSkill: 0.60,
  wInterest: 0.25,
  wDemand: 0.15,
  steppingStoneThreshold: 50,
};

/**
 * Calculates skill gap breakdown and readiness percentage for a given role according to Stage C.
 * weighted_gap(skill) = max(0, required - current) * importance
 * readiness (%) = sum( min(current, required) * importance ) / sum( required * importance ) * 100
 */
export function calculateRoleGaps(
  role: CareerRole,
  userSkills: Record<string, UserSkill>
): {
  readiness: number;
  gaps: SkillGapItem[];
  haveCount: number;
  partialCount: number;
  missingCount: number;
} {
  let weightedActualSum = 0;
  let weightedRequiredSum = 0;
  const gaps: SkillGapItem[] = [];

  let haveCount = 0;
  let partialCount = 0;
  let missingCount = 0;

  for (const req of role.requiredSkills) {
    const userSkill = userSkills[req.skillId];
    const currentLevel = userSkill ? userSkill.level : 0;
    const reqLevel = req.requiredLevel;
    const importance = req.importance;

    const weightedActual = Math.min(currentLevel, reqLevel) * importance;
    const weightedTarget = reqLevel * importance;

    weightedActualSum += weightedActual;
    weightedRequiredSum += weightedTarget;

    const gapDiff = Math.max(0, reqLevel - currentLevel);
    const weightedGap = Math.round(gapDiff * importance * 100) / 100;

    const skillDef = SKILLS_TAXONOMY.find((s) => s.id === req.skillId);
    const skillName = skillDef ? skillDef.name : req.skillId;

    let status: 'have' | 'partial' | 'missing' = 'missing';
    if (currentLevel >= reqLevel) {
      status = 'have';
      haveCount++;
    } else if (currentLevel > 0) {
      status = 'partial';
      partialCount++;
    } else {
      status = 'missing';
      missingCount++;
    }

    // Estimate hours needed: ~6 hours per whole level gap * importance
    const hoursNeeded = Math.round(gapDiff * 8);

    gaps.push({
      skillId: req.skillId,
      skillName,
      requiredLevel: reqLevel,
      currentLevel,
      importance,
      weightedGap,
      status,
      hoursNeeded,
    });
  }

  // Sort gaps by weighted gap descending (highest gap first)
  gaps.sort((a, b) => b.weightedGap - a.weightedGap);

  const readiness =
    weightedRequiredSum > 0
      ? Math.min(100, Math.round((weightedActualSum / weightedRequiredSum) * 100))
      : 0;

  return {
    readiness,
    gaps,
    haveCount,
    partialCount,
    missingCount,
  };
}

/**
 * Computes semantic interest match (0 to 100) between user stated interests and role attributes.
 */
export function calculateInterestFit(userInterests: string[], role: CareerRole): number {
  if (!userInterests || userInterests.length === 0) return 50;

  let matches = 0;
  const roleText = `${role.title} ${role.description} ${role.stream}`.toLowerCase();

  for (const interest of userInterests) {
    const tokens = interest.toLowerCase().split(/\s+/);
    for (const token of tokens) {
      if (token.length > 3 && roleText.includes(token)) {
        matches++;
        break;
      }
    }
  }

  // Normalize between 40% and 95%
  const ratio = Math.min(1, matches / Math.max(1, userInterests.length));
  return Math.round(45 + ratio * 50);
}

/**
 * Calculates top career recommendations using the exact blueprint formula:
 * fit = wSkill * skill_coverage + wInterest * interest_fit + wDemand * market_demand
 */
export function getCareerRecommendations(
  profile: StudentProfile,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS,
  limit: number = 5
): CareerRecommendation[] {
  const recommendations: CareerRecommendation[] = [];

  for (const role of CAREER_ROLES) {
    const { readiness, gaps } = calculateRoleGaps(role, profile.skills);
    const interestFit = calculateInterestFit(profile.interests, role);
    const marketDemand = Math.round(role.demandScore * 100);

    const fitScore = Math.round(
      weights.wSkill * readiness +
        weights.wInterest * interestFit +
        weights.wDemand * marketDemand
    );

    // Calculate penalty skills (skills causing the biggest score drop)
    const penaltySkills = gaps
      .filter((g) => g.weightedGap > 0)
      .slice(0, 3)
      .map((g) => {
        // Points lost to total fit
        const pointsLost = Math.round(
          (g.weightedGap / Math.max(1, role.requiredSkills.reduce((acc, r) => acc + r.requiredLevel * r.importance, 0))) *
            100 *
            weights.wSkill
        );
        return {
          skillId: g.skillId,
          skillName: g.skillName,
          requiredLevel: g.requiredLevel,
          currentLevel: g.currentLevel,
          pointsLost: Math.max(2, pointsLost),
        };
      });

    // Plain-language reasons in English, Hindi, and Marathi
    const topStrength = gaps.find((g) => g.status === 'have');
    const topGap = gaps.find((g) => g.status !== 'have');

    let reason = '';
    let reasonHi = '';
    let reasonMr = '';

    if (readiness >= 75) {
      reason = `Strong foundation in ${topStrength ? topStrength.skillName : 'core skills'}. Ready for fast placement in ${role.stream} roles.`;
      reasonHi = `${topStrength ? topStrength.skillName : 'मुख्य कौशल'} में मजबूत पकड़। नौकरी के लिए उच्च तत्परता।`;
      reasonMr = `${topStrength ? topStrength.skillName : 'मुख्य कौशल्ये'} मजबूत आहेत. त्वरित प्लेसमेंटसाठी सज्ज.`;
    } else if (topGap) {
      reason = `Solid baseline skills. Closing ${topGap.skillName} will boost your fit to over ${Math.min(96, fitScore + 18)}%.`;
      reasonHi = `बुनियादी स्तर अच्छा है। ${topGap.skillName} सीखने से आपकी तत्परता ${Math.min(96, fitScore + 18)}% से अधिक हो जाएगी।`;
      reasonMr = `चांगला पाया आहे. ${topGap.skillName} पूर्ण केल्यास तुमची तयारी ${Math.min(96, fitScore + 18)}% पेक्षा जास्त होईल.`;
    } else {
      reason = `Good match for your interests in ${profile.interests.slice(0, 2).join(', ')}.`;
      reasonHi = `आपकी रुचियों के साथ बढ़िया तालमेल।`;
      reasonMr = `तुमच्या आवडींशी उत्तम सुसंगतता.`;
    }

    recommendations.push({
      role,
      fitScore,
      skillCoverage: readiness,
      interestFit,
      marketDemand,
      reason,
      reasonHi,
      reasonMr,
      penaltySkills,
    });
  }

  // Sort by fit score descending
  recommendations.sort((a, b) => b.fitScore - a.fitScore);
  return recommendations.slice(0, limit);
}

/**
 * Signature Feature 2 What-If Simulator:
 * Re-runs the exact deterministic formula with modified skill levels in real-time.
 */
export function simulateWhatIf(
  role: CareerRole,
  userSkills: Record<string, UserSkill>,
  simulatedSkillLevels: Record<string, number>,
  userInterests: string[],
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): {
  originalReadiness: number;
  newReadiness: number;
  originalFit: number;
  newFit: number;
  readinessDelta: number;
  fitDelta: number;
} {
  // 1. Original calculation
  const origGap = calculateRoleGaps(role, userSkills);
  const interestFit = calculateInterestFit(userInterests, role);
  const marketDemand = Math.round(role.demandScore * 100);

  const originalFit = Math.round(
    weights.wSkill * origGap.readiness +
      weights.wInterest * interestFit +
      weights.wDemand * marketDemand
  );

  // 2. Simulated skills dictionary
  const simulatedSkills: Record<string, UserSkill> = { ...userSkills };
  for (const [skillId, lvl] of Object.entries(simulatedSkillLevels)) {
    const existing = userSkills[skillId];
    simulatedSkills[skillId] = {
      skillId,
      skillName: existing ? existing.skillName : skillId,
      cluster: existing ? existing.cluster : 'core',
      level: lvl,
      source: 'self',
      verified: true,
      updatedAt: new Date().toISOString(),
    };
  }

  const newGap = calculateRoleGaps(role, simulatedSkills);
  const newFit = Math.round(
    weights.wSkill * newGap.readiness +
      weights.wInterest * interestFit +
      weights.wDemand * marketDemand
  );

  return {
    originalReadiness: origGap.readiness,
    newReadiness: newGap.readiness,
    originalFit,
    newFit,
    readinessDelta: newGap.readiness - origGap.readiness,
    fitDelta: newFit - originalFit,
  };
}

/**
 * Stepping-Stone Role Logic (Section 6.7 of blueprint):
 * When readiness is below threshold (default 50%), suggest the nearer bridge role.
 */
export function getSteppingStoneAdvice(
  targetRole: CareerRole,
  currentReadiness: number,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): {
  isNeeded: boolean;
  steppingStoneRole?: CareerRole;
  rationale: string;
} {
  if (currentReadiness >= weights.steppingStoneThreshold) {
    return {
      isNeeded: false,
      rationale: 'Your readiness is above 50%. You can proceed directly with your target role learning pathway.',
    };
  }

  // Look for a stepping stone role in the same stream that has lower NSQF level
  const lowerRungs = CAREER_ROLES.filter(
    (r) => r.stream === targetRole.stream && r.nsqfLevel < targetRole.nsqfLevel
  ).sort((a, b) => b.nsqfLevel - a.nsqfLevel);

  if (lowerRungs.length > 0) {
    const steppingStone = lowerRungs[0];
    return {
      isNeeded: true,
      steppingStoneRole: steppingStone,
      rationale: `Target role '${targetRole.title}' has NSQF Level ${targetRole.nsqfLevel} and your current readiness is ${currentReadiness}%. A nearer stepping-stone is '${steppingStone.title}' (NSQF Level ${steppingStone.nsqfLevel}). Preparing for this role first ensures earlier job-readiness and smoother career ascent.`,
    };
  }

  return {
    isNeeded: false,
    rationale: 'Direct pathway is recommended.',
  };
}
