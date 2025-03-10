
import React, { useState } from 'react';
import { format, addMonths, addDays, isSameDay } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon
} from 'lucide-react';
import { useTimeEntries } from '../context/TimeEntryContext';
import { Button } from '@/components/ui/button';
import { getDaysInMonth, formatMonthYear, formatDayName, formatDayOfMonth } from '../utils/timeUtils';
import { cn } from '@/lib/utils';

const TimelineHeader: React.FC = () => {
  const { selectedDate, setSelectedDate } = useTimeEntries();
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);
  
  const days = getDaysInMonth(currentMonth);
  
  const goToPreviousMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
  };
  
  const selectDay = (day: Date) => {
    setSelectedDate(day);
  };
  
  const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date());
  };
  
  const isSelected = (date: Date): boolean => {
    return isSameDay(date, selectedDate);
  };

  return (
    <div className="glass-panel p-4 mb-6 animate-slide-down">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">{formatMonthYear(currentMonth)}</h2>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={goToToday}>
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="rounded-full" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 md:gap-2 overflow-x-auto py-2">
        {days.map((day, i) => (
          <Button
            key={i}
            variant="ghost"
            className={cn(
              "flex flex-col items-center justify-center h-16 rounded-lg transition-all duration-200 p-1",
              isSelected(day) && "bg-primary text-primary-foreground",
              isToday(day) && !isSelected(day) && "border-primary border"
            )}
            onClick={() => selectDay(day)}
          >
            <span className="text-xs font-medium">
              {formatDayName(day)}
            </span>
            <span className={cn(
              "text-lg",
              isSelected(day) && "font-semibold"
            )}>
              {formatDayOfMonth(day)}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimelineHeader;
