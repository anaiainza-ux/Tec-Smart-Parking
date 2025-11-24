import React, { useState } from 'react';
import { User, ViewState } from './types';
import { LoginPage } from './components/LoginPage';
import { SchedulePage } from './components/SchedulePage';
import { DashboardPage } from './components/DashboardPage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LOGIN);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView(ViewState.SCHEDULE);
  };

  const handleScheduleComplete = () => {
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(ViewState.LOGIN);
  };

  return (
    <div className="min-h-screen font-sans text-white bg-tec-bg-dark">
      {currentView === ViewState.LOGIN && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
      
      {currentView === ViewState.SCHEDULE && currentUser && (
        <div className="min-h-screen flex flex-col pt-10">
             <SchedulePage user={currentUser} onComplete={handleScheduleComplete} />
        </div>
      )}

      {currentView === ViewState.DASHBOARD && currentUser && (
        <DashboardPage 
          user={currentUser} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
};

export default App;