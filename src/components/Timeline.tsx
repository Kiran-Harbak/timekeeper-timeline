
import React, { useState } from 'react';
import { isSameDay } from 'date-fns';
import { useTimeEntries } from '../context/TimeEntryContext';
import TimeEntry from './TimeEntry';
import { TimeEntry as TimeEntryType, getTimeBlocks, formatFullDate } from '../utils/timeUtils';
import { Button } from '@/components/ui/button';
import { Plus, Play, Clock } from 'lucide-react';
import TimeEntryForm from './TimeEntryForm';

const Timeline: React.FC = () => {
  const { entries, selectedDate, activeEntry } = useTimeEntries();
  const [editingEntry, setEditingEntry] = useState<TimeEntryType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTimerMode, setIsTimerMode] = useState(false);
  
  const timeBlocks = getTimeBlocks();
  
  const filteredEntries = entries.filter(entry => 
    isSameDay(entry.date, selectedDate)
  );
  
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

  return (
    <div className="glass-panel p-4 mb-6 animate-slide-up">
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
            {filteredEntries.map(entry => (
              <TimeEntry 
                key={entry.id} 
                entry={entry} 
                onEdit={handleEditEntry} 
              />
            ))}
          </div>
        </div>
      </div>
      
      {filteredEntries.length === 0 && !activeEntry && (
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
      
      <TimeEntryForm
        entry={editingEntry}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      />
    </div>
  );
};

export default Timeline;
