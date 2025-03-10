
import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { useTimeEntries } from '../context/TimeEntryContext';
import { cn } from '@/lib/utils';
import { getInitialTimesheetData } from '../utils/timeUtils';

const JiraTimesheet: React.FC = () => {
  const { selectedDate } = useTimeEntries();
  
  // Get the week days starting from the selected date
  const startOfWeekDay = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 17 }, (_, i) => addDays(startOfWeekDay, i));
  
  // Get sample data
  const timesheetData = getInitialTimesheetData();
  
  // Calculate totals
  const totalHours = timesheetData.reduce((acc, user) => {
    const userTotal = user.tasks.reduce((taskAcc, task) => {
      return taskAcc + (task.hours || 0);
    }, 0);
    return acc + userTotal;
  }, 0);

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto relative">
        <table className="w-full min-w-max text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-2 px-3 font-medium text-left border-r sticky left-0 z-20 bg-gray-50" style={{ minWidth: '250px' }}>User / Issue</th>
              <th className="py-2 px-3 font-medium text-left border-r sticky left-[250px] z-20 bg-gray-50" style={{ minWidth: '80px' }}>Key</th>
              <th className="py-2 px-3 font-medium text-left border-r sticky left-[330px] z-20 bg-gray-50" style={{ minWidth: '100px' }}>Utilization</th>
              <th className="py-2 px-3 font-medium text-left border-r sticky left-[430px] z-20 bg-gray-50" style={{ minWidth: '100px' }}>Required</th>
              <th className="py-2 px-3 font-medium text-left border-r sticky left-[530px] z-20 bg-gray-50" style={{ minWidth: '80px' }}>Logged</th>
              
              {weekDays.slice(0, 17).map((day, index) => (
                <th key={index} className="text-center border-r py-1 px-1 min-w-14">
                  <div className="text-xs font-medium">{format(day, 'dd')}</div>
                  <div className="text-[10px] text-gray-500">{format(day, 'EEE').toUpperCase()}</div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {timesheetData.map((user, userIndex) => (
              <React.Fragment key={userIndex}>
                {/* User row */}
                <tr className="border-b bg-gray-50/50">
                  <td className="py-2 px-3 font-medium border-r flex items-center gap-2 sticky left-0 z-10 bg-gray-50/50">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                      {user.name.charAt(0)}
                    </div>
                    {user.name}
                  </td>
                  <td className="py-2 px-3 border-r sticky left-[250px] z-10 bg-gray-50/50"></td>
                  <td className="py-2 px-3 border-r sticky left-[330px] z-10 bg-gray-50/50">{user.utilization}%</td>
                  <td className="py-2 px-3 border-r sticky left-[430px] z-10 bg-gray-50/50">{user.requiredHours}h</td>
                  <td className="py-2 px-3 border-r sticky left-[530px] z-10 bg-gray-50/50">{user.loggedHours}h</td>
                  
                  {weekDays.slice(0, 17).map((day, dayIndex) => {
                    const dailyHours = user.dailyHours?.[format(day, 'dd')] || '';
                    return (
                      <td key={dayIndex} className="text-center border-r py-2 px-1 min-w-14">
                        {dailyHours && `${dailyHours}h`}
                      </td>
                    );
                  })}
                </tr>
                
                {/* Task rows */}
                {user.tasks.map((task, taskIndex) => (
                  <tr key={taskIndex} className={cn("border-b", taskIndex === user.tasks.length - 1 && "border-b-2")}>
                    <td className="py-2 px-3 border-r pl-10 sticky left-0 z-10 bg-white">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked className="h-4 w-4 rounded border-gray-300" />
                        <span className="truncate max-w-[400px]">{task.description}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 border-r text-blue-500 sticky left-[250px] z-10 bg-white">{task.key}</td>
                    <td className="py-2 px-3 border-r sticky left-[330px] z-10 bg-white">{task.utilization || '0h'}</td>
                    <td className="py-2 px-3 border-r sticky left-[430px] z-10 bg-white">{task.requiredHours || '0h'}</td>
                    <td className="py-2 px-3 border-r sticky left-[530px] z-10 bg-white">{task.hours ? `${task.hours}h` : '0h'}</td>
                    
                    {weekDays.slice(0, 17).map((day, dayIndex) => {
                      const dailyHours = task.dailyHours?.[format(day, 'dd')] || '';
                      return (
                        <td key={dayIndex} className="text-center border-r py-2 px-1 min-w-14 hover:bg-gray-50 cursor-pointer">
                          {dailyHours && `${dailyHours}h`}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
            
            {/* Totals row */}
            <tr className="border-b font-medium bg-gray-50">
              <td className="py-2 px-3 border-r sticky left-0 z-10 bg-gray-50">Total</td>
              <td className="py-2 px-3 border-r sticky left-[250px] z-10 bg-gray-50"></td>
              <td className="py-2 px-3 border-r sticky left-[330px] z-10 bg-gray-50">99%</td>
              <td className="py-2 px-3 border-r sticky left-[430px] z-10 bg-gray-50">1024h</td>
              <td className="py-2 px-3 border-r sticky left-[530px] z-10 bg-gray-50">{totalHours}h</td>
              
              {weekDays.slice(0, 17).map((day, dayIndex) => {
                const dayStr = format(day, 'dd');
                const dailyTotal = timesheetData.reduce((acc, user) => {
                  const userDailyTotal = user.tasks.reduce((taskAcc, task) => {
                    return taskAcc + (task.dailyHours?.[dayStr] || 0);
                  }, 0);
                  return acc + userDailyTotal;
                }, 0);
                
                return (
                  <td key={dayIndex} className="text-center border-r py-2 px-1 min-w-14">
                    {dailyTotal > 0 && `${dailyTotal}h`}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JiraTimesheet;
