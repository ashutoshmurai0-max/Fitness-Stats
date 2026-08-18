import { GoogleGenAI, Type } from '@google/genai';

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export const VARUN_SYSTEM_INSTRUCTION = `You are "Varun", a premier AI Fitness Coach, Nutritionist, and WhatsApp Health Bot.
Your mission is to help users effortlessly track their daily calorie intake, monitor workout progression, stay accountable, and deliver crisp, actionable WhatsApp summaries.

YOUR PERSONA:
- Name: Varun
- Style: Encouraging, knowledgeable, disciplined, friendly, athletic, concise, and focused on sustainable habits.
- You speak clearly with fitness wisdom (caloric deficits/surpluses, progressive overload, macronutrient balance, recovery, hydration).
- You use fitting emojis (🔥, 🥗, 🏋️, 🥩, 💧, 🎯, ⚡) naturally.

YOUR CAPABILITIES:
1. Meal Logging & Macro Estimation:
   - When the user mentions food or meals, accurately estimate calories, protein (g), carbs (g), fat (g), and fiber (g).
   - Infer the meal type (breakfast, lunch, dinner, snack) if context allows.
2. Workout Logging:
   - When the user mentions exercises or physical activities, extract exercise name, category (strength, cardio, hiit, flexibility, sports), sets (reps & weight if provided), duration in minutes, and estimated calories burned.
3. Water Logging:
   - If the user mentions drinking water, extract the volume in milliliters (ml).
4. WhatsApp Summaries & Coaching:
   - If the user asks for a summary, report, or WhatsApp message, generate an inspiring, clean WhatsApp-formatted summary using WhatsApp markdown (*bold*, _italics_, bullet points).

JSON RESPONSE FORMAT:
You MUST ALWAYS respond with a valid JSON object matching the following structure:
{
  "replyText": "Your natural language response to the user, formatted with markdown",
  "extractedData": {
    "meals": [
      {
        "name": "Food item name",
        "mealType": "breakfast" | "lunch" | "dinner" | "snack",
        "calories": 450,
        "protein": 30,
        "carbs": 40,
        "fat": 15,
        "fiber": 4,
        "servingSize": "1 bowl",
        "notes": "Optional notes"
      }
    ],
    "workouts": [
      {
        "exerciseName": "Exercise or routine name",
        "category": "strength" | "cardio" | "hiit" | "flexibility" | "sports",
        "sets": [
          { "setNumber": 1, "reps": 10, "weightKg": 70, "completed": true }
        ],
        "durationMins": 45,
        "caloriesBurned": 320,
        "intensity": "low" | "medium" | "high",
        "notes": "Optional notes"
      }
    ],
    "waterAddedMl": 500,
    "whatsappFormattedSummary": "Optional formatted WhatsApp message if requested or appropriate"
  }
}

Always keep extractedData.meals, workouts, and waterAddedMl as empty arrays or 0 if none were mentioned in the user's message.
Never leave required fields empty.`;

