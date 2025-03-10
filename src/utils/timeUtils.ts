
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, addHours, intervalToDuration, differenceInMinutes, formatDuration, parseISO } from 'date-fns';

export interface TimeEntry {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date | null;
  description: string;
  category: string;
}

export const generateTimeId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

export const formatFullDate = (date: Date): string => {
  return format(date, 'EEEE, MMMM d, yyyy');
};

export const formatMonthYear = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

export const formatDayOfMonth = (date: Date): string => {
  return format(date, 'd');
};

export const formatDayName = (date: Date): string => {
  return format(date, 'EEE');
};

export const getDaysInMonth = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

export const parseTimeString = (timeStr: string, baseDate: Date): Date => {
  const [hours, minutesPart] = timeStr.split(':');
  const [minutes, period] = minutesPart.split(' ');
  
  let hour = parseInt(hours, 10);
  const minute = parseInt(minutes, 10);

  if (period.toLowerCase() === 'pm' && hour < 12) {
    hour += 12;
  } else if (period.toLowerCase() === 'am' && hour === 12) {
    hour = 0;
  }

  const result = new Date(baseDate);
  result.setHours(hour, minute, 0, 0);
  return result;
};

export const calculateDuration = (start: Date, end: Date | null): string => {
  if (!end) return '...';
  
  const diffMinutes = differenceInMinutes(end, start);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
};

export const calculateTotalHours = (entries: TimeEntry[]): number => {
  return entries.reduce((total, entry) => {
    if (!entry.endTime) return total;
    const diffMinutes = differenceInMinutes(entry.endTime, entry.startTime);
    return total + (diffMinutes / 60);
  }, 0);
};

export const roundToNearest = (num: number, precision: number): number => {
  return Math.round(num * precision) / precision;
};

export const calculateTimelinePosition = (time: Date): number => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  return (hours * 60 + minutes) / 1440 * 100; // percentage of day
};

export const getTimeBlocks = (): string[] => {
  return [
    '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM',
  ];
};

export const getInitialTimeEntries = (): TimeEntry[] => {
  const today = new Date();
  const yesterday = addDays(today, -1);
  
  return [
    {
      id: generateTimeId(),
      date: today,
      startTime: new Date(today.setHours(9, 0, 0, 0)),
      endTime: new Date(today.setHours(12, 30, 0, 0)),
      description: 'Project meeting and documentation',
      category: 'Meeting'
    },
    {
      id: generateTimeId(),
      date: today,
      startTime: new Date(today.setHours(13, 30, 0, 0)),
      endTime: new Date(today.setHours(17, 0, 0, 0)),
      description: 'Development work',
      category: 'Development'
    },
    {
      id: generateTimeId(),
      date: yesterday,
      startTime: new Date(new Date(yesterday).setHours(10, 0, 0, 0)),
      endTime: new Date(new Date(yesterday).setHours(15, 45, 0, 0)),
      description: 'Client presentation and feedback',
      category: 'Client Work'
    }
  ];
};

export const getCategoryColor = (category: string): string => {
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

export const getCategories = (): string[] => {
  return [
    'Meeting',
    'Development',
    'Design',
    'Research',
    'Planning',
    'Client Work',
    'Other'
  ];
};
