'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function AddJobDialog({ open, onOpenChange }) {
  const [newApplication, setNewApplication] = useState({
    company: '',
    position: '',
    location: '',
    status: 'saved',
    salary: '',
    notes: '',
    appliedDate: '',
    url: '',
    requirements: '',
  });

  const handleSubmit = () => {
    if (!newApplication.company || !newApplication.position) {
      toast.error('Please fill in company and position fields');
      return;
    }

    const applicationWithId = {
      ...newApplication,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    // Get existing applications from localStorage
    const existingApplications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    
    // Add new application
    localStorage.setItem('jobApplications', JSON.stringify([applicationWithId, ...existingApplications]));
    
    // Reset form
    setNewApplication({
      company: '',
      position: '',
      location: '',
      status: 'saved',
      salary: '',
      notes: '',
      appliedDate: '',
      url: '',
      requirements: '',
    });

    onOpenChange(false);
    toast.success('Application added successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Job Application</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Company"
              value={newApplication.company}
              onChange={(e) =>
                setNewApplication(prev => ({
                  ...prev,
                  company: e.target.value,
                }))
              }
            />
            <Input
              placeholder="Position"
              value={newApplication.position}
              onChange={(e) =>
                setNewApplication(prev => ({
                  ...prev,
                  position: e.target.value,
                }))
              }
            />
            <Input
              placeholder="Location"
              value={newApplication.location}
              onChange={(e) =>
                setNewApplication(prev => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
            />
            <Input
              placeholder="Salary Range"
              value={newApplication.salary}
              onChange={(e) =>
                setNewApplication(prev => ({
                  ...prev,
                  salary: e.target.value,
                }))
              }
            />
            <Input
              placeholder="Job URL"
              value={newApplication.url}
              onChange={(e) =>
                setNewApplication(prev => ({
                  ...prev,
                  url: e.target.value,
                }))
              }
            />
            <Input
              type="date"
              placeholder="Applied Date"
              value={newApplication.appliedDate}
              onChange={(e) =>
                setNewApplication(prev => ({
                  ...prev,
                  appliedDate: e.target.value,
                }))
              }
            />
          </div>
          <Textarea
            placeholder="Job Requirements"
            value={newApplication.requirements}
            onChange={(e) =>
              setNewApplication(prev => ({
                ...prev,
                requirements: e.target.value,
              }))
            }
          />
          <Textarea
            placeholder="Notes"
            value={newApplication.notes}
            onChange={(e) =>
              setNewApplication(prev => ({
                ...prev,
                notes: e.target.value,
              }))
            }
          />
          <Button onClick={handleSubmit}>Add Application</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 