import { COURSES_CATALOG } from '../data/coursesData';
import { CAREER_ROLES } from '../data/rolesData';
import {
  CareerRole,
  LearningPathway,
  PathwayItem,
  PathwayWeek,
  SkillGapItem,
  UserSkill,
} from '../types';
import { calculateRoleGaps } from './recommendationEngine';

/**
 * Builds an 8-week structured, dated learning pathway based on the student's gaps,
 * weekly hours (e.g. 6 hrs/wk), and prerequisite order (Stage D in blueprint).
 */
export function buildLearningPathway(
  roleId: string,
  userSkills: Record<string, UserSkill>,
  weeklyHours: number = 6
): LearningPathway {
  const role = CAREER_ROLES.find((r) => r.id === roleId) || CAREER_ROLES[0];
  const { readiness, gaps } = calculateRoleGaps(role, userSkills);

  // Filter gap skills that need improvement
  const skillsNeedingWork = gaps.filter((g) => g.status !== 'have');

  const weeks: PathwayWeek[] = [];
  let itemCounter = 1;

  // Week 1 - 2: High priority foundational gap
  const topGap1 = skillsNeedingWork[0] || gaps[0];
  const course1 = COURSES_CATALOG.find((c) => c.skillId === topGap1?.skillId) || COURSES_CATALOG[0];

  weeks.push({
    weekNumber: 1,
    theme: `Core Fundamentals: ${topGap1?.skillName || 'Skill Setup'}`,
    items: [
      {
        id: `p_item_${itemCounter++}`,
        title: course1.title,
        provider: course1.provider,
        url: course1.url,
        durationHours: Math.min(weeklyHours, 6),
        skillId: topGap1?.skillId || 'elec_safety',
        skillName: topGap1?.skillName || 'Safety Standards',
        levelTarget: Math.min(5, (topGap1?.currentLevel || 0) + 1),
        status: 'active',
        type: 'course',
      },
    ],
  });

  weeks.push({
    weekNumber: 2,
    theme: `Applied Practice & First Checkpoint`,
    items: [
      {
        id: `p_item_${itemCounter++}`,
        title: `Practical Workshop & Lab Exercises: ${topGap1?.skillName || 'Practical Skills'}`,
        provider: 'Skill India',
        url: 'https://www.skillindiadigital.gov.in/',
        durationHours: 4,
        skillId: topGap1?.skillId || 'elec_safety',
        skillName: topGap1?.skillName || 'Safety Standards',
        levelTarget: Math.min(5, (topGap1?.currentLevel || 0) + 2),
        status: 'locked',
        type: 'course',
      },
      {
        id: `p_item_${itemCounter++}`,
        title: `Bi-Weekly Checkpoint: Mini-Quiz on ${topGap1?.skillName || 'Core Skills'}`,
        provider: 'Mini-Quiz',
        durationHours: 1,
        skillId: topGap1?.skillId || 'elec_safety',
        skillName: topGap1?.skillName || 'Safety Standards',
        levelTarget: (topGap1?.currentLevel || 0) + 1,
        status: 'locked',
        type: 'quiz',
      },
    ],
  });

  // Week 3 - 4: Second high priority bridge skill
  const topGap2 = skillsNeedingWork[1] || gaps[1] || gaps[0];
  const course2 = COURSES_CATALOG.find((c) => c.skillId === topGap2?.skillId) || COURSES_CATALOG[1];

  weeks.push({
    weekNumber: 3,
    theme: `Bridge Skill: ${topGap2?.skillName || 'Advanced Practice'}`,
    items: [
      {
        id: `p_item_${itemCounter++}`,
        title: course2.title,
        provider: course2.provider,
        url: course2.url,
        durationHours: Math.min(weeklyHours, 6),
        skillId: topGap2?.skillId || 'fault_finding',
        skillName: topGap2?.skillName || 'Diagnostics',
        levelTarget: Math.min(5, (topGap2?.currentLevel || 0) + 1),
        status: 'locked',
        type: 'course',
      },
    ],
  });

  weeks.push({
    weekNumber: 4,
    theme: `Midway Practical Simulation & Assessment`,
    items: [
      {
        id: `p_item_${itemCounter++}`,
        title: `Hands-On Lab Simulation: ${role.stream === 'electrical' ? 'Panel Wiring & Circuit Troubleshooting' : role.stream === 'it_data' ? 'SQL Database Design & Queries' : 'CAD Assembly & Part Machining'}`,
        provider: 'Project',
        durationHours: 5,
        skillId: topGap2?.skillId || 'fault_finding',
        skillName: topGap2?.skillName || 'Diagnostics',
        levelTarget: Math.min(5, (topGap2?.currentLevel || 0) + 2),
        status: 'locked',
        type: 'project',
      },
      {
        id: `p_item_${itemCounter++}`,
        title: `Milestone Mini-Quiz: Diagnostic & Execution Skills`,
        provider: 'Mini-Quiz',
        durationHours: 1,
        skillId: topGap2?.skillId || 'fault_finding',
        skillName: topGap2?.skillName || 'Diagnostics',
        levelTarget: (topGap2?.currentLevel || 0) + 2,
        status: 'locked',
        type: 'quiz',
      },
    ],
  });

  // Week 5 - 6: Automation / Specialized Tools
  const topGap3 = skillsNeedingWork[2] || gaps[2] || gaps[0];
  const course3 = COURSES_CATALOG.find((c) => c.skillId === topGap3?.skillId) || COURSES_CATALOG[2];

  weeks.push({
    weekNumber: 5,
    theme: `Advanced Tooling: ${topGap3?.skillName || 'Specialized Module'}`,
    items: [
      {
        id: `p_item_${itemCounter++}`,
        title: course3.title,
        provider: course3.provider,
        url: course3.url,
        durationHours: Math.min(weeklyHours, 6),
        skillId: topGap3?.skillId || 'plc_scada',
        skillName: topGap3?.skillName || 'Specialized Tool',
        levelTarget: Math.min(5, (topGap3?.currentLevel || 0) + 2),
        status: 'locked',
        type: 'course',
      },
    ],
  });

  weeks.push({
    weekNumber: 6,
    theme: `System Integration & Diagnostics Check`,
    items: [
      {
        id: `p_item_${itemCounter++}`,
        title: `Industry Standard Protocols & Compliance Review`,
        provider: 'SWAYAM',
        url: 'https://swayam.gov.in/',
        durationHours: 4,
        skillId: topGap3?.skillId || 'plc_scada',
        skillName: topGap3?.skillName || 'Specialized Tool',
        levelTarget: 4,
        status: 'locked',
        type: 'course',
      },
      {
        id: `p_item_${itemCounter++}`,
        title: `Week 6 Mini-Quiz: Advanced System Verification`,
        provider: 'Mini-Quiz',
        durationHours: 1,
        skillId: topGap3?.skillId || 'plc_scada',
        skillName: topGap3?.skillName || 'Specialized Tool',
        levelTarget: 3,
        status: 'locked',
        type: 'quiz',
      },
    ],
  });

  // Week 7 - 8: Capstone Portfolio Project & Placement Mock
  weeks.push({
    weekNumber: 7,
    theme: `Capstone Portfolio Project`,
    items: [
      {
        id: `p_item_${itemCounter++}`,
        title: `Industry Capstone: ${role.stream === 'electrical' ? 'Automated Plant Feeder & Motor Starter Design' : role.stream === 'it_data' ? 'End-to-End Sales BI Dashboard & SQL Pipeline' : 'Complete CNC Component Tooling & GD&T Inspection Report'}`,
        provider: 'Project',
        durationHours: 6,
        skillId: topGap1?.skillId || 'elec_safety',
        skillName: 'Capstone Project',
        levelTarget: 4,
        status: 'locked',
        type: 'project',
      },
    ],
  });

  weeks.push({
    weekNumber: 8,
    theme: `Placement Readiness, Mock Interview & Final Re-assessment`,
    items: [
      {
        id: `p_item_${itemCounter++}`,
        title: `Workplace Communication & Technical Interview Preparation`,
        provider: 'Skill India',
        url: 'https://www.skillindiadigital.gov.in/',
        durationHours: 3,
        skillId: 'workplace_comm',
        skillName: 'Workplace Communication',
        levelTarget: 4,
        status: 'locked',
        type: 'course',
      },
      {
        id: `p_item_${itemCounter++}`,
        title: `Final Verification Assessment & NSQF Readiness Certification`,
        provider: 'Mini-Quiz',
        durationHours: 2,
        skillId: topGap1?.skillId || 'elec_safety',
        skillName: 'Final Exit Re-Assessment',
        levelTarget: 5,
        status: 'locked',
        type: 'quiz',
      },
    ],
  });

  // Count total items
  const allItems = weeks.flatMap((w) => w.items);
  const completed = allItems.filter((i) => i.status === 'done').length;

  return {
    id: `pathway_${roleId}_${Date.now()}`,
    roleId,
    roleTitle: role.title,
    hoursPerWeek: weeklyHours,
    targetWeeks: 8,
    weeks,
    readinessBefore: readiness,
    readinessCurrent: readiness,
    completedItemCount: completed,
    totalItemCount: allItems.length,
  };
}
