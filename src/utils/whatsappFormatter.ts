import { ClientData, ClientReport, DailyReportData, FitnessAdviceItem, SHARE_DESTINATION_PHONE } from '../types';

export function generateWhatsAppLink(phoneNumber?: string, text?: string): string {
  // Always default to the configured destination phone (+91 7499 177 223)
  const phoneToUse = phoneNumber || SHARE_DESTINATION_PHONE;
  const cleanPhone = phoneToUse.replace(/[^0-9]/g, '') || SHARE_DESTINATION_PHONE;
  const encodedText = encodeURIComponent(text || '');
  
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://wa.me/${SHARE_DESTINATION_PHONE}?text=${encodedText}`;
}

export function formatDailyReportWhatsApp(data: DailyReportData): string {
  const lines: string[] = [];
  lines.push(`📋 *DAILY ATHLETE REPORT — COACH VARUN FITNESS* 🏋️‍♂️`);
  lines.push(`─────────────────────────────`);
  lines.push(`👤 *Athlete Name:* *${data.clientName.trim() || 'Athlete'}*`);
  lines.push(`📅 *Date:* ${data.reportDate}`);
  if (data.sessionFocus) {
    lines.push(`🎯 *Session Focus:* ${data.sessionFocus}`);
  }
  if (data.bodyWeight) {
    lines.push(`⚖️ *Body Weight / Condition:* ${data.bodyWeight}`);
  }
  if (data.stepsCount) {
    lines.push(`👟 *Steps / Activity:* ${data.stepsCount}`);
  }
  lines.push(`─────────────────────────────`);
  lines.push(`💪 *1. WORKOUT BREAKDOWN:*`);
  lines.push(`• Status: *${data.workoutStatus}*`);
  if (data.intensityRating) {
    lines.push(`• Intensity Level: *${data.intensityRating}*`);
  }
  if (data.workoutDetails && data.workoutDetails.trim()) {
    lines.push(`• Workout Details / Sets:`);
    lines.push(data.workoutDetails.trim());
  }
  lines.push(``);
  lines.push(`🥗 *2. NUTRITION & HYDRATION:*`);
  lines.push(`• Diet Adherence: *${data.dietAdherence}*`);
  lines.push(`• Water Intake: *${data.waterIntake}*`);
  if (data.mealsLogged && data.mealsLogged.trim()) {
    lines.push(`• Meals Logged:`);
    lines.push(data.mealsLogged.trim());
  }
  lines.push(``);
  lines.push(`🛌 *3. RECOVERY & ENERGY:*`);
  lines.push(`• Sleep Duration: *${data.sleepHours}*`);
  lines.push(`• Daily Energy / Readiness: *${data.energyLevel}*`);
  lines.push(``);
  if (data.keyWins && data.keyWins.trim()) {
    lines.push(`🏆 *4. KEY WINS & ACHIEVEMENTS:*`);
    lines.push(data.keyWins.trim());
    lines.push(``);
  }
  if (data.questionsOrNotes && data.questionsOrNotes.trim()) {
    lines.push(`💬 *5. MESSAGE / QUESTION FOR COACH VARUN:*`);
    lines.push(data.questionsOrNotes.trim());
    lines.push(``);
  }
  lines.push(`─────────────────────────────`);
  lines.push(`📱 *Sent to Coach Varun (+91 7499 177 223)*`);
  lines.push(`_Coach Varun Fitness Intelligence Portal_ ⚡`);

  return lines.join('\n');
}

