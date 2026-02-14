import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StudyTask, generateStudyPlan, getDateForDay, examInfo } from '@/lib/study-data';

export interface TaskProgress {
  taskId: string;
  completed: boolean;
  completedAt?: Date;
  skipped: boolean;
  skippedAt?: Date;
  movedToNextDay: boolean;
  notes: string;
}

export interface NotificationSettings {
  enabled: boolean;
  morningReminder: boolean;
  morningTime: string;
  eveningReminder: boolean;
  eveningTime: string;
  beforeTaskReminder: number;
  quietHoursStart: string;
  quietHoursEnd: string;
  weekendMoreIntensive: boolean;
}

export interface SyncInfo {
  isSynced: boolean;
  userId: string | null;
  deviceId: string | null;
  syncCode: string | null;
  lastSyncAt: string | null;
  deviceName: string;
}

export interface StudyStore {
  // Study Plan
  tasks: StudyTask[];
  taskProgress: Record<string, TaskProgress>;
  
  // Notifications
  notificationSettings: NotificationSettings;
  lastReminderSent: string | null;
  
  // Cloud Sync
  syncInfo: SyncInfo;
  isSyncing: boolean;
  syncError: string | null;
  
  // UI State
  selectedDate: Date;
  viewMode: 'today' | 'calendar' | 'progress' | 'settings';
  
  // Actions
  initializeStudyPlan: () => void;
  markTaskComplete: (taskId: string, notes?: string) => void;
  markTaskSkipped: (taskId: string) => void;
  moveTaskToNextDay: (taskId: string) => void;
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: 'today' | 'calendar' | 'progress' | 'settings') => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  
  // Cloud Sync Actions
  createSyncAccount: (name?: string) => Promise<void>;
  joinSyncAccount: (syncCode: string) => Promise<void>;
  syncProgress: () => Promise<void>;
  disconnectSync: () => void;
  setSyncInfo: (info: Partial<SyncInfo>) => void;
  
  // Computed helpers
  getTodayTasks: () => StudyTask[];
  getTasksForDate: (date: Date) => StudyTask[];
  getOverallProgress: () => number;
  getTodayProgress: () => number;
  getDaysRemaining: () => number;
  getTaskProgress: (taskId: string) => TaskProgress | undefined;
  getStreak: () => number;
  getOverdueTasks: () => StudyTask[];
}

const defaultNotificationSettings: NotificationSettings = {
  enabled: true,
  morningReminder: true,
  morningTime: '08:00',
  eveningReminder: true,
  eveningTime: '19:00',
  beforeTaskReminder: 15,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  weekendMoreIntensive: true,
};

const defaultSyncInfo: SyncInfo = {
  isSynced: false,
  userId: null,
  deviceId: null,
  syncCode: null,
  lastSyncAt: null,
  deviceName: typeof window !== 'undefined' ? 
    /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'iPhone' :
    /Mac/.test(navigator.userAgent) ? 'MacBook' :
    /Android/.test(navigator.userAgent) ? 'Android' :
    'Device' : 'Device',
};

// API helper functions
async function createSyncUser(deviceName: string, name?: string) {
  const response = await fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deviceName,
      deviceType: /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'iphone' :
                  /Mac/.test(navigator.userAgent) ? 'macbook' :
                  /Android/.test(navigator.userAgent) ? 'android' : 'other',
      name,
    }),
  });
  return response.json();
}

async function joinSyncAccount(syncCode: string, deviceName: string) {
  const response = await fetch('/api/sync', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      syncCode,
      deviceName,
      deviceType: /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'iphone' :
                  /Mac/.test(navigator.userAgent) ? 'macbook' :
                  /Android/.test(navigator.userAgent) ? 'android' : 'other',
    }),
  });
  return response.json();
}

async function syncProgressToCloud(userId: string, deviceId: string, progress: Record<string, TaskProgress>) {
  const response = await fetch('/api/progress', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, deviceId, progress }),
  });
  return response.json();
}

async function fetchProgressFromCloud(userId: string, deviceId: string) {
  const response = await fetch(`/api/progress?userId=${userId}&deviceId=${deviceId}`);
  return response.json();
}

