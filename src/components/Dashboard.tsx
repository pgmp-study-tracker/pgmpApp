'use client';

import { useStudyStore } from '@/store/study-store';
import { examInfo } from '@/lib/study-data';
import { motion } from 'framer-motion';
import { Clock, Target, Trophy, TrendingUp, Flame, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { differenceInDays, format } from 'date-fns';

export function Dashboard() {
  const { 
    getOverallProgress, 
    getTodayProgress, 
    getDaysRemaining, 
    getStreak,
    getOverdueTasks,
    getTodayTasks,
    taskProgress
  } = useStudyStore();

  const daysRemaining = getDaysRemaining();
  const overallProgress = getOverallProgress();
  const todayProgress = getTodayProgress();
  const streak = getStreak();
  const overdueTasks = getOverdueTasks();
  const todayTasks = getTodayTasks();
  
  const todayCompleted = todayTasks.filter(t => taskProgress[t.id]?.completed).length;
  const examDate = examInfo.date;

  // Calculate countdown details
  const now = new Date();
  const hoursRemaining = Math.max(0, Math.floor((examDate.getTime() - now.getTime()) / (1000 * 60 * 60)));
  const days = Math.floor(hoursRemaining / 24);
  const hours = hoursRemaining % 24;

  return (
    <div className="space-y-4">
      {/* Main Countdown Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-6 shadow-xl"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-2 text-blue-100 mb-4">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Exam Countdown</span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">{days}</span>
            <span className="text-xl text-blue-200">days</span>
            <span className="text-5xl font-bold text-white ml-4">{hours}</span>
            <span className="text-xl text-blue-200">hours</span>
          </div>
          
          <div className="mt-4 text-blue-200 text-sm">
            <p>{format(examDate, 'EEEE, MMMM d, yyyy')} • 9:30 AM Dubai</p>
          </div>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-blue-200 mb-2">
              <span>Study Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <Progress 
              value={overallProgress} 
              className="h-2 bg-blue-900/50"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Today's Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700/50"
        >
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-xs font-medium">Today&apos;s Tasks</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {todayCompleted}/{todayTasks.length}
          </div>
          <Progress 
            value={todayProgress} 
            className="h-1.5 mt-2 bg-slate-700"
          />
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700/50"
        >
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-medium">Streak</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {streak} {streak === 1 ? 'day' : 'days'}
          </div>
          <p className="text-xs text-slate-400 mt-1">Keep it going!</p>
        </motion.div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700/50"
        >
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Overall</span>
          </div>
          <div className="text-2xl font-bold text-white">{overallProgress}%</div>
          <p className="text-xs text-slate-400 mt-1">
            {Math.round((100 - overallProgress) * 0.68)} days left
          </p>
        </motion.div>

        {/* Overdue */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className={`bg-slate-800/50 backdrop-blur rounded-xl p-4 border ${
            overdueTasks.length > 0 
              ? 'border-red-500/50' 
              : 'border-slate-700/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {overdueTasks.length > 0 ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <Trophy className="w-4 h-4 text-yellow-400" />
            )}
            <span className="text-xs font-medium text-slate-300">
              {overdueTasks.length > 0 ? 'Overdue' : 'On Track'}
            </span>
          </div>
          <div className={`text-2xl font-bold ${
            overdueTasks.length > 0 ? 'text-red-400' : 'text-green-400'
          }`}>
            {overdueTasks.length > 0 ? overdueTasks.length : '✓'}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {overdueTasks.length > 0 
              ? 'Move to next day?' 
              : 'All caught up!'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
