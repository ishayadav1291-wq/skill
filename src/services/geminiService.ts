import { Language, StudentProfile } from '../types';
import { CAREER_ROLES } from '../data/rolesData';
import { calculateRoleGaps } from './recommendationEngine';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Career Advisor engine tailored for vocational students.
 * Runs instantly in the browser without external network dependencies,
 * avoiding API quota, token, or connection failures.
 */
export async function askAIMentor(
  userQuery: string,
  profile: StudentProfile,
  _chatHistory: ChatMessage[],
  language: Language = 'en'
): Promise<string> {
  const targetRole = CAREER_ROLES.find((r) => r.id === profile.targetRoleId) || CAREER_ROLES[0];
  const { readiness, gaps } = calculateRoleGaps(targetRole, profile.skills);
  const missingSkills = gaps.filter((g) => g.status === 'missing').map((g) => g.skillName).join(', ');
  const partialSkills = gaps.filter((g) => g.status === 'partial').map((g) => g.skillName).join(', ');

  const q = userQuery.toLowerCase().trim();

  // 1. PLC / Automation / Control systems
  if (q.includes('plc') || q.includes('automation') || q.includes('ladder') || q.includes('relay')) {
    if (language === 'hi') {
      return `नमस्ते ${profile.name}! PLC (प्रोग्रामेबल लॉजिक कंट्रोलर) आधुनिक औद्योगिक स्वचालन की रीढ़ है। ${targetRole.titleHi} बनने के लिए यह आवश्यक है क्योंकि आधुनिक प्लांट्स में मोटर और फीडर PLC द्वारा नियंत्रित होते हैं। Skill India और SWAYAM पर 'Industrial Automation & PLC' का 18 घंटे का मुफ्त कोर्स उपलब्ध है, जिससे आप लैडर लॉजिक सीख सकते हैं।`;
    }
    if (language === 'mr') {
      return `नमस्कार ${profile.name}! आधुनिक फॅक्टरींमध्ये मोटारी आणि सेन्सर्स नियंत्रित करण्यासाठी PLC अतिशय महत्त्वाचे आहे. ${targetRole.titleMr} या पदासाठी लॅडर लॉजिकचे प्राथमिक ज्ञान असणे अनिवार्य आहे. तुम्ही Skill India च्या मोफत कोर्सने सुरुवात करू शकता.`;
    }
    return `Hello ${profile.name}! PLC (Programmable Logic Controller) programming is fundamental for industrial automation. For the role of ${targetRole.title}, employers require reading ladder logic diagrams and troubleshooting plant signals. Taking the 18-hour free course on Skill India will help you bridge this gap in about 3 weeks at your ${profile.weeklyHours} hrs/week schedule.`;
  }

  // 2. SQL / Python / Data Analyst
  if (q.includes('sql') || q.includes('python') || q.includes('data') || q.includes('excel')) {
    if (language === 'hi') {
      return `नमस्ते ${profile.name}! डेटा एनालिस्ट बनने के लिए SQL सबसे पहली आवश्यकता है, क्योंकि कंपनियों में सारा डेटा रिलेशनल डेटाबेस में होता है। NPTEL का 'DBMS & SQL' कोर्स 14 घंटे का है और पूर्णतः नि:शुल्क है। इसके बाद आप Python और Excel पर काम कर सकते हैं।`;
    }
    if (language === 'mr') {
      return `नमस्कार ${profile.name}! डेटा ॲनालिस्ट होण्यासाठी SQL हा पाया आहे. NPTEL वरील मोफत कोर्सेसद्वारे तुम्ही डेटाबेस जॉइन्स (JOINs) आणि क्वेरींचा सराव करू शकता. दर आठवड्याला ${profile.weeklyHours} तास दिल्यास ८ आठवड्यांत तुम्ही नोकरीसाठी तयार व्हाल.`;
    }
    return `Hello ${profile.name}! For ${targetRole.title}, SQL is your highest-leverage foundational skill because industry stores transactional data in relational databases. Learning SELECT queries, multi-table JOINs, and GROUP BY will quickly push your readiness past 75%. Check Week 1 of your roadmap for the direct module!`;
  }

  // 3. Government apprenticeships / NAPS / Stipend / Jobs
  if (q.includes('naps') || q.includes('apprenticeship') || q.includes('internship') || q.includes('stipend') || q.includes('job') || q.includes('placement')) {
    if (language === 'hi') {
      return `NAPS (National Apprenticeship Promotion Scheme) भारत सरकार का आधिकारिक पोर्टल है जहाँ ITI और डिप्लोमा छात्रों को टाटा मोटर्स, L&T और बजाज जैसे प्रतिष्ठित उद्योगों में ₹15,000 - ₹18,000 मासिक वजीफे (stipend) के साथ 1 वर्ष का व्यावहारिक प्रशिक्षण मिलता है। SkillSetu के 'Opportunities' टैब से आप सीधे आवेदन कर सकते हैं!`;
    }
    if (language === 'mr') {
      return `NAPS ही भारत सरकारची योजना असून याद्वारे डिप्लोमा आणि ITI विद्यार्थ्यांना टाटा मोटर्स, L&T सारख्या मोठ्या कंपन्यांमध्ये ₹15,000 - ₹18,000 स्टायपेंडसह १ वर्षाची शिकाऊ उमेदवारी (Apprenticeship) मिळते. आपल्या 'Opportunities' विभागात याचे थेट पर्याय उपलब्ध आहेत!`;
    }
    return `NAPS (National Apprenticeship Promotion Scheme) is the Government of India's direct portal connecting ITI & Polytechnic graduates to industrial training with a mandated monthly stipend (₹15,000 - ₹18,000) and government certificate. You can view matched openings directly in the Opportunities tab!`;
  }

  // 4. Time commitment / Weekly study hours
  if (q.includes('hour') || q.includes('week') || q.includes('time') || q.includes('ghante') || q.includes('taas')) {
    if (language === 'hi') {
      return `हाँ, बिल्कुल! आपके चुने हुए ${profile.weeklyHours} घंटे/सप्ताह के शेड्यूल के साथ, आप अगले 8 हफ्तों में अपने सभी स्किल गैप्स को पूरा कर सकते हैं। प्रतिदिन केवल 1 घंटा अभ्यास करने से आपकी तत्परता ${readiness}% से बढ़कर 90%+ हो जाएगी।`;
    }
    if (language === 'mr') {
      return `होय, नक्कीच! दर आठवड्याला ${profile.weeklyHours} तास अभ्यास केल्यास ८ आठवड्यांत तुमचा संपूर्ण अभ्यासक्रम पूर्ण होईल. दररोज १ तास सराव केल्यास तुमची तयारी ${readiness}% वरून ९०%+ पर्यंत पोहोचेल.`;
    }
    return `Yes, absolutely! With your scheduled commitment of ${profile.weeklyHours} hours/week, you can complete all key gap modules in 8 weeks. Dedicating just 1 hour per day will advance your readiness from ${readiness}% to over 90%.`;
  }

  // 5. General profile-aware answer
  if (language === 'hi') {
    return `नमस्ते ${profile.name}! आपकी वर्तमान तत्परता ${readiness}% है। ${targetRole.titleHi} के लिए सबसे महत्वपूर्ण है कि आप ${missingSkills || partialSkills || 'मुख्य तकनीकी कौशलों'} पर ध्यान दें। हमने आपके लिए प्रति सप्ताह ${profile.weeklyHours} घंटे का क्रमबद्ध 8-सप्ताह का रोडमैप तैयार किया है। आप किसी भी विषय पर पूछ सकते हैं!`;
  }
  if (language === 'mr') {
    return `नमस्कार ${profile.name}! तुमची सध्याची तयारी ${readiness}% आहे. ${targetRole.titleMr} साठी ${missingSkills || partialSkills || 'मुख्य कौशल्ये'} आत्मसात करणे आवश्यक आहे. दर आठवड्याला ${profile.weeklyHours} तासांच्या अभ्यासाने तुम्ही सहज यश मिळवू शकता.`;
  }
  return `Hello ${profile.name}! With your current readiness at ${readiness}%, focusing on ${missingSkills || partialSkills || 'your highlighted skills'} is the fastest path to reaching ${targetRole.title}. Your customized 8-week pathway is budgeted for ${profile.weeklyHours} hours/week using free certified courses. What skill would you like to tackle first?`;
}
