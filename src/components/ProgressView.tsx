'use client';

import { useStudyStore } from '@/store/study-store';
import { studyTopics } from '@/lib/study-data';
import { motion } from 'framer-motion';
import { 
  Target, 
  Flame, 
  Trophy,
  BarChart3,
  Clock
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function ProgressView() {
  const { 
    tasks, 
    taskProgress, 
    getOverallProgress,
    getStreak,
    getDaysRemaining
  } = useStudyStore();

  const overallProgress = getOverallProgress();
  const streak = getStreak();
  const daysRemaining = getDaysRemaining();
  
  // Calculate topic-based progress
  const topicProgress = studyTopics.map(topic => {
    const topicTasks = tasks.filter(t => t.topic.id === topic.id);
    const completed = topicTasks.filter(t => taskProgress[t.id]?.completed).length;
    return {
      topic,
      total: topicTasks.length,
      completed,
      percentage: topicTasks.length > 0 ? Math.round((completed / topicTasks.length) * 100) : 0,
    };
  }).filter(t => t.total > 0);

  // Weekly progress data
  const weeklyData = [];
  for (let week = 1; week <= 10; week++) {
    const startDay = (week - 1) * 7 + 1;
    const endDay = week * 7;
    const weekTasks = tasks.filter(t => t.day >= startDay && t.day <= endDay);
    const completed = weekTasks.filter(t => taskProgress[t.id]?.completed).length;
    const pending = weekTasks.length - completed;
    
    weeklyData.push({
      week: `W${week}`,
      completed,
      pending,
      total: weekTasks.length,
    });
  }

  // Overall stats
  const totalTasks = tasks.length;
  const completedTasks = Object.values(taskProgress).filter(p => p.completed).length;
  const skippedTasks = Object.values(taskProgress).filter(p => p.skipped).length;
  const totalStudyTime = tasks
    .filter(t => taskProgress[t.id]?.completed)
    .reduce((sum, t) => sum + t.duration, 0);

  // Pie chart data
  const pieData = [
    { name: 'Completed', value: completedTasks, color: '#10b981' },
    { name: 'Pending', value: totalTasks - completedTasks - skippedTasks, color: '#3b82f6' },
    { name: 'Skipped', value: skippedTasks, color: '#64748b' },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-blue-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Overall Progress</h2>
          <span className="text-3xl font-bold text-white">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-3 bg-slate-700" />
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{completedTasks}</div>
            <div className="text-xs text-slate-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{totalTasks - completedTasks - skippedTasks}</div>
            <div className="text-xs text-slate-400">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-400">{skippedTasks}</div>
            <div className="text-xs text-slate-400">Skipped</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
        >
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-medium">Current Streak</span>
          </div>
          <div className="text-2xl font-bold text-white">{streak} days</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
        >
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Study Time</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {Math.round(totalStudyTime / 60)}h
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
        >
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-xs font-medium">Days Left</span>
          </div>
          <div className="text-2xl font-bold text-white">{daysRemaining}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
        >
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-medium">Best Streak</span>
          </div>
          <div className="text-2xl font-bold text-white">{streak} days</div>
        </motion.div>
      </div>

      {/* Weekly Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
      >
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          Weekly Progress
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis 
                dataKey="week" 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={{ stroke: '#475569' }}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={{ stroke: '#475569' }}
              />
              <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="pending" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-400">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-slate-400">Pending</span>
          </div>
        </div>
      </motion.div>

      {/* Topic Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
      >
        <h3 className="text-white font-semibold mb-4">Progress by Topic</h3>
        <div className="space-y-3">
          {topicProgress.slice(0, 10).map((item) => (
            <div key={item.topic.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.topic.color }}
                  />
                  <span className="text-sm text-slate-300">{item.topic.name}</span>
                </div>
                <span className="text-sm text-slate-400">
                  {item.completed}/{item.total}
                </span>
              </div>
              <Progress 
                value={item.percentage} 
                className="h-2 bg-slate-700"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Progress Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
      >
        <h3 className="text-white font-semibold mb-4">Task Distribution</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-slate-400">{item.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
