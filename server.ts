import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { processVarunChat, generateDietPlanAI, answerFitnessQAAI } from './server/gemini.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      bot: 'Varun Fitness AI',
      time: new Date().toISOString(),
      capabilities: ['meal_tracking', 'workout_monitoring', 'whatsapp_reports', 'voice_logging', 'diet_plans', 'fitness_qa'],
    });
  });

  // Chat endpoint for Varun
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, context } = req.body;
      if (!message && !req.body.audioBase64) {
        return res.status(400).json({ error: 'Message or audio is required.' });
      }

      const result = await processVarunChat({
        message: message || '',
        context,
        audioBase64: req.body.audioBase64,
        audioMimeType: req.body.audioMimeType,
      });

      res.json(result);
    } catch (error: any) {
      console.error('Error processing Varun chat:', error);
      res.status(500).json({
        error: 'Failed to process chat with Varun',
        message: error.message || 'Internal server error',
      });
    }
  });

  // Diet Plan Generation endpoint
  app.post('/api/diet-plan/generate', async (req, res) => {
    try {
      const { goal, dietType, targetCalories, allergiesOrDislikes, mealsPerDay, daysCount, userProfile } = req.body;
      const plan = await generateDietPlanAI({
        goal: goal || 'weight_loss',
        dietType: dietType || 'High-Protein Balanced',
        targetCalories: Number(targetCalories) || 2000,
        allergiesOrDislikes,
        mealsPerDay: Number(mealsPerDay) || 4,
        daysCount: Number(daysCount) || 3,
        userProfile,
      });

      res.json(plan);
    } catch (error: any) {
      console.error('Error generating diet plan:', error);
      res.status(500).json({
        error: 'Failed to generate diet plan',
        message: error.message || 'Internal server error',
      });
    }
  });

  // Fitness Q&A endpoint
  app.post('/api/fitness-qa', async (req, res) => {
    try {
      const { question, category, userContext } = req.body;
      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      const answer = await answerFitnessQAAI({
        question,
        category,
        userContext,
      });

      res.json(answer);
    } catch (error: any) {
      console.error('Error in fitness Q&A:', error);
      res.status(500).json({
        error: 'Failed to answer fitness query',
        message: error.message || 'Internal server error',
      });
    }
  });

  // Voice logging endpoint
  app.post('/api/voice-log', async (req, res) => {
    try {
      const { audioBase64, mimeType, context } = req.body;
      if (!audioBase64) {
        return res.status(400).json({ error: 'Audio data is required' });
      }

      const result = await processVarunChat({
        message: 'Listen carefully to this voice note from the athlete. Transcribe what they ate or what exercise they did, extract all nutritional or workout stats, and give encouraging feedback.',
        context,
        audioBase64,
        audioMimeType: mimeType || 'audio/webm',
      });

      res.json(result);
    } catch (error: any) {
      console.error('Error processing voice log:', error);
      res.status(500).json({
        error: 'Failed to process voice log',
        message: error.message || 'Internal server error',
      });
    }
  });

  // WhatsApp Webhook receiver & simulator
  app.post('/api/whatsapp/webhook', async (req, res) => {
    try {
      const { from, body } = req.body;
      console.log(`[WhatsApp Inbound] From: ${from} | Body: ${body}`);

      // Process message through Varun
      const result = await processVarunChat({
        message: body || 'Hello Varun',
      });

      res.json({
        status: 'received',
        reply: result.replyText,
        extracted: result.extractedData,
      });
    } catch (error: any) {
      console.error('Error handling WhatsApp webhook:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Varun AI Fitness Server running on http://localhost:${PORT}`);
  });
}

startServer();
