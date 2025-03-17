
import React from 'react';
import { useTimeEntries } from '../context/TimeEntryContext';
import { calculateTotalHours, roundToNearest, getCategoryColor } from '../utils/timeUtils';
import { isSameDay, format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { Clock, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Stats: React.FC = () => {
  const { entries, selectedDate, timelineView } = useTimeEntries();
  
  // Get today's entries
  const todayEntries = entries.filter(entry => 
    isSameDay(entry.date, selectedDate)
  );
  
  // Get current week's dates and entries
  const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const endOfCurrentWeek = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: endOfCurrentWeek
  });
  
  const weekEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= startOfCurrentWeek && entryDate <= endOfCurrentWeek;
  });
  
  // Calculate statistics
  const todayHours = roundToNearest(calculateTotalHours(todayEntries), 100);
  const weekHours = roundToNearest(calculateTotalHours(weekEntries), 100);
  
  // Calculate category distribution
  const categoryDistribution = weekEntries.reduce((acc, entry) => {
    if (!entry.endTime) return acc;
    
    const category = entry.category;
    const hours = (entry.endTime.getTime() - entry.startTime.getTime()) / (1000 * 60 * 60);
    
    acc[category] = (acc[category] || 0) + hours;
    return acc;
  }, {} as Record<string, number>);
  
  // Daily distribution
  const dailyDistribution = weekDays.map(day => {
    const dayEntries = entries.filter(entry => isSameDay(entry.date, day));
    const hours = calculateTotalHours(dayEntries);
    return {
      day: format(day, 'EEE'),
      hours,
      isCurrentDay: isSameDay(day, selectedDate)
    };
  });
  
  // Find max hours for scaling
  const maxDailyHours = Math.max(...dailyDistribution.map(d => d.hours), 8);

  // Set the title based on the current view
  const getViewTitle = () => {
    if (timelineView === 'days') {
      return 'Daily Summary';
    } else if (timelineView === 'weeks') {
      return 'Weekly Summary';
    } else {
      return 'Monthly Summary';
    }
  };

  return (
    <div className="glass-panel p-4 animate-slide-up">
      <h2 className="text-xl font-semibold mb-4">{getViewTitle()}</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{timelineView === 'days' ? 'Today' : 'Selected Day'}</span>
          </div>
          <div className="text-2xl font-bold">
            {todayHours} hrs
          </div>
        </div>
        
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm">This Week</span>
          </div>
          <div className="text-2xl font-bold">
            {weekHours} hrs
          </div>
        </div>
      </div>
      
      {/* Weekly distribution chart */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Daily Activity</h3>
        <div className="flex items-end justify-between h-24 gap-1">
          {dailyDistribution.map((day, i) => {
            const height = day.hours ? (day.hours / maxDailyHours) * 100 : 0;
            return (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className="relative w-full flex-1">
                  <div 
                    className={cn(
                      "absolute bottom-0 w-full rounded-sm transition-all duration-300",
                      day.isCurrentDay ? "bg-primary" : "bg-primary/30"
                    )}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className={cn(
                  "text-xs mt-1",
                  day.isCurrentDay ? "font-semibold text-primary" : "text-muted-foreground"
                )}>
                  {day.day}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Category distribution */}
      {Object.keys(categoryDistribution).length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Categories</h3>
          <div className="space-y-2">
            {Object.entries(categoryDistribution).map(([category, hours], i) => {
              const percentage = (hours / weekHours) * 100;
              const color = getCategoryColor(category);
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category}</span>
                    <span className="text-muted-foreground">
                      {roundToNearest(hours, 10)} hrs
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-${color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
