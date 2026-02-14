'use client';

import { useEffect, useState, useCallback, useSyncExternalStore } from 'react';
import { useStudyStore } from '@/store/study-store';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Custom hook for notification permission with useSyncExternalStore
function useNotificationPermission() {
  const permission = useSyncExternalStore(
    (callback) => {
      // Subscribe to permission changes
      if (typeof window !== 'undefined' && 'permissions' in navigator) {
        navigator.permissions.query({ name: 'notifications' as PermissionName })
          .then((status) => {
            status.addEventListener('change', callback);
          })
          .catch(() => {});
        return () => {
          navigator.permissions.query({ name: 'notifications' as PermissionName })
            .then((status) => {
              status.removeEventListener('change', callback);
            })
            .catch(() => {});
        };
      }
      return () => {};
    },
    () => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        return Notification.permission;
      }
      return 'default' as NotificationPermission;
    },
    () => 'default' as NotificationPermission
  );
  
  return permission;
}

export function NotificationService() {
  const { 
    notificationSettings, 
    getTodayTasks, 
    taskProgress,
  } = useStudyStore();
  
  const permissionStatus = useNotificationPermission();
  const { toast } = useToast();

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Notifications not supported',
        description: 'Your browser does not support notifications.',
        variant: 'destructive',
      });
      return;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      toast({
        title: 'Notifications enabled!',
        description: 'You will receive study reminders.',
      });
    } else {
      toast({
        title: 'Notifications blocked',
        description: 'Please enable notifications in your browser settings.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Send notification - memoized
  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permissionStatus !== 'granted' || !notificationSettings.enabled) return;

    // Check quiet hours
    const now = new Date();
    const currentHour = now.getHours();
    const [quietStart] = notificationSettings.quietHoursStart.split(':').map(Number);
    const [quietEnd] = notificationSettings.quietHoursEnd.split(':').map(Number);
    
    if (currentHour >= quietStart || currentHour < quietEnd) {
      return; // In quiet hours
    }

    try {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        requireInteraction: false,
        silent: false,
        ...options,
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }, [permissionStatus, notificationSettings]);

  // Morning reminder check
  useEffect(() => {
    if (!notificationSettings.enabled || !notificationSettings.morningReminder) return;

    const checkMorningReminder = () => {
      const now = new Date();
      const [hours, minutes] = notificationSettings.morningTime.split(':').map(Number);
      
      if (now.getHours() === hours && now.getMinutes() === minutes) {
        const todayTasks = getTodayTasks();
        const pendingTasks = todayTasks.filter(t => !taskProgress[t.id]?.completed);
        
        if (pendingTasks.length > 0) {
          sendNotification('Good morning! 🌅', {
            body: `You have ${pendingTasks.length} tasks scheduled for today. Let's start your PgMP preparation!`,
            tag: 'morning-reminder',
          });
        }
      }
    };

    const interval = setInterval(checkMorningReminder, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [notificationSettings, getTodayTasks, taskProgress, sendNotification]);

  // Evening reminder check
  useEffect(() => {
    if (!notificationSettings.enabled || !notificationSettings.eveningReminder) return;

    const checkEveningReminder = () => {
      const now = new Date();
      const [hours, minutes] = notificationSettings.eveningTime.split(':').map(Number);
      
      if (now.getHours() === hours && now.getMinutes() === minutes) {
        const todayTasks = getTodayTasks();
        const completedTasks = todayTasks.filter(t => taskProgress[t.id]?.completed);
        const pendingTasks = todayTasks.filter(t => !taskProgress[t.id]?.completed);
        
        if (pendingTasks.length > 0) {
          sendNotification('Evening check-in 🌙', {
            body: `Great progress! ${completedTasks.length} tasks done, ${pendingTasks.length} remaining. Can you complete them before bed?`,
            tag: 'evening-reminder',
          });
        } else if (completedTasks.length > 0) {
          sendNotification('All done! 🎉', {
            body: `Congratulations! You've completed all ${completedTasks.length} tasks for today!`,
            tag: 'evening-reminder',
          });
        }
      }
    };

    const interval = setInterval(checkEveningReminder, 60000);
    return () => clearInterval(interval);
  }, [notificationSettings, getTodayTasks, taskProgress, sendNotification]);

  // Task reminder - non-intrusive
  useEffect(() => {
    if (!notificationSettings.enabled) return;

    // Check every hour for task reminders
    const checkTaskReminder = () => {
      const now = new Date();
      const todayTasks = getTodayTasks();
      const pendingTasks = todayTasks.filter(t => !taskProgress[t.id]?.completed);
      
      // Only send if there are pending tasks and we haven't reminded recently
      if (pendingTasks.length > 0 && now.getHours() % 3 === 0 && now.getMinutes() === 0) {
        const randomTask = pendingTasks[Math.floor(Math.random() * pendingTasks.length)];
        sendNotification('Quick reminder 📚', {
          body: `Don't forget: "${randomTask.title}" - ${randomTask.duration} minutes`,
          tag: 'task-reminder',
        });
      }
    };

    const interval = setInterval(checkTaskReminder, 60000);
    return () => clearInterval(interval);
  }, [notificationSettings, getTodayTasks, taskProgress, sendNotification]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={requestPermission}
      className={`relative ${
        permissionStatus === 'granted' 
          ? 'text-emerald-400' 
          : permissionStatus === 'denied'
          ? 'text-red-400'
          : 'text-slate-400'
      }`}
    >
      {permissionStatus === 'granted' ? (
        <Bell className="w-5 h-5" />
      ) : (
        <BellOff className="w-5 h-5" />
      )}
      {permissionStatus === 'default' && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
      )}
    </Button>
  );
}
