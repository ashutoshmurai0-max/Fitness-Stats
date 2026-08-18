import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  User,
  Dumbbell,
  CheckCircle2,
  Calendar,
  Zap,
  Activity,
  Apple,
  Shield,
  HelpCircle,
  Smartphone,
  ChevronRight,
  BookOpen,
  ArrowRight,
  MessageSquare,
  Flame,
  Award,
  Clock,
  ExternalLink,
  Target,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClientData, ClientReport, HOST_CONTACT, SHARE_DESTINATION_PHONE, SHARE_DESTINATION_PHONE_FORMATTED } from '../types';
import { generateWhatsAppLink, formatClientReportWhatsApp } from '../utils/whatsappFormatter';
import { getTodayDateString } from '../utils/storage';

interface ClientPortalViewProps {
  clients: ClientData[];
  onAddReport: (clientId: string, report: ClientReport) => void;
  onNavigateToDailyReport?: () => void;
  onNavigateToAdvice: () => void;
  onNavigateToWhatsApp: () => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  clients,
  onAddReport,
  onNavigateToDailyReport,
  onNavigateToAdvice,
  onNavigateToWhatsApp,
}) => {
  // Selected client for lookup
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  // Check-In Submitter State
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [checkInClientId, setCheckInClientId] = useState<string>(clients[0]?.id || '');
  const [athleteCustomName, setAthleteCustomName] = useState('');
  const [isNewAthlete, setIsNewAthlete] = useState(false);

  const [workoutAdherence, setWorkoutAdherence] = useState<
    'Excellent (100%)' | 'Good (80-90%)' | 'Fair (60-70%)' | 'Needs Improvement (<50%)'
  >('Excellent (100%)');
  const [dietAdherence, setDietAdherence] = useState<
    'Strict & On-Target' | 'Consistent' | 'Moderate' | 'Needs Attention'
  >('Strict & On-Target');
  const [energyLevel, setEnergyLevel] = useState<'High & Strong' | 'Moderate' | 'Low / Fatigued'>(
    'High & Strong'
  );
  const [progressSummary, setProgressSummary] = useState('');
  const [keyWins, setKeyWins] = useState('');
  const [questionsForCoach, setQuestionsForCoach] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // AI Quick Question State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Handle Client Check-In Submit
  const handleSubmitCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveName = isNewAthlete
      ? athleteCustomName.trim() || 'Athlete'
      : clients.find((c) => c.id === checkInClientId)?.name || 'Athlete';

    const targetClientId = isNewAthlete ? `new-${Date.now()}` : checkInClientId;

    const newReport: ClientReport = {
      id: `rep-${Date.now()}`,
      clientId: targetClientId,
      clientName: effectiveName,
      reportDate: getTodayDateString(),
      workoutAdherence,
      dietAdherence,
      energyLevel,
      progressSummary: progressSummary.trim() || 'Completed weekly assigned training and nutrition targets.',
      keyWins: keyWins.trim() || 'Maintained high consistency throughout the week.',
      coachFeedback: 'Pending review by Coach Varun.',
      nextWeekTargets: questionsForCoach.trim() ? `Client Query: ${questionsForCoach}` : 'Keep progressive overload momentum going.',
      timestamp: new Date().toISOString(),
    };

    // Save report in state if existing client
    if (!isNewAthlete && checkInClientId) {
      onAddReport(checkInClientId, newReport);
    }

    // Format WhatsApp message to Coach Varun (+91 7499 177 223)
    const reportWhatsAppText = formatClientReportWhatsApp(newReport);
    const whatsappUrl = generateWhatsAppLink(SHARE_DESTINATION_PHONE, reportWhatsAppText);

    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    setSubmittedSuccess(true);

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsCheckInOpen(false);
      setProgressSummary('');
      setKeyWins('');
      setQuestionsForCoach('');
    }, 2500);
  };

  // Handle Quick AI Question
  const handleAskAi = async (presetQuestion?: string) => {
    const q = presetQuestion || aiQuestion;
    if (!q.trim()) return;

    setIsAiLoading(true);
    setAiAnswer(null);

    try {
      const response = await fetch('/api/fitness-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: q,
          userGoal: selectedClient?.fitnessGoal || 'general_health',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiAnswer(data.advice || data.result);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      // Fallback expert guidance
      setAiAnswer(
        `Coach Varun's Protocol for "${q}": Prioritize progressive overload (adding 1-2 reps or 2.5kg each week), consume 1.6-2.0g protein per kg of bodyweight, stay hydrated with 3.5L water, and get 7-8 hours of quality sleep. Feel free to message Coach Varun on WhatsApp (${SHARE_DESTINATION_PHONE_FORMATTED}) for specific routine adjustments!`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Friendly Hero Banner for Clients */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1D24] via-[#15171D] to-[#0F1115] border border-[#2A2D35] rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#CCFF00]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Athlete & Client Hub
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none">
              Welcome to Your <span className="text-[#CCFF00]">Fitness Portal</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#A0A3AD] leading-relaxed">
              Track your personalized workout routine, view Coach Varun's latest feedback notes, submit your weekly progress check-in, and get instant answers to your training and diet questions.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {onNavigateToDailyReport && (
              <button
                id="client-submit-daily-report-hero-btn"
                type="button"
                onClick={onNavigateToDailyReport}
                className="bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-black font-black px-5 py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#25D366]/20 transition cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Submit Daily Report (WhatsApp)</span>
              </button>
            )}

            <button
              id="client-submit-checkin-top-btn"
              type="button"
              onClick={() => setIsCheckInOpen(true)}
              className="bg-[#CCFF00] hover:bg-[#b8e600] active:bg-[#a3cc00] text-[#0F1115] font-black px-5 py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#CCFF00]/15 transition cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Weekly Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Quick User-Friendly Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Submit Daily Report (WhatsApp) */}
        <div
          onClick={onNavigateToDailyReport || (() => setIsCheckInOpen(true))}
          className="bg-gradient-to-br from-[#1A1D24] to-[#14231a] border-2 border-[#25D366]/40 hover:border-[#25D366] rounded-2xl p-5 sm:p-6 transition shadow-lg cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mb-4 group-hover:scale-110 transition border border-[#25D366]/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center justify-between">
              <span>Daily Report (WhatsApp)</span>
              <ChevronRight className="w-4 h-4 text-[#8A8D98] group-hover:text-[#25D366] transition" />
            </h3>
            <p className="text-xs text-[#A0A3AD] mt-2 leading-relaxed">
              Log today&apos;s workout sets, meals, water, sleep, and questions. Auto-formats and sends directly to Coach Varun on WhatsApp (+91 7499 177 223).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2A2D35] flex items-center text-xs font-bold text-[#25D366] uppercase tracking-wider">
            <span>Send Daily Report &rarr;</span>
          </div>
        </div>

        {/* Card 2: Weekly Review */}
        <div
          onClick={() => setIsCheckInOpen(true)}
          className="bg-[#1A1D24] border border-[#2A2D35] hover:border-[#CCFF00]/50 rounded-2xl p-5 sm:p-6 transition shadow-lg cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#CCFF00]/10 text-[#CCFF00] flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center justify-between">
              <span>Weekly Progress Review</span>
              <ChevronRight className="w-4 h-4 text-[#8A8D98] group-hover:text-[#CCFF00] transition" />
            </h3>
            <p className="text-xs text-[#8A8D98] mt-2 leading-relaxed">
              Submit overall weekly adherence, achievements, and review targets with Coach Varun.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2A2D35] flex items-center text-xs font-bold text-[#CCFF00] uppercase tracking-wider">
            <span>Weekly Check-In &rarr;</span>
          </div>
        </div>

        {/* Card 3: Fitness Advice Hub */}
        <div
          onClick={onNavigateToAdvice}
          className="bg-[#1A1D24] border border-[#2A2D35] hover:border-cyan-500/50 rounded-2xl p-5 sm:p-6 transition shadow-lg cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center justify-between">
              <span>Fitness Advice Hub</span>
              <ChevronRight className="w-4 h-4 text-[#8A8D98] group-hover:text-cyan-400 transition" />
            </h3>
            <p className="text-xs text-[#8A8D98] mt-2 leading-relaxed">
              Explore science-backed principles for fat loss, muscle hypertrophy, protein sources, and workout splits.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2A2D35] flex items-center text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <span>Browse Advice &rarr;</span>
          </div>
        </div>

        {/* Card 4: WhatsApp Connect */}
        <div
          onClick={onNavigateToWhatsApp}
          className="bg-[#1A1D24] border border-[#2A2D35] hover:border-[#25D366]/50 rounded-2xl p-5 sm:p-6 transition shadow-lg cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center justify-between">
              <span>Direct WhatsApp Hub</span>
              <ChevronRight className="w-4 h-4 text-[#8A8D98] group-hover:text-[#25D366] transition" />
            </h3>
            <p className="text-xs text-[#8A8D98] mt-2 leading-relaxed">
              Connect directly with Coach Varun at <span className="text-[#25D366] font-bold">{SHARE_DESTINATION_PHONE_FORMATTED}</span> with quick templates.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2A2D35] flex items-center text-xs font-bold text-[#25D366] uppercase tracking-wider">
            <span>Open WhatsApp &rarr;</span>
          </div>
        </div>
      </div>

      {/* 🍗 HILARIOUS SUNDAY BIRYANI DECREE BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-950/40 via-[#1F1913] to-[#1A1D24] border-2 border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="absolute -right-6 -bottom-6 text-7xl opacity-20 pointer-events-none select-none">
          🍗🍚
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase tracking-wider">
              <span>🍗 Official Sunday Nutrition Directive</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>On Sunday, You Can Eat Biryani!</span>
              <span className="text-xl">🍚🔥</span>
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-medium">
              &ldquo;<strong className="text-amber-300">Coach Varun&apos;s Holy Sunday Rule:</strong> Calories are legally on vacation every Sunday! Science confirms that delicious Dum Biryani reloads your glycogen stores — just make sure you crush your Monday leg day with 200% guilt-free beast mode!&rdquo;
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#A0A3AD] pt-1">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                ✓ 100% Guilt-Free
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                ✓ Extra Raita = Essential Calcium
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#CCFF00] font-bold">
                ✓ Monday Squats Contract
              </span>
            </div>
          </div>

          <div className="flex sm:flex-col items-stretch gap-2 flex-shrink-0">
            <a
              id="sunday-biryani-whatsapp-btn"
              href={`https://wa.me/${SHARE_DESTINATION_PHONE}?text=${encodeURIComponent("Hey Coach Varun! 🍗 Today is Sunday, so I am officially redeeming my Biryani Pass! Expect heavy squats tomorrow! 💪🍚🔥")}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } })}
              className="bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-black font-black px-4 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition cursor-pointer"
            >
              <span>🍗 Claim Biryani Pass</span>
            </a>
            <button
              type="button"
              onClick={onNavigateToAdvice}
              className="bg-[#0F1115] hover:bg-[#252830] text-[#E0E0E0] border border-[#2A2D35] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
            >
              <span>View Rule In Hub</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Section: Athlete Plan & Coach Feedback Viewer */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2D35] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#CCFF00]/10 text-[#CCFF00] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                My Athlete Profile & Workout Plan
              </h2>
              <p className="text-xs text-[#8A8D98]">
                Select your name to view your assigned workout schedule, dietary targets, and coach feedback.
              </p>
            </div>
          </div>

          {/* Client Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8A8D98] whitespace-nowrap font-bold uppercase">Select Athlete:</span>
            <select
              id="client-portal-selector"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.fitnessGoal.replace('_', ' ').toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedClient ? (
          <div className="space-y-6">
            {/* Athlete Info Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#0F1115] p-4 rounded-2xl border border-[#2A2D35]">
                <span className="text-[10px] text-[#8A8D98] uppercase font-bold tracking-wider">Athlete Name</span>
                <div className="text-base font-black text-white mt-1">{selectedClient.name}</div>
                <div className="text-xs text-[#8A8D98] mt-0.5">{selectedClient.phoneNumber}</div>
              </div>

              <div className="bg-[#0F1115] p-4 rounded-2xl border border-[#2A2D35]">
                <span className="text-[10px] text-[#8A8D98] uppercase font-bold tracking-wider">Primary Goal</span>
                <div className="text-base font-black text-[#CCFF00] mt-1 uppercase">
                  {selectedClient.fitnessGoal.replace('_', ' ')}
                </div>
                <div className="text-xs text-[#8A8D98] mt-0.5">Plan Status: {selectedClient.planStatus.toUpperCase()}</div>
              </div>

              <div className="bg-[#0F1115] p-4 rounded-2xl border border-[#2A2D35]">
                <span className="text-[10px] text-[#8A8D98] uppercase font-bold tracking-wider">Assigned Training Split</span>
                <div className="text-xs font-bold text-white mt-1 leading-snug">
                  {selectedClient.assignedWorkoutPlan || 'Personalized Routine'}
                </div>
              </div>

              <div className="bg-[#0F1115] p-4 rounded-2xl border border-[#2A2D35]">
                <span className="text-[10px] text-[#8A8D98] uppercase font-bold tracking-wider">Diet Preference</span>
                <div className="text-xs font-bold text-emerald-400 mt-1 leading-snug">
                  {selectedClient.dietaryPreference || 'High Protein Balanced'}
                </div>
              </div>
            </div>

            {/* Coach's Latest Feedback & Notes */}
            <div className="bg-gradient-to-r from-[#0F1115] to-[#14161C] border border-[#2A2D35] rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#CCFF00] uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Coach Varun's Focus Guidance & Strategy</span>
              </div>
              <p className="text-sm text-white leading-relaxed">
                {selectedClient.coachNotes || 'Prioritize consistent workout logs, maintain hydration (3.5L/day), and ensure 7-8 hours of restorative sleep.'}
              </p>
              {selectedClient.latestReportSummary && (
                <div className="pt-2 border-t border-[#2A2D35]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#A0A3AD]">
                  <span><strong>Latest Review ({selectedClient.latestReportDate}):</strong> {selectedClient.latestReportSummary}</span>
                </div>
              )}
            </div>

            {/* Past Check-In Reports History */}
            {selectedClient.reports && selectedClient.reports.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#CCFF00]" />
                  <span>My Past Check-In Reports ({selectedClient.reports.length})</span>
                </h3>

                <div className="space-y-3">
                  {selectedClient.reports.map((rep) => (
                    <div
                      key={rep.id}
                      className="bg-[#0F1115] border border-[#2A2D35] rounded-2xl p-4 sm:p-5 space-y-3 hover:border-[#CCFF00]/30 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2D35]/60 pb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#CCFF00]" />
                          <span className="text-xs font-mono font-bold text-white">
                            Week of {rep.reportDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap text-[11px]">
                          <span className="px-2 py-0.5 rounded-full bg-[#CCFF00]/10 text-[#CCFF00] font-bold border border-[#CCFF00]/20">
                            Workout: {rep.workoutAdherence}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                            Diet: {rep.dietAdherence}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20">
                            Energy: {rep.energyLevel}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#8A8D98]">Progress Summary</span>
                          <p className="text-white mt-0.5">{rep.progressSummary}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#8A8D98]">Key Wins & PRs</span>
                          <p className="text-[#CCFF00] font-medium mt-0.5">{rep.keyWins}</p>
                        </div>
                      </div>

                      {rep.coachFeedback && (
                        <div className="bg-[#1A1D24] p-3 rounded-xl border border-[#2A2D35] text-xs space-y-1">
                          <span className="text-[10px] font-bold uppercase text-cyan-400">Coach Feedback</span>
                          <p className="text-[#E0E0E0]">{rep.coachFeedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-[#8A8D98]">
            No client profile selected. Click "Submit Weekly Check-In" to log your first report!
          </div>
        )}
      </div>

      {/* AI Coach Varun Instant Q&A for Clients */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#CCFF00]/10 text-[#CCFF00] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
              Ask Coach Varun (Instant AI Fitness Guide)
            </h3>
            <p className="text-xs text-[#8A8D98]">
              Got a quick question about pre-workout meals, exercise form, supplements, or recovery? Ask below:
            </p>
          </div>
        </div>

        {/* Quick Sample Questions */}
        <div className="flex flex-wrap gap-2">
          {[
            'What is the best pre-workout meal 1 hour before training?',
            'How do I break through a bench press plateau?',
            'How much protein do I need per day for muscle growth?',
            'What should I do on my rest days for faster recovery?',
          ].map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setAiQuestion(prompt);
                handleAskAi(prompt);
              }}
              className="bg-[#0F1115] hover:bg-[#252830] text-[#A0A3AD] hover:text-white px-3 py-1.5 rounded-xl text-xs transition border border-[#2A2D35] text-left"
            >
              💡 {prompt}
            </button>
          ))}
        </div>

        {/* Input & Ask Button */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
            placeholder="Type any fitness or nutrition question (e.g. Best vegetarian protein sources)..."
            className="flex-1 bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleAskAi()}
            disabled={isAiLoading || !aiQuestion.trim()}
            className="bg-[#CCFF00] hover:bg-[#b8e600] disabled:opacity-40 text-[#0F1115] font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {isAiLoading ? (
              <span className="animate-pulse">Consulting...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Get Advice</span>
              </>
            )}
          </button>
        </div>

        {/* Answer Box */}
        {aiAnswer && (
          <div className="bg-[#0F1115] border border-[#CCFF00]/40 rounded-2xl p-5 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold text-[#CCFF00] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Coach Varun's Science-Backed Recommendation</span>
            </div>
            <p className="text-xs sm:text-sm text-[#E0E0E0] leading-relaxed whitespace-pre-line">
              {aiAnswer}
            </p>
          </div>
        )}
      </div>

      {/* CLIENT CHECK-IN MODAL */}
      {isCheckInOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#2A2D35] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#CCFF00]/10 text-[#CCFF00] rounded-xl">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                    Weekly Athlete Check-In
                  </h3>
                  <p className="text-xs text-[#8A8D98]">
                    Submit your progress to Coach Varun via WhatsApp (+91 7499 177 223).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckInOpen(false)}
                className="text-[#8A8D98] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitCheckIn} className="space-y-4">
              {/* Athlete Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#A0A3AD] uppercase tracking-wider">
                    Athlete Name
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsNewAthlete(!isNewAthlete)}
                    className="text-[11px] text-[#CCFF00] hover:underline"
                  >
                    {isNewAthlete ? 'Select from roster' : '+ New Athlete / Not on list?'}
                  </button>
                </div>

                {isNewAthlete ? (
                  <input
                    type="text"
                    value={athleteCustomName}
                    onChange={(e) => setAthleteCustomName(e.target.value)}
                    placeholder="Enter your full name..."
                    className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                ) : (
                  <select
                    value={checkInClientId}
                    onChange={(e) => setCheckInClientId(e.target.value)}
                    className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.fitnessGoal.replace('_', ' ')})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Workout Adherence */}
              <div>
                <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                  Workout Adherence This Week
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Excellent (100%)',
                    'Good (80-90%)',
                    'Fair (60-70%)',
                    'Needs Improvement (<50%)',
                  ].map((adh) => (
                    <button
                      key={adh}
                      type="button"
                      onClick={() => setWorkoutAdherence(adh as any)}
                      className={`p-2 rounded-xl text-xs font-bold transition text-left border ${
                        workoutAdherence === adh
                          ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]'
                          : 'bg-[#0F1115] text-[#8A8D98] border-[#2A2D35] hover:text-white'
                      }`}
                    >
                      {adh}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet Adherence */}
              <div>
                <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                  Nutrition / Protein Adherence
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Strict & On-Target',
                    'Consistent',
                    'Moderate',
                    'Needs Attention',
                  ].map((diet) => (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => setDietAdherence(diet as any)}
                      className={`p-2 rounded-xl text-xs font-bold transition text-left border ${
                        dietAdherence === diet
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                          : 'bg-[#0F1115] text-[#8A8D98] border-[#2A2D35] hover:text-white'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Level */}
              <div>
                <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                  Energy & Recovery Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['High & Strong', 'Moderate', 'Low / Fatigued'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setEnergyLevel(lvl as any)}
                      className={`p-2 rounded-xl text-xs font-bold transition text-center border ${
                        energyLevel === lvl
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                          : 'bg-[#0F1115] text-[#8A8D98] border-[#2A2D35] hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Wins & PRs */}
              <div>
                <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                  Key Wins & Achievements This Week
                </label>
                <input
                  type="text"
                  value={keyWins}
                  onChange={(e) => setKeyWins(e.target.value)}
                  placeholder="e.g. Hit new 80kg bench PR, drank 3.5L water daily, completed all 4 workouts"
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Progress Summary / How did workouts feel */}
              <div>
                <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                  How Did Your Workouts & Diet Feel?
                </label>
                <textarea
                  rows={2}
                  value={progressSummary}
                  onChange={(e) => setProgressSummary(e.target.value)}
                  placeholder="e.g. Recovery was smooth, felt energized during leg day, adhered to high protein..."
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              {/* Questions For Coach */}
              <div>
                <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                  Any Questions or Feedback for Coach Varun?
                </label>
                <input
                  type="text"
                  value={questionsForCoach}
                  onChange={(e) => setQuestionsForCoach(e.target.value)}
                  placeholder="e.g. Should I add creatine? Can we adjust leg volume?"
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              {submittedSuccess && (
                <div className="p-3 bg-[#25D366]/20 border border-[#25D366]/40 rounded-xl text-xs text-[#25D366] font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Check-in submitted! Opening WhatsApp ({SHARE_DESTINATION_PHONE_FORMATTED})...</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckInOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#0F1115] hover:bg-[#252830] text-[#8A8D98] hover:text-white text-xs font-bold uppercase tracking-wider transition border border-[#2A2D35]"
                >
                  Cancel
                </button>
                <button
                  id="client-submit-checkin-whatsapp-btn"
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-[#25D366]/10 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Submit to Coach on WhatsApp ({SHARE_DESTINATION_PHONE_FORMATTED})</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
