'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AudioRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSpeechDetected, setIsSpeechDetected] = useState(false);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const transcriptPartsRef = useRef([]);
  const mediaStreamRef = useRef(null);

  const initializeSpeechRecognition = () => {
    if (typeof window === 'undefined') return null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Speech recognition started');
      transcriptPartsRef.current = [];
      setTranscript('');
      setIsSpeechDetected(false);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
          transcriptPartsRef.current.push(transcript);
          setIsSpeechDetected(true);
        } else {
          interimTranscript += transcript;
        }
      }

      const fullTranscript = transcriptPartsRef.current.join(' ') + ' ' + interimTranscript;
      setTranscript(fullTranscript.trim());
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        if (!isSpeechDetected) {
          toast.error("No speech detected. Please speak louder or check your microphone settings.");
        }
      } else if (event.error === 'audio-capture') {
        toast.error("No microphone detected. Please check your audio settings.");
      } else if (event.error === 'not-allowed') {
        toast.error("Microphone access denied. Please check your browser permissions.");
      } else {
        toast.error("Speech recognition error. Please try again.");
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      if (isRecording) {
        console.log('Restarting speech recognition...');
        recognition.start();
      }
    };

    return recognition;
  };

  useEffect(() => {
    recognitionRef.current = initializeSpeechRecognition();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      if (!recognitionRef.current) {
        recognitionRef.current = initializeSpeechRecognition();
        if (!recognitionRef.current) return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      mediaStreamRef.current = stream;
      const audioTracks = stream.getAudioTracks();
      
      if (audioTracks.length === 0) {
        throw new Error('No audio track available');
      }

      // Test microphone input level
      const audioContext = new AudioContext();
      const mediaStreamSource = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      mediaStreamSource.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      
      setIsRecording(true);
      setRecordingTime(0);
      setTranscript('');
      setShowPreview(false);
      transcriptPartsRef.current = [];
      
      recognitionRef.current.start();
      toast.success("Recording started. Start speaking...");

      // Monitor audio input
      const checkAudioInput = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const audioLevel = dataArray.reduce((a, b) => a + b) / dataArray.length;
        if (audioLevel < 10 && isRecording) {
          toast("Speaking too quietly. Please speak louder.", {
            duration: 2000
          });
        }
      }, 2000);

      // Cleanup audio monitoring after 5 seconds
      setTimeout(() => {
        clearInterval(checkAudioInput);
        audioContext.close();
      }, 5000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      if (error.name === 'NotAllowedError') {
        toast.error("Microphone access denied. Please check your browser permissions.");
      } else if (error.name === 'NotFoundError') {
        toast.error("No microphone found. Please check your audio settings.");
      } else {
        toast.error("Failed to access microphone. Please check your settings.");
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const finalTranscript = transcriptPartsRef.current.join(' ').trim();
      setTranscript(finalTranscript);
      setShowPreview(true);

      if (!finalTranscript) {
        toast.error("No speech was detected. Please try again and speak clearly into your microphone.");
      } else if (finalTranscript.length < 10) {
        toast.warning("Your answer seems very short. Consider providing more details.");
      }
    }
  };

  const handleSubmit = () => {
    const finalTranscript = transcript.trim();
    if (!finalTranscript) {
      toast.error("No transcription available. Please try recording again.");
      return;
    }
    setIsProcessing(true);
    onRecordingComplete(null, finalTranscript);
    setShowPreview(false);
    setIsProcessing(false);
  };

  const handleReRecord = () => {
    setTranscript('');
    setShowPreview(false);
    startRecording();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-2xl font-mono">
        {formatTime(recordingTime)}
      </div>
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        variant={isRecording ? "destructive" : "default"}
        size="lg"
        className="w-16 h-16 rounded-full"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : isRecording ? (
          <Square className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>
      <p className="text-sm text-muted-foreground">
        {isProcessing 
          ? 'Processing your answer...' 
          : isRecording 
            ? 'Recording in progress... Click to stop' 
            : 'Click to start recording'}
      </p>

      {(showPreview || isRecording) && transcript && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Your Answer:</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{transcript}</p>
          </div>
          {showPreview && (
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={handleReRecord}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Re-record
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex items-center gap-2"
                disabled={!transcript.trim()}
              >
                Submit Answer
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 