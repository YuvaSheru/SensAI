'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Building2, Calendar, Briefcase, Target, Wand2, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

const applicationStatuses = [
  { value: 'saved', label: 'Saved', color: 'bg-gray-500' },
  { value: 'applied', label: 'Applied', color: 'bg-blue-500' },
  { value: 'interviewing', label: 'Interviewing', color: 'bg-yellow-500' },
  { value: 'offered', label: 'Offered', color: 'bg-green-500' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
  { value: 'accepted', label: 'Accepted', color: 'bg-purple-500' },
];

export default function JobList() {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);

  // Load applications from localStorage on mount
  useEffect(() => {
    const savedApplications = localStorage.getItem('jobApplications');
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }
  }, []);

  // Save applications to localStorage when updated
  useEffect(() => {
    localStorage.setItem('jobApplications', JSON.stringify(applications));
  }, [applications]);

  const filteredApplications = applications
    .filter(app => filter === 'all' || app.status === filter)
    .filter(app =>
      searchTerm
        ? app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.position.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

  const handleDelete = (id) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    toast.success('Application deleted successfully!');
  };

  const handleStatusChange = (id, newStatus) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id
          ? {
              ...app,
              status: newStatus,
              statusUpdatedAt: new Date().toISOString(),
            }
          : app
      )
    );
    toast.success('Status updated successfully!');
  };

  const getAIInsights = async (application) => {
    try {
      const response = await fetch('/api/job-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company: application.company,
          position: application.position,
          requirements: application.requirements,
        }),
      });

      if (!response.ok) throw new Error('Failed to get insights');
      
      const insights = await response.json();
      setSelectedApp({
        ...application,
        insights: insights,
      });
      toast.success('AI insights generated successfully!');
    } catch (error) {
      console.error('Error getting insights:', error);
      toast.error('Failed to get AI insights');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search companies or positions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<Search className="w-4 h-4" />}
          />
        </div>
        <select
          className="border rounded-md px-3 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Applications</option>
          {applicationStatuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplications.map(application => (
          <Card key={application.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{application.position}</h3>
                  <p className="text-muted-foreground flex items-center">
                    <Building2 className="w-4 h-4 mr-1" />
                    {application.company}
                  </p>
                </div>
                <Badge className={
                  applicationStatuses.find(s => s.value === application.status)?.color
                }>
                  {applicationStatuses.find(s => s.value === application.status)?.label}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                {application.location && (
                  <p className="flex items-center text-muted-foreground">
                    <Target className="w-4 h-4 mr-2" />
                    {application.location}
                  </p>
                )}
                {application.appliedDate && (
                  <p className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Applied: {new Date(application.appliedDate).toLocaleDateString()}
                  </p>
                )}
                {application.salary && (
                  <p className="flex items-center text-muted-foreground">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {application.salary}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => getAIInsights(application)}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Get AI Tips
                </Button>
                <select
                  className="border rounded-md px-2 py-1 text-sm"
                  value={application.status}
                  onChange={(e) => handleStatusChange(application.id, e.target.value)}
                >
                  {applicationStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedApp(application)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(application.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedApp.position}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedApp(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Company Details</h3>
                  <p className="text-muted-foreground">{selectedApp.company}</p>
                  {selectedApp.location && (
                    <p className="text-muted-foreground">{selectedApp.location}</p>
                  )}
                </div>

                {selectedApp.requirements && (
                  <div>
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <p className="text-muted-foreground">{selectedApp.requirements}</p>
                  </div>
                )}

                {selectedApp.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="text-muted-foreground">{selectedApp.notes}</p>
                  </div>
                )}

                {selectedApp.insights && (
                  <div>
                    <h3 className="font-semibold mb-2">AI Insights</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-muted-foreground">{selectedApp.insights}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 