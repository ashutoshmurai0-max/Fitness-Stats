import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  Key,
  Eye,
  EyeOff,
  LogOut,
  Users,
  CheckCircle2,
  Smartphone,
  Sparkles,
  AlertCircle,
  FileText,
  Activity,
  Award,
  Settings,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClientData, ClientReport, SHARE_DESTINATION_PHONE_FORMATTED } from '../types';
import { verifyHostPin, getSavedHostPin, saveNewHostPin, DEFAULT_HOST_PIN } from '../utils/auth';
import { SimpleClientsTable } from './SimpleClientsTable';
import { WhatsAppDirectHub } from './WhatsAppDirectHub';

interface HostSectionProps {
  clients: ClientData[];
  onAddClient: (client: ClientData) => void;
  onUpdateClient: (client: ClientData) => void;
  onDeleteClient: (clientId: string) => void;
  onAddReport: (clientId: string, report: ClientReport) => void;
  isUnlocked: boolean;
  onUnlock: () => void;
  onLock: () => void;
}

export const HostSection: React.FC<HostSectionProps> = ({
  clients,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onAddReport,
  isUnlocked,
  onUnlock,
  onLock,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeHostTab, setActiveHostTab] = useState<'roster' | 'whatsapp' | 'settings'>('roster');

  // Change PIN modal/state
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPinAttempt, setCurrentPinAttempt] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pinInput.trim()) {
      setErrorMsg('Please enter the host password or PIN.');
      return;
    }

    if (verifyHostPin(pinInput)) {
      setErrorMsg('');
      setPinInput('');
      onUnlock();
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    } else {
      setErrorMsg('Incorrect host password. Please try again.');
    }
  };

  const handleKeypadPress = (val: string) => {
    if (pinInput.length < 12) {
      setPinInput(prev => prev + val);
      setErrorMsg('');
    }
  };

  const handleKeypadClear = () => {
    setPinInput('');
    setErrorMsg('');
  };

  const handleKeypadBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError('');
    setPinChangeSuccess('');

    if (!verifyHostPin(currentPinAttempt)) {
      setPinChangeError('Current password/PIN is incorrect.');
      return;
    }

    if (newPin.trim().length < 4) {
      setPinChangeError('New PIN must be at least 4 characters.');
      return;
    }

    if (newPin !== confirmNewPin) {
      setPinChangeError('New PIN and confirmation PIN do not match.');
      return;
    }

    if (saveNewHostPin(newPin)) {
      setPinChangeSuccess('Host PIN updated successfully!');
      setTimeout(() => {
        setIsChangingPin(false);
        setCurrentPinAttempt('');
        setNewPin('');
        setConfirmNewPin('');
        setPinChangeSuccess('');
      }, 1500);
    } else {
      setPinChangeError('Failed to save new PIN.');
    }
  };

  // LOCKED STATE: Sleek Password Screen
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto py-8 sm:py-12 px-4 space-y-6">
        <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          {/* Header Icon */}
          <div className="w-16 h-16 bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-[#CCFF00]/5">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F1115] border border-[#2A2D35] text-[#8A8D98] text-[11px] font-mono font-medium mb-2">
              <Shield className="w-3.5 h-3.5 text-[#CCFF00]" />
              Restricted Coach Area
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              Host / Coach Portal
            </h2>
            <p className="text-xs text-[#8A8D98] mt-1.5">
              Enter the host password or PIN to access client management, roster edits, and internal notes.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                id="host-pin-input"
                type={showPin ? 'text' : 'password'}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter Host PIN / Passcode"
                className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-4 py-3.5 text-center text-lg font-mono font-bold tracking-widest text-white placeholder:text-[#555] focus:outline-none transition shadow-inner"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8D98] hover:text-white p-1"
                title={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-medium flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Number Pad */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  className="bg-[#0F1115] hover:bg-[#252830] active:bg-[#CCFF00] active:text-black text-white font-mono font-bold py-2.5 rounded-xl border border-[#2A2D35] text-sm transition"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleKeypadClear}
                className="bg-[#0F1115] hover:bg-rose-950/40 text-rose-400 font-mono font-bold py-2.5 rounded-xl border border-[#2A2D35] text-xs transition"
              >
                CLR
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="bg-[#0F1115] hover:bg-[#252830] active:bg-[#CCFF00] active:text-black text-white font-mono font-bold py-2.5 rounded-xl border border-[#2A2D35] text-sm transition"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleKeypadBackspace}
                className="bg-[#0F1115] hover:bg-[#252830] text-[#8A8D98] hover:text-white font-mono font-bold py-2.5 rounded-xl border border-[#2A2D35] text-xs transition"
              >
                ⌫
              </button>
            </div>

            <button
              id="host-unlock-submit-btn"
              type="submit"
              className="w-full bg-[#CCFF00] hover:bg-[#b8e600] active:bg-[#a3cc00] text-[#0F1115] font-black uppercase tracking-wider py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-[#CCFF00]/15 mt-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Host Dashboard</span>
            </button>
          </form>

          {/* Security Notice */}
          <div className="bg-[#0F1115] border border-[#2A2D35] p-3.5 rounded-2xl text-left space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#CCFF00] uppercase tracking-wider">
              <Key className="w-3.5 h-3.5" />
              <span>Host Authentication</span>
            </div>
            <p className="text-[11px] text-[#8A8D98]">
              Authorized coach access only. Client management and reports are securely protected.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // UNLOCKED STATE: Full Coach Host Console
  return (
    <div className="space-y-6 pb-16">
      {/* Host Bar */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#CCFF00] text-[#0F1115] flex items-center justify-center font-black text-lg shadow-md shadow-[#CCFF00]/15 flex-shrink-0">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                Coach Varun — Host Console
              </h2>
              <span className="bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                Unlocked & Active
              </span>
            </div>
            <p className="text-xs text-[#8A8D98] mt-0.5">
              Full administrative access to client profiles, notes, progress reviews, and WhatsApp dispatches.
            </p>
          </div>
        </div>

        {/* Host Control Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setIsChangingPin(true)}
            className="flex items-center gap-1.5 bg-[#0F1115] hover:bg-[#252830] text-[#8A8D98] hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition border border-[#2A2D35]"
            title="Change Host PIN"
          >
            <Settings className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span className="hidden sm:inline">Change PIN</span>
          </button>

          <button
            id="host-lock-logout-btn"
            type="button"
            onClick={onLock}
            className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition"
            title="Lock host section"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock & Sign Out</span>
          </button>
        </div>
      </div>

      {/* Host Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-[#2A2D35] pb-3 text-xs overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveHostTab('roster')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition whitespace-nowrap ${
            activeHostTab === 'roster'
              ? 'bg-[#CCFF00] text-[#0F1115] shadow-sm'
              : 'bg-[#1A1D24] text-[#8A8D98] hover:text-white border border-[#2A2D35]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Clients & Reports Table ({clients.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveHostTab('whatsapp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition whitespace-nowrap ${
            activeHostTab === 'whatsapp'
              ? 'bg-[#CCFF00] text-[#0F1115] shadow-sm'
              : 'bg-[#1A1D24] text-[#8A8D98] hover:text-white border border-[#2A2D35]'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>WhatsApp Dispatch Hub ({SHARE_DESTINATION_PHONE_FORMATTED})</span>
        </button>
      </div>

      {/* Host Tab Content */}
      {activeHostTab === 'roster' && (
        <SimpleClientsTable
          clients={clients}
          onAddClient={onAddClient}
          onUpdateClient={onUpdateClient}
          onDeleteClient={onDeleteClient}
          onAddReport={onAddReport}
        />
      )}

      {activeHostTab === 'whatsapp' && (
        <WhatsAppDirectHub clients={clients} />
      )}

      {/* Change Host PIN Modal */}
      {isChangingPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#2A2D35] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#CCFF00]/10 text-[#CCFF00] rounded-xl">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">
                    Change Host Passcode / PIN
                  </h3>
                  <p className="text-xs text-[#8A8D98]">
                    Set a custom PIN for Coach Varun's Host Portal.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangingPin(false)}
                className="text-[#8A8D98] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                  Current Passcode / PIN
                </label>
                <input
                  type="password"
                  value={currentPinAttempt}
                  onChange={(e) => setCurrentPinAttempt(e.target.value)}
                  placeholder="Enter current PIN"
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                  New Passcode / PIN (Min 4 characters)
                </label>
                <input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Enter new PIN"
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                  Confirm New Passcode / PIN
                </label>
                <input
                  type="password"
                  value={confirmNewPin}
                  onChange={(e) => setConfirmNewPin(e.target.value)}
                  placeholder="Re-enter new PIN"
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  required
                />
              </div>

              {pinChangeError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400">
                  {pinChangeError}
                </div>
              )}

              {pinChangeSuccess && (
                <div className="p-3 bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl text-xs text-[#25D366] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{pinChangeSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPin(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#0F1115] hover:bg-[#252830] text-[#8A8D98] hover:text-white text-xs font-bold uppercase tracking-wider transition border border-[#2A2D35]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] text-[#0F1115] text-xs font-black uppercase tracking-wider transition shadow-md shadow-[#CCFF00]/15"
                >
                  Save New PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
