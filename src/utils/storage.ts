import { ClientData, ClientReport, UserProfile } from '../types';

const STORAGE_KEYS = {
  CLIENTS: 'varun_fitness_clients_roster_v2',
  PROFILE: 'varun_fitness_user_profile_v2',
};

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Coach Varun',
  fitnessGoal: 'muscle_gain',
  phoneNumber: '+91 7499 177 223',
};

export const INITIAL_CLIENTS: ClientData[] = [
  {
    id: 'client-101',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phoneNumber: '+91 98201 45678',
    age: 28,
    gender: 'male',
    fitnessGoal: 'weight_loss',
    assignedWorkoutPlan: '4-Day Push/Pull/Legs Split + 8k Daily Steps',
    planStatus: 'active',
    joiningDate: '2026-07-15',
    latestReportDate: '2026-08-16',
    latestReportSummary: 'Hit 4/4 gym workouts, 100% protein consistency. High energy levels throughout the week.',
    coachNotes: 'Focus on progressive overload on Barbell Bench and Romanian Deadlifts. Keep hitting 150g protein.',
    dietaryPreference: 'High Protein Non-Veg (Eggs, Chicken, Whey)',
    reports: [
      {
        id: 'rep-101-1',
        clientId: 'client-101',
        clientName: 'Rahul Sharma',
        reportDate: '2026-08-16',
        workoutAdherence: 'Excellent (100%)',
        dietAdherence: 'Strict & On-Target',
        energyLevel: 'High & Strong',
        progressSummary: 'Completed all 4 hypertrophy sessions without missing a workout. Step count averaged 8,500/day.',
        keyWins: 'Benched 75kg for 8 clean reps (New PR!). Felt zero lower back fatigue on RDLs.',
        coachFeedback: 'Outstanding focus Rahul! The tempo control on your eccentric reps is showing in your recovery. Keep this exact pace.',
        nextWeekTargets: 'Progress bench to 77.5kg for 6 reps. Add 10 mins of incline walking post-workout on Leg day.',
        timestamp: '2026-08-16T18:30:00Z',
      },
      {
        id: 'rep-101-2',
        clientId: 'client-101',
        clientName: 'Rahul Sharma',
        reportDate: '2026-08-09',
        workoutAdherence: 'Good (80-90%)',
        dietAdherence: 'Consistent',
        energyLevel: 'Moderate',
        progressSummary: 'Finished 3 out of 4 scheduled sessions. Traveled for work on Thursday but caught up over the weekend.',
        keyWins: 'Maintained hydration target (3.5L/day) during travel.',
        coachFeedback: 'Solid rebound after traveling. Good job prioritizing hydration and protein snacks.',
        nextWeekTargets: 'Lock in Monday chest session early in the morning before work.',
        timestamp: '2026-08-09T19:00:00Z',
      }
    ],
  },
  {
    id: 'client-102',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phoneNumber: '+91 97123 88412',
    age: 25,
    gender: 'female',
    fitnessGoal: 'muscle_gain',
    assignedWorkoutPlan: 'Lower Body Glute & Posterior Chain + Upper Posture',
    planStatus: 'active',
    joiningDate: '2026-07-28',
    latestReportDate: '2026-08-15',
    latestReportSummary: 'Increased Hip Thrust load to 85kg. Eating 120g protein daily without digestive discomfort.',
    coachNotes: 'Prioritizing vegetarian protein combos (Paneer, Tofu, Pea Isolate, Sattu, Greek Yogurt).',
    dietaryPreference: 'Vegetarian (Lacto-Ovo)',
    reports: [
      {
        id: 'rep-102-1',
        clientId: 'client-102',
        clientName: 'Priya Patel',
        reportDate: '2026-08-15',
        workoutAdherence: 'Excellent (100%)',
        dietAdherence: 'Strict & On-Target',
        energyLevel: 'High & Strong',
        progressSummary: 'Completed 3 resistance sessions + 2 mobility stretch flows. Glute activation drills worked wonders.',
        keyWins: 'Hip thrust PR: 85kg x 10 reps. Seamlessly hit 120g protein without feeling overly stuffed.',
        coachFeedback: 'Excellent form on Bulgarian split squats! Core brace was solid.',
        nextWeekTargets: 'Maintain 85kg hip thrust and add a 2-second isometric pause at top lockout.',
        timestamp: '2026-08-15T17:00:00Z',
      }
    ],
  },
  {
    id: 'client-103',
    name: 'Rohit Verma',
    email: 'rohit.v99@example.com',
    phoneNumber: '+91 88899 12345',
    age: 32,
    gender: 'male',
    fitnessGoal: 'general_health',
    assignedWorkoutPlan: '3-Day Full Body Functional Conditioning + Posture Alignment',
    planStatus: 'review',
    joiningDate: '2026-08-05',
    latestReportDate: '2026-08-14',
    latestReportSummary: 'Desk worker routine: Neck and shoulder stiffness reduced by 50% through daily posture drills.',
    coachNotes: 'Desk ergonomics review done. Set timer for 5-min walk every 90 minutes.',
    dietaryPreference: 'Standard Balanced Diet',
    reports: [
      {
        id: 'rep-103-1',
        clientId: 'client-103',
        clientName: 'Rohit Verma',
        reportDate: '2026-08-14',
        workoutAdherence: 'Good (80-90%)',
        dietAdherence: 'Consistent',
        energyLevel: 'Moderate',
        progressSummary: 'Did 3 functional dumbbell workouts. Added daily 10-min thoracic spine and hamstring mobility.',
        keyWins: 'Zero neck tension while working long coding hours.',
        coachFeedback: 'Great start Rohit. We are transitioning you to light barbell squats next week.',
        nextWeekTargets: 'Increase daily step count to 7,500 and replace evening sugary chai with green tea or water.',
        timestamp: '2026-08-14T20:15:00Z',
      }
    ],
  },
  {
    id: 'client-104',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    phoneNumber: '+91 94455 67890',
    age: 29,
    gender: 'female',
    fitnessGoal: 'endurance',
    assignedWorkoutPlan: 'Half-Marathon Aerobic Base + Single-Leg Knee Stability',
    planStatus: 'active',
    joiningDate: '2026-06-10',
    latestReportDate: '2026-08-16',
    latestReportSummary: '14km long run completed at 5:45/km pace. Heart rate stayed strictly in Zone 2.',
    coachNotes: 'Pre-race nutrition strategy testing. Electrolytes during Sunday long runs.',
    dietaryPreference: 'Pescatarian / High Carbohydrate',
    reports: [
      {
        id: 'rep-104-1',
        clientId: 'client-104',
        clientName: 'Ananya Iyer',
        reportDate: '2026-08-16',
        workoutAdherence: 'Excellent (100%)',
        dietAdherence: 'Strict & On-Target',
        energyLevel: 'High & Strong',
        progressSummary: 'Completed 3 weekly runs (32km total mileage) + 2 knee stability strength sessions.',
        keyWins: 'Sunday 14km run felt effortless with average heart rate of 138 bpm.',
        coachFeedback: 'Aerobic base is in phenomenal shape. Single-leg step-downs are protecting the patellar tendon perfectly.',
        nextWeekTargets: 'Step up long run to 16km. Test mid-run energy gel at the 8km mark.',
        timestamp: '2026-08-16T11:00:00Z',
      }
    ],
  },
  {
    id: 'client-105',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@example.com',
    phoneNumber: '+91 98111 22334',
    age: 35,
    gender: 'male',
    fitnessGoal: 'weight_loss',
    assignedWorkoutPlan: 'Body Recomposition & Core Strengthening',
    planStatus: 'onboarding',
    joiningDate: '2026-08-16',
    latestReportDate: '2026-08-17',
    latestReportSummary: 'Initial fitness assessment completed. Baseline mobility tests passed.',
    coachNotes: 'Client starting journey this week. Focus on building gym habit and basic clean nutrition.',
    dietaryPreference: 'Non-Vegetarian',
    reports: [
      {
        id: 'rep-105-1',
        clientId: 'client-105',
        clientName: 'Vikram Mehta',
        reportDate: '2026-08-17',
        workoutAdherence: 'Good (80-90%)',
        dietAdherence: 'Consistent',
        energyLevel: 'High & Strong',
        progressSummary: 'Completed onboarding session and baseline compound movement assessments (Squat, Overhead Press, Lat Pulldown).',
        keyWins: 'Understood progressive overload and warm-up set structure.',
        coachFeedback: 'Welcome to the team Vikram! Your foundation is solid. Focus on form over heavy weights this week.',
        nextWeekTargets: 'Log 3 workouts in the gym and swap fried snacks for boiled eggs / fruit.',
        timestamp: '2026-08-17T09:00:00Z',
      }
    ]
  }
];

export function loadClients(): ClientData[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load clients', e);
  }
  return INITIAL_CLIENTS;
}

export function saveClients(clients: ClientData[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  } catch (e) {
    console.error('Failed to save clients', e);
  }
}

export function loadProfile(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load profile', e);
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}
