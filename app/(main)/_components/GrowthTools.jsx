'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, FileText, PenLine, GraduationCap, Mic, Search } from 'lucide-react';

const growthTools = [
  {
    label: 'Build Resume',
    href: '/resume-builder',
    icon: FileText,
  },
  {
    label: 'Cover Letter',
    href: '/cover-letter',
    icon: PenLine,
  },
  {
    label: 'Interview Prep',
    href: '/interview-prep',
    icon: GraduationCap,
  },
  {
    label: 'Mock Interview',
    href: '/mock-interview',
    icon: Mic,
  },
  {
    label: 'Job Search',
    href: '/job-search',
    icon: Search,
  }
];

export default function GrowthTools() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="bg-purple-600 text-white hover:bg-purple-700 hover:text-white flex items-center gap-2 rounded-full px-4"
        >
          <span className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
            >
              <path
                d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.0749 12.975 13.8623 12.975 13.5999C12.975 11.72 12.4778 10.2794 11.4959 9.31167C10.7244 8.55135 9.70025 8.12901 8.50625 7.98352C10.0187 7.54739 11.125 6.15288 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
            Growth Tools
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] mt-2">
        {growthTools.map((tool) => (
          <DropdownMenuItem key={tool.href} asChild>
            <Link 
              href={tool.href} 
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              <tool.icon className="w-4 h-4" />
              <span>{tool.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 