import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Dumbbell,
  Apple,
  Shield,
  Pill,
  Send,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Search,
  Activity,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FitnessAdviceItem, HOST_CONTACT, SHARE_DESTINATION_PHONE, SHARE_DESTINATION_PHONE_FORMATTED } from '../types';
import { generateWhatsAppLink, formatFitnessAdviceWhatsApp, formatCustomAdviceWhatsApp } from '../utils/whatsappFormatter';

export const CORE_FITNESS_ADVICES: FitnessAdviceItem[] = [
  {
    id: 'fat-loss-mastery',
    title: 'Fat Loss & Lean Definition Fundamentals',
    category: 'Fat Loss',
    icon: 'Flame',
    summary: 'Sustainable fat loss is governed by an energy deficit paired with high protein intake and resistance training to preserve lean muscle tissue.',
    coreRules: [
      'Maintain a moderate caloric deficit (300–500 kcal below maintenance) for steady fat loss without metabolic slowdown.',
      'Aim for 1.8g to 2.2g of protein per kg of bodyweight to maximize muscle retention and satiety.',
      'Prioritize resistance training 3–5 days per week to signal your body to burn stored fat rather than muscle.',
      'Increase Non-Exercise Physical Activity (NEAT) by hitting 8,000–10,000 steps daily.',
      'Prioritize high-volume, fibrous foods (green veggies, berries, potatoes, lean meats) to maintain fullness.',
    ],
    sampleRoutineOrMeal: [
      'Cardio Strategy: 20–30 mins of low-impact Zone 2 cardio (incline walking or cycling) 3x/week after lifting.',
      'Meal Timing: Distribute protein evenly across 3–4 meals with at least 30g protein per feeding.',
    ],
    commonMistakes: [
      'Slashing calories drastically (>800 kcal deficit), which leads to muscle loss, cravings, and hormonal crashes.',
      'Relying purely on cardio and abandoning weightlifting.',
      'Underestimating liquid calories (sodas, sugary coffee syrups, heavy cooking oils).',
    ],
    coachProTip: 'Track your progress using weekly waist measurements and gym strength rather than daily scale fluctuations caused by water retention.',
  },
  {
    id: 'hypertrophy-principles',
    title: 'Muscle Hypertrophy & Progressive Overload',
    category: 'Muscle Gain',
    icon: 'Dumbbell',
    summary: 'Muscles grow in response to mechanical tension, progressive overload, and adequate recovery fuel.',
    coreRules: [
      'Apply Progressive Overload: Consistently add weight, reps, or improve execution tempo on compound lifts over time.',
      'Train in the 6–15 rep range with 1–2 Reps in Reserve (RIR) to stimulate maximum high-threshold motor unit recruitment.',
      'Target 10–20 hard working sets per muscle group per week distributed across 2 sessions per week.',
      'Rest 2–3 minutes between heavy compound sets to allow ATP replenishment for maximum power output.',
      'Eat in a mild caloric surplus (200–300 kcal above maintenance) to support new muscle synthesis with minimal fat gain.',
    ],
    sampleRoutineOrMeal: [
      'Hypertrophy Split: Push / Pull / Legs (PPL) or 4-Day Upper / Lower for optimal frequency and recovery.',
      'Post-Workout Window: Consume 30–40g of rapid-digesting protein paired with 40–60g of clean carbohydrates within 2 hours.',
    ],
    commonMistakes: [
      'Ego lifting: Sacrificing range of motion and joint stability to lift heavier weights.',
      'Changing workout routines every week ("muscle confusion" myth) instead of mastering core lifts.',
      'Undereating protein and sleeping fewer than 7 hours per night.',
    ],
    coachProTip: 'Control the negative (eccentric) phase of every repetition for 2–3 seconds. That is where peak muscle micro-tearing occurs.',
  },
  {
    id: 'clean-nutrition-fuel',
    title: 'Clean Nutrition & High-Protein Fueling',
    category: 'Nutrition',
    icon: 'Apple',
    summary: 'Nutrition is the cornerstone of body composition, athletic performance, and hormonal balance.',
    coreRules: [
      'Build every meal around a high-quality protein anchor (Eggs, Chicken Breast, Fish, Paneer, Tofu, Greek Yogurt, Whey).',
      'Choose complex carbohydrates (Oats, Sweet Potatoes, Basmati Rice, Quinoa, Whole Grains) for sustained glycogen replenishment.',
      'Include essential dietary fats (Avocados, Extra Virgin Olive Oil, Almonds, Chia Seeds, Egg Yolks) to support testosterone and joint lubrication.',
      'Drink 35–45 ml of water per kg of body weight daily (3 to 4 liters) for optimal nutrient transportation and kidney function.',
      'Follow the 80/20 Rule: 80% whole, single-ingredient nutrient-dense foods, and 20% flexible lifestyle choices.',
    ],
    sampleRoutineOrMeal: [
      'Breakfast: 3 whole eggs scrambled with spinach + 1 bowl of steel-cut oats topped with blueberries.',
      'Lunch: 180g grilled chicken / tofu bowl with brown rice, steamed broccoli, and 1 tbsp cold-pressed olive oil.',
      'Pre-Workout Fuel: 1 banana with 1 tbsp peanut butter and a pinch of pink Himalayan salt 45 mins before training.',
    ],
    commonMistakes: [
      'Fearing carbohydrates: Carbs are the primary fuel source for high-intensity lifting and explosive energy.',
      'Inconsistent hydration: Dehydration of just 2% decreases gym strength by up to 15%.',
    ],
    coachProTip: 'Season your food well with spices (turmeric, black pepper, garlic, cumin) to enjoy clean eating for life without feeling deprived.',
  },
  {
    id: 'recovery-injury-prevention',
    title: 'Recovery, Sleep & Injury Prevention',
    category: 'Recovery & Injury',
    icon: 'Shield',
    summary: 'You do not grow in the gym—you break down muscle in the gym, and grow while resting and sleeping.',
    coreRules: [
      'Prioritize 7.5 to 9 hours of quality sleep nightly; 90% of growth hormone release happens in deep slow-wave sleep.',
      'Perform a 5–8 minute dynamic warm-up (hip openers, thoracic twists, band pull-aparts) before loading heavy weights.',
      'Take a scheduled Deload Week every 6–8 weeks (reduce working volume by 50%) to recover joints, tendons, and the nervous system.',
      'Practice active recovery on off days: 30 minutes of brisk walking, swimming, or full-body yoga stretching.',
      'Manage stress levels: Chronic cortisol elevation impairs protein synthesis and increases abdominal fat storage.',
    ],
    sampleRoutineOrMeal: [
      'Pre-Bed Routine: No screens 45 mins before bed, cool dark room (19-21°C), and 300mg Magnesium Glycinate.',
      'Joint Care Routine: Light face-pulls and band dislocates between heavy pushing workouts.',
    ],
    commonMistakes: [
      'Pushing through sharp joint pain instead of adjusting grip, stance, or exercise angles.',
      'Treating rest days as completely sedentary couch days instead of walking for lymphatic flow.',
    ],
    coachProTip: 'Listen to joint feedback. Sore muscles mean adaptation; painful tendons mean you need to modify leverage or lower the load.',
  },
  {
    id: 'supplements-decoded',
    title: 'Evidence-Based Supplement Science',
    category: 'Supplements',
    icon: 'Pill',
    summary: 'Supplements are the final 5%—they enhance a solid diet and training foundation, but cannot replace them.',
    coreRules: [
      'Creatine Monohydrate (3–5g daily): The most researched supplement on Earth. Increases cellular phosphocreatine, boosting explosive power, strength, and muscle hydration.',
      'Whey / Plant Protein Isolate: A convenient, high-bioavailability tool to hit daily protein quotas effortlessly.',
      'Omega-3 Fish Oil (1000–2000mg EPA/DHA): Lowers systemic inflammation, supports cardiac health, and assists joint lubrication.',
      'Vitamin D3 (2000–4000 IU daily): Essential for immune function, bone density, and optimal hormonal production.',
      'Caffeine (100–200mg): Proven ergogenic aid for workout intensity and focus when consumed 30–45 mins pre-training.',
    ],
    commonMistakes: [
      'Buying expensive proprietary fat burners (99% marketing, mostly cheap caffeine and fillers).',
      'Loading creatine with 20g/day: Unnecessary; 3-5g daily will fully saturate muscle cells in 3 weeks without GI distress.',
    ],
    coachProTip: 'Consistency beats timing with creatine. Take 5g every single day at any time with water or a post-workout meal.',
  },
  {
    id: 'master-workout-splits',
    title: 'Top Workout Splits & Weekly Programming',
    category: 'Workout Splits',
    icon: 'Zap',
    summary: 'Choose a workout split based on how many days you can realistically commit to every single week.',
    coreRules: [
      '3 Days/Week: Full Body Routine (Mon/Wed/Fri) — Ideal for beginners, busy professionals, and rapid compound strength gains.',
      '4 Days/Week: Upper / Lower Split (Mon/Tue/Thu/Fri) — The sweet spot for balance, recovery, and hypertrophy.',
      '5–6 Days/Week: Push / Pull / Legs (PPL) — Maximum volume distribution for dedicated bodybuilders and athletes.',
      'Home Setup: 4-Day Dumbbell + Calisthenics Routine — Equal stimulus using progressive tempo and paused reps.',
    ],
    sampleRoutineOrMeal: [
      'Upper Day Sample: Incline Dumbbell Press (4x8-10), Barbell Row (4x8-10), Overhead Press (3x10), Lat Pulldown (3x12), Bicep/Tricep Superset (3x12).',
      'Lower Day Sample: Barbell Back Squats (4x6-8), Romanian Deadlifts (4x8-10), Bulgarian Split Squats (3x10/leg), Standing Calf Raises (4x15).',
    ],
    commonMistakes: [
      'Skipping Leg Day: Missing 50% of your body\'s muscle mass and powerful anabolic endocrine signaling.',
      'Doing too much junk volume (30+ sets per session) leading to chronic central nervous system exhaustion.',
    ],
    coachProTip: 'The best workout split is the one you can stick to 52 weeks a year with zero skipped sessions.',
  },
  {
    id: 'sunday-biryani-protocol',
    title: '🍗 The Sunday Biryani Protocol (Calories On Vacation!)',
    category: 'Nutrition',
    icon: 'Apple',
    summary: 'Official decree from Coach Varun: On Sunday, you can eat Biryani! Science, psychology, and tastebuds agree that aromatic Dum Biryani reloads your glycogen and converts directly into Monday squat PRs.',
    coreRules: [
      'Golden Rule: On Sunday, calories are legally on vacation — you can eat Biryani without guilt!',
      'Protein Justification: Choose chicken, mutton, or paneer biryani and proudly declare you are "just hitting daily protein targets".',
      'The Monday Contract: Every single grain of Sunday biryani must be repaid with 100% intensity on Monday leg day!',
      'Hydration Shield: Drink 3.5 liters of water and enjoy with cool cucumber raita to stay energized.',
      'Guilt-Free Mindset: 1 meal will not ruin 6 days of discipline, just as 1 salad will not give you a 6-pack. Consistency wins!',
    ],
    sampleRoutineOrMeal: [
      'Sunday Feast: 1 hearty plate of aromatic Dum Biryani with onion raita, lemon, and boiled egg.',
      'Monday Aftermath: Heavy Squats, Romanian Deadlifts, and Leg Press powered by 100% Biryani glycogen energy!',
    ],
    commonMistakes: [
      'Starving yourself the entire morning before Biryani (just eat normal balanced meals and enjoy lunch).',
      'Feeling guilty: Guilt spikes stress cortisol; enjoying good food with friends & family boosts recovery and dopamine.',
    ],
    coachProTip: 'If anyone asks why you are eating Biryani on a fitness plan, tell them Coach Varun prescribed it as a mandatory Sunday Glycogen Reload Protocol! 🍗🍚🔥',
  },
];

