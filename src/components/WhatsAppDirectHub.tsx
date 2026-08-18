import React, { useState } from 'react';
import {
  Smartphone,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Users,
  Dumbbell,
  Apple,
  Shield,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClientData, SHARE_DESTINATION_PHONE, SHARE_DESTINATION_PHONE_FORMATTED } from '../types';
import { generateWhatsAppLink } from '../utils/whatsappFormatter';

interface WhatsAppDirectHubProps {
  clients: ClientData[];
}

export const WhatsAppDirectHub: React.FC<WhatsAppDirectHubProps> = ({ clients }) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const quickTemplates = [
    {
      title: 'Weekly Progress Check-in',
      icon: Dumbbell,
      text: `Hi ${selectedClient?.name || 'Athlete'}! Coach Varun here. How did your workouts and nutrition feel this week? Please reply with your adherence and any questions so we can adjust next week's plan! 💪`,
    },
    {
      title: 'Protein & Nutrition Reminder',
      icon: Apple,
      text: `Hey ${selectedClient?.name || 'Athlete'}! Quick reminder to hit your daily protein goal today and stay on top of your hydration (3+ Liters). Consistency is how we get results! 🥗⚡`,
    },
    {
      title: 'Workout Plan Update',
      icon: Sparkles,
      text: `Hi ${selectedClient?.name || 'Athlete'}! Your training plan has been updated with progressive overload targets for your compound lifts. Let's make this week count! 🏋️‍♂️🔥`,
    },
    {
      title: 'Rest & Recovery Protocol',
      icon: Shield,
      text: `Great effort on your recent training sessions, ${selectedClient?.name || 'Athlete'}! Make sure you prioritize 7-8 hours of sleep tonight for optimal muscle repair and recovery. 🛌💤`,
    },
    {
      title: '🍗 Sunday Biryani Permission',
      icon: Apple,
      text: `Hey Coach Varun! 🍗 Just invoking the Sunday Biryani Rule today — calories are officially on vacation! I will crush the Monday leg workout with double the guilt-free intensity! 🍚💪🔥`,
    },
  ];

  const handleSendToWhatsApp = (textToSend?: string) => {
    const text = textToSend || customMessage;
    if (!text.trim()) return;

    const link = generateWhatsAppLink(SHARE_DESTINATION_PHONE, text);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    window.open(link, '_blank');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Card */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-xs font-bold uppercase tracking-wider mb-2">
              <Smartphone className="w-3.5 h-3.5" />
              Verified WhatsApp Integration
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Direct WhatsApp Dispatch
            </h2>
            <p className="text-xs sm:text-sm text-[#A0A3AD] mt-1">
              All client reports, workout advice, and check-ins are routed strictly to:
            </p>
          </div>

          <div className="p-4 bg-[#0F1115] border border-[#25D366]/40 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#8A8D98] uppercase">Destination Number</span>
              <div className="text-lg font-black text-white font-mono">{SHARE_DESTINATION_PHONE_FORMATTED}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Composer */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#CCFF00]" />
            Compose & Send to WhatsApp
          </h3>

          {clients.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8A8D98]">Target Client:</span>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="bg-[#0F1115] border border-[#2A2D35] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#CCFF00]"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.fitnessGoal.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Quick Templates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickTemplates.map((tmpl, idx) => (
            <div
              key={idx}
              className="bg-[#0F1115] p-3.5 rounded-xl border border-[#2A2D35] hover:border-[#CCFF00]/40 transition space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                  <tmpl.icon className="w-3.5 h-3.5 text-[#CCFF00]" />
                  {tmpl.title}
                </span>
                <p className="text-xs text-[#A0A3AD] mt-1 line-clamp-2">
                  {tmpl.text}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#2A2D35]/60">
                <button
                  type="button"
                  onClick={() => setCustomMessage(tmpl.text)}
                  className="flex-1 bg-[#1A1D24] hover:bg-[#2A2D35] text-[#A0A3AD] hover:text-white py-1.5 rounded-lg text-[11px] font-bold transition"
                >
                  Use Template
                </button>
                <button
                  type="button"
                  onClick={() => handleSendToWhatsApp(tmpl.text)}
                  className="bg-[#25D366] hover:bg-[#20ba59] text-black px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Text Area */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider">
            Custom Message Body
          </label>
          <textarea
            rows={4}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Type any custom workout advice, diet tips, or client report details to dispatch to WhatsApp..."
            className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => handleCopy(customMessage)}
            disabled={!customMessage.trim()}
            className="bg-[#0F1115] hover:bg-[#2A2D35] disabled:opacity-40 text-[#8A8D98] hover:text-white px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition border border-[#2A2D35]"
          >
            {copied ? <Check className="w-4 h-4 text-[#CCFF00]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendToWhatsApp()}
            disabled={!customMessage.trim()}
            className="flex-1 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] disabled:opacity-40 text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-[#25D366]/10"
          >
            <Smartphone className="w-4 h-4" />
            <span>Send to WhatsApp ({SHARE_DESTINATION_PHONE_FORMATTED})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
