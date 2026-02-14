'use client';

import { useState } from 'react';
import { useStudyStore } from '@/store/study-store';
import { examInfo } from '@/lib/study-data';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Moon, 
  Trash2,
  Info,
  Calendar,
  Cloud,
  CloudOff,
  Copy,
  Check,
  RefreshCw,
  Smartphone,
  Link2
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export function SettingsView() {
  const { 
    notificationSettings, 
    updateNotificationSettings,
    initializeStudyPlan,
    taskProgress,
    syncInfo,
    isSyncing,
    syncError,
    createSyncAccount,
    joinSyncAccount,
    syncProgress,
    disconnectSync,
  } = useStudyStore();
  
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleResetProgress = () => {
    localStorage.removeItem('pgmp-study-tracker');
    initializeStudyPlan();
    window.location.reload();
  };

  const handleCopySyncCode = async () => {
    if (syncInfo.syncCode) {
      await navigator.clipboard.writeText(syncInfo.syncCode);
      setCopied(true);
      toast({
        title: 'Sync code copied!',
        description: 'Share this code to sync on another device.',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoinSync = async () => {
    if (joinCode.trim()) {
      await joinSyncAccount(joinCode.trim());
      setJoinCode('');
    }
  };

  const completedTasks = Object.values(taskProgress).filter(p => p.completed).length;

  return (
    <div className="space-y-6">
      {/* Exam Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-6 border border-purple-500/30"
      >
        <div className="flex items-center gap-2 text-purple-300 mb-4">
          <Info className="w-4 h-4" />
          <span className="text-sm font-medium">Exam Information</span>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-slate-400">Date & Time</p>
            <p className="text-white font-medium">
              {format(examInfo.date, 'EEEE, MMMM d, yyyy')} at 9:30 AM
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Location</p>
            <p className="text-white font-medium">{examInfo.location}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Format</p>
            <p className="text-white font-medium">{examInfo.format}</p>
          </div>
        </div>
      </motion.div>

      {/* Cloud Sync Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
      >
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Cloud className="w-4 h-4 text-blue-400" />
          Cloud Sync
        </h3>
        
        {!syncInfo.isSynced ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Sync your progress across iPhone, MacBook, and other devices.
            </p>
            
            {/* Create New Sync Account */}
            <Button
              onClick={() => createSyncAccount()}
              disabled={isSyncing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Cloud className="w-4 h-4 mr-2" />
              )}
              Create Sync Account
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800 px-2 text-slate-400">or</span>
              </div>
            </div>
            
            {/* Join Existing Sync Account */}
            <div className="space-y-2">
              <Label className="text-white text-sm">Enter Sync Code</Label>
              <div className="flex gap-2">
                <Input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="PGMP-XXXX-XXXX"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
                <Button
                  onClick={handleJoinSync}
                  disabled={isSyncing || !joinCode.trim()}
                  variant="outline"
                  className="border-slate-600 text-white"
                >
                  <Link2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Enter the sync code from another device to link them.
              </p>
            </div>
            
            {syncError && (
              <p className="text-sm text-red-400">{syncError}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sync Status */}
            <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-white">Synced</p>
                  <p className="text-xs text-slate-400">
                    Last synced: {syncInfo.lastSyncAt ? 
                      format(new Date(syncInfo.lastSyncAt), 'MMM d, h:mm a') : 
                      'Never'}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={syncProgress}
                disabled={isSyncing}
                className="text-emerald-400"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            {/* Sync Code Display */}
            <div className="p-3 bg-slate-700/30 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">Your Sync Code</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-mono font-bold text-white tracking-wider">
                  {syncInfo.syncCode}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopySyncCode}
                  className="text-slate-400 hover:text-white"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Use this code on other devices to sync your progress.
              </p>
            </div>
            
            {/* Device Info */}
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Smartphone className="w-4 h-4" />
              <span>Connected: {syncInfo.deviceName}</span>
            </div>
            
            {/* Disconnect */}
            <Button
              onClick={disconnectSync}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <CloudOff className="w-4 h-4 mr-2" />
              Disconnect Sync
            </Button>
          </div>
        )}
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
      >
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-400" />
          Notifications
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Enable Notifications</Label>
              <p className="text-xs text-slate-400 mt-0.5">
                Get reminders for your study tasks
              </p>
            </div>
            <Switch
              checked={notificationSettings.enabled}
              onCheckedChange={(checked) => 
                updateNotificationSettings({ enabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Morning Reminder</Label>
              <p className="text-xs text-slate-400 mt-0.5">
                Start your day with a task overview
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">
                {notificationSettings.morningTime}
              </span>
              <Switch
                checked={notificationSettings.morningReminder}
                onCheckedChange={(checked) => 
                  updateNotificationSettings({ morningReminder: checked })
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Evening Reminder</Label>
              <p className="text-xs text-slate-400 mt-0.5">
                Review progress before bed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">
                {notificationSettings.eveningTime}
              </span>
              <Switch
                checked={notificationSettings.eveningReminder}
                onCheckedChange={(checked) => 
                  updateNotificationSettings({ eveningReminder: checked })
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-slate-400" />
              <div>
                <Label className="text-white">Quiet Hours</Label>
                <p className="text-xs text-slate-400 mt-0.5">
                  No notifications {notificationSettings.quietHoursStart} - {notificationSettings.quietHoursEnd}
                </p>
              </div>
            </div>
            <Switch
              checked={true}
              onCheckedChange={() => {}}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <Label className="text-white">Weekend Intensive Mode</Label>
                <p className="text-xs text-slate-400 mt-0.5">
                  More reminders on weekends
                </p>
              </div>
            </div>
            <Switch
              checked={notificationSettings.weekendMoreIntensive}
              onCheckedChange={(checked) => 
                updateNotificationSettings({ weekendMoreIntensive: checked })
              }
            />
          </div>
        </div>
      </motion.div>

      {/* Study Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
      >
        <h3 className="text-white font-semibold mb-4">Your Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-3">
            <p className="text-2xl font-bold text-emerald-400">{completedTasks}</p>
            <p className="text-xs text-slate-400">Tasks Completed</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3">
            <p className="text-2xl font-bold text-blue-400">{examInfo.totalDays}</p>
            <p className="text-xs text-slate-400">Total Study Days</p>
          </div>
        </div>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
      >
        <h3 className="text-white font-semibold mb-4">About</h3>
        <div className="space-y-2 text-sm text-slate-400">
          <p>PgMP Study Tracker v1.0</p>
          <p>Based on PMI&apos;s Standard for Program Management Fifth Edition</p>
        </div>
      </motion.div>

      {/* Reset Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Reset All Progress
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-slate-800 border-slate-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Reset Progress?</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400">
                This will clear all your study progress and notes. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-slate-600 text-slate-300">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleResetProgress}
                className="bg-red-600 hover:bg-red-700"
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
}
