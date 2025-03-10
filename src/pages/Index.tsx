
import React from 'react';
import { TimeEntryProvider } from '../context/TimeEntryContext';
import TimelineHeader from '../components/TimelineHeader';
import Timeline from '../components/Timeline';
import Stats from '../components/Stats';

const Index = () => {
  return (
    <TimeEntryProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Timekeeper</h1>
            <p className="text-muted-foreground">Track your time with elegance and precision</p>
          </header>
          
          <TimelineHeader />
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Timeline />
            </div>
            <div>
              <Stats />
            </div>
          </div>
        </div>
      </div>
    </TimeEntryProvider>
  );
};

export default Index;
