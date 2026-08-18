export type FitnessGoal = 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance' | 'general_health';
export type ClientStatus = 'active' | 'onboarding' | 'review' | 'completed' | 'paused';

export interface DailyReportData {
  id: string;
  clientId?: string;
  clientName: string;
  phoneNumber?: string;
  reportDate: string; // YYYY-MM-DD
  sessionFocus: string;
  workoutStatus: string;
  workoutDetails: string;
  intensityRating: string;
  stepsCount?: string;
  dietAdherence: string;
  mealsLogged: string;
  waterIntake: string;
  sleepHours: string;
  energyLevel: string;
  bodyWeight?: string;
  keyWins?: string;
  questionsOrNotes?: string;
  timestamp: string;
}

export interface ClientReport {
  id: string;
  clientId: string;
  clientName: string;
  reportDate: string; // YYYY-MM-DD
  workoutAdherence: 'Excellent (100%)' | 'Good (80-90%)' | 'Fair (60-70%)' | 'Needs Improvement (<50%)';
  dietAdherence: 'Strict & On-Target' | 'Consistent' | 'Moderate' | 'Needs Attention';
  energyLevel: 'High & Strong' | 'Moderate' | 'Low / Fatigued';
  progressSummary: string;
  keyWins: string;
  coachFeedback: string;
  nextWeekTargets: string;
  timestamp: string;
  dailyReportDetails?: Partial<DailyReportData>;
}

export interface ClientData {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string; // WhatsApp number
  age?: number;
  gender?: 'male' | 'female' | 'other';
  fitnessGoal: FitnessGoal;
  assignedWorkoutPlan?: string;
  planStatus: ClientStatus;
  joiningDate: string;
  latestReportDate?: string;
  latestReportSummary?: string;
  reports?: ClientReport[];
  coachNotes?: string;
  dietaryPreference?: string;
}

export interface FitnessAdviceItem {
  id: string;
  title: string;
  category: 'Fat Loss' | 'Muscle Gain' | 'Nutrition' | 'Recovery & Injury' | 'Supplements' | 'Workout Splits';
  icon: string;
  summary: string;
  coreRules: string[];
  sampleRoutineOrMeal?: string[];
  commonMistakes: string[];
  coachProTip: string;
}

export interface UserProfile {
  name: string;
  fitnessGoal: FitnessGoal;
  phoneNumber: string;
}

export const HOST_CONTACT = {
  name: 'Varun Murai',
  title: 'Lead Fitness Coach & Sports Specialist',
  whatsappPhone: '+91 7499 177 223',
  cleanWhatsAppPhone: '917499177223',
  email: 'varunmuraifir.ed@gmail.com',
};

// Fixed destination phone number for all shared fitness progress, summaries, advice, and client reports
export const SHARE_DESTINATION_PHONE = '917499177223';
export const SHARE_DESTINATION_PHONE_FORMATTED = '+91 7499 177 223';

