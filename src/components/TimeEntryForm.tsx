
import React, { useState, useEffect } from 'react';
import { TimeEntry, getCategories } from '../utils/timeUtils';
import { useTimeEntries } from '../context/TimeEntryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

interface TimeEntryFormProps {
  entry: TimeEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ entry, isOpen, onClose }) => {
  const { addEntry, updateEntry, startTimer } = useTimeEntries();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isStartingTimer, setIsStartingTimer] = useState(false);
  
  const categories = getCategories();
  
  useEffect(() => {
    if (entry) {
      setDescription(entry.description);
      setCategory(entry.category);
      setStartTime(format(entry.startTime, 'HH:mm'));
      setEndTime(entry.endTime ? format(entry.endTime, 'HH:mm') : '');
      setIsStartingTimer(false);
    } else {
      setDescription('');
      setCategory(categories[0]);
      setStartTime(format(new Date(), 'HH:mm'));
      setEndTime('');
      setIsStartingTimer(true);
    }
  }, [entry, isOpen]);
  
  const handleSubmit = () => {
    if (description.trim() === '') return;
    
    if (isStartingTimer) {
      startTimer(description, category);
    } else if (entry) {
      // Convert time strings to Date objects
      const updatedStartTime = new Date(entry.startTime);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      updatedStartTime.setHours(startHours, startMinutes);
      
      let updatedEndTime = null;
      if (endTime) {
        updatedEndTime = new Date(entry.endTime || entry.startTime);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        updatedEndTime.setHours(endHours, endMinutes);
      }
      
      updateEntry(entry.id, {
        description,
        category,
        startTime: updatedStartTime,
        endTime: updatedEndTime,
      });
    } else {
      // Create new entry with the specified times
      const now = new Date();
      const newStartTime = new Date(now);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      newStartTime.setHours(startHours, startMinutes);
      
      let newEndTime = null;
      if (endTime) {
        newEndTime = new Date(now);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        newEndTime.setHours(endHours, endMinutes);
      }
      
      addEntry({
        date: now,
        description,
        category,
        startTime: newStartTime,
        endTime: newEndTime,
      });
    }
    
    onClose();
  };
  
  const dialogTitle = entry
    ? 'Edit Time Entry'
    : isStartingTimer
    ? 'Start Timer'
    : 'Add Time Entry';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-panel animate-scale-in">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {entry 
              ? 'Update the details of your time entry.' 
              : isStartingTimer 
              ? 'Start a new timer for your current activity.' 
              : 'Record a completed time entry.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you working on?"
              className="border-0 shadow-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-0 shadow-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {!isStartingTimer && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border-0 shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border-0 shadow-sm"
                />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {entry 
              ? 'Save Changes' 
              : isStartingTimer 
              ? 'Start Timer' 
              : 'Add Entry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimeEntryForm;