export function formatClientReportWhatsApp(
  clientOrReport: ClientData | ClientReport,
  optionalReport?: ClientReport
): string {
  let clientName = '';
  let goalStr = '';
  let assignedPlan = '';
  let report: ClientReport;

  if (optionalReport) {
    const client = clientOrReport as ClientData;
    clientName = client.name;
    goalStr = client.fitnessGoal ? client.fitnessGoal.replace('_', ' ').toUpperCase() : 'GENERAL FITNESS';
    assignedPlan = client.assignedWorkoutPlan || '';
    report = optionalReport;
  } else {
    report = clientOrReport as ClientReport;
    clientName = report.clientName || 'Athlete';
    goalStr = 'FITNESS GOAL REVIEW';
  }

  const lines: string[] = [];
  lines.push(`📋 *ATHLETE FITNESS CHECK-IN & REPORT* 🏋️‍♂️`);
  lines.push(`👤 *Athlete:* ${clientName}`);
  lines.push(`📅 *Date:* ${report.reportDate}`);
  if (goalStr) {
    lines.push(`🎯 *Goal/Focus:* ${goalStr}`);
  }
  if (assignedPlan) {
    lines.push(`📋 *Assigned Plan:* ${assignedPlan}`);
  }
  lines.push(`─────────────────────────`);
  lines.push(`📊 *ADHERENCE & STATUS*`);
  lines.push(`• Workout Adherence: *${report.workoutAdherence}*`);
  lines.push(`• Nutrition Consistency: *${report.dietAdherence}*`);
  lines.push(`• Energy & Recovery: *${report.energyLevel}*`);
  lines.push(``);
  lines.push(`📝 *Progress Summary:*`);
  lines.push(report.progressSummary || 'Consistent training and progress logged this week.');
  lines.push(``);
  if (report.keyWins) {
    lines.push(`🏆 *Key Wins & Milestones:*`);
    lines.push(report.keyWins);
    lines.push(``);
  }
  if (report.coachFeedback && report.coachFeedback !== 'Pending review by Coach Varun.') {
    lines.push(`💬 *Coach Varun's Feedback:*`);
    lines.push(report.coachFeedback);
    lines.push(``);
  }
  if (report.nextWeekTargets) {
    lines.push(`🎯 *Next Week Targets / Questions:*`);
    lines.push(report.nextWeekTargets);
    lines.push(``);
  }
  lines.push(`─────────────────────────`);
  lines.push(`_Delivered via Coach Varun Fitness Portal_ 📱`);

  return lines.join('\n');
}

export function formatFitnessAdviceWhatsApp(advice: FitnessAdviceItem): string {
  const lines: string[] = [];
  lines.push(`💡 *COACH VARUN FITNESS ADVICE* ⚡`);
  lines.push(`📌 *Topic:* *${advice.title}* (${advice.category})`);
  lines.push(`─────────────────────────`);
  lines.push(`📖 *Overview:*`);
  lines.push(advice.summary);
  lines.push(``);
  lines.push(`🔑 *Core Actionable Rules:*`);
  advice.coreRules.forEach((rule, idx) => {
    lines.push(`${idx + 1}. ${rule}`);
  });
  lines.push(``);
  if (advice.commonMistakes && advice.commonMistakes.length > 0) {
    lines.push(`⚠️ *Common Mistakes to Avoid:*`);
    advice.commonMistakes.forEach(m => lines.push(`• ${m}`));
    lines.push(``);
  }
  lines.push(`💡 *Coach's Pro Tip:*`);
  lines.push(`"${advice.coachProTip}"`);
  lines.push(``);
  lines.push(`_Coach Varun Fitness Intelligence_ 🏋️‍♂️`);

  return lines.join('\n');
}

export function formatCustomAdviceWhatsApp(params: {
  goal: string;
  level: string;
  equipment: string;
  prescription: {
    title: string;
    workoutStrategy: string;
    nutritionRules: string[];
    weeklyHabits: string[];
    recoveryTips: string;
  };
}): string {
  const lines: string[] = [];
  lines.push(`🏋️‍♂️ *PERSONALIZED FITNESS BLUEPRINT* ⚡`);
  lines.push(`👤 *Goal:* ${params.goal.toUpperCase()} | *Level:* ${params.level} | *Setup:* ${params.equipment}`);
  lines.push(`📋 *Plan:* *${params.prescription.title}*`);
  lines.push(`─────────────────────────`);
  lines.push(`💪 *Training Protocol:*`);
  lines.push(params.prescription.workoutStrategy);
  lines.push(``);
  lines.push(`🥗 *Nutrition Guidelines:*`);
  params.prescription.nutritionRules.forEach(r => lines.push(`• ${r}`));
  lines.push(``);
  lines.push(`⚡ *Key Daily Habits:*`);
  params.prescription.weeklyHabits.forEach(h => lines.push(`• ${h}`));
  lines.push(``);
  lines.push(`🛌 *Recovery Focus:*`);
  lines.push(params.prescription.recoveryTips);
  lines.push(``);
  lines.push(`_Provided by Coach Varun Fitness Advisor_ 📱`);

  return lines.join('\n');
}
