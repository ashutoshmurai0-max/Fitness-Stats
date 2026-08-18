import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Phone,
  Mail,
  Smartphone,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Flame,
  Target,
  Dumbbell,
  Sparkles,
  FileText,
  Copy,
  Check,
  ChevronDown,
  Calendar,
  Activity,
  Plus,
  Eye,
  Send,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClientData, ClientReport, ClientStatus, FitnessGoal, HOST_CONTACT, SHARE_DESTINATION_PHONE, SHARE_DESTINATION_PHONE_FORMATTED } from '../types';
import { generateWhatsAppLink, formatClientReportWhatsApp } from '../utils/whatsappFormatter';
import { getTodayDateString } from '../utils/storage';

interface SimpleClientsTableProps {
  clients: ClientData[];
  onAddClient: (client: ClientData) => void;
  onUpdateClient: (client: ClientData) => void;
  onDeleteClient: (clientId: string) => void;
  onAddReport: (clientId: string, report: ClientReport) => void;
}

export const SimpleClientsTable: React.FC<SimpleClientsTableProps> = ({
  clients,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onAddReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [goalFilter, setGoalFilter] = useState<string>('all');

  // Modals
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientData | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedClientForReport, setSelectedClientForReport] = useState<ClientData | null>(null);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedClientForHistory, setSelectedClientForHistory] = useState<ClientData | null>(null);

  // Client Form State
  const [clientFormData, setClientFormData] = useState<Partial<ClientData>>({
    name: '',
    email: '',
    phoneNumber: '+91 ',
    fitnessGoal: 'weight_loss',
    assignedWorkoutPlan: '4-Day Push/Pull/Legs Split',
    planStatus: 'active',
    joiningDate: getTodayDateString(),
    dietaryPreference: 'High Protein Balanced',
    coachNotes: '',
  });

  // Report Form State
  const [reportFormData, setReportFormData] = useState<Partial<ClientReport>>({
    reportDate: getTodayDateString(),
    workoutAdherence: 'Excellent (100%)',
    dietAdherence: 'Strict & On-Target',
    energyLevel: 'High & Strong',
    progressSummary: '',
    keyWins: '',
    coachFeedback: '',
    nextWeekTargets: '',
  });

  const [shareToWhatsAppImmediately, setShareToWhatsAppImmediately] = useState(true);

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phoneNumber.includes(searchTerm) ||
      (c.assignedWorkoutPlan && c.assignedWorkoutPlan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.coachNotes && c.coachNotes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || c.planStatus === statusFilter;
    const matchesGoal = goalFilter === 'all' || c.fitnessGoal === goalFilter;

    return matchesSearch && matchesStatus && matchesGoal;
  });

  // Open Client Add/Edit Modal
  const handleOpenAddClient = () => {
    setEditingClient(null);
    setClientFormData({
      name: '',
      email: '',
      phoneNumber: '+91 ',
      fitnessGoal: 'weight_loss',
      assignedWorkoutPlan: '4-Day Push/Pull/Legs Split',
      planStatus: 'active',
      joiningDate: getTodayDateString(),
      dietaryPreference: 'High Protein Balanced',
      coachNotes: 'Client intake note: Prioritizing consistent workouts and nutrition tracking.',
    });
    setIsClientModalOpen(true);
  };

  const handleOpenEditClient = (client: ClientData) => {
    setEditingClient(client);
    setClientFormData({ ...client });
    setIsClientModalOpen(true);
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientFormData.name?.trim()) return;

    if (editingClient) {
      const updated: ClientData = {
        ...editingClient,
        ...clientFormData,
        name: clientFormData.name.trim(),
        phoneNumber: clientFormData.phoneNumber?.trim() || '+91 7499 177 223',
        fitnessGoal: clientFormData.fitnessGoal || 'weight_loss',
        planStatus: clientFormData.planStatus || 'active',
      };
      onUpdateClient(updated);
    } else {
      const newClient: ClientData = {
        id: `client-${Date.now()}`,
        name: clientFormData.name.trim(),
        email: clientFormData.email?.trim() || '',
        phoneNumber: clientFormData.phoneNumber?.trim() || '+91 7499 177 223',
        fitnessGoal: clientFormData.fitnessGoal || 'weight_loss',
        assignedWorkoutPlan: clientFormData.assignedWorkoutPlan?.trim() || 'Custom Training Split',
        planStatus: clientFormData.planStatus || 'active',
        joiningDate: clientFormData.joiningDate || getTodayDateString(),
        dietaryPreference: clientFormData.dietaryPreference?.trim() || 'Balanced High Protein',
        coachNotes: clientFormData.coachNotes || 'New athlete added to coaching roster.',
        reports: [],
      };
      onAddClient(newClient);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }

    setIsClientModalOpen(false);
  };

  // Open Report Add Modal
  const handleOpenAddReport = (client: ClientData) => {
    setSelectedClientForReport(client);
    setReportFormData({
      reportDate: getTodayDateString(),
      workoutAdherence: 'Excellent (100%)',
      dietAdherence: 'Strict & On-Target',
      energyLevel: 'High & Strong',
      progressSummary: 'Completed all planned training sessions. Good workout recovery and consistency.',
      keyWins: 'Maintained steady strength numbers on core compound lifts.',
      coachFeedback: `Keep up the momentum, ${client.name}! Your movement quality is improving rapidly.`,
      nextWeekTargets: 'Maintain protein target and add 1 more rep on your primary lifts.',
    });
    setIsReportModalOpen(true);
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForReport) return;

    const newReport: ClientReport = {
      id: `rep-${Date.now()}`,
      clientId: selectedClientForReport.id,
      clientName: selectedClientForReport.name,
      reportDate: reportFormData.reportDate || getTodayDateString(),
      workoutAdherence: reportFormData.workoutAdherence as any || 'Excellent (100%)',
      dietAdherence: reportFormData.dietAdherence as any || 'Strict & On-Target',
      energyLevel: reportFormData.energyLevel as any || 'High & Strong',
      progressSummary: reportFormData.progressSummary?.trim() || 'Weekly training completed.',
      keyWins: reportFormData.keyWins?.trim() || 'Consistent training adherence.',
      coachFeedback: reportFormData.coachFeedback?.trim() || 'Solid week of progress.',
      nextWeekTargets: reportFormData.nextWeekTargets?.trim() || 'Continue progressive overload.',
      timestamp: new Date().toISOString(),
    };

    onAddReport(selectedClientForReport.id, newReport);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });

    if (shareToWhatsAppImmediately) {
      const text = formatClientReportWhatsApp(selectedClientForReport, newReport);
      const link = generateWhatsAppLink(SHARE_DESTINATION_PHONE, text);
      window.open(link, '_blank');
    }

    setIsReportModalOpen(false);
  };

  // Open Reports History
  const handleOpenHistory = (client: ClientData) => {
    setSelectedClientForHistory(client);
    setIsHistoryModalOpen(true);
  };

  const handleDirectShareLatestReport = (client: ClientData) => {
    if (client.reports && client.reports.length > 0) {
      const latest = client.reports[0];
      const text = formatClientReportWhatsApp(client, latest);
      const link = generateWhatsAppLink(SHARE_DESTINATION_PHONE, text);
      window.open(link, '_blank');
    } else {
      // Generate summary check-in report
      const mockReport: ClientReport = {
        id: `mock-${Date.now()}`,
        clientId: client.id,
        clientName: client.name,
        reportDate: client.latestReportDate || client.joiningDate,
        workoutAdherence: 'Good (80-90%)',
        dietAdherence: 'Consistent',
        energyLevel: 'High & Strong',
        progressSummary: client.latestReportSummary || client.coachNotes || 'Active athlete in training cycle.',
        keyWins: 'Steady training adherence and commitment to goals.',
        coachFeedback: `Athlete ${client.name} is on track with the ${client.assignedWorkoutPlan || 'assigned plan'}.`,
        nextWeekTargets: 'Continue scheduled workouts and hit daily hydration targets.',
        timestamp: new Date().toISOString(),
      };
      const text = formatClientReportWhatsApp(client, mockReport);
      const link = generateWhatsAppLink(SHARE_DESTINATION_PHONE, text);
      window.open(link, '_blank');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-[#CCFF00] text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              Clients & Progress Reports Table
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Client Management & Reports
            </h2>
            <p className="text-xs sm:text-sm text-[#A0A3AD] mt-1">
              Add new clients, record coaching progress reports, and dispatch formatted reports directly to WhatsApp ({SHARE_DESTINATION_PHONE_FORMATTED}).
            </p>
          </div>

          <button
            id="add-client-top-btn"
            onClick={handleOpenAddClient}
            className="bg-[#CCFF00] hover:bg-[#b8e600] text-[#0F1115] font-black px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-[#CCFF00]/10 flex-shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add New Client</span>
          </button>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#2A2D35]">
          <div className="bg-[#0F1115] p-3.5 rounded-xl border border-[#2A2D35]">
            <span className="text-[10px] font-mono uppercase text-[#8A8D98] font-bold">Total Clients</span>
            <div className="text-xl font-black text-white mt-0.5">{clients.length}</div>
          </div>
          <div className="bg-[#0F1115] p-3.5 rounded-xl border border-[#2A2D35]">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Active Clients</span>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {clients.filter(c => c.planStatus === 'active').length}
            </div>
          </div>
          <div className="bg-[#0F1115] p-3.5 rounded-xl border border-[#2A2D35]">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">In Review</span>
            <div className="text-xl font-black text-amber-400 mt-0.5">
              {clients.filter(c => c.planStatus === 'review').length}
            </div>
          </div>
          <div className="bg-[#0F1115] p-3.5 rounded-xl border border-[#2A2D35]">
            <span className="text-[10px] font-mono uppercase text-[#CCFF00] font-bold">Reports Logged</span>
            <div className="text-xl font-black text-[#CCFF00] mt-0.5">
              {clients.reduce((sum, c) => sum + (c.reports ? c.reports.length : 0), 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Table Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8D98]" />
          <input
            id="client-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, plan, or phone number..."
            className="w-full bg-[#1A1D24] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#5A5D66] focus:outline-none transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['all', 'active', 'review', 'onboarding', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#CCFF00] text-[#0F1115]'
                  : 'bg-[#1A1D24] text-[#8A8D98] hover:text-white border border-[#2A2D35]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Clients & Reports Table */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F1115] border-b border-[#2A2D35] text-[11px] font-mono uppercase text-[#8A8D98] tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Client</th>
                <th className="py-3.5 px-4">Goal & Workout Plan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 min-w-[200px]">Latest Report / Notes</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2D35] text-xs sm:text-sm">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#8A8D98]">
                    No clients found matching your search. Tap <strong>+ Add New Client</strong> to create one.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const reportsCount = client.reports ? client.reports.length : 0;
                  const latestReport = client.reports && client.reports.length > 0 ? client.reports[0] : null;

                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-[#222630] transition group"
                    >
                      {/* Client Name & Info */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] font-black text-sm flex items-center justify-center flex-shrink-0">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{client.name}</span>
                              {client.gender && (
                                <span className="text-[10px] text-[#8A8D98] font-normal uppercase">
                                  ({client.gender}, {client.age || 26})
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#8A8D98] mt-0.5">
                              <a
                                href={`https://wa.me/${SHARE_DESTINATION_PHONE}?text=${encodeURIComponent(`Hi ${client.name}! This is Coach Varun checking in.`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#25D366] hover:underline font-mono flex items-center gap-1"
                              >
                                <Smartphone className="w-3 h-3" />
                                {client.phoneNumber || SHARE_DESTINATION_PHONE_FORMATTED}
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Goal & Plan */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#0F1115] text-[#CCFF00] px-2 py-0.5 rounded border border-[#2A2D35]">
                            {client.fitnessGoal.replace('_', ' ')}
                          </span>
                          <div className="text-xs text-[#E0E0E0] font-medium truncate max-w-[220px]" title={client.assignedWorkoutPlan}>
                            {client.assignedWorkoutPlan || 'Standard Hypertrophy Plan'}
                          </div>
                          {client.dietaryPreference && (
                            <div className="text-[11px] text-[#8A8D98] truncate max-w-[220px]">
                              🥗 {client.dietaryPreference}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            client.planStatus === 'active'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : client.planStatus === 'review'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : client.planStatus === 'onboarding'
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                              : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {client.planStatus}
                        </span>
                      </td>

                      {/* Latest Report / Notes */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-[#8A8D98] flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#CCFF00]" />
                              {latestReport ? latestReport.reportDate : (client.latestReportDate || client.joiningDate)}
                            </span>
                            {latestReport && (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                                {latestReport.workoutAdherence.split(' ')[0]}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#A0A3AD] line-clamp-2 leading-snug">
                            {latestReport
                              ? latestReport.progressSummary
                              : (client.latestReportSummary || client.coachNotes || 'No report logged yet.')}
                          </p>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Add Report Button */}
                          <button
                            id={`add-report-btn-${client.id}`}
                            onClick={() => handleOpenAddReport(client)}
                            className="bg-[#CCFF00] hover:bg-[#b8e600] text-[#0F1115] px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition shadow-sm"
                            title="Add a new progress report"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Report</span>
                          </button>

                          {/* View Reports Button */}
                          <button
                            id={`view-reports-btn-${client.id}`}
                            onClick={() => handleOpenHistory(client)}
                            className="bg-[#0F1115] hover:bg-[#2A2D35] text-white border border-[#2A2D35] px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                            title={`View reports history (${reportsCount})`}
                          >
                            <FileText className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="hidden lg:inline">{reportsCount}</span>
                          </button>

                          {/* 1-Click WhatsApp Share Button */}
                          <button
                            id={`share-whatsapp-btn-${client.id}`}
                            onClick={() => handleDirectShareLatestReport(client)}
                            className="bg-[#25D366] hover:bg-[#20ba59] text-black px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                            title={`Share report to WhatsApp (${SHARE_DESTINATION_PHONE_FORMATTED})`}
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline">Share</span>
                          </button>

                          {/* Edit Client */}
                          <button
                            onClick={() => handleOpenEditClient(client)}
                            className="p-1.5 rounded-lg bg-[#0F1115] hover:bg-[#2A2D35] text-[#8A8D98] hover:text-white transition"
                            title="Edit Client"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Client */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
                                onDeleteClient(client.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-[#0F1115] hover:bg-red-500/20 text-[#8A8D98] hover:text-red-400 transition"
                            title="Delete Client"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Client Modal */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 bg-[#0F1115] border-b border-[#2A2D35] flex items-center justify-between">
              <h3 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#CCFF00]" />
                {editingClient ? 'Edit Client Details' : 'Add New Client to Roster'}
              </h3>
              <button
                onClick={() => setIsClientModalOpen(false)}
                className="text-[#8A8D98] hover:text-white p-1 rounded-lg hover:bg-[#2A2D35]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientFormData.name || ''}
                  onChange={(e) => setClientFormData({ ...clientFormData, name: e.target.value })}
                  placeholder="e.g. Sameer Kapoor"
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="text"
                    value={clientFormData.phoneNumber || ''}
                    onChange={(e) => setClientFormData({ ...clientFormData, phoneNumber: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={clientFormData.planStatus || 'active'}
                    onChange={(e) => setClientFormData({ ...clientFormData, planStatus: e.target.value as any })}
                    className="w-full bg-[#0F1115] border border-[#2A2D35] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="active">Active</option>
                    <option value="review">Review Needed</option>
                    <option value="onboarding">Onboarding</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                    Primary Goal
                  </label>
                  <select
                    value={clientFormData.fitnessGoal || 'weight_loss'}
                    onChange={(e) => setClientFormData({ ...clientFormData, fitnessGoal: e.target.value as any })}
                    className="w-full bg-[#0F1115] border border-[#2A2D35] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="weight_loss">🔥 Weight Loss / Cut</option>
                    <option value="muscle_gain">💪 Muscle Hypertrophy</option>
                    <option value="maintenance">⚖️ Maintenance / Recomp</option>
                    <option value="endurance">🏃 Endurance & Stamina</option>
                    <option value="general_health">🌱 General Health & Longevity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                    Dietary Preference
                  </label>
                  <input
                    type="text"
                    value={clientFormData.dietaryPreference || ''}
                    onChange={(e) => setClientFormData({ ...clientFormData, dietaryPreference: e.target.value })}
                    placeholder="e.g. High Protein Non-Veg / Vegetarian"
                    className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                  Assigned Workout Plan / Routine
                </label>
                <input
                  type="text"
                  value={clientFormData.assignedWorkoutPlan || ''}
                  onChange={(e) => setClientFormData({ ...clientFormData, assignedWorkoutPlan: e.target.value })}
                  placeholder="e.g. 4-Day Upper/Lower Hypertrophy + 8k Steps"
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                  Coach Notes / Initial Assessment
                </label>
                <textarea
                  rows={3}
                  value={clientFormData.coachNotes || ''}
                  onChange={(e) => setClientFormData({ ...clientFormData, coachNotes: e.target.value })}
                  placeholder="Notes on client baseline, past injuries, or key weekly focus..."
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="flex-1 bg-[#0F1115] hover:bg-[#2A2D35] text-[#8A8D98] hover:text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#CCFF00] hover:bg-[#b8e600] text-[#0F1115] py-3 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md"
                >
                  {editingClient ? 'Save Changes' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Client Report Modal */}
      {isReportModalOpen && selectedClientForReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 bg-[#0F1115] border-b border-[#2A2D35] flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#CCFF00]" />
                  Log Client Progress Report
                </h3>
                <p className="text-xs text-[#8A8D98] mt-0.5">
                  Client: <strong className="text-white">{selectedClientForReport.name}</strong> ({selectedClientForReport.fitnessGoal.replace('_', ' ')})
                </p>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-[#8A8D98] hover:text-white p-1 rounded-lg hover:bg-[#2A2D35]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                    Report Date
                  </label>
                  <input
                    type="date"
                    value={reportFormData.reportDate || getTodayDateString()}
                    onChange={(e) => setReportFormData({ ...reportFormData, reportDate: e.target.value })}
                    className="w-full bg-[#0F1115] border border-[#2A2D35] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                    Workout Adherence
                  </label>
                  <select
                    value={reportFormData.workoutAdherence}
                    onChange={(e) => setReportFormData({ ...reportFormData, workoutAdherence: e.target.value as any })}
                    className="w-full bg-[#0F1115] border border-[#2A2D35] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="Excellent (100%)">Excellent (100%)</option>
                    <option value="Good (80-90%)">Good (80-90%)</option>
                    <option value="Fair (60-70%)">Fair (60-70%)</option>
                    <option value="Needs Improvement (<50%)">Needs Improvement (&lt;50%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                    Diet Adherence
                  </label>
                  <select
                    value={reportFormData.dietAdherence}
                    onChange={(e) => setReportFormData({ ...reportFormData, dietAdherence: e.target.value as any })}
                    className="w-full bg-[#0F1115] border border-[#2A2D35] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="Strict & On-Target">Strict & On-Target</option>
                    <option value="Consistent">Consistent</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Needs Attention">Needs Attention</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                  Progress Summary (Workouts & Consistency) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={reportFormData.progressSummary || ''}
                  onChange={(e) => setReportFormData({ ...reportFormData, progressSummary: e.target.value })}
                  placeholder="e.g. Completed 4/4 gym workouts, hit daily step goals, good energy..."
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                  Key Wins & PRs (Personal Records)
                </label>
                <input
                  type="text"
                  value={reportFormData.keyWins || ''}
                  onChange={(e) => setReportFormData({ ...reportFormData, keyWins: e.target.value })}
                  placeholder="e.g. Benched 80kg x 6 reps (New PR!), zero knee soreness on squats"
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                  Coach Feedback & Technical Guidance
                </label>
                <textarea
                  rows={2}
                  value={reportFormData.coachFeedback || ''}
                  onChange={(e) => setReportFormData({ ...reportFormData, coachFeedback: e.target.value })}
                  placeholder="e.g. Outstanding tempo control. Next week maintain 2-second pause at bottom of squats."
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A0A3AD] uppercase tracking-wider mb-1.5">
                  Next Week Action Targets
                </label>
                <input
                  type="text"
                  value={reportFormData.nextWeekTargets || ''}
                  onChange={(e) => setReportFormData({ ...reportFormData, nextWeekTargets: e.target.value })}
                  placeholder="e.g. Step target 8.5k/day + increase bench load to 82.5kg"
                  className="w-full bg-[#0F1115] border border-[#2A2D35] focus:border-[#CCFF00] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Immediate WhatsApp Share Checkbox */}
              <div className="p-3 bg-[#0F1115] border border-[#25D366]/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#25D366]" />
                  <span className="text-xs font-bold text-white">
                    Send Report to WhatsApp ({SHARE_DESTINATION_PHONE_FORMATTED})
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={shareToWhatsAppImmediately}
                  onChange={(e) => setShareToWhatsAppImmediately(e.target.checked)}
                  className="w-4 h-4 accent-[#25D366] rounded cursor-pointer"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="flex-1 bg-[#0F1115] hover:bg-[#2A2D35] text-[#8A8D98] hover:text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#CCFF00] hover:bg-[#b8e600] text-[#0F1115] py-3 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md"
                >
                  Save & Record Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Reports History Modal */}
      {isHistoryModalOpen && selectedClientForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-[#0F1115] border-b border-[#2A2D35] flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#CCFF00]" />
                  Reports History: {selectedClientForHistory.name}
                </h3>
                <p className="text-xs text-[#8A8D98]">
                  Plan: {selectedClientForHistory.assignedWorkoutPlan}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsHistoryModalOpen(false);
                    handleOpenAddReport(selectedClientForHistory);
                  }}
                  className="bg-[#CCFF00] hover:bg-[#b8e600] text-[#0F1115] px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ New Report</span>
                </button>
                <button
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="text-[#8A8D98] hover:text-white p-1 rounded-lg hover:bg-[#2A2D35]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {(!selectedClientForHistory.reports || selectedClientForHistory.reports.length === 0) ? (
                <div className="py-12 text-center text-[#8A8D98] space-y-2">
                  <p>No historical reports logged for this client yet.</p>
                  <button
                    onClick={() => {
                      setIsHistoryModalOpen(false);
                      handleOpenAddReport(selectedClientForHistory);
                    }}
                    className="text-[#CCFF00] font-bold text-xs hover:underline"
                  >
                    + Log the first report now
                  </button>
                </div>
              ) : (
                selectedClientForHistory.reports.map((report, idx) => (
                  <div
                    key={report.id || idx}
                    className="p-4 bg-[#0F1115] border border-[#2A2D35] rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-[#2A2D35] pb-2.5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#CCFF00]" />
                        <span className="font-mono font-bold text-white text-xs">{report.reportDate}</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                          {report.workoutAdherence}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          const text = formatClientReportWhatsApp(selectedClientForHistory, report);
                          const link = generateWhatsAppLink(SHARE_DESTINATION_PHONE, text);
                          window.open(link, '_blank');
                        }}
                        className="bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/40 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Send to WhatsApp</span>
                      </button>
                    </div>

                    <p className="text-xs text-[#D0D3DD] leading-relaxed">
                      <strong>Progress:</strong> {report.progressSummary}
                    </p>

                    {report.keyWins && (
                      <p className="text-xs text-[#CCFF00]">
                        <strong>🏆 PRs / Wins:</strong> {report.keyWins}
                      </p>
                    )}

                    {report.coachFeedback && (
                      <p className="text-xs text-[#A0A3AD] bg-[#1A1D24] p-2.5 rounded-lg border border-[#2A2D35]">
                        <strong>Coach Feedback:</strong> "{report.coachFeedback}"
                      </p>
                    )}

                    {report.nextWeekTargets && (
                      <p className="text-[11px] text-[#8A8D98]">
                        <strong>Next Week Targets:</strong> {report.nextWeekTargets}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
