import React from 'react';
import {
  Users,
  BookOpen,
  Smartphone,
  Sparkles,
  Lock,
  Unlock,
  Shield,
  UserCheck,
  Zap,
  ClipboardCheck,
} from 'lucide-react';
import { HOST_CONTACT, SHARE_DESTINATION_PHONE, SHARE_DESTINATION_PHONE_FORMATTED } from '../types';

export type AppTab = 'client_portal' | 'daily_report' | 'advice' | 'whatsapp' | 'host';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  clientsCount: number;
  isHostUnlocked: boolean;
  onLockHost: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  clientsCount,
  isHostUnlocked,
  onLockHost,
}) => {
  return (
    <header className="bg-[#0F1115] text-[#E0E0E0] border-b border-[#2A2D35] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3.5 sm:py-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => setActiveTab('client_portal')}
              className="w-10 h-10 sm:w-11 sm:h-11 bg-[#CCFF00] hover:bg-[#b8e600] rounded-full flex items-center justify-center text-[#0F1115] font-black text-lg sm:text-xl shadow-lg shadow-[#CCFF00]/10 flex-shrink-0 transition"
              title="Go to Athlete Portal Home"
            >
              V
            </button>
            <div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('client_portal')}
                  className="text-left"
                >
                  <h1 className="text-lg sm:text-xl font-black tracking-tighter text-white uppercase flex items-center hover:text-[#CCFF00] transition">
                    Coach Varun
                    <span className="text-[#CCFF00] text-[10px] sm:text-[11px] font-mono font-medium tracking-normal lowercase ml-2 bg-[#1A1D24] px-2 py-0.5 rounded border border-[#2A2D35]">
                      Fitness Coaching
                    </span>
                  </h1>
                </button>
              </div>
              <p className="text-[10px] sm:text-xs text-[#8A8D98] font-mono tracking-tight flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse inline-block" />
                <span>WHATSAPP DIRECT:</span>
                <a
                  href={`https://wa.me/${SHARE_DESTINATION_PHONE}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#25D366] hover:underline font-bold"
                >
                  {SHARE_DESTINATION_PHONE_FORMATTED}
                </a>
              </p>
            </div>
          </div>

          {/* Quick Header Actions: Direct WhatsApp & Host Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Host Section Quick Switcher Button */}
            <button
              id="header-host-portal-btn"
              type="button"
              onClick={() => setActiveTab('host')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition border ${
                activeTab === 'host'
                  ? 'bg-[#CCFF00] text-[#0F1115] border-[#CCFF00]'
                  : isHostUnlocked
                  ? 'bg-[#1A1D24] text-[#CCFF00] border-[#CCFF00]/40'
                  : 'bg-[#1A1D24] text-[#8A8D98] hover:text-white border-[#2A2D35]'
              }`}
              title="Host / Coach Portal (Password Protected)"
            >
              {isHostUnlocked ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-[#CCFF00]" />
                  <span className="hidden sm:inline">Host Mode (Active)</span>
                  <span className="sm:hidden">Host 👑</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#8A8D98]" />
                  <span className="hidden sm:inline">Host / Coach Portal</span>
                  <span className="sm:hidden">Host 🔒</span>
                </>
              )}
            </button>

            {/* Quick Direct WhatsApp Button */}
            <a
              id="header-direct-whatsapp-chat-btn"
              href={`https://wa.me/${SHARE_DESTINATION_PHONE}?text=${encodeURIComponent("Hi Coach Varun! I'd like to get fitness advice and review my workout progress.")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-black px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md shadow-[#25D366]/10"
              title={`Chat directly on WhatsApp (${SHARE_DESTINATION_PHONE_FORMATTED})`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp ({SHARE_DESTINATION_PHONE_FORMATTED})</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-2 pb-2.5 overflow-x-auto no-scrollbar border-t border-[#2A2D35] pt-2 text-xs">
          {/* Tab 1: Client Portal */}
          <button
            id="tab-client-portal-btn"
            onClick={() => setActiveTab('client_portal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition whitespace-nowrap text-xs ${
              activeTab === 'client_portal'
                ? 'bg-[#1A1D24] text-[#CCFF00] border border-[#CCFF00]/40 shadow-sm'
                : 'text-[#8A8D98] hover:text-[#E0E0E0] hover:bg-[#1A1D24]/50'
            }`}
          >
            <Zap className="w-4 h-4 text-[#CCFF00] fill-current" />
            <span>Athlete Hub</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#CCFF00]/15 text-[#CCFF00] font-mono font-bold">
              Portal
            </span>
          </button>

          {/* Tab 2: Submit Daily Report */}
          <button
            id="tab-daily-report-btn"
            onClick={() => setActiveTab('daily_report')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition whitespace-nowrap text-xs ${
              activeTab === 'daily_report'
                ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366] shadow-md shadow-[#25D366]/10'
                : 'text-[#8A8D98] hover:text-[#25D366] hover:bg-[#1A1D24]/50 border border-transparent hover:border-[#25D366]/30'
            }`}
          >
            <ClipboardCheck className="w-4 h-4 text-[#25D366]" />
            <span>Submit Daily Report</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#25D366] text-black font-black uppercase">
              WhatsApp 📱
            </span>
          </button>

          {/* Tab 3: Fitness Advice Hub */}
          <button
            id="tab-advice-btn"
            onClick={() => setActiveTab('advice')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition whitespace-nowrap text-xs ${
              activeTab === 'advice'
                ? 'bg-[#1A1D24] text-[#CCFF00] border border-[#CCFF00]/40 shadow-sm'
                : 'text-[#8A8D98] hover:text-[#E0E0E0] hover:bg-[#1A1D24]/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Fitness Advice</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              Prescriptions
            </span>
          </button>

          {/* Tab 4: WhatsApp Connect */}
          <button
            id="tab-whatsapp-hub-btn"
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition whitespace-nowrap text-xs ${
              activeTab === 'whatsapp'
                ? 'bg-[#1A1D24] text-[#CCFF00] border border-[#CCFF00]/40 shadow-sm'
                : 'text-[#8A8D98] hover:text-[#E0E0E0] hover:bg-[#1A1D24]/50'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Hub</span>
          </button>

          {/* Tab 5: Host Section */}
          <button
            id="tab-host-portal-btn"
            onClick={() => setActiveTab('host')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition whitespace-nowrap text-xs ${
              activeTab === 'host'
                ? 'bg-[#1A1D24] text-[#CCFF00] border border-[#CCFF00]/40 shadow-sm'
                : 'text-[#8A8D98] hover:text-[#E0E0E0] hover:bg-[#1A1D24]/50'
            }`}
          >
            {isHostUnlocked ? (
              <Unlock className="w-4 h-4 text-[#CCFF00]" />
            ) : (
              <Lock className="w-4 h-4 text-amber-400" />
            )}
            <span>Host / Coach Section</span>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
              isHostUnlocked
                ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {isHostUnlocked ? 'Unlocked 👑' : 'Password 🔒'}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
