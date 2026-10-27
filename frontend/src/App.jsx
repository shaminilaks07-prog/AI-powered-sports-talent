import React, { useState, useEffect } from 'react';
import DeviceFrame from './components/DeviceFrame';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

import LandingPage from './screens/LandingPage';
import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import UploadScreen from './screens/UploadScreen';
import ResultsScreen from './screens/ResultsScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import DrillsScreen from './screens/DrillsScreen';
import OpportunitiesScreen from './screens/OpportunitiesScreen';

import { checkServerHealth } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('landing'); // 'landing' | 'auth'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'drills' | 'assess' | 'results' | 'history' | 'opportunities' | 'profile'
  const [selectedSport, setSelectedSport] = useState('Sit-ups and Core Endurance');
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [isBackendOnline, setIsBackendOnline] = useState(false);

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
      case 'drills': return 'Exercise Guides';
      case 'assess': return 'Motion Assessment';
      case 'results': return 'Biomechanics Report';
      case 'history': return 'Assessment History';
      case 'opportunities': return 'Verified Trials';
      case 'profile': return 'Athlete Profile';
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
        <Navbar title="TalentPulse AI" showBack={false} user={null} />
        <div className="app-screen-content">
          <AuthScreen
            onAuthSuccess={handleAuthSuccess}
            onBackToLanding={() => setAuthView('landing')}
          />
        </div>
      </DeviceFrame>
    );
  }

  // Authenticated Athlete Application
  return (
    <DeviceFrame isConnected={isBackendOnline}>
      {/* Top Mobile / Desktop Header */}
      <Navbar
        title={getScreenTitle()}
        showBack={activeTab === 'results'}
        onBack={() => setActiveTab('home')}
        user={user}
        onProfileClick={() => setActiveTab('profile')}
      />

      {/* Main Scrollable Viewport */}
      <div className="app-screen-content">
        {activeTab === 'home' && (
          <HomeScreen
            user={user}
            onNavigateToUpload={handleNavigateToUpload}
            onNavigateToHistory={() => setActiveTab('history')}
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
      </div>

      {/* Mobile & Desktop Bottom Navigation */}
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