export const useStudyStore = create<StudyStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      taskProgress: {},
      notificationSettings: defaultNotificationSettings,
      lastReminderSent: null,
      syncInfo: defaultSyncInfo,
      isSyncing: false,
      syncError: null,
      selectedDate: new Date(),
      viewMode: 'today',

      initializeStudyPlan: () => {
        const tasks = generateStudyPlan();
        set({ tasks });
        
        // Auto-sync if connected
        const { syncInfo } = get();
        if (syncInfo.isSynced && syncInfo.userId && syncInfo.deviceId) {
          get().syncProgress();
        }
      },

      markTaskComplete: (taskId: string, notes?: string) => {
        set((state) => {
          const newProgress: Record<string, TaskProgress> = {
            ...state.taskProgress,
            [taskId]: {
              taskId,
              completed: true,
              completedAt: new Date(),
              skipped: false,
              movedToNextDay: false,
              notes: notes || '',
            },
          };
          
          // Trigger sync in background
          if (state.syncInfo.isSynced && state.syncInfo.userId) {
            get().syncProgress();
          }
          
          return { taskProgress: newProgress };
        });
      },

      markTaskSkipped: (taskId: string) => {
        set((state) => {
          const newProgress: Record<string, TaskProgress> = {
            ...state.taskProgress,
            [taskId]: {
              taskId,
              completed: false,
              skipped: true,
              skippedAt: new Date(),
              movedToNextDay: false,
              notes: '',
            },
          };
          
          if (state.syncInfo.isSynced && state.syncInfo.userId) {
            get().syncProgress();
          }
          
          return { taskProgress: newProgress };
        });
      },

      moveTaskToNextDay: (taskId: string) => {
        set((state) => {
          const task = state.tasks.find(t => t.id === taskId);
          if (!task || task.day >= 67) return state;

          const newProgress: Record<string, TaskProgress> = {
            ...state.taskProgress,
            [taskId]: {
              taskId,
              completed: false,
              skipped: false,
              movedToNextDay: true,
              notes: 'Moved to next day',
            },
          };

          if (state.syncInfo.isSynced && state.syncInfo.userId) {
            get().syncProgress();
          }

          return { taskProgress: newProgress };
        });
      },

      setSelectedDate: (date: Date) => set({ selectedDate: date }),
      setViewMode: (mode) => set({ viewMode: mode }),

      updateNotificationSettings: (settings) => {
        set((state) => ({
          notificationSettings: { ...state.notificationSettings, ...settings },
        }));
      },

      createSyncAccount: async (name?: string) => {
        set({ isSyncing: true, syncError: null });
        
        try {
          const deviceName = get().syncInfo.deviceName;
          const result = await createSyncUser(deviceName, name);
          
          if (result.success) {
            set({
              syncInfo: {
                isSynced: true,
                userId: result.userId,
                deviceId: result.deviceId,
                syncCode: result.syncCode,
                lastSyncAt: new Date().toISOString(),
                deviceName,
              },
              isSyncing: false,
            });
            
            // Sync existing progress
            await get().syncProgress();
          } else {
            set({ syncError: result.error, isSyncing: false });
          }
        } catch (error) {
          set({ syncError: 'Failed to create sync account', isSyncing: false });
        }
      },

      joinSyncAccount: async (syncCode: string) => {
        set({ isSyncing: true, syncError: null });
        
        try {
          const deviceName = get().syncInfo.deviceName;
          const result = await joinSyncAccount(syncCode, deviceName);
          
          if (result.success) {
            set({
              syncInfo: {
                isSynced: true,
                userId: result.userId,
                deviceId: result.deviceId,
                syncCode: result.syncCode,
                lastSyncAt: new Date().toISOString(),
                deviceName,
              },
              isSyncing: false,
            });
            
            // Merge local progress with cloud progress
            if (result.taskProgress) {
              const cloudProgress: Record<string, TaskProgress> = {};
              result.taskProgress.forEach((p: any) => {
                cloudProgress[p.taskId] = {
                  taskId: p.taskId,
                  completed: p.completed,
                  completedAt: p.completedAt ? new Date(p.completedAt) : undefined,
                  skipped: p.skipped,
                  skippedAt: p.skippedAt ? new Date(p.skippedAt) : undefined,
                  movedToNextDay: false,
                  notes: p.notes || '',
                };
              });
              
              set((state) => ({
                taskProgress: { ...state.taskProgress, ...cloudProgress },
              }));
            }
          } else {
            set({ syncError: result.error, isSyncing: false });
          }
        } catch (error) {
          set({ syncError: 'Failed to join sync account', isSyncing: false });
        }
      },

      syncProgress: async () => {
        const { syncInfo, taskProgress } = get();
        
        if (!syncInfo.isSynced || !syncInfo.userId || !syncInfo.deviceId) return;
        
        set({ isSyncing: true, syncError: null });
        
        try {
          const result = await syncProgressToCloud(syncInfo.userId, syncInfo.deviceId, taskProgress);
          
          if (result.success) {
            // Merge returned progress
            const mergedProgress: Record<string, TaskProgress> = {};
            Object.entries(result.taskProgress).forEach(([taskId, data]: [string, any]) => {
              mergedProgress[taskId] = {
                taskId: data.taskId,
                completed: data.completed,
                completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
                skipped: data.skipped,
                skippedAt: data.skippedAt ? new Date(data.skippedAt) : undefined,
                movedToNextDay: false,
                notes: data.notes || '',
              };
            });
            
            set({
              taskProgress: mergedProgress,
              syncInfo: { ...syncInfo, lastSyncAt: result.lastSync },
              isSyncing: false,
            });
          } else {
            set({ syncError: result.error, isSyncing: false });
          }
        } catch (error) {
          set({ syncError: 'Sync failed. Will retry later.', isSyncing: false });
        }
      },

      disconnectSync: () => {
        set({
          syncInfo: defaultSyncInfo,
        });
      },

      setSyncInfo: (info) => {
        set((state) => ({
          syncInfo: { ...state.syncInfo, ...info },
        }));
      },

      getTodayTasks: () => {
        const state = get();
        const today = new Date();
        const startOfStudy = new Date(2026, 1, 14);
        
        const diffTime = today.getTime() - startOfStudy.getTime();
        const currentDay = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
        
        const todayTasks = state.tasks.filter(task => task.day === currentDay);
        
        const previousIncompleteTasks = state.tasks.filter(task => {
          if (task.day >= currentDay) return false;
          const progress = state.taskProgress[task.id];
          return !progress || (!progress.completed && !progress.skipped);
        });

        return [...previousIncompleteTasks, ...todayTasks];
      },

      getTasksForDate: (date: Date) => {
        const state = get();
        const startOfStudy = new Date(2026, 1, 14);
        const diffTime = date.getTime() - startOfStudy.getTime();
        const dayNumber = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
        
        return state.tasks.filter(task => task.day === dayNumber);
      },

      getOverallProgress: () => {
        const state = get();
        if (state.tasks.length === 0) return 0;
        
        const completedTasks = Object.values(state.taskProgress).filter(p => p.completed).length;
        const totalTasks = state.tasks.length;
        
        return Math.round((completedTasks / totalTasks) * 100);
      },

      getTodayProgress: () => {
        const state = get();
        const todayTasks = state.getTodayTasks();
        if (todayTasks.length === 0) return 0;
        
        const completedToday = todayTasks.filter(task => {
          const progress = state.taskProgress[task.id];
          return progress?.completed;
        }).length;
        
        return Math.round((completedToday / todayTasks.length) * 100);
      },

      getDaysRemaining: () => {
        const today = new Date();
        const examDate = examInfo.date;
        const diffTime = examDate.getTime() - today.getTime();
        return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      },

      getTaskProgress: (taskId: string) => {
        return get().taskProgress[taskId];
      },

      getStreak: () => {
        const state = get();
        let streak = 0;
        const today = new Date();
        const startOfStudy = new Date(2026, 1, 14);
        
        const diffTime = today.getTime() - startOfStudy.getTime();
        const currentDay = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
        
        for (let day = currentDay - 1; day >= 1; day--) {
          const dayTasks = state.tasks.filter(t => t.day === day);
          if (dayTasks.length === 0) break;
          
          const allCompleted = dayTasks.every(task => {
            const progress = state.taskProgress[task.id];
            return progress?.completed;
          });
          
          if (allCompleted) {
            streak++;
          } else {
            break;
          }
        }
        
        return streak;
      },

      getOverdueTasks: () => {
        const state = get();
        const today = new Date();
        const startOfStudy = new Date(2026, 1, 14);
        
        const diffTime = today.getTime() - startOfStudy.getTime();
        const currentDay = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
        
        return state.tasks.filter(task => {
          if (task.day >= currentDay) return false;
          const progress = state.taskProgress[task.id];
          return !progress || (!progress.completed && !progress.skipped);
        });
      },
    }),
    {
      name: 'pgmp-study-tracker',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        taskProgress: state.taskProgress,
        notificationSettings: state.notificationSettings,
        lastReminderSent: state.lastReminderSent,
        syncInfo: state.syncInfo,
      }),
    }
  )
);
