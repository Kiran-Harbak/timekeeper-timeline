
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TimeEntry, getInitialTimeEntries, generateTimeId } from '../utils/timeUtils';
import { toast } from 'sonner';

export type TimelineViewType = 'days' | 'weeks' | 'months';

interface TimeEntryContextType {
  entries: TimeEntry[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  updateEntry: (id: string, entry: Partial<TimeEntry>) => void;
  deleteEntry: (id: string) => void;
  startTimer: (description: string, category: string) => void;
  stopTimer: () => void;
  activeEntry: TimeEntry | null;
  timelineView: TimelineViewType;
  setTimelineView: (view: TimelineViewType) => void;
}

const TimeEntryContext = createContext<TimeEntryContextType | undefined>(undefined);

export const TimeEntryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<TimeEntry[]>(getInitialTimeEntries());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [timelineView, setTimelineView] = useState<TimelineViewType>('days');

  const addEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry = { ...entry, id: generateTimeId() };
    setEntries([...entries, newEntry as TimeEntry]);
    toast.success('Time entry added');
  };

  const updateEntry = (id: string, updatedFields: Partial<TimeEntry>) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, ...updatedFields } : entry
    ));
    toast.success('Time entry updated');
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    toast.success('Time entry deleted');
  };

  const startTimer = (description: string, category: string) => {
    if (activeEntry) {
      // Stop current timer first
      stopTimer();
    }
    
    const newEntry: TimeEntry = {
      id: generateTimeId(),
      date: selectedDate,
      startTime: new Date(),
      endTime: null,
      description,
      category
    };
    
    setActiveEntry(newEntry);
    setEntries([...entries, newEntry]);
    toast.success('Timer started');
  };

  const stopTimer = () => {
    if (!activeEntry) return;
    
    updateEntry(activeEntry.id, { endTime: new Date() });
    setActiveEntry(null);
    toast.success('Timer stopped');
  };

  // Timer updater effect - updates the UI every second while timer is running
  useEffect(() => {
    if (!activeEntry) return;
    
    const interval = setInterval(() => {
      // Force a re-render to update the timer display
      setActiveEntry({ ...activeEntry });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeEntry]);

  const value = {
    entries,
    selectedDate,
    setSelectedDate,
    addEntry,
    updateEntry,
    deleteEntry,
    startTimer,
    stopTimer,
    activeEntry,
    timelineView,
    setTimelineView
  };

  return (
    <TimeEntryContext.Provider value={value}>
      {children}
    </TimeEntryContext.Provider>
  );
};

export const useTimeEntries = (): TimeEntryContextType => {
  const context = useContext(TimeEntryContext);
  if (context === undefined) {
    throw new Error('useTimeEntries must be used within a TimeEntryProvider');
  }
  return context;
};
