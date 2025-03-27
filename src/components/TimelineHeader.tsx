
import React, { useState } from 'react';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, getDate } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight,
  Filter,
  ArrowDownWideNarrow,
  MoreHorizontal,
  Download,
  Calendar,
  FileSpreadsheet,
  FileDown, // Replacing FileCsv with FileDown
  FileText, // Replacing FilePdf with FileText
  Mail,
  ChevronDown // Added for dropdown chevron
} from 'lucide-react';
import { useTimeEntries } from '../context/TimeEntryContext';
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
  const { selectedDate, setSelectedDate } = useTimeEntries();
  const [viewMode, setViewMode] = useState<'days'|'weeks'|'months'>('days');
  
  const goToPreviousPeriod = () => {
    if (viewMode === 'days') {
      setSelectedDate(addDays(selectedDate, -1));
    } else if (viewMode === 'weeks') {
      setSelectedDate(addDays(selectedDate, -7));
    } else if (viewMode === 'months') {
      const prevMonth = new Date(selectedDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      setSelectedDate(prevMonth);
    }
  };
  
  const goToNextPeriod = () => {
    if (viewMode === 'days') {
      setSelectedDate(addDays(selectedDate, 1));
    } else if (viewMode === 'weeks') {
      setSelectedDate(addDays(selectedDate, 7));
    } else if (viewMode === 'months') {
      const nextMonth = new Date(selectedDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setSelectedDate(nextMonth);
    }
  };
  
  // Get the period display based on view mode
  const getPeriodDisplay = () => {
    if (viewMode === 'days') {
      return format(selectedDate, 'dd MMM yyyy');
    } else if (viewMode === 'weeks') {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
      return `${format(start, 'dd/MM/yy')} - ${format(end, 'dd/MM/yy')}`;
    } else {
      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);
      return `${format(start, 'MMM yyyy')}`;
    }
  };

  const handleExport = (type: string) => {
    toast.success(`Exporting as ${type}`);
  };

  const handleViewChange = (view: 'days' | 'weeks' | 'months') => {
    setViewMode(view);
    toast.success(`View changed to ${view}`);
  };

  // Generate calendar days for the month view
  const getMonthDays = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const days = [];
    let day = start;
    
    while (day <= end) {
      days.push(format(day, 'd'));
      day = addDays(day, 1);
    }
    
    return days;
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
              User
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
                  {viewMode === 'days' ? 'Day' : viewMode === 'weeks' ? 'Week' : 'Month'} <ChevronDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white min-w-[150px]">
                <DropdownMenuItem onClick={() => handleViewChange("days")} className="text-sm">
                  <Calendar className="mr-2 h-3.5 w-3.5" />
                  <span>Day</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewChange("weeks")} className="text-sm">
                  <Calendar className="mr-2 h-3.5 w-3.5" />
                  <span>Week</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewChange("months")} className="text-sm">
                  <Calendar className="mr-2 h-3.5 w-3.5" />
                  <span>Month</span>
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
                  <FileDown className="mr-2 h-3.5 w-3.5" />
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
      
      {/* Display days of month when in month view */}
      {viewMode === 'months' && (
        <div className="grid grid-cols-7 gap-1 p-2 text-center">
          {getMonthDays().map((day, index) => (
            <div key={index} className="text-sm border rounded p-1 hover:bg-gray-100 cursor-pointer">
              {day}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimelineHeader;