export const FitnessAdviceHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Advice Q&A state
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<{
    headline: string;
    answerMarkdown: string;
    actionSteps: string[];
    commonMistakes: string[];
    proTip: string;
  } | null>(null);

  // Custom Prescription Generator state
  const [prescriptionGoal, setPrescriptionGoal] = useState<'fat_loss' | 'muscle_gain' | 'strength' | 'general_health'>('fat_loss');
  const [prescriptionLevel, setPrescriptionLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [prescriptionSetup, setPrescriptionSetup] = useState<'Full Commercial Gym' | 'Home Dumbbells & Bands' | 'Bodyweight & Park'>('Full Commercial Gym');
  const [generatedPrescription, setGeneratedPrescription] = useState<{
    title: string;
    workoutStrategy: string;
    nutritionRules: string[];
    weeklyHabits: string[];
    recoveryTips: string;
  } | null>(null);

  const categories = ['All', 'Fat Loss', 'Muscle Gain', 'Nutrition', 'Recovery & Injury', 'Supplements', 'Workout Splits'];

  const filteredAdvices = CORE_FITNESS_ADVICES.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.coreRules.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleShareAdvice = (advice: FitnessAdviceItem) => {
    const text = formatFitnessAdviceWhatsApp(advice);
    const link = generateWhatsAppLink(SHARE_DESTINATION_PHONE, text);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    window.open(link, '_blank');
  };

  const handleCopyAdvice = (advice: FitnessAdviceItem) => {
    const text = formatFitnessAdviceWhatsApp(advice);
    navigator.clipboard.writeText(text);
    setCopiedId(advice.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAskCoachVarun = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;

    setIsAsking(true);
    setAiAnswer(null);

    try {
      const res = await fetch('/api/fitness-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          category: selectedCategory,
          userContext: {
            profile: { name: 'Athlete', fitnessGoal: 'fitness' },
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to get coaching advice');
      const data = await res.json();
      setAiAnswer(data);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch (err: any) {
      // Fallback answers
      setAiAnswer({
        headline: `Coach Varun Advice for: "${question.trim()}"`,
        answerMarkdown: `To address this effectively:\n\n1. **Focus on Consistency:** Adhering to your weekly training split and hitting your daily protein target (1.8–2.2g per kg bodyweight) will deliver 80% of your results.\n2. **Progressive Overload:** Always aim for 1 more rep or 1kg more load than last week while maintaining strict biomechanics.\n3. **Recovery First:** Ensure 7–8 hours of uninterrupted sleep for optimal nervous system and muscular regeneration.`,
        actionSteps: [
          'Log your workouts and track top working sets',
          'Drink at least 3 liters of water daily',
          'Prioritize compound movements (Squats, Presses, Rows, Deadlifts)',
        ],
        commonMistakes: [
          'Skipping warm-ups and joint preparation',
          'Undereating protein on rest days',
        ],
        proTip: 'Consistency beats intensity every single day. Master the basics and repeat them for 6 months.',
      });
    } finally {
      setIsAsking(false);
    }
  };

  const handleGeneratePrescription = () => {
    let title = '';
    let workoutStrategy = '';
    let nutritionRules: string[] = [];
    let weeklyHabits: string[] = [];
    let recoveryTips = '';

    if (prescriptionGoal === 'fat_loss') {
      title = `${prescriptionLevel} Accelerated Fat Loss & Muscle Preservation Protocol`;
      workoutStrategy = prescriptionSetup === 'Full Commercial Gym'
        ? '4-Day Upper / Lower Split with 3-4 heavy compound movements per session, followed by 15 mins of Zone 2 Incline Walking (12% incline @ 4.5 km/h).'
        : '4-Day Dumbbell Density Circuit (Squats, DB Rows, Push-ups, Overhead DB Press, Walking Lunges) with 45s rest intervals to elevate metabolic rate.';
      nutritionRules = [
        'Maintain a 400 kcal deficit below your TDEE.',
        'Target 2.0g protein / kg bodyweight (e.g. 150g for a 75kg individual).',
        'Have 1 serving of green fibrous vegetables with lunch and dinner for fullness.',
        'Replace all sugary beverages with water, black coffee, or zero-calorie sparkling water.',
      ];
      weeklyHabits = [
        'Hit 9,000–10,000 steps daily (track on phone or watch).',
        'Drink 3.5 Liters of water daily.',
        'Take weekly progress photos and waist measurements every Sunday morning.',
      ];
      recoveryTips = '7.5+ hours of sleep per night. Take a 20-minute relaxation walk on off days.';
    } else if (prescriptionGoal === 'muscle_gain') {
      title = `${prescriptionLevel} Maximum Hypertrophy & Muscle Building Split`;
      workoutStrategy = prescriptionSetup === 'Full Commercial Gym'
        ? 'Push / Pull / Legs Split focusing on 8–12 reps with 2 RIR. Prioritize Barbell Bench Press, Barbell Rows, Romanian Deadlifts, and Hack Squats.'
        : 'Heavy Dumbbell + Calisthenics Hypertrophy Routine using 3-second eccentric negatives and paused reps for maximum mechanical tension.';
      nutritionRules = [
        'Eat in a controlled 250 kcal surplus above maintenance to build muscle with minimal body fat.',
        'Consume 1.8g to 2.2g of protein per kg bodyweight divided across 4 meals.',
        'Pre-workout fuel: 50g complex carbs + 25g protein 60 mins before lifting.',
        'Take 5g of Creatine Monohydrate daily with water or post-workout meal.',
      ];
      weeklyHabits = [
        'Record the weight and reps for all top working sets in a notebook or phone.',
        'Rest 2 to 3 minutes between heavy compound lifts to maximize power.',
        'Aim for progressive overload (1 extra rep or 1.25kg heavier each week).',
      ];
      recoveryTips = '8 hours of deep sleep. High protein intake on rest days to fuel muscular protein synthesis.';
    } else if (prescriptionGoal === 'strength') {
      title = `${prescriptionLevel} Raw Power & Compound Strength Blueprint`;
      workoutStrategy = '3-Day Full Body Strength (Starting Strength / 5x5 Model): Squat, Bench, Overhead Press, Deadlift, and Weighted Pull-ups (3-6 rep range).';
      nutritionRules = [
        'Eat at maintenance or slight surplus with ample carbohydrates to replenish muscle glycogen.',
        'Hydrate with electrolytes (pinch of pink salt + water) before heavy training.',
      ];
      weeklyHabits = [
        'Rest 3–5 minutes between heavy 85%+ 1RM working sets.',
        'Perform thorough dynamic warm-ups with empty bar work before loading plates.',
      ];
      recoveryTips = 'Take a full deload week every 6 weeks. Regular hamstring, hip, and rotator cuff mobility.';
    } else {
      title = `${prescriptionLevel} Holistic Longevity, Stamina & Functional Health`;
      workoutStrategy = '3 Resistance Sessions (Full Body) + 2 Cardio/Mobility Sessions (Brisk walking, jogging, or swimming).';
      nutritionRules = [
        'Follow the 80/20 Mediterranean/Whole Foods diet: olive oil, nuts, lean proteins, colorful vegetables, and whole grains.',
        'Limit processed sugar and deep-fried fast foods.',
      ];
      weeklyHabits = [
        'Walk at least 8,000 steps daily.',
        'Spend 10 minutes every morning on spinal and hip mobility stretches.',
      ];
      recoveryTips = 'Stay consistent and reduce stress through deep breathing and nature walks.';
    }

    const prescription = {
      title,
      workoutStrategy,
      nutritionRules,
      weeklyHabits,
      recoveryTips,
    };

    setGeneratedPrescription(prescription);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  const handleSharePrescription = () => {
    if (!generatedPrescription) return;
    const text = formatCustomAdviceWhatsApp({
      goal: prescriptionGoal,
      level: prescriptionLevel,
      equipment: prescriptionSetup,
      prescription: generatedPrescription,
    });
    const link = generateWhatsAppLink(SHARE_DESTINATION_PHONE, text);
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#CCFF00]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-[#CCFF00] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Coach Varun Master Fitness Advice Hub
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Science-Backed Fitness Guidance & Advice
            </h2>
            <p className="text-sm text-[#A0A3AD] mt-2 leading-relaxed">
              Explore proven training rules, clean nutrition frameworks, fat loss blueprints, and muscle-building protocols. Ask any question or generate a customized blueprint to share directly on WhatsApp.
            </p>
          </div>

          {/* Quick WhatsApp Dispatch Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <a
              id="advice-hub-direct-whatsapp-btn"
              href={`https://wa.me/${SHARE_DESTINATION_PHONE}?text=${encodeURIComponent("Hi Coach Varun! I'd like to get expert fitness advice for my current training and nutrition.")}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-black font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-[#25D366]/10"
            >
              <Smartphone className="w-4 h-4" />
              <span>Direct WhatsApp ({SHARE_DESTINATION_PHONE_FORMATTED})</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive AI Fitness Advice Ask Box */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#CCFF00]/20 border border-[#CCFF00]/40 flex items-center justify-center text-[#CCFF00]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide">
                Ask Coach Varun (AI Fitness Advice Engine)
              </h3>
              <p className="text-xs text-[#8A8D98]">
                Instant expert answers on workout technique, fat loss plateaus, protein timing, injury recovery, or supplements.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleAskCoachVarun} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="fitness-advice-query-input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., How do I break a 3-week fat loss plateau without dropping protein?"
              className="flex-1 bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white placeholder-[#5A5D66] focus:outline-none transition"
            />
            <button
              id="fitness-advice-submit-btn"
              type="submit"
              disabled={isAsking || !question.trim()}
              className="bg-[#CCFF00] hover:bg-[#b8e600] disabled:opacity-50 text-[#0F1115] font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition flex-shrink-0 shadow-md shadow-[#CCFF00]/10"
            >
              {isAsking ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Consulting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Get Advice</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[#8A8D98] text-[11px] font-mono whitespace-nowrap">Quick Questions:</span>
            {[
              'How much protein do I need for fat loss?',
              'Best 4-day workout split for muscle gain',
              'How to prevent lower back pain during deadlifts',
              'Should I take creatine during a cut?',
            ].map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuestion(prompt);
                }}
                className="bg-[#0F1115] hover:bg-[#2A2D35] text-[#A0A3AD] hover:text-[#CCFF00] border border-[#2A2D35] px-3 py-1 rounded-lg whitespace-nowrap text-[11px] transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        </form>

        {/* AI Answer Display */}
        {aiAnswer && (
          <div className="mt-5 p-5 bg-[#0F1115] border border-[#CCFF00]/30 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase bg-[#CCFF00]/10 text-[#CCFF00] px-2 py-0.5 rounded border border-[#CCFF00]/20 font-bold">
                  Coach Varun Prescription
                </span>
                <h4 className="text-base font-black text-white mt-1.5">{aiAnswer.headline}</h4>
              </div>
              <button
                onClick={() => {
                  const formatted = `*Coach Varun Advice:*\n\n${aiAnswer.headline}\n\n${aiAnswer.answerMarkdown}\n\n_Delivered via Coach Varun Fitness Advisor_`;
                  const link = generateWhatsAppLink(SHARE_DESTINATION_PHONE, formatted);
                  window.open(link, '_blank');
                }}
                className="bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/40 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition flex-shrink-0"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Share to WhatsApp</span>
              </button>
            </div>

            <div className="text-xs sm:text-sm text-[#E0E0E0] leading-relaxed whitespace-pre-line border-l-2 border-[#CCFF00] pl-3">
              {aiAnswer.answerMarkdown}
            </div>

            {aiAnswer.actionSteps && aiAnswer.actionSteps.length > 0 && (
              <div className="bg-[#1A1D24] p-3.5 rounded-lg border border-[#2A2D35]">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#CCFF00]" />
                  Actionable Steps:
                </h5>
                <ul className="space-y-1 text-xs text-[#A0A3AD]">
                  {aiAnswer.actionSteps.map((step, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2">
                      <span className="text-[#CCFF00] font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiAnswer.proTip && (
              <div className="p-3 bg-[#CCFF00]/5 border border-[#CCFF00]/20 rounded-lg flex items-center gap-2.5 text-xs text-[#CCFF00]">
                <Lightbulb className="w-4 h-4 flex-shrink-0" />
                <span><strong>Coach Pro Tip:</strong> {aiAnswer.proTip}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Personalized Fitness Advice Blueprint Generator */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#CCFF00]" />
              Personalized Fitness Advice Blueprint Generator
            </h3>
            <p className="text-xs text-[#8A8D98] mt-0.5">
              Select your parameters to build an instant workout strategy, nutrition rules, and daily habits.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Goal Selector */}
          <div>
            <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-2">
              Primary Goal
            </label>
            <select
              id="prescription-goal-select"
              value={prescriptionGoal}
              onChange={(e) => setPrescriptionGoal(e.target.value as any)}
              className="w-full bg-[#0F1115] border border-[#2A2D35] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
            >
              <option value="fat_loss">🔥 Fat Loss & Definition</option>
              <option value="muscle_gain">💪 Muscle Hypertrophy</option>
              <option value="strength">⚡ Raw Power & Strength</option>
              <option value="general_health">🌱 Longevity & General Health</option>
            </select>
          </div>

          {/* Level Selector */}
          <div>
            <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-2">
              Experience Level
            </label>
            <select
              id="prescription-level-select"
              value={prescriptionLevel}
              onChange={(e) => setPrescriptionLevel(e.target.value as any)}
              className="w-full bg-[#0F1115] border border-[#2A2D35] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
            >
              <option value="Beginner">Beginner (&lt; 1 year lifting)</option>
              <option value="Intermediate">Intermediate (1–3 years)</option>
              <option value="Advanced">Advanced (3+ years)</option>
            </select>
          </div>

          {/* Equipment Setup */}
          <div>
            <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-2">
              Equipment Setup
            </label>
            <select
              id="prescription-setup-select"
              value={prescriptionSetup}
              onChange={(e) => setPrescriptionSetup(e.target.value as any)}
              className="w-full bg-[#0F1115] border border-[#2A2D35] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
            >
              <option value="Full Commercial Gym">Full Commercial Gym (Barbells, Cables, Machines)</option>
              <option value="Home Dumbbells & Bands">Home Dumbbells & Resistance Bands</option>
              <option value="Bodyweight & Park">Bodyweight Calisthenics</option>
            </select>
          </div>
        </div>

        <button
          id="generate-prescription-btn"
          onClick={handleGeneratePrescription}
          className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-[#0F1115] font-black py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md shadow-[#CCFF00]/10"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Customized Fitness Advice Blueprint</span>
        </button>

        {/* Prescription Result */}
        {generatedPrescription && (
          <div className="mt-6 p-6 bg-[#0F1115] border border-[#2A2D35] rounded-xl space-y-5 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2D35] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase bg-[#CCFF00]/10 text-[#CCFF00] px-2 py-0.5 rounded font-bold border border-[#CCFF00]/20">
                  Custom Prescription
                </span>
                <h4 className="text-lg font-black text-white mt-1">{generatedPrescription.title}</h4>
              </div>
              <button
                id="share-prescription-whatsapp-btn"
                onClick={handleSharePrescription}
                className="bg-[#25D366] hover:bg-[#20ba59] text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition flex-shrink-0 shadow-md"
              >
                <Smartphone className="w-4 h-4" />
                <span>Send Blueprint to WhatsApp ({SHARE_DESTINATION_PHONE_FORMATTED})</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1A1D24] p-4 rounded-xl border border-[#2A2D35]">
                <h5 className="text-xs font-bold text-[#CCFF00] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Dumbbell className="w-4 h-4" />
                  Training Protocol:
                </h5>
                <p className="text-xs text-[#D0D3DD] leading-relaxed">
                  {generatedPrescription.workoutStrategy}
                </p>
              </div>

              <div className="bg-[#1A1D24] p-4 rounded-xl border border-[#2A2D35]">
                <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Apple className="w-4 h-4" />
                  Nutrition Guidelines:
                </h5>
                <ul className="space-y-1.5 text-xs text-[#D0D3DD]">
                  {generatedPrescription.nutritionRules.map((rule, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#1A1D24] p-4 rounded-xl border border-[#2A2D35]">
                <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Activity className="w-4 h-4" />
                  Daily Action Habits:
                </h5>
                <ul className="space-y-1.5 text-xs text-[#D0D3DD]">
                  {generatedPrescription.weeklyHabits.map((habit, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-1.5">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{habit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#1A1D24] p-4 rounded-xl border border-[#2A2D35]">
                <h5 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Shield className="w-4 h-4" />
                  Recovery Focus:
                </h5>
                <p className="text-xs text-[#D0D3DD] leading-relaxed">
                  {generatedPrescription.recoveryTips}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Core Fitness Advice Library */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#CCFF00]" />
              Core Fitness Principles & Rules
            </h3>
            <p className="text-xs text-[#8A8D98] mt-0.5">
              Comprehensive guidelines for fat loss, muscle growth, clean nutrition, and injury prevention.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8D98]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fitness advice..."
              className="w-full bg-[#1A1D24] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#5A5D66] focus:outline-none transition"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#CCFF00] text-[#0F1115] shadow-md shadow-[#CCFF00]/10'
                  : 'bg-[#1A1D24] text-[#8A8D98] hover:text-white border border-[#2A2D35]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Advice Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredAdvices.map((advice) => (
            <div
              key={advice.id}
              className="bg-[#1A1D24] border border-[#2A2D35] hover:border-[#CCFF00]/40 rounded-2xl p-5 sm:p-6 transition shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-[#0F1115] text-[#CCFF00] px-2 py-0.5 rounded border border-[#2A2D35] font-bold">
                      {advice.category}
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-white mt-1.5">{advice.title}</h4>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleCopyAdvice(advice)}
                      className="p-2 rounded-lg bg-[#0F1115] hover:bg-[#2A2D35] text-[#8A8D98] hover:text-white transition"
                      title="Copy advice text"
                    >
                      {copiedId === advice.id ? <Check className="w-3.5 h-3.5 text-[#CCFF00]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleShareAdvice(advice)}
                      className="bg-[#25D366] hover:bg-[#20ba59] text-black px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                      title={`Send advice to WhatsApp (${SHARE_DESTINATION_PHONE_FORMATTED})`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-[#A0A3AD] leading-relaxed">
                  {advice.summary}
                </p>

                {/* Core Rules */}
                <div className="bg-[#0F1115] p-3.5 rounded-xl border border-[#2A2D35] space-y-2">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#CCFF00]" />
                    Core Actionable Rules:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#D0D3DD]">
                    {advice.coreRules.map((rule, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <span className="text-[#CCFF00] font-bold text-xs leading-none mt-0.5">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mistakes to avoid */}
                {advice.commonMistakes && advice.commonMistakes.length > 0 && (
                  <div className="bg-[#FF4444]/5 p-3 rounded-xl border border-[#FF4444]/20 space-y-1">
                    <span className="text-[11px] font-bold text-[#FF4444] uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Common Mistakes:
                    </span>
                    <ul className="space-y-1 text-xs text-[#E0A0A0]">
                      {advice.commonMistakes.map((mistake, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-2">
                          <span className="text-[#FF4444] font-bold">•</span>
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Coach Pro Tip Footer */}
              <div className="mt-4 pt-3 border-t border-[#2A2D35] flex items-center gap-2 text-xs text-[#CCFF00]">
                <Lightbulb className="w-4 h-4 flex-shrink-0" />
                <span className="italic">"{advice.coachProTip}"</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
