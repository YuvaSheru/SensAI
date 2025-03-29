'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import AudioRecorder from './components/AudioRecorder';
import InterviewHistory from './components/InterviewHistory';
import { History, Mic } from 'lucide-react';

export default function MockInterview() {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentQuestionType, setCurrentQuestionType] = useState('technical');
  const [feedback, setFeedback] = useState(null);
  const [activeTab, setActiveTab] = useState('interview');

  const interviewTypes = [
    { id: 'technical', label: 'Technical Interview' },
    { id: 'behavioral', label: 'Behavioral Interview' },
    { id: 'system-design', label: 'System Design Interview' },
  ];

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`/api/mock-interview?type=${currentQuestionType}`);
      if (!response.ok) throw new Error('Failed to fetch question');
      const data = await response.json();
      return data.question;
    } catch (error) {
      console.error('Error fetching question:', error);
      toast.error('Failed to fetch question');
      return null;
    }
  };

  const handleRecordingComplete = async (audioUrl, transcript) => {
    try {
      const response = await fetch('/api/mock-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer: transcript,
          questionType: currentQuestionType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const feedback = await response.json();
      setFeedback(feedback);

      // Move to next question or complete interview
      if (progress < 4) {
        setProgress(prev => prev + 1);
        await fetchQuestion();
      } else {
        setIsRecording(false);
        toast.success("Interview Complete!", {
          description: "Great job! You've completed all questions.",
        });
      }
    } catch (error) {
      console.error('Error processing answer:', error);
      toast.error(
        "There was an issue processing your answer, but we're still able to continue. Please try again or proceed to the next question."
      );
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="interview" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Mock Interview
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Interview History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="interview" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Mock Interview</h1>
              <p className="text-muted-foreground">
                Practice your interview skills with AI-powered feedback
              </p>
            </div>
            <div className="flex gap-4">
              {interviewTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={currentQuestionType === type.id ? "default" : "outline"}
                  onClick={() => setCurrentQuestionType(type.id)}
                  disabled={isRecording}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Current Progress</h2>
                  <span className="text-sm text-muted-foreground">
                    Question {progress + 1} of 5
                  </span>
                </div>
                <Progress value={(progress / 4) * 100} />
              </div>

              <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                isRecording={isRecording}
                setIsRecording={setIsRecording}
              />

              {feedback && (
                <div className="space-y-4 mt-6">
                  <h3 className="text-xl font-semibold">AI Feedback</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-600">Strengths:</h4>
                      <ul className="list-disc list-inside">
                        {feedback.strengths.map((strength, index) => (
                          <li key={index} className="text-muted-foreground">
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-600">
                        Areas for Improvement:
                      </h4>
                      <ul className="list-disc list-inside">
                        {feedback.improvements.map((improvement, index) => (
                          <li key={index} className="text-muted-foreground">
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium">Analysis:</h4>
                      <p className="text-muted-foreground">{feedback.analysis}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <InterviewHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
} 