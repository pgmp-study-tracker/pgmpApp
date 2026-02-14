'use client';

import { useStudyStore } from '@/store/study-store';
import { StudyTask, getDateForDay, studyTopics } from '@/lib/study-data';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  CheckCircle2,
  Circle,
  BookOpen,
  Users,
  Target,
  Zap,
  Crown,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Users,
  Target,
  Zap,
  UsersRound: Users,
  RefreshCcw: ChevronRight,
  Crown,
  AlertTriangle,
  Scale: Target,
  Compass: Target,
  TrendingUp: Target,
  MessageCircle: Users,
  Shield: Target,
  Handshake: Users,
  Repeat: ChevronRight,
  FileText: BookOpen,
  Rocket: Zap,
  CheckCircle2,
  Briefcase: BookOpen,
  FileSignature: BookOpen,
  Map: Target,
  ClipboardList: BookOpen,
  GraduationCap,
};

export function CalendarView() {
  const { tasks, taskProgress, selectedDate, setSelectedDate } = useStudyStore();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    return startOfWeek(today, { weekStartsOn: 6 }); // Saturday start
  });
  const [selectedTask, setSelectedTask] = useState<StudyTask | null>(null);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getTasksForDate = (date: Date): StudyTask[] => {
    const startOfStudy = new Date(2026, 1, 14);
    const diffTime = date.getTime() - startOfStudy.getTime();
    const dayNumber = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return tasks.filter(task => task.day === dayNumber);
  };

  const getDayProgress = (date: Date): number => {
    const dayTasks = getTasksForDate(date);
    if (dayTasks.length === 0) return 0;
    
    const completed = dayTasks.filter(task => taskProgress[task.id]?.completed).length;
    return Math.round((completed / dayTasks.length) * 100);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const getTopicIcon = (iconName: string) => {
    return iconMap[iconName] || BookOpen;
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateWeek('prev')}
          className="text-slate-400 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-semibold text-white">
          {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateWeek('next')}
          className="text-slate-400 hover:text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => {
          const dayTasks = getTasksForDate(day);
          const progress = getDayProgress(day);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const totalDuration = dayTasks.reduce((sum, t) => sum + t.duration, 0);
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`p-2 rounded-xl transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : isTodayDate
                  ? 'bg-blue-600/20 text-blue-300'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <div className="text-xs font-medium mb-1">
                {format(day, 'EEE')}
              </div>
              <div className="text-lg font-bold">
                {format(day, 'd')}
              </div>
              {dayTasks.length > 0 && (
                <>
                  <div className="text-xs mt-1 opacity-80">
                    {dayTasks.length} tasks
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-1 mt-1 bg-slate-700/50"
                  />
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Tasks */}
      <motion.div
        key={selectedDate.toISOString()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h3>
          <span className="text-sm text-slate-400">
            {getTasksForDate(selectedDate).reduce((sum, t) => sum + t.duration, 0)} min total
          </span>
        </div>

        <div className="space-y-2">
          {getTasksForDate(selectedDate).map((task) => {
            const progress = taskProgress[task.id];
            const Icon = getTopicIcon(task.topic.icon);
            
            return (
              <motion.button
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  progress?.completed
                    ? 'bg-slate-800/30 border-slate-700/30 opacity-60'
                    : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  {progress?.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${task.topic.color}20` }}
                  >
                    <Icon 
                      className="w-5 h-5" 
                      style={{ color: task.topic.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium ${
                      progress?.completed ? 'text-slate-400 line-through' : 'text-white'
                    }`}>
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {task.topic.name} • {task.duration} min
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}

          {getTasksForDate(selectedDate).length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400">No tasks scheduled for this day</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Topic Legend */}
      <div className="mt-6 p-4 bg-slate-800/30 rounded-xl">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Topics</h4>
        <div className="flex flex-wrap gap-2">
          {studyTopics.slice(0, 8).map((topic) => (
            <div
              key={topic.id}
              className="flex items-center gap-1.5 text-xs text-slate-400"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: topic.color }}
              />
              <span>{topic.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-sm bg-slate-800 border-slate-700">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${selectedTask.topic.color}20` }}
                  >
                    {(() => {
                      const Icon = getTopicIcon(selectedTask.topic.icon);
                      return <Icon className="w-4 h-4" style={{ color: selectedTask.topic.color }} />;
                    })()}
                  </div>
                  {selectedTask.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <p className="text-slate-300 text-sm">
                  {selectedTask.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-4 h-4" />
                    {selectedTask.duration} min
                  </span>
                  <span className="text-slate-400">
                    Day {selectedTask.day}
                  </span>
                  {selectedTask.isWeekend && (
                    <span className="text-purple-400">Weekend</span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Key Points</h4>
                  <ul className="space-y-1">
                    {selectedTask.keyPoints.map((point, i) => (
                      <li 
                        key={i}
                        className="text-sm text-slate-400 flex items-start gap-2"
                      >
                        <span className="text-blue-400 mt-1">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Resources</h4>
                  <ul className="space-y-1">
                    {selectedTask.resources.map((resource, i) => (
                      <li 
                        key={i}
                        className="text-sm text-blue-400"
                      >
                        {resource}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
