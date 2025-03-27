
import React from 'react';
import { 
  Clock, 
  Edit, 
  Trash2, 
  Play, 
  Square 
} from 'lucide-react';
import { 
  formatTime, 
  calculateDuration, 
  calculateTimelinePosition,
  TimeEntry as TimeEntryType
} from '../utils/timeUtils';
import { useTimeEntries } from '../context/TimeEntryContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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

interface TimeEntryProps {
  entry: TimeEntryType;
  onEdit: (entry: TimeEntryType) => void;
}

const TimeEntry: React.FC<TimeEntryProps> = ({ entry, onEdit }) => {
  const { deleteEntry, activeEntry, stopTimer } = useTimeEntries();
  
  const startPosition = calculateTimelinePosition(entry.startTime);
  const endPosition = entry.endTime 
    ? calculateTimelinePosition(entry.endTime) 
    : calculateTimelinePosition(new Date());
  
  const width = Math.max(endPosition - startPosition, 2);
  const isActive = activeEntry?.id === entry.id;
  const categoryColor = getCategoryColor(entry.category);
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteEntry(entry.id);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(entry);
  };
  
  const handleStopTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    stopTimer();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={cn(
            "time-entry absolute h-8 rounded-md flex items-center px-2 cursor-pointer",
            `bg-${categoryColor}`,
            isActive && "animate-pulse-subtle",
          )}
          style={{ 
            left: `${startPosition}%`, 
            width: `${width}%`,
            minWidth: '60px'
          }}
          onClick={() => onEdit(entry)}
        >
          <div className="flex items-center gap-1 text-white w-full">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <div className="flex-1 truncate text-xs font-medium">
              {entry.description}
            </div>
            <div className="text-xs font-semibold whitespace-nowrap">
              {calculateDuration(entry.startTime, entry.endTime || new Date())}
            </div>
            
            <div className="flex gap-1 ml-1">
              {isActive ? (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 text-white hover:bg-white/20 rounded-full"
                  onClick={handleStopTimer}
                >
                  <Square className="h-3 w-3" />
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 text-white hover:bg-white/20 rounded-full"
                    onClick={handleEdit}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 text-white hover:bg-white/20 rounded-full"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <div className="text-sm">
          <div className="font-semibold">{entry.description}</div>
          <div className="text-xs text-muted-foreground">
            {formatTime(entry.startTime)} - {entry.endTime ? formatTime(entry.endTime) : 'Now'} • {entry.category}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default TimeEntry;
