import React, { useState, useEffect } from 'react';
import DeviceFrame from './components/DeviceFrame';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import UploadScreen from './screens/UploadScreen';
import ResultsScreen from './screens/ResultsScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';

import { checkServerHealth } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedSport, setSelectedSport] = useState('Cricket');
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Check saved user session and backend connection on load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
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
    setActiveTab('home');
    setActiveAssessment(null);
  };

  const handleNavigateToUpload = (sport) => {
    if (sport) setSelectedSport(sport);
    setActiveTab('upload');
  };

  const handleAssessmentCompleted = (result) => {
    setActiveAssessment(result);
    setActiveTab('results');
  };

  const handleSelectHistoryItem = (item) => {
    setActiveAssessment(item);
    setActiveTab('results');
  };

  // Screen Title for Top Navbar
  const getScreenTitle = () => {
    switch (activeTab) {
      case 'home': return 'TalentPulse AI';
      case 'upload': return 'Motion Assessment';
      case 'results': return 'Performance Report';
      case 'history': return 'Assessment History';
      case 'profile': return 'Athlete Profile';
      default: return 'TalentPulse';
    }
  };

  // If user is not logged in, show Auth screen inside the mobile frame
  if (!user) {
    return (
      <DeviceFrame isConnected={isBackendOnline}>
        <Navbar title="TalentPulse AI" showBack={false} user={null} />
        <div className="app-screen-content">
          <AuthScreen onAuthSuccess={handleAuthSuccess} />
        </div>
      </DeviceFrame>
    );
  }

  return (
    <DeviceFrame isConnected={isBackendOnline}>
      {/* Top Mobile App Header */}
      <Navbar
        title={getScreenTitle()}
        showBack={activeTab === 'results'}
        onBack={() => setActiveTab('home')}
        user={user}
        onProfileClick={() => setActiveTab('profile')}
      />

      {/* Main Scrollable Screen Content */}
      <div className="app-screen-content">
        {activeTab === 'home' && (
          <HomeScreen
            user={user}
            onNavigateToUpload={handleNavigateToUpload}
            onNavigateToHistory={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'upload' && (
          <UploadScreen
            user={user}
            initialSport={selectedSport}
            onAssessmentCompleted={handleAssessmentCompleted}
          />
        )}

        {activeTab === 'results' && (
          <ResultsScreen
            result={activeAssessment}
            onRetake={() => setActiveTab('upload')}
            onGoToHistory={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryScreen
            user={user}
            onSelectAssessment={handleSelectHistoryItem}
            onNewScan={() => setActiveTab('upload')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen user={user} onLogout={handleLogout} />
        )}
      </div>

      {/* Mobile Bottom Tab Bar */}
      <BottomNav
        activeTab={activeTab === 'results' ? 'upload' : activeTab}
        onTabChange={(tab) => {
          if (tab === 'upload') setActiveAssessment(null);
          setActiveTab(tab);
        }}
      />
    </DeviceFrame>
  );
}
