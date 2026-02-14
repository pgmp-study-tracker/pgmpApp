'use client';

import { useStudyStore } from '@/store/study-store';
import { StudyTask } from '@/lib/study-data';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ChevronRight, 
  MoreVertical,
  SkipForward,
  ArrowRight,
  BookOpen,
  Users,
  Target,
  Zap,
  Crown,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Users,
  Target,
  Zap,
  UsersRound: Users,
  RefreshCcw: ArrowRight,
  Crown,
  AlertTriangle,
  Scale: Target,
  Compass: Target,
  TrendingUp: Target,
  MessageCircle: Users,
  Shield: Target,
  Handshake: Users,
  Repeat: ArrowRight,
  FileText: BookOpen,
  Rocket: Zap,
  CheckCircle2,
  Briefcase: BookOpen,
  FileSignature: BookOpen,
  Map: Target,
  ClipboardList: BookOpen,
  GraduationCap,
};

export function TodayView() {
  const { 
    getTodayTasks, 
    taskProgress, 
    markTaskComplete, 
    markTaskSkipped,
    moveTaskToNextDay,
    getOverdueTasks
  } = useStudyStore();
  
  const [selectedTask, setSelectedTask] = useState<StudyTask | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [showNotesDialog, setShowNotesDialog] = useState(false);

  const todayTasks = getTodayTasks();
  const overdueTasks = getOverdueTasks();
  
  // Separate tasks by status
  const pendingTasks = todayTasks.filter(t => {
    const progress = taskProgress[t.id];
    return !progress?.completed && !progress?.skipped;
  });
  
  const completedTasks = todayTasks.filter(t => {
    const progress = taskProgress[t.id];
    return progress?.completed;
  });

  const handleCompleteTask = (task: StudyTask) => {
    setSelectedTask(task);
    setShowNotesDialog(true);
  };

  const confirmCompletion = () => {
    if (selectedTask) {
      markTaskComplete(selectedTask.id, completionNotes);
      setShowNotesDialog(false);
      setSelectedTask(null);
      setCompletionNotes('');
    }
  };

  const getTopicIcon = (iconName: string) => {
    return iconMap[iconName] || BookOpen;
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Overdue Tasks Alert */}
      {overdueTasks.length > 0 && overdueTasks.some(t => !todayTasks.includes(t)) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium text-sm">Overdue Tasks</span>
          </div>
          <p className="text-slate-300 text-sm">
            You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}. 
            Consider moving them to today or marking as skipped.
          </p>
        </motion.div>
      )}

      {/* Today's Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Today&apos;s Study Plan
        </h2>
        <span className="text-sm text-slate-400">
          {format(new Date(), 'MMM d, yyyy')}
        </span>
      </div>

      {/* Pending Tasks */}
      <div className="space-y-2">
        <AnimatePresence>
          {pendingTasks.map((task, index) => {
            const Icon = getTopicIcon(task.topic.icon);
            const isOverdue = overdueTasks.some(t => t.id === task.id);
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`relative bg-slate-800/50 backdrop-blur rounded-xl p-4 border transition-all active:scale-[0.98] ${
                  isOverdue 
                    ? 'border-red-500/50 bg-red-900/10' 
                    : 'border-slate-700/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleCompleteTask(task)}
                    className="flex-shrink-0 mt-1 text-slate-500 hover:text-emerald-400 transition-colors"
                  >
                    <Circle className="w-6 h-6" />
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${task.topic.color}20` }}
                      >
                        <Icon 
                          className="w-4 h-4" 
                          style={{ color: task.topic.color }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white text-sm">
                          {task.title}
                        </h3>
                        <p className="text-xs text-slate-400 truncate">
                          {task.topic.name}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                      {task.description}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      {task.duration > 0 && (
                        <Badge variant="secondary" className="text-xs bg-slate-700/50">
                          <Clock className="w-3 h-3 mr-1" />
                          {task.duration} min
                        </Badge>
                      )}
                      {task.isWeekend && (
                        <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300">
                          Weekend
                        </Badge>
                      )}
                      {task.priority === 'high' && (
                        <Badge variant="secondary" className="text-xs bg-red-500/20 text-red-300">
                          High Priority
                        </Badge>
                      )}
                      {isOverdue && (
                        <Badge variant="secondary" className="text-xs bg-red-500/20 text-red-300">
                          Overdue
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem 
                        onClick={() => handleCompleteTask(task)}
                        className="text-emerald-400"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Complete
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => moveTaskToNextDay(task.id)}
                        className="text-blue-400"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Move to Tomorrow
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => markTaskSkipped(task.id)}
                        className="text-slate-400"
                      >
                        <SkipForward className="w-4 h-4 mr-2" />
                        Skip Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-400 mb-3">
            Completed Today ({completedTasks.length})
          </h3>
          <div className="space-y-2">
            {completedTasks.map((task) => {
              const Icon = getTopicIcon(task.topic.icon);
              const progress = taskProgress[task.id];
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div 
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${task.topic.color}20` }}
                    >
                      <Icon 
                        className="w-3 h-3" 
                        style={{ color: task.topic.color }}
                      />
                    </div>
                    <span className="text-sm text-slate-300 line-through">
                      {task.title}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pendingTasks.length === 0 && completedTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-white font-medium mb-1">All Done for Today!</h3>
          <p className="text-slate-400 text-sm">
            No tasks scheduled for today. Enjoy your rest!
          </p>
        </motion.div>
      )}

      {/* Completion Dialog */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent className="max-w-sm bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Complete Task</DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedTask?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Add notes (optional)
              </label>
              <Textarea
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Any key learnings or notes..."
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowNotesDialog(false)}
                className="flex-1 border-slate-600 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmCompletion}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
