'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import JobList from './components/JobList';
import JobStats from './components/JobStats';
import AddJobDialog from './components/AddJobDialog';

export default function JobTrackerPage() {
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [applications, setApplications] = useState([]);

  // Load applications from localStorage on mount
  useEffect(() => {
    const savedApplications = localStorage.getItem('jobApplications');
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }
  }, []);

  // Update applications when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedApplications = localStorage.getItem('jobApplications');
      if (savedApplications) {
        setApplications(JSON.parse(savedApplications));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <Button onClick={() => setIsAddJobOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Application
        </Button>
      </div>

      <JobStats applications={applications} />
      
      <JobList />
      
      <AddJobDialog 
        open={isAddJobOpen} 
        onOpenChange={setIsAddJobOpen} 
      />
    </div>
  );
} 