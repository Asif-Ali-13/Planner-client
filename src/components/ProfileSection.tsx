import React from 'react';
import { Calendar, CheckCircle2, Clock, TrendingUp, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format, subDays, startOfDay, endOfDay, isToday } from 'date-fns';
import { useUser } from '@/hooks/useUser';
import { AvatarUpload } from './AvatarUpload';

interface Todo {
  id: string;
  title: string;
  description: string;
  createdDate: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  completedDate?: string;
}

interface ProfileSectionProps {
  todos: Todo[];
}

interface DayActivity {
  date: string;
  assigned: number;
  completed: number;
  percentage: number;
}

export function ProfileSection({ todos }: ProfileSectionProps) {
  const { user, isLoading } = useUser();
  
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const overallProgress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  // Calculate weekly activity with completion percentages
  const last7Days: DayActivity[] = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    
    // Find todos assigned for this day (due date matches this day)
    const assignedTodos = todos.filter(todo => {
      if (!todo.dueDate) return false;
      const dueDate = new Date(todo.dueDate);
      return dueDate >= startOfDay(date) && dueDate <= endOfDay(date);
    });
    
    // Find todos completed on this day
    const completedTodos = assignedTodos.filter(todo => 
      todo.completed && 
      todo.completedDate &&
      new Date(todo.completedDate) >= startOfDay(date) &&
      new Date(todo.completedDate) <= endOfDay(date)
    );
    
    const assigned = assignedTodos.length;
    const completed = completedTodos.length;
    const percentage = assigned > 0 ? (completed / assigned) * 100 : 0;
    
    return {
      date: format(date, 'MMM dd'),
      assigned,
      completed,
      percentage
    };
  }).reverse();

  const categoryStats = todos.reduce((acc, todo) => {
    if (!acc[todo.category]) {
      acc[todo.category] = { total: 0, completed: 0 };
    }
    acc[todo.category].total++;
    if (todo.completed) {
      acc[todo.category].completed++;
    }
    return acc;
  }, {} as { [key: string]: { total: number; completed: number } });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get completion percentage color based on performance
  const getPercentageColor = (percentage: number) => {
    if (percentage >= 71) return 'text-green-700 bg-green-100';
    if (percentage >= 31) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Profile Header */}
      {user && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <AvatarUpload
                currentAvatar={user.avatar}
                userName={user.name}
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {getGreeting()}, {user.name}!
                </h2>
                <p className="text-gray-600 mb-2">
                  Welcome back to your productivity dashboard
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-1" />
                  Member since {format(new Date(user.joinedDate), 'MMMM yyyy')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile & Stats</h2>
        <p className="text-gray-600">Track your productivity and progress</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold text-gray-900">{totalTodos}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold text-gray-900">{completedTodos}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
              <span className="text-2xl font-bold text-gray-900">{Math.round(overallProgress)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-medium">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <p className="text-sm text-gray-500">
              {completedTodos} of {totalTodos} tasks completed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Activity - Enhanced with percentages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Weekly Activity</CardTitle>
          <p className="text-sm text-gray-500">Daily completion rates for the past 7 days</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-3">
            {last7Days.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 mb-2">{day.date}</div>
                <div className={`relative w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs font-medium mx-auto border-2 ${
                  day.assigned === 0 
                    ? 'bg-gray-50 text-gray-400 border-gray-200' 
                    : `${getPercentageColor(day.percentage)} border-current`
                }`}>
                  {day.assigned === 0 ? (
                    <span className="text-xs">-</span>
                  ) : (
                    <>
                      <span className="text-xs font-bold">{Math.round(day.percentage)}%</span>
                      <span className="text-[10px] opacity-75">{day.completed}/{day.assigned}</span>
                    </>
                  )}
                </div>
                {day.assigned > 0 && (
                  <div className="mt-1">
                    <Progress 
                      value={day.percentage} 
                      className="h-1 w-full" 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-gray-500 text-center">
            Shows completion percentage of tasks due each day
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, stats]) => {
              const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm text-gray-500">
                      {stats.completed}/{stats.total}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
