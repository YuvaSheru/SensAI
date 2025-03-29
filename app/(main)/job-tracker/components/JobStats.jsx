'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Briefcase, CheckCircle, XCircle, Clock, Target, Building2 } from 'lucide-react';

export default function JobStats({ applications }) {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    rejected: 0,
    interviewing: 0,
    offered: 0,
    accepted: 0,
    companies: new Set(),
  });

  useEffect(() => {
    const newStats = {
      total: applications.length,
      active: 0,
      rejected: 0,
      interviewing: 0,
      offered: 0,
      accepted: 0,
      companies: new Set(),
    };

    applications.forEach(app => {
      newStats.companies.add(app.company);
      
      switch (app.status) {
        case 'applied':
        case 'interviewing':
          newStats.active++;
          break;
        case 'rejected':
          newStats.rejected++;
          break;
        case 'interviewing':
          newStats.interviewing++;
          break;
        case 'offered':
          newStats.offered++;
          break;
        case 'accepted':
          newStats.accepted++;
          break;
      }
    });

    setStats(newStats);
  }, [applications]);

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.total,
      icon: Briefcase,
      color: 'text-blue-500',
    },
    {
      title: 'Active Applications',
      value: stats.active,
      icon: Target,
      color: 'text-green-500',
    },
    {
      title: 'Interviewing',
      value: stats.interviewing,
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      title: 'Offers',
      value: stats.offered,
      icon: CheckCircle,
      color: 'text-purple-500',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-red-500',
    },
    {
      title: 'Unique Companies',
      value: stats.companies.size,
      icon: Building2,
      color: 'text-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
        </Card>
      ))}
    </div>
  );
} 