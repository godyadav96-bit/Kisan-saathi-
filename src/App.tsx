import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { LocationModal } from './components/LocationModal';
import { KisanAIAssistantModal } from './components/KisanAIAssistantModal';
import { NotificationModal } from './components/NotificationModal';
import { OfflineIndicator } from './components/OfflineIndicator';

// Pages
import { HomeDashboard } from './pages/HomeDashboard';
import { MausamDashboard } from './pages/MausamDashboard';
import { MandiDashboard } from './pages/MandiDashboard';
import { SoilSenseDashboard } from './pages/SoilSenseDashboard';
import { CropLibrary } from './pages/CropLibrary';
import { KhetiCalculator } from './pages/KhetiCalculator';
import { KnowledgeLibrary } from './pages/KnowledgeLibrary';
import { UserProfile } from './pages/UserProfile';
import { AdminDashboard } from './pages/AdminDashboard';
import { MarketplacePlaceholder } from './pages/MarketplacePlaceholder';

const MainContent: React.FC = () => {
  const { activeScreen } = useApp();

  return (
    <main className="max-w-4xl mx-auto px-3 sm:px-4 pt-3">
      {activeScreen === 'home' && <HomeDashboard />}
      {activeScreen === 'mausam' && <MausamDashboard />}
      {activeScreen === 'mandi' && <MandiDashboard />}
      {activeScreen === 'soilsense' && <SoilSenseDashboard />}
      {activeScreen === 'profile' && <UserProfile />}
      {activeScreen === 'crops' && <CropLibrary />}
      {activeScreen === 'calculator' && <KhetiCalculator />}
      {activeScreen === 'library' && <KnowledgeLibrary />}
      {activeScreen === 'admin' && <AdminDashboard />}
      {activeScreen === 'marketplace' && <MarketplacePlaceholder />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-stone-100/70 text-gray-900 font-sans antialiased selection:bg-amber-200 selection:text-amber-950">
        {/* Offline Connectivity Status Banner */}
        <OfflineIndicator />

        {/* Global App Header */}
        <Header />

        {/* Core Screen Router */}
        <MainContent />

        {/* Floating AI Assistant Trigger */}
        <FloatingAIAssistant />

        {/* Bottom Navigation Bar */}
        <BottomNav />

        {/* Modals & Drawers */}
        <LocationModal />
        <KisanAIAssistantModal />
        <NotificationModal />
      </div>
    </AppProvider>
  );
}
