
import React, { useState } from 'react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight,
  Filter,
  ArrowDownWideNarrow,
  MoreHorizontal,
  Export
} from 'lucide-react';
import { useTimeEntries } from '../context/TimeEntryContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TimelineHeader: React.FC = () => {
  const { selectedDate, setSelectedDate } = useTimeEntries();
  
  const goToPreviousPeriod = () => {
    setSelectedDate(addDays(selectedDate, -7));
  };
  
  const goToNextPeriod = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };
  
  // Get the current week range
  const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const periodDisplay = `${format(start, 'dd/MM/yy')} - ${format(end, 'dd/MM/yy')}`;

  return (
    <div className="border rounded-md">
      <div className="flex justify-between items-center border-b p-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPreviousPeriod}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center border rounded px-3 py-1.5">
            <span className="text-sm">{periodDisplay}</span>
          </div>
          
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToNextPeriod}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded">
            <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 h-8">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter by</span>
            </Button>
            <div className="border-l h-8 flex items-center px-2 text-sm">
              Project
            </div>
          </div>
          
          <div className="border-l h-8"></div>
          
          <div className="flex items-center border rounded">
            <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 h-8">
              <ArrowDownWideNarrow className="h-3.5 w-3.5" />
              <span>Group By</span>
            </Button>
            <div className="border-l h-8 flex items-center px-2 text-sm">
              1. User
            </div>
            <div className="border-l h-8 flex items-center px-2 text-sm">
              2. Issue
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          
          <div className="flex gap-2 ml-4">
            <Button variant="outline" className="h-8 text-xs">
              Days ▼
            </Button>
            
            <Button variant="primary" className="h-8 text-xs bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1">
              <Export className="h-3.5 w-3.5" />
              Export ▼
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineHeader;
