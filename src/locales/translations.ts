import { Language } from '../types';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Topbar
    appName: 'SkillSetu',
    tagline: 'Skills to Careers',
    subTagline: 'NSQF Career Roadmap',
    demoPersonas: 'Profiles',
    switchRole: 'Role',
    roleStudent: 'Student',
    roleInstitution: 'College TPO',
    roleMentor: 'Recruiter',
    roleAdmin: 'Settings',

    // Navigation (Short, 1-line, minimalist)
    navHome: 'Home',
    navLadder: 'Ladder',
    navMatches: 'Careers',
    navGapReport: 'Gaps',
    navPathway: 'Roadmap',
    navOpportunities: 'Jobs',
    navChat: '🤖 AI Mentor',


    // Student Dashboard
    greetingNamaste: 'Hello',
    targetRoleLabel: 'Target Role',
    readinessScoreLabel: 'Readiness',
    nextStepTitle: 'Next Step',
    continueWeek: 'Continue',
    viewSkillProfile: 'Skills',
    viewCareerMatches: 'View Careers',
    changeTargetRole: 'Change',

    // Career Ladder
    careerLadderTitle: 'Career Ladder',
    careerLadderSub: 'Steps from ITI & Diploma to Lead Engineer',
    youAreHere: 'You Are Here',
    nextRung: 'Next Step',
    bridgeSkillsNeeded: 'Skills Needed',
    timeToReach: 'Est. Time',
    openGapAndPlan: 'View Plan',

    // Explain & Challenge
    whyNotTitle: 'Why Not This Role?',
    fitBreakdown: 'Score Breakdown',
    skillCoverageWeight: 'Skills (60%)',
    interestWeight: 'Interests (25%)',
    demandWeight: 'Demand (15%)',
    skillsLoweringScore: 'Skills to Improve',
    whatIfTitle: 'What If I Learn This?',
    whatIfSub: 'Move sliders to see your score update instantly',
    recalculatedReadiness: 'New Readiness',
    recalculatedFit: 'New Fit',
    challengeResult: 'Report Match',
    reportWrongMatch: 'Report Wrong Match',

    // Assessment
    takeSkillQuiz: 'Take Quiz',
    startQuiz: 'Start Quiz',
    selfRating: 'Rate Skills',
    resumeUpload: 'Upload Resume',
    verifiedBadge: 'Verified',
    unverifiedBadge: 'Self-Rated',
    resumeExtractedBadge: 'From Resume',

    // Pathway
    weeklyRoadmapTitle: '8-Week Roadmap',
    budgetHoursPerWeek: 'hours / week',
    markDone: 'Complete',
    itemDone: 'Done',
    itemLocked: 'Locked',
    itemActive: 'Active',

    // Microcopy
    emptyPathway: 'Pick a career to see your learning plan.',
    lowConfidenceMatch: 'Take a quick quiz to improve accuracy.',
    completedWeek: 'Week done! Readiness increased.',
    steppingStoneBadge: 'Recommended First Step',
  },
  hi: {
    // Brand & Topbar
    appName: 'स्किलसेतु',
    tagline: 'कौशल से करियर',
    subTagline: 'NSQF करियर रोडमैप',
    demoPersonas: 'प्रोफाइल',
    switchRole: 'भूमिका',
    roleStudent: 'विद्यार्थी',
    roleInstitution: 'कॉलेज TPO',
    roleMentor: 'उद्योग',
    roleAdmin: 'सेटिंग्स',

    // Navigation (Short, 1-line, minimalist)
    navHome: 'होम',
    navLadder: 'सीढ़ी',
    navMatches: 'करियर',
    navGapReport: 'स्किल गैप',
    navPathway: 'रोडमैप',
    navOpportunities: 'नौकरियां',
    navChat: '🤖 एआई मेंटर',


    // Student Dashboard
    greetingNamaste: 'नमस्ते',
    targetRoleLabel: 'लक्षित पद',
    readinessScoreLabel: 'तत्परता',
    nextStepTitle: 'अगला कदम',
    continueWeek: 'जारी रखें',
    viewSkillProfile: 'कौशल देखें',
    viewCareerMatches: 'करियर देखें',
    changeTargetRole: 'बदलें',

    // Career Ladder
    careerLadderTitle: 'करियर सीढ़ी',
    careerLadderSub: 'आईटीआई एवं डिप्लोमा से लीड इंजीनियर तक',
    youAreHere: 'आप यहाँ हैं',
    nextRung: 'अगला पायदान',
    bridgeSkillsNeeded: 'आवश्यक कौशल',
    timeToReach: 'समय',
    openGapAndPlan: 'प्लान देखें',

    // Explain & Challenge
    whyNotTitle: 'स्कोर क्यों कम है?',
    fitBreakdown: 'स्कोर विवरण',
    skillCoverageWeight: 'कौशल (60%)',
    interestWeight: 'रुचि (25%)',
    demandWeight: 'मांग (15%)',
    skillsLoweringScore: 'सुधार योग्य कौशल',
    whatIfTitle: 'अगर मैं यह सीखूँ तो?',
    whatIfSub: 'स्लाइडर हिलाकर अपना नया स्कोर देखें',
    recalculatedReadiness: 'नई तत्परता',
    recalculatedFit: 'नया स्कोर',
    challengeResult: 'रिपोर्ट करें',
    reportWrongMatch: 'गलत मैच रिपोर्ट करें',

    // Assessment
    takeSkillQuiz: 'क्विज दें',
    startQuiz: 'शुरू करें',
    selfRating: 'रेटिंग दें',
    resumeUpload: 'बायोडाटा',
    verifiedBadge: 'प्रमाणित',
    unverifiedBadge: 'स्व-घोषित',
    resumeExtractedBadge: 'रिज्यूमे से',

    // Pathway
    weeklyRoadmapTitle: '8-सप्ताह रोडमैप',
    budgetHoursPerWeek: 'घंटे / सप्ताह',
    markDone: 'पूर्ण',
    itemDone: 'पूर्ण',
    itemLocked: 'लॉक',
    itemActive: 'सक्रिय',

    // Microcopy
    emptyPathway: 'करियर चुनकर अपना प्लान देखें।',
    lowConfidenceMatch: 'सटीकता के लिए 10 मिनट क्विज दें।',
    completedWeek: 'बधाई! आपकी तत्परता बढ़ गई है।',
    steppingStoneBadge: 'पहला कदम अनुशंसित',
  },
  mr: {
    // Brand & Topbar
    appName: 'कौशलसेतू',
    tagline: 'कौशल्याकडून करिअरकडे',
    subTagline: 'NSQF करिअर रोडमॅप',
    demoPersonas: 'प्रोफाईल',
    switchRole: 'भूमिका',
    roleStudent: 'विद्यार्थी',
    roleInstitution: 'कॉलेज TPO',
    roleMentor: 'उद्योग',
    roleAdmin: 'सेटिंग्ज',

    // Navigation (Short, 1-line, minimalist)
    navHome: 'होम',
    navLadder: 'शिडी',
    navMatches: 'करिअर',
    navGapReport: 'तफावत',
    navPathway: 'रोडमॅप',
    navOpportunities: 'नोकरी',
    navChat: '🤖 एआय मेंटॉर',


    // Student Dashboard
    greetingNamaste: 'नमस्कार',
    targetRoleLabel: 'लक्ष्यित पद',
    readinessScoreLabel: 'तयारी',
    nextStepTitle: 'पुढची पायरी',
    continueWeek: 'पुढे जा',
    viewSkillProfile: 'कौशल्ये',
    viewCareerMatches: 'पर्याय पहा',
    changeTargetRole: 'बदला',

    // Career Ladder
    careerLadderTitle: 'करिअर शिडी',
    careerLadderSub: 'आयटीआय/डिप्लोमापासून मुख्य अभियंत्यापर्यंत',
    youAreHere: 'येथे आहात',
    nextRung: 'पुढील पायरी',
    bridgeSkillsNeeded: 'आवश्यक कौशल्ये',
    timeToReach: 'वेळ',
    openGapAndPlan: 'प्लॅन पहा',

    // Explain & Challenge
    whyNotTitle: 'स्कोअर कमी का?',
    fitBreakdown: 'स्कोअर विश्लेषण',
    skillCoverageWeight: 'कौशल्य (६०%)',
    interestWeight: 'आवड (२५%)',
    demandWeight: 'मागणी (१५%)',
    skillsLoweringScore: 'आवश्यक कौशल्ये',
    whatIfTitle: 'मी हे शिकलो तर?',
    whatIfSub: 'स्लायडर हलवून नवीन स्कोअर पहा',
    recalculatedReadiness: 'नवीन तयारी',
    recalculatedFit: 'नवीन स्कोअर',
    challengeResult: 'नोंदवा',
    reportWrongMatch: 'तक्रार नोंदवा',

    // Assessment
    takeSkillQuiz: 'चाचणी द्या',
    startQuiz: 'सुरू करा',
    selfRating: 'रेट करा',
    resumeUpload: 'रेझ्युमे',
    verifiedBadge: 'प्रमाणित',
    unverifiedBadge: 'स्वयं-घोषित',
    resumeExtractedBadge: 'रेझ्युमेमधून',

    // Pathway
    weeklyRoadmapTitle: '८-आठवड्यांचा रोडमॅप',
    budgetHoursPerWeek: 'तास / आठवडा',
    markDone: 'पूर्ण',
    itemDone: 'पूर्ण',
    itemLocked: 'लॉक',
    itemActive: 'सक्रिय',

    // Microcopy
    emptyPathway: 'प्लॅन पाहण्यासाठी करिअर निवडा.',
    lowConfidenceMatch: 'अचूकतेसाठी चाचणी द्या.',
    completedWeek: 'अभिनंदन! तयारी वाढली.',
    steppingStoneBadge: 'पहिली पायरी शिफारसित',
  },
};
