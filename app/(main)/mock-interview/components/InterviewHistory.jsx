'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Clock, Calendar } from 'lucide-react';

export default function InterviewHistory() {
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);

  // Mock data - In a real app, this would come from your database
  const mockHistory = [
    {
      id: 1,
      date: new Date('2024-03-15'),
      type: 'technical',
      questions: [
        {
          question: 'Explain how you would implement a binary search tree.',
          answer: 'A binary search tree is a data structure where each node has at most two children...',
          feedback: {
            strengths: ['Clear explanation', 'Good technical depth'],
            improvements: ['Could add more examples', 'Consider edge cases']
          }
        }
      ],
      duration: '15:30',
      score: 85
    },
    {
      id: 2,
      date: new Date('2024-03-14'),
      type: 'behavioral',
      questions: [
        {
          question: 'Tell me about a challenging project you worked on.',
          answer: 'I recently led a team project where we had to migrate a legacy system...',
          feedback: {
            strengths: ['Structured response', 'Good use of STAR method'],
            improvements: ['Could elaborate on technical details', 'Add metrics']
          }
        }
      ],
      duration: '12:45',
      score: 78
    }
  ];

  const sortedHistory = [...mockHistory].sort((a, b) => {
    const order = sortOrder === 'desc' ? -1 : 1;
    return order * (a.date.getTime() - b.date.getTime());
  });

  const filteredHistory = sortedHistory.filter(
    session => filterType === 'all' || session.type === filterType
  );

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Interview History</h2>
        <div className="flex gap-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="behavioral">Behavioral</SelectItem>
              <SelectItem value="system-design">System Design</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={toggleSort}
            className="flex items-center gap-2"
          >
            Sort by Date {sortOrder === 'desc' ? <ChevronDown /> : <ChevronUp />}
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredHistory.map((session) => (
            <TableRow key={session.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(session.date, 'MMM d, yyyy')}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {session.type}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {session.duration}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getScoreBadgeColor(session.score)}>
                  {session.score}%
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedSession(
                    selectedSession?.id === session.id ? null : session
                  )}
                >
                  {selectedSession?.id === session.id ? 'Hide Details' : 'View Details'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedSession && (
        <Card className="p-6 mt-4">
          <h3 className="text-xl font-semibold mb-4">Session Details</h3>
          {selectedSession.questions.map((q, index) => (
            <div key={index} className="space-y-4 mb-6">
              <div>
                <h4 className="font-medium">Question:</h4>
                <p className="text-muted-foreground">{q.question}</p>
              </div>
              <div>
                <h4 className="font-medium">Your Answer:</h4>
                <p className="text-muted-foreground">{q.answer}</p>
              </div>
              <div>
                <h4 className="font-medium">Feedback:</h4>
                <div className="space-y-2">
                  <div>
                    <h5 className="text-sm font-medium text-green-600">Strengths:</h5>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {q.feedback.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-yellow-600">Areas for Improvement:</h5>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {q.feedback.improvements.map((i, index) => (
                        <li key={index}>{i}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
} 