export async function processVarunChat(params: {
  message: string;
  context?: {
    profile?: any;
    goals?: any;
    todayStats?: any;
    recentChatHistory?: Array<{ sender: string; text: string }>;
  };
  audioBase64?: string;
  audioMimeType?: string;
}) {
  const { message, context, audioBase64, audioMimeType } = params;

  let contents: any[] = [];

  const contextText = context
    ? `Current User Profile & Day Context:
- User Name: ${context.profile?.name || 'Athlete'}
- Goal: ${context.profile?.fitnessGoal || 'weight_loss'} (Target: ${context.profile?.targetWeightKg || 70}kg, Current: ${context.profile?.weightKg || 75}kg)
- Daily Calorie Target: ${context.goals?.targetCalories || 2000} kcal (Protein: ${context.goals?.targetProtein || 150}g, Carbs: ${context.goals?.targetCarbs || 200}g, Fat: ${context.goals?.targetFat || 60}g)
- Consumed Today So Far: ${context.todayStats?.consumedCalories || 0} kcal (P: ${context.todayStats?.consumedProtein || 0}g, C: ${context.todayStats?.consumedCarbs || 0}g, F: ${context.todayStats?.consumedFat || 0}g)
- Workout Burned Today: ${context.todayStats?.burnedCalories || 0} kcal (${context.todayStats?.workoutMins || 0} mins)
- Water Drank Today: ${context.todayStats?.waterMl || 0} ml
`
    : '';

  const promptText = `${contextText}\nUser Message: "${message || 'Process this audio log'}"`;

  if (audioBase64) {
    contents = [
      {
        parts: [
          { text: promptText },
          {
            inlineData: {
              data: audioBase64,
              mimeType: audioMimeType || 'audio/webm',
            },
          },
        ],
      },
    ];
  } else {
    contents = [{ parts: [{ text: promptText }] }];
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.7-flash',
    contents: contents.length === 1 ? contents[0] : contents,
    config: {
      systemInstruction: VARUN_SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          replyText: {
            type: Type.STRING,
            description: 'The conversational response from Varun to the athlete',
          },
          extractedData: {
            type: Type.OBJECT,
            properties: {
              meals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    mealType: {
                      type: Type.STRING,
                      description: 'breakfast, lunch, dinner, or snack',
                    },
                    calories: { type: Type.NUMBER },
                    protein: { type: Type.NUMBER },
                    carbs: { type: Type.NUMBER },
                    fat: { type: Type.NUMBER },
                    fiber: { type: Type.NUMBER },
                    servingSize: { type: Type.STRING },
                    notes: { type: Type.STRING },
                  },
                  required: ['name', 'mealType', 'calories', 'protein', 'carbs', 'fat'],
                },
              },
              workouts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    exerciseName: { type: Type.STRING },
                    category: {
                      type: Type.STRING,
                      description: 'strength, cardio, hiit, flexibility, or sports',
                    },
                    sets: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          setNumber: { type: Type.NUMBER },
                          reps: { type: Type.NUMBER },
                          weightKg: { type: Type.NUMBER },
                          completed: { type: Type.BOOLEAN },
                        },
                        required: ['setNumber', 'reps', 'weightKg', 'completed'],
                      },
                    },
                    durationMins: { type: Type.NUMBER },
                    caloriesBurned: { type: Type.NUMBER },
                    intensity: {
                      type: Type.STRING,
                      description: 'low, medium, or high',
                    },
                    notes: { type: Type.STRING },
                  },
                  required: ['exerciseName', 'category', 'durationMins', 'caloriesBurned', 'intensity'],
                },
              },
              waterAddedMl: { type: Type.NUMBER },
              whatsappFormattedSummary: { type: Type.STRING },
            },
          },
        },
        required: ['replyText', 'extractedData'],
      },
    },
  });

  const text = response.text || '{}';
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse Gemini JSON output:', text);
    return {
      replyText: text,
      extractedData: { meals: [], workouts: [], waterAddedMl: 0 },
    };
  }
}

