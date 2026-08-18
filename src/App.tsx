/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ClientData, ClientReport } from './types';
import { loadClients, saveClients } from './utils/storage';
import { isHostLoggedIn, setHostLoggedIn } from './utils/auth';
import { Header, AppTab } from './components/Header';
import { ClientPortalView } from './components/ClientPortalView';
import { DailyReportSubmitter } from './components/DailyReportSubmitter';
import { HostSection } from './components/HostSection';
import { FitnessAdviceHub } from './components/FitnessAdviceHub';
import { WhatsAppDirectHub } from './components/WhatsAppDirectHub';

export default function App() {
  const [clients, setClients] = useState<ClientData[]>(loadClients);
  const [activeTab, setActiveTab] = useState<AppTab>('client_portal');
  const [isHostUnlocked, setIsHostUnlocked] = useState<boolean>(isHostLoggedIn);

  // Save clients to localStorage on update
  useEffect(() => {
    saveClients(clients);
  }, [clients]);

  // Host Auth Handlers
  const handleUnlockHost = () => {
    setHostLoggedIn(true);
    setIsHostUnlocked(true);
  };

  const handleLockHost = () => {
    setHostLoggedIn(false);
    setIsHostUnlocked(false);
  };

  // Client CRUD Handlers (for Host)
  const handleAddClient = (newClient: ClientData) => {
    setClients((prev) => [newClient, ...prev]);
  };

  const handleUpdateClient = (updatedClient: ClientData) => {
    setClients((prev) =>
      prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    );
  };

  const handleDeleteClient = (clientId: string) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
  };

  const handleAddReport = (clientId: string, report: ClientReport) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const currentReports = c.reports || [];
          return {
            ...c,
            latestReportDate: report.reportDate,
            latestReportSummary: report.progressSummary,
            reports: [report, ...currentReports],
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E0E0E0] font-sans antialiased selection:bg-[#CCFF00] selection:text-black">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        clientsCount={clients.length}
        isHostUnlocked={isHostUnlocked}
        onLockHost={handleLockHost}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Tab 1: Client/Athlete Portal (Ultra user-friendly!) */}
        {activeTab === 'client_portal' && (
          <ClientPortalView
            clients={clients}
            onAddReport={handleAddReport}
            onNavigateToDailyReport={() => setActiveTab('daily_report')}
            onNavigateToAdvice={() => setActiveTab('advice')}
            onNavigateToWhatsApp={() => setActiveTab('whatsapp')}
          />
        )}

        {/* Tab 2: Dedicated Daily Client Report Submitter (WhatsApp) */}
        {activeTab === 'daily_report' && (
          <DailyReportSubmitter
            clients={clients}
            onAddReport={handleAddReport}
            onNavigateToPortal={() => setActiveTab('client_portal')}
          />
        )}

        {/* Tab 3: Fitness Advice Hub */}
        {activeTab === 'advice' && <FitnessAdviceHub />}

        {/* Tab 4: Direct WhatsApp Connect */}
        {activeTab === 'whatsapp' && <WhatsAppDirectHub clients={clients} />}

        {/* Tab 5: Host / Coach Section (Password-Protected!) */}
        {activeTab === 'host' && (
          <HostSection
            clients={clients}
            onAddClient={handleAddClient}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
            onAddReport={handleAddReport}
            isUnlocked={isHostUnlocked}
            onUnlock={handleUnlockHost}
            onLock={handleLockHost}
          />
        )}
      </main>
    </div>
  );
}
