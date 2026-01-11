import React from 'react';
import { Activity, LayoutDashboard, FilePlus, ShieldCheck, Menu, X, Sun, Moon } from 'lucide-react';
import { ViewState } from '../types';
import SakuraParticles from './SakuraParticles';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, isDarkMode, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const NavItem = ({ view, label, icon: Icon }: { view: ViewState; label: string; icon: any }) => (
    <button
      onClick={() => {
        setView(view);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm
        ${currentView === view
          ? 'bg-sakura text-white shadow-sakura scale-105'
          : 'text-muted-foreground hover:bg-sakura-light/50 hover:text-sakura-dark hover:scale-105'
        }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 relative">
      <SakuraParticles />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-border transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setView('landing')}>
            <div className="bg-gradient-to-br from-sakura-dark to-sakura p-2 rounded-lg shadow-sakura group-hover:shadow-glow transition-all duration-300">
              <Activity className="text-white h-6 w-6" />
            </div>
            <span className="text-2xl font-display font-bold text-gradient-sakura tracking-tight">CampusPulse AI</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavItem view="report" label="Report Issue" icon={FilePlus} />
            <NavItem view="feed" label="Public Feed" icon={Activity} />
            <div className="h-6 w-px bg-border mx-2"></div>
            <NavItem view="admin" label="Admin" icon={LayoutDashboard} />
            <NavItem view="authority" label="Authority" icon={ShieldCheck} />

            <button
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-lg text-muted-foreground hover:bg-sakura-light/50 hover:text-sakura-dark transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="p-2 text-muted-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-border p-4 space-y-2 relative z-40">
          <NavItem view="report" label="Report Issue" icon={FilePlus} />
          <NavItem view="feed" label="Public Feed" icon={Activity} />
          <NavItem view="admin" label="Admin Dashboard" icon={LayoutDashboard} />
          <NavItem view="authority" label="Authority View" icon={ShieldCheck} />
        </div>
      )}

      {/* Content */}
      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-border py-6 mt-auto transition-colors duration-300 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm font-sans">
          &copy; {new Date().getFullYear()} CampusPulse AI. Powered by Gemini.
        </div>
      </footer>
    </div>
  );
};