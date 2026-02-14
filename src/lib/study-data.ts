// PgMP Study Plan Data - Based on PMI's Standard for Program Management Fifth Edition
// Study Period: Feb 14, 2026 - April 23, 2026 (68 days)

export interface StudyTask {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  topic: StudyTopic;
  day: number; // day number from start
  isWeekend: boolean;
  priority: 'high' | 'medium' | 'low';
  resources: string[];
  keyPoints: string[];
}

export interface StudyTopic {
  id: string;
  name: string;
  category: 'principles' | 'domains' | 'lifecycle' | 'documents' | 'practice';
  color: string;
  icon: string;
}

export const studyTopics: StudyTopic[] = [
  { id: 'principles', name: 'Program Management Principles', category: 'principles', color: '#3b82f6', icon: 'BookOpen' },
  { id: 'stakeholders', name: 'Stakeholder Principle', category: 'principles', color: '#10b981', icon: 'Users' },
  { id: 'benefits', name: 'Benefits Realization', category: 'principles', color: '#f59e0b', icon: 'Target' },
  { id: 'synergy', name: 'Synergy Principle', category: 'principles', color: '#8b5cf6', icon: 'Zap' },
  { id: 'team', name: 'Team of Teams', category: 'principles', color: '#ec4899', icon: 'UsersRound' },
  { id: 'change', name: 'Change Management', category: 'principles', color: '#ef4444', icon: 'RefreshCcw' },
  { id: 'leadership', name: 'Leadership Principle', category: 'principles', color: '#06b6d4', icon: 'Crown' },
  { id: 'risk', name: 'Risk Management', category: 'principles', color: '#f97316', icon: 'AlertTriangle' },
  { id: 'governance', name: 'Governance Principle', category: 'principles', color: '#84cc16', icon: 'Scale' },
  { id: 'strategic', name: 'Strategic Alignment Domain', category: 'domains', color: '#6366f1', icon: 'Compass' },
  { id: 'benefits-domain', name: 'Benefits Management Domain', category: 'domains', color: '#14b8a6', icon: 'TrendingUp' },
  { id: 'stakeholder-domain', name: 'Stakeholder Engagement Domain', category: 'domains', color: '#a855f7', icon: 'MessageCircle' },
  { id: 'governance-domain', name: 'Governance Framework Domain', category: 'domains', color: '#f43f5e', icon: 'Shield' },
  { id: 'collaboration', name: 'Collaboration Domain', category: 'domains', color: '#0ea5e9', icon: 'Handshake' },
  { id: 'lifecycle', name: 'Life Cycle Management Domain', category: 'domains', color: '#22c55e', icon: 'Repeat' },
  { id: 'definition', name: 'Definition Phase', category: 'lifecycle', color: '#eab308', icon: 'FileText' },
  { id: 'delivery', name: 'Delivery Phase', category: 'lifecycle', color: '#3b82f6', icon: 'Rocket' },
  { id: 'closure', name: 'Closure Phase', category: 'lifecycle', color: '#64748b', icon: 'CheckCircle' },
  { id: 'business-case', name: 'Business Case', category: 'documents', color: '#f59e0b', icon: 'Briefcase' },
  { id: 'charter', name: 'Program Charter', category: 'documents', color: '#10b981', icon: 'FileSignature' },
  { id: 'roadmap', name: 'Program Roadmap', category: 'documents', color: '#8b5cf6', icon: 'Map' },
  { id: 'plan', name: 'Program Management Plan', category: 'documents', color: '#ef4444', icon: 'ClipboardList' },
  { id: 'practice', name: 'Practice Exams', category: 'practice', color: '#06b6d4', icon: 'GraduationCap' },
];

