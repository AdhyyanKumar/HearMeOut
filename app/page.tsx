'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { transcriptionService } from '@/lib/transcription-service';

export default function TranscriptDisplay() {
  const [transcript, setTranscript] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const unsubscribe = transcriptionService.subscribe((textChunk) => {
      setTranscript((prev) => prev + textChunk);
    });

    const unsubscribeErrors = transcriptionService.subscribeToErrors((error) => {
      console.error('Transcription error:', error);
      alert(error);
    });

    return () => {
      unsubscribe();
      unsubscribeErrors();
    };
  }, []);

  const handleToggleRecording = () => {
    if (isRecording) {
      transcriptionService.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      transcriptionService.start();
      setIsRecording(true);
    }
  };

  const renderMessage = (text: string) => {
    const parts = text.split(/(<[^>]+>)/g);

    return parts.map((part, index) => {
      if (part.match(/^<[^>]+>$/)) {
        const cleanText = part.slice(1, -1);
        return (
          <span key={index} className="bg-yellow-200 font-semibold px-1 rounded">
            {cleanText}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-blue-100">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2 text-center">
            Real-Time Transcript Monitor
          </h1>
          <p className="text-sm text-blue-600/70 text-center">
            Live transcription with intelligent highlighting
          </p>
        </div>

        <div className="mb-6 flex justify-center">
          <Button
            onClick={handleToggleRecording}
            className={`min-w-[180px] flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
            } text-white`}
          >
            <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-white' : 'bg-white'}`} />
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
        </div>

        <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-xl p-6 min-h-[450px] max-h-[550px] overflow-y-auto border border-blue-100/50 shadow-inner">
          {transcript.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <p className="text-blue-600/60 text-center font-medium">
                Click "Start Recording" to begin transcription
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-5 shadow-md border border-blue-100/30">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {renderMessage(transcript)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