export async function generateDietPlanAI(params: {
  goal: string;
  dietType: string;
  targetCalories: number;
  allergiesOrDislikes?: string;
  mealsPerDay?: number;
  daysCount?: number;
  userProfile?: any;
}) {
  const {
    goal,
    dietType,
    targetCalories,
    allergiesOrDislikes = 'None',
    mealsPerDay = 4,
    daysCount = 3,
    userProfile,
  } = params;

  const prompt = `Generate an elite, highly detailed, realistic, and delicious ${daysCount}-day diet meal plan for an athlete with the following specifications:
- Fitness Goal: ${goal}
- Diet Preference: ${dietType} (e.g. High-Protein Balanced, Indian Vegetarian, Non-Vegetarian, Keto, Vegan, Mediterranean, Low Carb)
- Daily Target Calories: ${targetCalories} kcal
- Meals Per Day: ${mealsPerDay}
- Dietary Restrictions / Allergies: ${allergiesOrDislikes}
- Athlete Profile: ${userProfile?.name || 'Athlete'}, Weight: ${userProfile?.weightKg || 75}kg, Target: ${userProfile?.targetWeightKg || 70}kg

Provide a complete breakdown for each day with accurate macronutrients (protein, carbs, fat, calories), exact portion measurements, easy ingredient lists, hydration goal, actionable coach tips, and an organized grocery list by category.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.7-flash',
    contents: prompt,
    config: {
      systemInstruction: `You are Varun, a world-class sports nutritionist. Design precise, science-backed meal plans tailored to exact calorie and macronutrient targets. Ensure meal variety, delicious flavors, easy-to-cook recipes, and realistic portion sizes. Output must be strictly valid JSON.`,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          goal: { type: Type.STRING },
          dietType: { type: Type.STRING },
          targetCalories: { type: Type.NUMBER },
          targetProtein: { type: Type.NUMBER },
          targetCarbs: { type: Type.NUMBER },
          targetFat: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          hydrationTargetMl: { type: Type.NUMBER },
          coachingTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayNumber: { type: Type.NUMBER },
                dayName: { type: Type.STRING },
                totalCalories: { type: Type.NUMBER },
                totalProtein: { type: Type.NUMBER },
                totalCarbs: { type: Type.NUMBER },
                totalFat: { type: Type.NUMBER },
                meals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      mealType: { type: Type.STRING },
                      name: { type: Type.STRING },
                      calories: { type: Type.NUMBER },
                      protein: { type: Type.NUMBER },
                      carbs: { type: Type.NUMBER },
                      fat: { type: Type.NUMBER },
                      portion: { type: Type.STRING },
                      ingredients: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      notes: { type: Type.STRING },
                    },
                    required: ['mealType', 'name', 'calories', 'protein', 'carbs', 'fat', 'portion', 'ingredients'],
                  },
                },
              },
              required: ['dayNumber', 'dayName', 'totalCalories', 'totalProtein', 'totalCarbs', 'totalFat', 'meals'],
            },
          },
          groceryList: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                items: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['category', 'items'],
            },
          },
        },
        required: ['title', 'goal', 'dietType', 'targetCalories', 'targetProtein', 'targetCarbs', 'targetFat', 'summary', 'days', 'groceryList', 'coachingTips', 'hydrationTargetMl'],
      },
    },
  });

  const text = response.text || '{}';
  try {
    const parsed = JSON.parse(text);
    return {
      ...parsed,
      id: `diet-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
  } catch (e) {
    console.error('Failed to parse diet plan JSON:', text);
    throw new Error('Could not generate diet plan. Please try again.');
  }
}

export async function answerFitnessQAAI(params: {
  question: string;
  category?: string;
  userContext?: any;
}) {
  const { question, category = 'general', userContext } = params;

  const prompt = `User Fitness & Health Query:
"${question}"

Context of Athlete:
- Name: ${userContext?.profile?.name || 'Athlete'}
- Goal: ${userContext?.profile?.fitnessGoal || 'fitness'}
- Daily Calories: ${userContext?.goals?.targetCalories || 2000} kcal (P: ${userContext?.goals?.targetProtein || 150}g)
- Weight: ${userContext?.profile?.weightKg || 75}kg, Height: ${userContext?.profile?.heightCm || 175}cm
- Category: ${category}

Answer this comprehensively as Coach Varun. Give direct, science-backed guidance, actionable takeaway steps, practical examples, common mistakes to avoid, and motivational closing words.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.7-flash',
    contents: prompt,
    config: {
      systemInstruction: `You are "Coach Varun", an expert AI fitness coach, sports scientist, and certified nutritionist.
Provide structured, highly articulate, evidence-based fitness advice with clear headings, bullet points, and actionable routines.
Always be positive, encouraging, realistic, and safety-conscious.`,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          answerMarkdown: { type: Type.STRING },
          actionSteps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          commonMistakes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          proTip: { type: Type.STRING },
          relatedTopics: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['headline', 'answerMarkdown', 'actionSteps', 'commonMistakes', 'proTip'],
      },
    },
  });

  const text = response.text || '{}';
  try {
    return JSON.parse(text);
  } catch (e) {
    return {
      headline: 'Coach Varun Fitness Guidance',
      answerMarkdown: text,
      actionSteps: ['Stay consistent with your daily targets', 'Prioritize protein intake and sleep'],
      commonMistakes: ['Skipping progressive overload', 'Under-eating protein'],
      proTip: 'Consistency beats intensity every single time.',
      relatedTopics: ['Nutrition', 'Workout Technique', 'Recovery'],
    };
  }
}
