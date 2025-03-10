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

export interface TimesheetTask {
  key: string;
  description: string;
  hours?: number;
  requiredHours?: string;
  dailyHours?: Record<string, number>;
  utilization?: string;
}

export interface TimesheetUser {
  name: string;
  utilization: number;
  requiredHours: number;
  loggedHours: number;
  tasks: TimesheetTask[];
  dailyHours?: Record<string, number>;
}

export const getInitialTimesheetData = (): TimesheetUser[] => {
  return [
    {
      name: "Catherine Evans",
      utilization: 113,
      requiredHours: 176,
      loggedHours: 198.75,
      dailyHours: { "04": 14, "05": 12, "06": 11, "07": 11, "08": 10, "11": 13, "12": 13, "13": 13, "14": 13, "19": 9, "20": 9 },
      tasks: [
        {
          key: "SUST-2",
          description: "Consult with Lunar Industries to develop plan",
          requiredHours: "5h 15m",
          dailyHours: { "04": 3, "05": 1, "06": 15/60, "07": 1 }
        },
        {
          key: "SUST-32",
          description: "Determine contamination levels using liquid chromatography",
          requiredHours: "29h",
          dailyHours: { "05": 1, "06": 1, "07": 1, "12": 4, "13": 4, "14": 4, "15": 4, "16": 4 }
        },
        {
          key: "SUST-16",
          description: "Determine pollution output from food emulsifiers",
          requiredHours: "24h 15m",
          dailyHours: { "06": 15/60, "12": 3, "13": 3, "14": 3, "15": 3, "16": 3, "19": 3, "20": 3 }
        },
        {
          key: "SUST-10",
          description: "Determine thermal and radiation emissions from processing",
          requiredHours: "20h 15m",
          dailyHours: { "04": 4, "05": 4, "06": 4.25, "07": 4, "08": 4 }
        },
        {
          key: "SUST-30",
          description: "Training on lunar environmental assessments",
          requiredHours: "120h",
          dailyHours: { "04": 6, "05": 6, "06": 6, "07": 6, "08": 6, "12": 6, "13": 6, "14": 6, "15": 6, "16": 6, "19": 6, "20": 6 }
        }
      ]
    },
    {
      name: "David Carmichael",
      utilization: 100,
      requiredHours: 168,
      loggedHours: 168,
      dailyHours: { "04": 8, "05": 8, "06": 8, "07": 8, "08": 8, "12": 8, "13": 8, "14": 8, "15": 8, "19": 8, "20": 8 },
      tasks: [
        {
          key: "SUST-27",
          description: "Assess toxicology risk of green cheese sedimentation",
          requiredHours: "168h",
          dailyHours: { "04": 8, "05": 8, "06": 8, "07": 8, "08": 8, "12": 8, "13": 8, "14": 8, "15": 8, "19": 8, "20": 8 }
        }
      ]
    },
    {
      name: "Eric",
      utilization: 73,
      requiredHours: 176,
      loggedHours: 129,
      dailyHours: { "04": 7, "05": 7, "06": 7, "07": 7, "08": 7, "12": 7, "13": 7, "14": 7, "15": 7, "16": 7, "19": 6, "20": 6 },
      tasks: [
        {
          key: "SUST-29",
          description: "Administrative",
          requiredHours: "10h",
          dailyHours: { "04": 1, "05": 1, "06": 1, "07": 1, "08": 1, "12": 1, "13": 1, "14": 1, "15": 1, "16": 1 }
        },
        {
          key: "SUST-9",
          description: "Test soil samples for excess helium-3 emissions",
          requiredHours: "119h",
          dailyHours: { "04": 6, "05": 6, "06": 6, "07": 6, "08": 6, "12": 6, "13": 6, "14": 6, "15": 6, "16": 6, "19": 6, "20": 6 }
        }
      ]
    },
    {
      name: "Scott",
      utilization: 117,
      requiredHours: 168,
      loggedHours: 197,
      dailyHours: { "04": 14, "05": 14, "06": 14, "07": 14, "08": 14, "12": 10, "13": 14, "14": 14, "15": 14, "19": 8, "20": 8 },
      tasks: [
        {
          key: "SUST-14",
          description: "Do ultrasonic tests in waste disposal areas",
          requiredHours: "61h",
          dailyHours: { "04": 6, "05": 6, "06": 6, "07": 6, "08": 6, "12": 6, "13": 6, "14": 6, "15": 6, "16": 6 }
        },
        {
          key: "SUST-19",
          description: "Prescribe actions to take on green cheese toxicology",
          requiredHours: "136h",
          dailyHours: { "04": 8, "05": 8, "06": 8, "07": 8, "08": 8, "12": 4, "13": 8, "14": 8, "15": 8, "19": 8, "20": 8 }
        }
      ]
    },
    {
      name: "Taylor",
      utilization: 100,
      requiredHours: 168,
      loggedHours: 168,
      dailyHours: { "04": 8, "05": 8, "06": 8, "07": 8, "08": 8, "12": 8, "13": 8, "14": 8, "15": 8, "19": 8, "20": 8 },
      tasks: [
        {
          key: "SUST-3",
          description: "Manage transportation equipment for facilities",
          requiredHours: "168h",
          dailyHours: { "04": 8, "05": 8, "06": 8, "07": 8, "08": 8, "12": 8, "13": 8, "14": 8, "15": 8, "19": 8, "20": 8 }
        }
      ]
    },
    {
      name: "Vivian",
      utilization: 90,
      requiredHours: 168,
      loggedHours: 152,
      dailyHours: { "04": 5, "05": 5, "06": 5, "07": 5, "08": 5, "12": 7, "13": 7, "14": 7, "15": 10, "19": 10, "20": 10 },
      tasks: [
        {
          key: "SUST-32",
          description: "Determine contamination levels using liquid chromatography",
          requiredHours: "138h",
          dailyHours: { "04": 5, "05": 5, "06": 5, "07": 5, "08": 5, "12": 5, "13": 5, "14": 5, "15": 8, "19": 8, "20": 8 }
        },
        {
          key: "SUST-31",
          description: "Project meetings",
          requiredHours: "14h",
          dailyHours: { "12": 2, "13": 2, "14": 2, "15": 2, "19": 2, "20": 2 }
        }
      ]
    }
  ];
};

