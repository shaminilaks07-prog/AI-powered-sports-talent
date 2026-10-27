import React, { useState, useEffect } from 'react';
import DeviceFrame from './components/DeviceFrame';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';

import LandingPage from './screens/LandingPage';
import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import UploadScreen from './screens/UploadScreen';
import ResultsScreen from './screens/ResultsScreen';
import HistoryScreen from './screens/HistoryScreen';
import StatsScreen from './screens/StatsScreen';
import ProfileScreen from './screens/ProfileScreen';
import DrillsScreen from './screens/DrillsScreen';
import OpportunitiesScreen from './screens/OpportunitiesScreen';
import SettingsScreen from './screens/SettingsScreen';

import { checkServerHealth } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('landing'); // 'landing' | 'auth'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'assess' | 'results' | 'history' | 'stats' | 'drills' | 'opportunities' | 'profile' | 'settings'
  const [selectedSport, setSelectedSport] = useState('Sit-ups and Core Endurance');
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check saved session and backend connection on load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.email) {
          setUser(parsed);
        }
      } catch (e) {
        console.error('Session load error:', e);
      }
    }

    const testHealth = async () => {
      const res = await checkServerHealth();
      setIsBackendOnline(res.status === 'healthy');
    };
    testHealth();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setActiveTab('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setAuthView('landing');
    setActiveTab('home');
    setActiveAssessment(null);
    setIsSidebarOpen(false);
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const handleNavigateToUpload = (sport) => {
    if (sport) setSelectedSport(sport);
    setActiveTab('assess');
  };

  const handleAssessmentCompleted = (result) => {
    setActiveAssessment(result);
    setActiveTab('results');
  };

  const handleSelectHistoryItem = (item) => {
    setActiveAssessment(item);
    setActiveTab('results');
  };

  const getScreenTitle = () => {
    switch (activeTab) {
      case 'home': return 'Athlete Dashboard';
      case 'assess': return 'Video Motion Assessment';
      case 'results': return 'Biomechanics & Talent Report';
      case 'history': return 'Talent Reports & History';
      case 'stats': return 'Performance Statistics & Analytics';
      case 'drills': return 'Exercise Guides & Drills';
      case 'opportunities': return 'Verified Grassroots Trials';
      case 'profile': return 'Athlete Profile';
      case 'settings': return 'Settings & Privacy';
      default: return 'TalentPulse AI';
    }
  };

  // If user is not logged in, show Landing Page or Auth Screen
  if (!user) {
    if (authView === 'landing') {
      return (
        <DeviceFrame isConnected={isBackendOnline}>
          <LandingPage
            onGetStarted={() => setAuthView('auth')}
            onLoginClick={() => setAuthView('auth')}
          />
        </DeviceFrame>
      );
    }

    return (
      <DeviceFrame isConnected={isBackendOnline}>
        <AuthScreen
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={() => setAuthView('landing')}
        />
      </DeviceFrame>
    );
  }

  // Authenticated Athlete Full Desktop Dashboard
  return (
    <DeviceFrame isConnected={isBackendOnline}>
      {/* Dark Chocolate Top Navigation Bar */}
      <Navbar
        title={getScreenTitle()}
        showBack={activeTab === 'results'}
        onBack={() => setActiveTab('home')}
        user={user}
        onProfileClick={() => setActiveTab('profile')}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isConnected={isBackendOnline}
        onNewAssessment={() => handleNavigateToUpload()}
      />

      {/* Main Body: Fixed-Width Left Sidebar + Spacious Responsive Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Fixed Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tabId) => {
            if (tabId === 'assess') setActiveAssessment(null);
            setActiveTab(tabId);
          }}
          user={user}
          onLogout={handleLogout}
          hasActiveAssessment={Boolean(activeAssessment)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="app-screen-content">
          {activeTab === 'home' && (
            <HomeScreen
              user={user}
              onNavigateToUpload={handleNavigateToUpload}
              onNavigateToHistory={() => setActiveTab('history')}
              onNavigateToProfile={() => setActiveTab('profile')}
              onNavigateToStats={() => setActiveTab('stats')}
              onNavigateToDrills={() => setActiveTab('drills')}
              onSelectAssessment={handleSelectHistoryItem}
            />
          )}

          {activeTab === 'assess' && (
            <UploadScreen
              user={user}
              initialSport={selectedSport}
              onAssessmentCompleted={handleAssessmentCompleted}
            />
          )}

          {activeTab === 'results' && (
            <ResultsScreen
              result={activeAssessment}
              onRetake={() => setActiveTab('assess')}
              onGoToHistory={() => setActiveTab('history')}
              onBackToHome={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'history' && (
            <HistoryScreen
              user={user}
              onSelectAssessment={handleSelectHistoryItem}
              onNewScan={() => setActiveTab('assess')}
            />
          )}

          {activeTab === 'stats' && (
            <StatsScreen
              user={user}
              onNavigateToUpload={handleNavigateToUpload}
              onSelectAssessment={handleSelectHistoryItem}
            />
          )}

          {activeTab === 'drills' && (
            <DrillsScreen
              onSelectDrill={(sportId) => {
                setSelectedSport(sportId);
                setActiveTab('assess');
              }}
            />
          )}

          {activeTab === 'opportunities' && (
            <OpportunitiesScreen
              onSelectDrillForOpportunity={(sport) => {
                setSelectedSport(sport);
                setActiveTab('assess');
              }}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              user={user}
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              user={user}
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Visible only on small screens) */}
      <BottomNav
        activeTab={activeTab === 'results' ? 'assess' : activeTab}
        onTabChange={(tab) => {
          if (tab === 'assess') setActiveAssessment(null);
          setActiveTab(tab);
        }}
      />
    </DeviceFrame>
  );
}
