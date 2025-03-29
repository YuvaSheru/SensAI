import { Mic, FileText, Briefcase, Search } from 'lucide-react';

const routes = [
  {
    label: 'Mock Interview',
    icon: Mic,
    href: '/mock-interview',
    color: 'text-violet-500'
  },
  {
    label: 'Resume Builder',
    icon: FileText,
    href: '/resume-builder',
    color: 'text-blue-500'
  },
  {
    label: 'Job Search',
    icon: Search,
    href: '/job-search',
    color: 'text-yellow-500'
  },
  {
    label: 'Job Applications',
    icon: Briefcase,
    href: '/job-tracker',
    color: 'text-green-500'
  }
];

const growthTools = [
  {
    label: 'Build Resume',
    href: '/resume-builder',
    description: 'Create a professional resume'
  },
  {
    label: 'Cover Letter',
    href: '/cover-letter',
    description: 'Generate tailored cover letters'
  },
  {
    label: 'Interview Prep',
    href: '/mock-interview',
    description: 'Practice with AI interviews'
  },
  {
    label: 'Job Search',
    href: '/job-search',
    description: 'Find relevant job opportunities'
  },
  {
    label: 'Job Tracker',
    href: '/job-tracker',
    description: 'Track your job applications'
  }
]; 