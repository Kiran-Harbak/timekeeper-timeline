
import React, { useState } from 'react';
import { format, addDays, startOfWeek, endOfWeek, addWeeks } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight,
  Filter,
  ArrowDownWideNarrow,
  MoreHorizontal,
  Download,
  Calendar,
  FileSpreadsheet,
  FileText,
  File,
  Mail,
  ChevronDown
} from 'lucide-react';
import { useTimeEntries, TimelineViewType } from '../context/TimeEntryContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

const TimelineHeader: React.FC = () => {
  const { selectedDate, setSelectedDate, timelineView, setTimelineView } = useTimeEntries();
  
  const goToPreviousPeriod = () => {
    if (timelineView === 'days') {
      setSelectedDate(addDays(selectedDate, -7));
    } else if (timelineView === 'weeks') {
      setSelectedDate(addWeeks(selectedDate, -1));
    } else {
      // For months view
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setSelectedDate(newDate);
    }
  };
  
  const goToNextPeriod = () => {
    if (timelineView === 'days') {
      setSelectedDate(addDays(selectedDate, 7));
    } else if (timelineView === 'weeks') {
      setSelectedDate(addWeeks(selectedDate, 1));
    } else {
      // For months view
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setSelectedDate(newDate);
    }
  };
  
  // Get the current period range based on selected view
  const getPeriodDisplay = () => {
    if (timelineView === 'days') {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
      return `${format(start, 'dd/MM/yy')} - ${format(end, 'dd/MM/yy')}`;
    }
    else if (timelineView === 'weeks') {
      const weekNumber = format(selectedDate, 'w');
      const yearNumber = format(selectedDate, 'yyyy');
      return `Week ${weekNumber}, ${yearNumber}`;
    } 
    else {
      // For months view
      return format(selectedDate, 'MMMM yyyy');
    }
  };

  const handleExport = (type: string) => {
    toast.success(`Exporting as ${type}`);
  };

  const handleViewChange = (view: TimelineViewType) => {
    setTimelineView(view);
    toast.success(`View changed to ${view}`);
  };

  return (
    <div className="border rounded-md">
      <div className="flex justify-between items-center border-b p-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPreviousPeriod}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center border rounded px-3 py-1.5">
            <span className="text-sm">{getPeriodDisplay()}</span>
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
            {/* Days Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-8 text-xs">
                  {timelineView.charAt(0).toUpperCase() + timelineView.slice(1)} <ChevronDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white min-w-[150px]">
                <DropdownMenuItem onClick={() => handleViewChange("days")} className="text-sm">
                  <Calendar className="mr-2 h-3.5 w-3.5" />
                  <span>Days</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewChange("weeks")} className="text-sm">
                  <Calendar className="mr-2 h-3.5 w-3.5" />
                  <span>Weeks</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewChange("months")} className="text-sm">
                  <Calendar className="mr-2 h-3.5 w-3.5" />
                  <span>Months</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="h-8 text-xs bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1">
                  <Download className="h-3.5 w-3.5" />
                  Export <ChevronDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white min-w-[150px]">
                <DropdownMenuItem onClick={() => handleExport("Excel")} className="text-sm">
                  <FileSpreadsheet className="mr-2 h-3.5 w-3.5" />
                  <span>Excel</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("CSV")} className="text-sm">
                  <File className="mr-2 h-3.5 w-3.5" />
                  <span>CSV</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("PDF")} className="text-sm">
                  <FileText className="mr-2 h-3.5 w-3.5" />
                  <span>PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("Email")} className="text-sm">
                  <Mail className="mr-2 h-3.5 w-3.5" />
                  <span>Email Report</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineHeader;
