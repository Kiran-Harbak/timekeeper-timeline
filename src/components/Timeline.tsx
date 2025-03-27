
import React, { useState } from 'react';
import { isSameDay, format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { useTimeEntries } from '../context/TimeEntryContext';
import TimeEntry from './TimeEntry';
import { TimeEntry as TimeEntryType, getTimeBlocks, formatFullDate, formatDayName, formatDayOfMonth } from '../utils/timeUtils';
import { Button } from '@/components/ui/button';
import { Plus, Play, Clock } from 'lucide-react';
import TimeEntryForm from './TimeEntryForm';
import { cn } from '@/lib/utils';

// Helper function to get category color
const getCategoryColor = (category: string): string => {
  const categoryColors: Record<string, string> = {
    'Meeting': 'timesheet-indigo',
    'Development': 'timesheet-blue',
    'Design': 'timesheet-purple',
    'Research': 'timesheet-teal',
    'Planning': 'timesheet-green',
    'Client Work': 'timesheet-orange',
    'Other': 'timesheet-gray'
  };
  
  return categoryColors[category] || 'timesheet-gray';
};

const Timeline: React.FC = () => {
  const { entries, selectedDate, activeEntry, timelineView } = useTimeEntries();
  const [editingEntry, setEditingEntry] = useState<TimeEntryType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTimerMode, setIsTimerMode] = useState(false);
  
  const timeBlocks = getTimeBlocks();
  
  // For days view
  const filteredDayEntries = entries.filter(entry => 
    isSameDay(entry.date, selectedDate)
  );

  // For weeks view
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const handleOpenNewEntryForm = (timerMode: boolean = false) => {
    setEditingEntry(null);
    setIsTimerMode(timerMode);
    setIsFormOpen(true);
  };
  
  const handleEditEntry = (entry: TimeEntryType) => {
    setEditingEntry(entry);
    setIsTimerMode(false);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  // Render day view timeline
  const renderDayView = () => {
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{formatFullDate(selectedDate)}</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1" 
              onClick={() => handleOpenNewEntryForm(false)}
            >
              <Clock className="h-4 w-4" />
              <span>Add Time</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="gap-1" 
              onClick={() => handleOpenNewEntryForm(true)}
            >
              <Play className="h-4 w-4" />
              <span>Start Timer</span>
            </Button>
          </div>
        </div>
        
        <div className="relative mt-2">
          {/* Time markers */}
          <div className="grid grid-cols-24 gap-0">
            {timeBlocks.map((time, index) => (
              <div key={index} className="text-xs text-muted-foreground mb-2 text-center">
                {index % 2 === 0 ? time : ''}
              </div>
            ))}
          </div>
          
          {/* Timeline grid */}
          <div className="h-24 relative">
            <div className="absolute inset-0 grid grid-cols-24 gap-0 border-t">
              {timeBlocks.map((_, index) => (
                <div 
                  key={index} 
                  className="h-full border-r last:border-r-0"
                />
              ))}
            </div>
            
            {/* Time entries */}
            <div className="absolute inset-0">
              {filteredDayEntries.map(entry => (
                <TimeEntry 
                  key={entry.id} 
                  entry={entry} 
                  onEdit={handleEditEntry} 
                />
              ))}
            </div>
          </div>
        </div>
        
        {filteredDayEntries.length === 0 && !activeEntry && (
          <div className="text-center py-10 text-muted-foreground">
            <p>No time entries for this day.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => handleOpenNewEntryForm(false)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>
        )}
      </>
    );
  };

  // Render week view timeline
  const renderWeekView = () => {
    const now = new Date();
    
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Week {format(selectedDate, 'w')}, {format(selectedDate, 'yyyy')}
          </h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1" 
              onClick={() => handleOpenNewEntryForm(false)}
            >
              <Clock className="h-4 w-4" />
              <span>Add Time</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="gap-1" 
              onClick={() => handleOpenNewEntryForm(true)}
            >
              <Play className="h-4 w-4" />
              <span>Start Timer</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mt-4">
          {weekDays.map((day, index) => {
            const dayEntries = entries.filter(entry => isSameDay(entry.date, day));
            const isToday = isSameDay(day, now);
            
            return (
              <div 
                key={index} 
                className={cn(
                  "border rounded-md overflow-hidden",
                  isToday && "border-blue-500 shadow"
                )}
              >
                <div className={cn(
                  "p-2 border-b text-center",
                  isToday && "bg-blue-50 text-blue-600 border-b-blue-500"
                )}>
                  <div className="text-xs font-medium">{formatDayName(day)}</div>
                  <div className={cn(
                    "text-lg font-semibold", 
                    isToday && "text-blue-600"
                  )}>
                    {formatDayOfMonth(day)}
                  </div>
                </div>
                
                <div className="p-2 h-24 overflow-y-auto">
                  {dayEntries.length > 0 ? (
                    dayEntries.map(entry => (
                      <div 
                        key={entry.id}
                        className={`text-xs p-1 my-1 rounded bg-${getCategoryColor(entry.category)} cursor-pointer`}
                        onClick={() => handleEditEntry(entry)}
                      >
                        {format(entry.startTime, 'HH:mm')} - {entry.endTime ? format(entry.endTime, 'HH:mm') : '...'} 
                        <div className="font-medium truncate">{entry.description}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-xs text-muted-foreground h-full flex items-center justify-center">
                      <span>No entries</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className="glass-panel p-4 mb-6 animate-slide-up">
      {timelineView === 'days' ? renderDayView() : renderWeekView()}
      
      <TimeEntryForm
        entry={editingEntry}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      />
    </div>
  );
};

export default Timeline;