// Generate study tasks for 68 days (Feb 14 - April 23, 2026)
export function generateStudyPlan(): StudyTask[] {
  const tasks: StudyTask[] = [];
  let taskId = 1;

  // Helper to check if a day falls on weekend
  const isWeekend = (dayNum: number): boolean => {
    const startDate = new Date(2026, 1, 14); // Feb 14, 2026
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + dayNum - 1);
    const dayOfWeek = targetDate.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
  };

  // Week 1: Foundation & Principles (Days 1-7)
  const week1Tasks = [
    { title: 'Introduction to Program Management', topic: 'principles', duration: 90, priority: 'high' as const, day: 1, desc: 'Overview of program management, key concepts, and PMI framework', points: ['Program vs Project vs Portfolio', 'Program management value proposition', 'PMI standards overview'] },
    { title: 'Stakeholder Principle Deep Dive', topic: 'stakeholders', duration: 120, priority: 'high' as const, day: 2, desc: 'Understanding stakeholder identification, analysis, and engagement strategies', points: ['Stakeholder identification techniques', 'Power/interest grid', 'Engagement approaches'] },
    { title: 'Benefits Realization Principle', topic: 'benefits', duration: 120, priority: 'high' as const, day: 3, desc: 'Learn how to define, measure, and sustain program benefits', points: ['Benefits identification', 'Benefits measurement', 'Benefits sustainment'] },
    { title: 'Weekend Review: Principles 1-3', topic: 'principles', duration: 180, priority: 'high' as const, day: 4, desc: 'Comprehensive review and practice questions for first three principles', points: ['Review key concepts', 'Practice scenarios', 'Memory techniques'] },
    { title: 'Synergy Principle', topic: 'synergy', duration: 120, priority: 'high' as const, day: 5, desc: 'Understanding how to create value through component interdependencies', points: ['Component synergy', 'Resource optimization', 'Interdependency management'] },
    { title: 'Team of Teams Principle', topic: 'team', duration: 120, priority: 'high' as const, day: 6, desc: 'Building and leading effective program teams', points: ['Team structure', 'Communication protocols', 'Conflict resolution'] },
    { title: 'Weekend Deep Dive: Team Dynamics', topic: 'team', duration: 180, priority: 'medium' as const, day: 7, desc: 'Extended study on team leadership and collaboration', points: ['Leadership styles', 'Team motivation', 'Performance management'] },
  ];

  // Week 2: More Principles (Days 8-14)
  const week2Tasks = [
    { title: 'Change Management Principle', topic: 'change', duration: 120, priority: 'high' as const, day: 8, desc: 'Managing organizational change through programs', points: ['Change models', 'Resistance management', 'Change adoption'] },
    { title: 'Leadership Principle', topic: 'leadership', duration: 120, priority: 'high' as const, day: 9, desc: 'Program manager as transformational leader', points: ['Leadership competencies', 'Influence strategies', 'Vision communication'] },
    { title: 'Risk Management Principle', topic: 'risk', duration: 120, priority: 'high' as const, day: 10, desc: 'Program-level risk identification and response', points: ['Risk identification', 'Risk analysis', 'Risk response strategies'] },
    { title: 'Weekend Review: All Principles', topic: 'principles', duration: 240, priority: 'high' as const, day: 11, desc: 'Complete review of all 8 program management principles', points: ['Cross-principle connections', 'Practice questions', 'Key memorization'] },
    { title: 'Governance Principle', topic: 'governance', duration: 120, priority: 'high' as const, day: 12, desc: 'Establishing effective program governance structures', points: ['Governance structures', 'Decision frameworks', 'Accountability mechanisms'] },
    { title: 'Principles Integration Exercise', topic: 'principles', duration: 150, priority: 'medium' as const, day: 13, desc: 'How principles work together in real scenarios', points: ['Case study analysis', 'Integration patterns', 'Best practices'] },
    { title: 'Weekend Practice: Principles Exam', topic: 'practice', duration: 180, priority: 'high' as const, day: 14, desc: 'Practice exam focusing on principles domain', points: ['Timed practice', 'Answer analysis', 'Weak area identification'] },
  ];

  // Week 3: Performance Domains Begin (Days 15-21)
  const week3Tasks = [
    { title: 'Strategic Alignment Domain', topic: 'strategic', duration: 120, priority: 'high' as const, day: 15, desc: 'Aligning programs with organizational strategy', points: ['Strategic planning', 'Program selection criteria', 'Strategic fit assessment'] },
    { title: 'Strategic Alignment Deep Dive', topic: 'strategic', duration: 120, priority: 'high' as const, day: 16, desc: 'Advanced strategic alignment concepts', points: ['Portfolio alignment', 'Strategic objectives', 'Value delivery'] },
    { title: 'Benefits Management Domain Intro', topic: 'benefits-domain', duration: 120, priority: 'high' as const, day: 17, desc: 'Introduction to benefits management domain', points: ['Benefits lifecycle', 'Benefits mapping', 'Benefits tracking'] },
    { title: 'Weekend: Benefits Domain Mastery', topic: 'benefits-domain', duration: 240, priority: 'high' as const, day: 18, desc: 'Comprehensive study of benefits management', points: ['Benefits identification', 'Benefits analysis', 'Benefits realization'] },
    { title: 'Stakeholder Engagement Domain', topic: 'stakeholder-domain', duration: 120, priority: 'high' as const, day: 19, desc: 'Domain-specific stakeholder engagement techniques', points: ['Stakeholder analysis', 'Engagement planning', 'Communication strategies'] },
    { title: 'Stakeholder Engagement Practice', topic: 'stakeholder-domain', duration: 120, priority: 'medium' as const, day: 20, desc: 'Practical stakeholder scenarios', points: ['Stakeholder mapping', 'Engagement techniques', 'Conflict management'] },
    { title: 'Weekend Review: Domains 1-3', topic: 'practice', duration: 180, priority: 'high' as const, day: 21, desc: 'Review and practice for first three domains', points: ['Domain integration', 'Practice questions', 'Key concepts review'] },
  ];

  // Week 4: More Domains (Days 22-28)
  const week4Tasks = [
    { title: 'Governance Framework Domain', topic: 'governance-domain', duration: 120, priority: 'high' as const, day: 22, desc: 'Building effective governance frameworks', points: ['Governance boards', 'Stage gates', 'Decision rights'] },
    { title: 'Governance Deep Dive', topic: 'governance-domain', duration: 120, priority: 'high' as const, day: 23, desc: 'Advanced governance concepts and practices', points: ['Governance audits', 'Compliance management', 'Escalation procedures'] },
    { title: 'Collaboration Domain', topic: 'collaboration', duration: 120, priority: 'high' as const, day: 24, desc: 'Fostering collaboration across program components', points: ['Collaboration tools', 'Knowledge sharing', 'Team dynamics'] },
    { title: 'Weekend: Governance & Collaboration', topic: 'practice', duration: 240, priority: 'high' as const, day: 25, desc: 'Intensive review of governance and collaboration', points: ['Domain integration', 'Case studies', 'Practice questions'] },
    { title: 'Life Cycle Management Domain', topic: 'lifecycle', duration: 120, priority: 'high' as const, day: 26, desc: 'Overview of program life cycle management', points: ['Life cycle phases', 'Phase transitions', 'Iterative management'] },
    { title: 'Life Cycle Phase Details', topic: 'lifecycle', duration: 120, priority: 'medium' as const, day: 27, desc: 'Detailed study of life cycle phases', points: ['Phase activities', 'Key deliverables', 'Success criteria'] },
    { title: 'Weekend Practice: All Domains', topic: 'practice', duration: 180, priority: 'high' as const, day: 28, desc: 'Comprehensive practice for all 6 domains', points: ['Timed practice', 'Domain weighting', 'Weak area focus'] },
  ];

  // Week 5: Program Life Cycle Phases (Days 29-35)
  const week5Tasks = [
    { title: 'Definition Phase Overview', topic: 'definition', duration: 120, priority: 'high' as const, day: 29, desc: 'Understanding the program definition phase', points: ['Phase objectives', 'Key activities', 'Deliverables'] },
    { title: 'Business Case Development', topic: 'business-case', duration: 120, priority: 'high' as const, day: 30, desc: 'Creating compelling business cases for programs', points: ['Business case elements', 'Financial analysis', 'Benefit projections'] },
    { title: 'Program Charter Creation', topic: 'charter', duration: 120, priority: 'high' as const, day: 31, desc: 'Developing effective program charters', points: ['Charter components', 'Authorization process', 'Stakeholder approval'] },
    { title: 'Weekend: Definition Phase Mastery', topic: 'definition', duration: 240, priority: 'high' as const, day: 32, desc: 'Deep dive into definition phase', points: ['Phase activities', 'Key deliverables', 'Success criteria'] },
    { title: 'Delivery Phase Overview', topic: 'delivery', duration: 120, priority: 'high' as const, day: 33, desc: 'Understanding the program delivery phase', points: ['Phase objectives', 'Component management', 'Progress monitoring'] },
    { title: 'Program Roadmap Development', topic: 'roadmap', duration: 120, priority: 'high' as const, day: 34, desc: 'Creating and maintaining program roadmaps', points: ['Roadmap elements', 'Milestone planning', 'Dependency visualization'] },
    { title: 'Weekend: Delivery Phase Practice', topic: 'delivery', duration: 180, priority: 'high' as const, day: 35, desc: 'Practice scenarios for delivery phase', points: ['Case studies', 'Decision making', 'Problem solving'] },
  ];

  // Week 6: More Life Cycle & Documents (Days 36-42)
  const week6Tasks = [
    { title: 'Program Management Plan', topic: 'plan', duration: 120, priority: 'high' as const, day: 36, desc: 'Developing comprehensive program management plans', points: ['Plan components', 'Subsidiary plans', 'Plan integration'] },
    { title: 'Delivery Phase Deep Dive', topic: 'delivery', duration: 120, priority: 'high' as const, day: 37, desc: 'Advanced delivery phase concepts', points: ['Component coordination', 'Issue management', 'Change control'] },
    { title: 'Closure Phase Overview', topic: 'closure', duration: 120, priority: 'high' as const, day: 38, desc: 'Understanding program closure', points: ['Closure criteria', 'Transition planning', 'Lessons learned'] },
    { title: 'Weekend: Documents Integration', topic: 'practice', duration: 240, priority: 'high' as const, day: 39, desc: 'Integration of all key program documents', points: ['Document relationships', 'Template usage', 'Best practices'] },
    { title: 'Closure Phase Deep Dive', topic: 'closure', duration: 120, priority: 'high' as const, day: 40, desc: 'Detailed closure activities and processes', points: ['Benefit sustainment', 'Resource release', 'Knowledge transfer'] },
    { title: 'Document Templates Review', topic: 'plan', duration: 120, priority: 'medium' as const, day: 41, desc: 'Review of key document templates and structures', points: ['Charter template', 'Plan structure', 'Report formats'] },
    { title: 'Weekend: Full Life Cycle Review', topic: 'lifecycle', duration: 180, priority: 'high' as const, day: 42, desc: 'Complete review of program life cycle', points: ['Phase transitions', 'Key decisions', 'Critical success factors'] },
  ];

  // Week 7: Integration & Practice (Days 43-49)
  const week7Tasks = [
    { title: 'Cross-Domain Integration', topic: 'practice', duration: 120, priority: 'high' as const, day: 43, desc: 'How domains interact and support each other', points: ['Domain relationships', 'Integration points', 'Synergy creation'] },
    { title: 'Principles & Domains Integration', topic: 'practice', duration: 120, priority: 'high' as const, day: 44, desc: 'Connecting principles with performance domains', points: ['Principle application', 'Domain alignment', 'Real-world scenarios'] },
    { title: 'Full Practice Exam 1', topic: 'practice', duration: 240, priority: 'high' as const, day: 45, desc: 'First full-length practice exam', points: ['Time management', 'Question analysis', 'Score tracking'] },
    { title: 'Weekend: Exam Analysis & Review', topic: 'practice', duration: 240, priority: 'high' as const, day: 46, desc: 'Detailed analysis of practice exam results', points: ['Wrong answer review', 'Knowledge gaps', 'Study adjustments'] },
    { title: 'Weak Areas Focus Session', topic: 'practice', duration: 150, priority: 'high' as const, day: 47, desc: 'Targeted study on identified weak areas', points: ['Personalized review', 'Additional practice', 'Concept reinforcement'] },
    { title: 'Scenario-Based Practice', topic: 'practice', duration: 120, priority: 'medium' as const, day: 48, desc: 'Complex scenario-based questions', points: ['Situation analysis', 'Decision making', 'Best practices'] },
    { title: 'Weekend: Intensive Review', topic: 'practice', duration: 240, priority: 'high' as const, day: 49, desc: 'Comprehensive weekend review session', points: ['All topics review', 'Memory reinforcement', 'Confidence building'] },
  ];

  // Week 8: More Practice & Refinement (Days 50-56)
  const week8Tasks = [
    { title: 'Full Practice Exam 2', topic: 'practice', duration: 240, priority: 'high' as const, day: 50, desc: 'Second full-length practice exam', points: ['Progress measurement', 'Endurance building', 'Time management'] },
    { title: 'Exam Results Analysis', topic: 'practice', duration: 120, priority: 'high' as const, day: 51, desc: 'Detailed analysis of second practice exam', points: ['Trend analysis', 'Improvement areas', 'Study refinement'] },
    { title: 'Key Concepts Memorization', topic: 'practice', duration: 120, priority: 'medium' as const, day: 52, desc: 'Final memorization of key concepts and terms', points: ['Key definitions', 'Process flows', 'Critical formulas'] },
    { title: 'Weekend: Mock Exam Conditions', topic: 'practice', duration: 270, priority: 'high' as const, day: 53, desc: 'Practice under actual exam conditions', points: ['Real timing', 'No breaks simulation', 'Full focus'] },
    { title: 'Final Weak Area Review', topic: 'practice', duration: 150, priority: 'high' as const, day: 54, desc: 'Last focused review on remaining weak areas', points: ['Targeted study', 'Quick wins', 'Confidence boost'] },
    { title: 'Exam Strategies & Tips', topic: 'practice', duration: 90, priority: 'medium' as const, day: 55, desc: 'Test-taking strategies and exam tips', points: ['Question analysis', 'Elimination techniques', 'Time allocation'] },
    { title: 'Weekend: Final Comprehensive Review', topic: 'practice', duration: 240, priority: 'high' as const, day: 56, desc: 'Last major review before final week', points: ['All topics summary', 'Quick reference', 'Mental preparation'] },
  ];

  // Week 9: Final Preparation (Days 57-63)
  const week9Tasks = [
    { title: 'Full Practice Exam 3', topic: 'practice', duration: 240, priority: 'high' as const, day: 57, desc: 'Third full-length practice exam', points: ['Performance tracking', 'Stamina testing', 'Final assessment'] },
    { title: 'Light Review & Rest', topic: 'practice', duration: 60, priority: 'low' as const, day: 58, desc: 'Light review session, avoid burnout', points: ['Light reading', 'Concept browsing', 'Mental rest'] },
    { title: 'Quick Reference Review', topic: 'practice', duration: 90, priority: 'medium' as const, day: 59, desc: 'Review quick reference materials', points: ['Key points', 'Cheat sheets', 'Summary notes'] },
    { title: 'Weekend: Confidence Building', topic: 'practice', duration: 180, priority: 'high' as const, day: 60, desc: 'Focus on strengths and confidence building', points: ['Strong areas review', 'Positive reinforcement', 'Visualization'] },
    { title: 'Final Light Practice', topic: 'practice', duration: 60, priority: 'low' as const, day: 61, desc: 'Short practice session, stay sharp', points: ['Quick questions', 'Mental activation', 'Focus maintenance'] },
    { title: 'Logistics & Mental Prep', topic: 'practice', duration: 30, priority: 'medium' as const, day: 62, desc: 'Prepare logistics and mental state', points: ['Exam day planning', 'Relaxation techniques', 'Sleep schedule'] },
    { title: 'Final Review & Relaxation', topic: 'practice', duration: 45, priority: 'low' as const, day: 63, desc: 'Very light review, focus on relaxation', points: ['Brief overview', 'Deep breathing', 'Positive mindset'] },
  ];

  // Final Days (Days 64-68)
  const finalDaysTasks = [
    { title: 'Day Before - Light Review', topic: 'practice', duration: 30, priority: 'low' as const, day: 64, desc: 'Very light review, no heavy study', points: ['Brief notes review', 'Stay calm', 'Early sleep prep'] },
    { title: 'Day Before - Rest & Prepare', topic: 'practice', duration: 15, priority: 'low' as const, day: 65, desc: 'Rest day, prepare exam logistics', points: ['Documents ready', 'Route planned', 'Relax'] },
    { title: 'Light Mental Activation', topic: 'practice', duration: 20, priority: 'low' as const, day: 66, desc: 'Keep mind active without stress', points: ['Light reading', 'Stay positive', 'Trust preparation'] },
    { title: 'Final Relaxation', topic: 'practice', duration: 0, priority: 'low' as const, day: 67, desc: 'Complete rest, no study', points: ['Full relaxation', 'Good sleep', 'Confidence'] },
    { title: 'EXAM DAY - You\'re Ready!', topic: 'practice', duration: 0, priority: 'high' as const, day: 68, desc: 'Your PgMP exam is today at 9:30 AM Dubai!', points: ['Stay confident', 'Trust your prep', 'You\'ve got this!'] },
  ];

  // Combine all weeks
  const allTaskTemplates = [
    ...week1Tasks,
    ...week2Tasks,
    ...week3Tasks,
    ...week4Tasks,
    ...week5Tasks,
    ...week6Tasks,
    ...week7Tasks,
    ...week8Tasks,
    ...week9Tasks,
    ...finalDaysTasks,
  ];

  // Convert to StudyTask format
  allTaskTemplates.forEach((task) => {
    const topic = studyTopics.find(t => t.id === task.topic) || studyTopics[0];
    tasks.push({
      id: `task-${taskId}`,
      title: task.title,
      description: task.desc,
      duration: task.duration,
      topic: topic,
      day: task.day,
      isWeekend: isWeekend(task.day),
      priority: task.priority,
      resources: ['PMI Standard for Program Management 5th Ed', 'PgMP Examination Content Outline'],
      keyPoints: task.points,
    });
    taskId++;
  });

  return tasks;
}

// Get date for a specific day number
export function getDateForDay(dayNumber: number): Date {
  const startDate = new Date(2026, 1, 14); // Feb 14, 2026
  const targetDate = new Date(startDate);
  targetDate.setDate(startDate.getDate() + dayNumber - 1);
  return targetDate;
}

// Get day number for a specific date
export function getDayForDate(date: Date): number {
  const startDate = new Date(2026, 1, 14); // Feb 14, 2026
  const diffTime = date.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

// Exam info
export const examInfo = {
  date: new Date(2026, 3, 23, 9, 30), // April 23, 2026, 9:30 AM
  location: 'Dubai, UAE',
  format: 'Online Proctored',
  totalDays: 68,
  startDate: new Date(2026, 1, 14), // Feb 14, 2026
};
