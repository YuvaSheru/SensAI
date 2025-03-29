'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function InterviewPrep({ application }) {
  const [prepNotes, setPrepNotes] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuestions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          position: application.position,
          company: application.company,
          requirements: application.requirements,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate questions');
      
      const data = await response.json();
      setQuestions(data.questions);
      toast.success('Interview questions generated!');
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions');
    } finally {
      setIsGenerating(false);
    }
  };

  const savePrepNotes = () => {
    const savedNotes = JSON.parse(localStorage.getItem('interviewPrep') || '{}');
    savedNotes[application.id] = prepNotes;
    localStorage.setItem('interviewPrep', JSON.stringify(savedNotes));
    toast.success('Prep notes saved!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Interview Preparation</h3>
        <Button
          onClick={generateQuestions}
          disabled={isGenerating}
        >
          <Wand2 className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate Questions'}
        </Button>
      </div>

      <Card className="p-4">
        <h4 className="font-medium mb-2">Preparation Notes</h4>
        <Textarea
          placeholder="Add your interview preparation notes here..."
          value={prepNotes}
          onChange={(e) => setPrepNotes(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={savePrepNotes} className="mt-2">
          Save Notes
        </Button>
      </Card>

      {questions.length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium mb-4">Potential Interview Questions</h4>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-medium">{question}</p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const savedNotes = JSON.parse(localStorage.getItem('interviewPrep') || '{}');
                        savedNotes[application.id] = savedNotes[application.id] || '';
                        savedNotes[application.id] += `\nQ: ${question}\nA: `;
                        localStorage.setItem('interviewPrep', JSON.stringify(savedNotes));
                        setPrepNotes(savedNotes[application.id]);
                      }}
                    >
                      Add to Notes
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
} 