import React, { useState, useEffect } from 'react';
import { ViewState, IssueReport, IssueStatus } from './types';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { ReportIssue } from './pages/ReportIssue';
import { IssueFeed } from './pages/IssueFeed';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthorityView } from './pages/AuthorityView';
import { fetchAllIssues, createIssue, updateIssueStatus as updateIssueStatusInDb } from './services/issueService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch issues from Supabase on mount
  useEffect(() => {
    const loadIssues = async () => {
      try {
        const data = await fetchAllIssues();
        setIssues(data);
      } catch (error) {
        console.error('Failed to load issues:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadIssues();
  }, []);

  const addIssue = async (newIssue: IssueReport) => {
    try {
      const createdIssue = await createIssue(newIssue);
      setIssues((prev) => [createdIssue, ...prev]);
      setCurrentView('feed');
    } catch (error) {
      console.error('Failed to create issue:', error);
    }
  };

  const updateIssueStatus = async (id: string, status: IssueStatus) => {
    try {
      await updateIssueStatusInDb(id, status);
      setIssues((prev) => prev.map(issue =>
        issue.id === id ? { ...issue, status, resolvedAt: status === IssueStatus.RESOLVED ? Date.now() : undefined } : issue
      ));
    } catch (error) {
      console.error('Failed to update issue status:', error);
    }
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