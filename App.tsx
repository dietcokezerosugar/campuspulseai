import React, { useState, useEffect } from 'react';
import { ViewState, IssueReport, IssueStatus } from './types';
import { MOCK_ISSUES } from './constants';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { ReportIssue } from './pages/ReportIssue';
import { IssueFeed } from './pages/IssueFeed';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthorityView } from './pages/AuthorityView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [issues, setIssues] = useState<IssueReport[]>(MOCK_ISSUES);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Default to dark mode, only use light if explicitly set
    if (typeof window !== 'undefined') {
      return localStorage.theme !== 'light';
    }
    return true;
  });

  // Apply theme class to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // In a real app, we would fetch from Firestore here
  useEffect(() => {
    // Simulating loading data
    console.log("App initialized with mock data.");
  }, []);

  const addIssue = (newIssue: IssueReport) => {
    setIssues((prev) => [newIssue, ...prev]);
    setCurrentView('feed');
  };

  const updateIssueStatus = (id: string, status: IssueStatus) => {
    setIssues((prev) => prev.map(issue =>
      issue.id === id ? { ...issue, status, resolvedAt: status === IssueStatus.RESOLVED ? Date.now() : undefined } : issue
    ));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return <Landing setView={setCurrentView} />;
      case 'report':
        return <ReportIssue onAddIssue={addIssue} />;
      case 'feed':
        return <IssueFeed issues={issues} />;
      case 'admin':
        return <AdminDashboard issues={issues} isDarkMode={isDarkMode} />;
      case 'authority':
        return <AuthorityView issues={issues} onUpdateStatus={updateIssueStatus} />;
      default:
        return <Landing setView={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView} isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
      {renderContent()}
    </Layout>
  );
};

export default App;