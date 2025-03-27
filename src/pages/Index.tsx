
import React from 'react';
import { TimeEntryProvider } from '../context/TimeEntryContext';
import TimelineHeader from '../components/TimelineHeader';
import JiraTimesheet from '../components/JiraTimesheet';
import Timeline from '../components/Timeline';
import { Toaster } from 'sonner';

const Index = () => {
  return (
    <TimeEntryProvider>
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="max-w-full mx-auto">
          <header className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Timekeeper</h1>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span>Reports</span>
                <span>›</span>
                <span>Logged Time</span>
              </div>
              <h2 className="text-xl font-semibold mt-1">Sustainability Project Team - August 2024</h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="border px-4 py-1 rounded text-sm">Save</button>
              <button className="border px-4 py-1 rounded text-sm">Share</button>
            </div>
          </header>
          
          <TimelineHeader />
          
          <div className="mt-6">
            <Timeline />
            <JiraTimesheet />
          </div>
        </div>
      </div>
      <Toaster />
    </TimeEntryProvider>
  );
};

export default Index;
