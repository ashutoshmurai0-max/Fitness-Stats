import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Dumbbell,
  Apple,
  Moon,
  Zap,
  CheckCircle2,
  Calendar,
  User,
  Copy,
  Check,
  Flame,
  Droplets,
  Award,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClientData, ClientReport, DailyReportData, SHARE_DESTINATION_PHONE, SHARE_DESTINATION_PHONE_FORMATTED } from '../types';
import { formatDailyReportWhatsApp, generateWhatsAppLink } from '../utils/whatsappFormatter';

interface DailyReportSubmitterProps {
  clients: ClientData[];
  onAddReport: (clientId: string, report: ClientReport) => void;
  onNavigateToPortal?: () => void;
}

export const DailyReportSubmitter: React.FC<DailyReportSubmitterProps> = ({
  clients,
  onAddReport,
  onNavigateToPortal,
}) => {
  // Form State
  const [selectedClientId, setSelectedClientId] = useState<string>(
    clients.length > 0 ? clients[0].id : 'custom'
  );
  const [customClientName, setCustomClientName] = useState<string>('');
  const [reportDate, setReportDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [sessionFocus, setSessionFocus] = useState<string>('Chest & Triceps (Push Day)');
  const [workoutStatus, setWorkoutStatus] = useState<string>('Completed 100% As Prescribed 🔥');
  const [intensityRating, setIntensityRating] = useState<string>('RPE 8.5/10 (High Energy & Pump)');
  const [stepsCount, setStepsCount] = useState<string>('10,000+ Steps');
  const [workoutDetails, setWorkoutDetails] = useState<string>(
    '1. Incline Dumbbell Press: 30kg x 10, 10, 8\n2. Flat Barbell Bench Press: 75kg x 8, 8, 6\n3. Dips: 3 sets x 12 reps bodyweight\n4. Cable Tricep Pushdowns: 4 sets x 15 reps\n5. 15 mins post-workout incline walk'
  );

  const [dietAdherence, setDietAdherence] = useState<string>('100% Clean & On Target 🥗');
  const [waterIntake, setWaterIntake] = useState<string>('3.5L+ (Hydration Champion 💧)');
  const [mealsLogged, setMealsLogged] = useState<string>(
    '• Breakfast: 4 Boiled Eggs + 60g Oats with Berries & Almonds\n• Lunch: 200g Grilled Chicken Breast + 1 cup Brown Rice & Curd\n• Snack: 1 Scoop Whey Protein Isolate + 1 Banana\n• Dinner: 150g Stir-Fried Paneer + Big Green Salad Bowl'
  );

  const [sleepHours, setSleepHours] = useState<string>('7.5 - 8 Hours (Deep & Restful 🛌)');
  const [energyLevel, setEnergyLevel] = useState<string>('⚡ 9/10 High Energy & Focus');
  const [bodyWeight, setBodyWeight] = useState<string>('74.2 kg (Morning Fasted)');

  const [keyWins, setKeyWins] = useState<string>(
    'Pushed 30kg DBs on incline press for 10 clean reps with zero shoulder discomfort! Drank 4L water.'
  );
  const [questionsOrNotes, setQuestionsOrNotes] = useState<string>(
    'Coach, should I increase weight by 2kg on flat bench next session or focus on higher reps?'
  );

  const [copied, setCopied] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // Derive Current Athlete Name
  const currentClient = clients.find((c) => c.id === selectedClientId);
  const activeClientName =
    selectedClientId === 'custom'
      ? customClientName || 'Athlete'
      : currentClient?.name || 'Athlete';

  // Construct Daily Report Object
  const currentReportData: DailyReportData = {
    id: `daily-${Date.now()}`,
    clientId: selectedClientId !== 'custom' ? selectedClientId : undefined,
    clientName: activeClientName,
    reportDate,
    sessionFocus,
    workoutStatus,
    workoutDetails,
    intensityRating,
    stepsCount,
    dietAdherence,
    mealsLogged,
    waterIntake,
    sleepHours,
    energyLevel,
    bodyWeight,
    keyWins,
    questionsOrNotes,
    timestamp: new Date().toISOString(),
  };

  const formattedWhatsAppText = formatDailyReportWhatsApp(currentReportData);
  const whatsAppUrl = generateWhatsAppLink(SHARE_DESTINATION_PHONE, formattedWhatsAppText);

  // Handle Copy to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(formattedWhatsAppText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Quick Preset Handlers
  const handleInsertWorkoutTemplate = () => {
    setWorkoutDetails(
      `1. Primary Compound Movement: 4 sets x 8-10 reps (Heavy)\n2. Secondary Movement: 3 sets x 10-12 reps\n3. Isolation Movement: 3 sets x 12-15 reps (Strict Form)\n4. Finisher / Dropset: 2 sets to failure\n5. Core / Conditioning: 10-15 mins`
    );
  };

  const handleInsertSundayBiryaniTemplate = () => {
    setDietAdherence('🍗 Sunday Biryani Pass (Approved)');
    setMealsLogged(
      `• Breakfast: Black Coffee + 3 Whole Eggs\n• Lunch: 1 Hearty Plate Delicious Chicken Dum Biryani + Onion Raita (Sunday Feast!)\n• Snack: Whey Protein Shake with Chilled Water\n• Dinner: Light Vegetable Clear Soup & Boiled Eggs\n• Note: Ready to convert these carbs into Monday leg day squats!`
    );
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
  };

  // Submit Handler: Saves to Local Client History & Opens WhatsApp
  const handleSubmitAndSend = () => {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Map into ClientReport format for internal storage
    const mappedWorkoutAdherence = workoutStatus.includes('100%')
      ? 'Excellent (100%)'
      : workoutStatus.includes('80-90%')
      ? 'Good (80-90%)'
      : workoutStatus.includes('Light')
      ? 'Fair (60-70%)'
      : 'Needs Improvement (<50%)';

    const mappedDietAdherence = dietAdherence.includes('100%')
      ? 'Strict & On-Target'
      : dietAdherence.includes('Hit Protein') || dietAdherence.includes('Sunday Biryani')
      ? 'Consistent'
      : dietAdherence.includes('Moderate')
      ? 'Moderate'
      : 'Needs Attention';

    const mappedEnergy = energyLevel.includes('High') || energyLevel.includes('9/10') || energyLevel.includes('10/10')
      ? 'High & Strong'
      : energyLevel.includes('Moderate') || energyLevel.includes('8/10')
      ? 'Moderate'
      : 'Low / Fatigued';

    const clientReportRecord: ClientReport = {
      id: `report-${Date.now()}`,
      clientId: selectedClientId !== 'custom' ? selectedClientId : 'guest',
      clientName: activeClientName,
      reportDate,
      workoutAdherence: mappedWorkoutAdherence,
      dietAdherence: mappedDietAdherence,
      energyLevel: mappedEnergy,
      progressSummary: `[Daily ${sessionFocus}] ${workoutStatus} | Diet: ${dietAdherence} | Sleep: ${sleepHours} | Weight: ${bodyWeight || 'N/A'}`,
      keyWins: keyWins || 'Logged daily fitness check-in with high consistency.',
      coachFeedback: 'Pending review by Coach Varun.',
      nextWeekTargets: questionsOrNotes || 'Keep up the daily training momentum.',
      timestamp: new Date().toISOString(),
      dailyReportDetails: currentReportData,
    };

    if (selectedClientId !== 'custom') {
      onAddReport(selectedClientId, clientReportRecord);
    }

    setSubmittedSuccess(true);
    setTimeout(() => {
      window.open(whatsAppUrl, '_blank');
    }, 300);
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1D24] via-[#14171E] to-[#0F1115] border-2 border-[#25D366]/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#25D366]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
              <span>Direct WhatsApp Daily Check-In</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Submit Your Daily Fitness Report
            </h2>
            <p className="text-sm sm:text-base text-[#A0A3AD] leading-relaxed">
              Log your workout sets, meals, water intake, sleep, and questions. In one click, all details are beautifully formatted and sent directly to Coach Varun on WhatsApp (<span className="text-[#25D366] font-bold">{SHARE_DESTINATION_PHONE_FORMATTED}</span>).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
            <a
              href={`https://wa.me/${SHARE_DESTINATION_PHONE}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-black font-black px-5 py-3.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Chat With Coach Varun</span>
            </a>
            {onNavigateToPortal && (
              <button
                type="button"
                onClick={onNavigateToPortal}
                className="bg-[#1A1D24] hover:bg-[#252830] text-[#E0E0E0] border border-[#2A2D35] px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
              >
                <span>View Assigned Routine</span>
                <ChevronRight className="w-4 h-4 text-[#CCFF00]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification Bar */}
      {submittedSuccess && (
        <div className="bg-[#25D366]/15 border-2 border-[#25D366] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366] text-black flex items-center justify-center flex-shrink-0 font-bold">
              ✓
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-white">
                Daily Report Prepared & Sent to Coach Varun!
              </h4>
              <p className="text-xs text-[#A0A3AD]">
                WhatsApp has been launched with your full report. If it did not open automatically, click the button below.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] text-black font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 w-full sm:w-auto shadow-md"
            >
              <span>Re-Open WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => setSubmittedSuccess(false)}
              className="px-3 py-2 text-xs text-[#8A8D98] hover:text-white rounded-xl bg-[#1A1D24] border border-[#2A2D35]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Two Column Layout: Interactive Form on Left, Live WhatsApp Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Athlete & Session Header */}
          <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#2A2D35]">
              <div className="w-8 h-8 rounded-xl bg-[#CCFF00]/15 text-[#CCFF00] flex items-center justify-center font-black text-sm border border-[#CCFF00]/30">
                1
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Athlete Identity & Date
                </h3>
                <p className="text-xs text-[#8A8D98]">
                  Select your name or enter a custom name for this daily report
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Athlete Selector */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A0A3AD] mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#CCFF00]" />
                  <span>Select Athlete</span>
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#25D366] rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none transition"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      👤 {c.name} ({c.fitnessGoal.replace('_', ' ')})
                    </option>
                  ))}
                  <option value="custom">➕ Other / New Athlete Name...</option>
                </select>
              </div>

              {/* Date Selector */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A0A3AD] mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Report Date</span>
                </label>
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#25D366] rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none transition"
                />
              </div>
            </div>

            {/* Custom Name Input if Selected */}
            {selectedClientId === 'custom' && (
              <div className="pt-1">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#CCFF00] mb-2">
                  Enter Your Full Name
                </label>
                <input
                  type="text"
                  value={customClientName}
                  onChange={(e) => setCustomClientName(e.target.value)}
                  placeholder="e.g. Ashutosh Murai"
                  className="w-full bg-[#0F1115] border border-[#CCFF00]/50 focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none placeholder:text-[#555]"
                  autoFocus
                />
              </div>
            )}

            {/* Session Focus / Split */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A0A3AD] mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-[#CCFF00]" />
                  <span>Today&apos;s Workout Focus / Split</span>
                </span>
                <span className="text-[10px] text-[#8A8D98]">Click to select</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Chest & Triceps (Push)',
                  'Back & Biceps (Pull)',
                  'Legs & Calves (Quads & Hamstrings)',
                  'Shoulders & Arms',
                  'Full Body Strength',
                  'HIIT & Cardio Conditioning',
                  'Core & Abs Finisher',
                  'Active Recovery / Mobility',
                ].map((split) => (
                  <button
                    key={split}
                    type="button"
                    onClick={() => setSessionFocus(split)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                      sessionFocus === split
                        ? 'bg-[#CCFF00]/20 text-[#CCFF00] border-[#CCFF00]'
                        : 'bg-[#0F1115] text-[#A0A3AD] border-[#2A2D35] hover:border-[#444]'
                    }`}
                  >
                    {split}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Workout Details & Adherence */}
          <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2D35]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center font-black text-sm border border-orange-500/30">
                  2
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Workout Breakdown & Intensity
                  </h3>
                  <p className="text-xs text-[#8A8D98]">
                    Log exercises, sets, reps, and overall session intensity
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleInsertWorkoutTemplate}
                className="text-[11px] font-mono text-[#CCFF00] hover:underline flex items-center gap-1 bg-[#0F1115] px-2.5 py-1 rounded-lg border border-[#2A2D35]"
                title="Insert standard workout set template"
              >
                <Sparkles className="w-3 h-3" />
                <span>Preset Format</span>
              </button>
            </div>

            {/* Workout Status */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A0A3AD] mb-2">
                Workout Completion Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Completed 100% 🔥', val: 'Completed 100% As Prescribed 🔥' },
                  { label: 'Solid (80-90%) 👍', val: 'Completed (80-90% of Volume)' },
                  { label: 'Light / Modified 🧘', val: 'Light / Modified Workout' },
                  { label: 'Rest Day 🛌', val: 'Rest / Active Recovery Day' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setWorkoutStatus(item.val)}
                    className={`p-2.5 rounded-xl text-xs font-bold text-center transition border ${
                      workoutStatus === item.val
                        ? 'bg-orange-500/20 text-orange-300 border-orange-500'
                        : 'bg-[#0F1115] text-[#8A8D98] border-[#2A2D35] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity Level & Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A0A3AD] mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>Session Intensity (RPE)</span>
                </label>
                <select
                  value={intensityRating}
                  onChange={(e) => setIntensityRating(e.target.value)}
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#25D366] rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none"
                >
                  <option value="RPE 9.5-10/10 (Peak Beast Mode / Max Effort)">⚡ RPE 9.5-10/10 (Peak Beast Mode / Max Effort)</option>
                  <option value="RPE 8.5/10 (High Energy & Pump)">🔥 RPE 8.5/10 (High Energy & Pump)</option>
                  <option value="RPE 7-8/10 (Solid Controlled Volume)">💪 RPE 7-8/10 (Solid Controlled Volume)</option>
                  <option value="RPE 5-6/10 (Moderate & Steady)">🧘 RPE 5-6/10 (Moderate & Steady)</option>
                  <option value="RPE 1-4/10 (Light Recovery / Stretch)">🌱 RPE 1-4/10 (Light Recovery / Stretch)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A0A3AD] mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Daily Steps / Cardio</span>
                </label>
                <input
                  type="text"
                  value={stepsCount}
                  onChange={(e) => setStepsCount(e.target.value)}
                  placeholder="e.g. 10,500 Steps / 20 mins stairmaster"
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#25D366] rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none placeholder:text-[#555]"
                />
              </div>
            </div>

            {/* Detailed Workout Notes */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A0A3AD] mb-2">
                Exercises, Weights & Sets Performed
              </label>
              <textarea
                rows={4}
                value={workoutDetails}
                onChange={(e) => setWorkoutDetails(e.target.value)}
                placeholder="List your key exercises, weights lifted, and repetitions..."
                className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#25D366] rounded-xl p-3.5 text-xs text-white focus:outline-none font-mono leading-relaxed placeholder:text-[#555]"
              />
            </div>
          </div>

          {/* Step 3: Nutrition, Hydration & Sunday Biryani */}
          <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2D35]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-black text-sm border border-emerald-500/30">
                  3
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Nutrition & Hydration
                  </h3>
                  <p className="text-xs text-[#8A8D98]">
                    Track your diet consistency, protein intake, and water
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleInsertSundayBiryaniTemplate}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg transition"
                title="Apply Sunday Biryani Protocol"
              >
                <span>🍗 Sunday Biryani Pass</span>
              </button>
            </div>

            {/* Diet Adherence Radio Pills */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A0A3AD] mb-2">
                Diet Adherence Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { label: '100% Clean & On Target 🥗', val: '100% Clean & On Target 🥗' },
                  { label: 'Hit Protein + 1 Snack 🍎', val: 'Hit Protein Goal + 1 Free Snack' },
                  { label: '🍗 Sunday Biryani Pass', val: '🍗 Sunday Biryani Pass (Approved)' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setDietAdherence(item.val)}
                    className={`p-2.5 rounded-xl text-xs font-bold text-center transition border ${
                      dietAdherence === item.val
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-[#0F1115] text-[#8A8D98] border-[#2A2D35] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Water Intake & Morning Body Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A0A3AD] mb-2 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Water Intake Today</span>
                </label>
                <select
                  value={waterIntake}
                  onChange={(e) => setWaterIntake(e.target.value)}
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#25D366] rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none"
                >
                  <option value="3.5L+ (Hydration Champion 💧)">💧 3.5L+ (Hydration Champion)</option>
                  <option value="2.5L - 3.5L (Optimal Intake 💧)">💧 2.5L - 3.5L (Optimal Intake)</option>
                  <option value="1.5L - 2.5L (Moderate)">💧 1.5L - 2.5L (Moderate)</option>
                  <option value="< 1.5L (Needs Improvement)">⚠️ &lt; 1.5L (Needs Improvement)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A0A3AD] mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#CCFF00]" />
                  <span>Fasted Body Weight / Status</span>
                </label>
                <input
                  type="text"
                  value={bodyWeight}
                  onChange={(e) => setBodyWeight(e.target.value)}
                  placeholder="e.g. 74.2 kg (Morning Fasted)"
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#25D366] rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none placeholder:text-[#555]"
                />
              </div>
            </div>

            {/* Daily Meals Breakdown */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A0A3AD] mb-2">
                Meals & Foods Logged Today
              </label>
              <textarea
                rows={3}
                value={mealsLogged}
                onChange={(e) => setMealsLogged(e.target.value)}
                placeholder="List what you ate today (Breakfast, Lunch, Snacks, Dinner)..."
                className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#25D366] rounded-xl p-3.5 text-xs text-white focus:outline-none font-mono leading-relaxed placeholder:text-[#555]"
              />
            </div>
          </div>

          {/* Step 4: Sleep, Energy, Wins & Coach Notes */}
          <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#2A2D35]">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-black text-sm border border-purple-500/30">
                4
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Sleep, Recovery & Coach Notes
                </h3>
                <p className="text-xs text-[#8A8D98]">
                  Share your rest metrics, personal wins, and questions for Coach Varun
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A0A3AD] mb-2 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-purple-400" />
                  <span>Sleep Last Night</span>
                </label>
                <select
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#25D366] rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none"
                >
                  <option value="8+ Hours (Deep & Restful 🛌)">🛌 8+ Hours (Deep & Restful)</option>
                  <option value="7.5 - 8 Hours (Deep & Restful 🛌)">🛌 7.5 - 8 Hours (Solid Recovery)</option>
                  <option value="6 - 7 Hours (Moderate Rest)">🛌 6 - 7 Hours (Moderate Rest)</option>
                  <option value="< 6 Hours (Fatigued / Broken Sleep)">⚠️ &lt; 6 Hours (Fatigued)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A0A3AD] mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Energy & Readiness</span>
                </label>
                <select
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(e.target.value)}
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#25D366] rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none"
                >
                  <option value="⚡ 10/10 Peak Energy & Explosive">⚡ 10/10 Peak Energy & Explosive</option>
                  <option value="⚡ 9/10 High Energy & Focus">⚡ 9/10 High Energy & Focus</option>
                  <option value="🔥 7-8/10 Solid & Consistent">🔥 7-8/10 Solid & Consistent</option>
                  <option value="😴 5-6/10 Moderate / Muscle Soreness">😴 5-6/10 Moderate / Muscle Soreness</option>
                  <option value="💤 < 5/10 Heavy Fatigue">💤 &lt; 5/10 Heavy Fatigue</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A0A3AD] mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#CCFF00]" />
                <span>Today&apos;s Key Win / Milestone</span>
              </label>
              <input
                type="text"
                value={keyWins}
                onChange={(e) => setKeyWins(e.target.value)}
                placeholder="e.g. New PR on bench press, resisted sugary snacks, completed 10k steps"
                className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#25D366] rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none placeholder:text-[#555]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A0A3AD] mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Message or Question for Coach Varun</span>
              </label>
              <input
                type="text"
                value={questionsOrNotes}
                onChange={(e) => setQuestionsOrNotes(e.target.value)}
                placeholder="e.g. Should I increase dumbbell weight on shoulder press next time?"
                className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#25D366] rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none placeholder:text-[#555]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live WhatsApp Message Preview & 1-Click Dispatch (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Main Action Card */}
          <div className="bg-[#1A1D24] border-2 border-[#25D366]/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#25D366] animate-pulse" />
                <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                  <span>Live WhatsApp Preview</span>
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded border border-[#25D366]/30">
                To: {SHARE_DESTINATION_PHONE_FORMATTED}
              </span>
            </div>

            {/* Styled WhatsApp Chat Bubble */}
            <div className="bg-[#0b141a] rounded-2xl p-4 sm:p-5 border border-[#1f2c34] shadow-inner font-sans relative overflow-hidden">
              <div className="text-[11px] font-mono text-[#8696a0] mb-2 flex items-center justify-between border-b border-[#1f2c34] pb-2">
                <span>To: Coach Varun (+91 7499 177 223)</span>
                <span>Today</span>
              </div>
              <div className="bg-[#005c4b] text-[#e9edef] p-4 rounded-2xl rounded-tr-none text-xs leading-relaxed font-mono whitespace-pre-wrap shadow-md max-h-[380px] overflow-y-auto custom-scrollbar">
                {formattedWhatsAppText}
              </div>
              <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-[#8696a0]">
                <span>✓✓ Delivered to Coach Varun</span>
                <span className="font-mono">Auto-formatted</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                id="daily-report-submit-whatsapp-btn"
                type="button"
                onClick={handleSubmitAndSend}
                className="w-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-black font-black py-4 px-6 rounded-2xl text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-[#25D366]/25 transition cursor-pointer transform hover:-translate-y-0.5"
              >
                <Send className="w-5 h-5 fill-current" />
                <span>Send Daily Report on WhatsApp</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="bg-[#0F1115] hover:bg-[#252830] text-[#E0E0E0] border border-[#2A2D35] py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#25D366]" />
                      <span className="text-[#25D366]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#8A8D98]" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/${SHARE_DESTINATION_PHONE}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#0F1115] hover:bg-[#252830] text-[#E0E0E0] border border-[#2A2D35] py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Direct Chat</span>
                </a>
              </div>
            </div>

            {/* Coach Varun Guarantee Note */}
            <div className="bg-[#0F1115]/60 border border-[#2A2D35] rounded-xl p-3.5 text-center space-y-1">
              <p className="text-[11px] text-[#A0A3AD]">
                Coach Varun personally reviews every daily submission and provides feedback on exercise progression, recovery, and meal tweaks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
