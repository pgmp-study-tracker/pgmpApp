'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useStudyStore } from '@/store/study-store';
import { Dashboard } from '@/components/Dashboard';
import { TodayView } from '@/components/TodayView';
import { CalendarView } from '@/components/CalendarView';
import { ProgressView } from '@/components/ProgressView';
import { SettingsView } from '@/components/SettingsView';
import { NotificationService } from '@/components/NotificationService';
import { motion, AnimatePresence } from 'framer-motion';
import { Home as HomeIcon, Calendar, BarChart3, Settings, GraduationCap } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

// Check if running in standalone mode (installed PWA)
function getIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches;
}

function subscribeToStandalone(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(display-mode: standalone)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getSnapshot(): boolean {
  return getIsStandalone();
}

function getServerSnapshot(): boolean {
  return false;
}

export default function PgMPTracker() {
  const { 
    initializeStudyPlan, 
    viewMode, 
    setViewMode,
  } = useStudyStore();
  
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const isStandalone = useSyncExternalStore(subscribeToStandalone, getSnapshot, getServerSnapshot);

  // Initialize study plan once
  useEffect(() => {
    initializeStudyPlan();
  }, [initializeStudyPlan]);

  // Show install prompt if not standalone
  useEffect(() => {
    if (!isStandalone) {
      const timer = setTimeout(() => setShowInstallPrompt(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isStandalone]);

  const navItems = [
    { id: 'today' as const, label: 'Today', icon: HomeIcon },
    { id: 'calendar' as const, label: 'Calendar', icon: Calendar },
    { id: 'progress' as const, label: 'Progress', icon: BarChart3 },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/80 border-b border-slate-700/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">PgMP Tracker</h1>
              <p className="text-slate-400 text-xs">Study Progress</p>
            </div>
          </div>
          <NotificationService />
        </div>
      </header>

      {/* Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white px-4 py-3 text-center text-sm"
          >
            <p className="font-medium">Add to Home Screen</p>
            <p className="text-xs opacity-90 mt-1">
              Tap the share button and select &quot;Add to Home Screen&quot; for the best experience
            </p>
            <button 
              onClick={() => setShowInstallPrompt(false)}
              className="text-xs underline mt-2 opacity-80 hover:opacity-100"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pb-24 pt-4">
        <AnimatePresence mode="wait">
          {viewMode === 'today' && (
            <motion.div
              key="today"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Dashboard />
              <TodayView />
            </motion.div>
          )}
          {viewMode === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CalendarView />
            </motion.div>
          )}
          {viewMode === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ProgressView />
            </motion.div>
          )}
          {viewMode === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SettingsView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/50 z-50">
        <div className="max-w-lg mx-auto px-2">
          <div className="flex justify-around items-center py-2">
            {navItems.map((item) => {
              const isActive = viewMode === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setViewMode(item.id)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                    isActive 
                      ? 'text-blue-400' 
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  <span className="text-xs font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-0 w-8 h-1 bg-blue-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <Toaster />
    </div>
  );
}
