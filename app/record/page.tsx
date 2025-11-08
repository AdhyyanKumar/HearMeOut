'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { transcriptionService } from '@/lib/transcription-service';

export default function TranscriptDisplay() {
  const [transcript, setTranscript] = useState<string>('');
  const [processedText, setProcessedText] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const processedRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  useEffect(() => {
    if (processedRef.current) {
      processedRef.current.scrollTop = processedRef.current.scrollHeight;
    }
  }, [processedText]);

  const handleToggleRecording = () => {
    if (isRecording) {
      transcriptionService.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      setProcessedText('');
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
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col items-center p-8">
      <div className={`transition-all duration-700 ease-in-out flex flex-col items-center absolute left-1/2 -translate-x-1/2 ${isRecording ? 'top-8' : 'top-1/2 -translate-y-1/2'}`}>
        <h1 className={`transition-all duration-700 ease-in-out font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6 ${
          isRecording ? 'text-4xl' : 'text-6xl'
        }`}>
          HearMeOut
        </h1>
        <Button
          onClick={handleToggleRecording}
          className={`transition-all duration-500 ease-in-out flex items-center gap-4 shadow-2xl hover:shadow-3xl ${
            isRecording
              ? 'w-48 h-16 bg-red-500 hover:bg-red-600 animate-pulse'
              : 'w-64 h-24 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 scale-110'
          } text-white font-semibold text-lg rounded-full`}
        >
          <div className={`transition-all duration-300 ${isRecording ? 'w-5 h-5' : 'w-6 h-6'} rounded-full bg-white`} />
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </div>

      <div className={`w-full max-w-7xl absolute bottom-8 left-1/2 -translate-x-1/2 grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 ${
        isRecording ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
      }`} style={{ height: 'calc(100vh - 280px)' }}>
        <div className="transform transition-all duration-700 ease-out h-full" style={{
          transform: isRecording ? 'translateX(0)' : 'translateX(-100px)',
        }}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-200 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="text-xl font-semibold text-slate-800">Live Transcription</h2>
            </div>
            <div ref={transcriptRef} className="flex-1 overflow-y-auto">
              {transcript.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-400 text-center">Waiting for speech...</p>
                </div>
              ) : (
                <p className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap">
                  {renderMessage(transcript)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="transform transition-all duration-700 ease-out delay-100 h-full" style={{
          transform: isRecording ? 'translateX(0)' : 'translateX(100px)',
        }}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-200 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <h2 className="text-xl font-semibold text-slate-800">Processed Output</h2>
            </div>
            <div ref={processedRef} className="flex-1 overflow-y-auto">
              {processedText.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-400 text-center">Processing will appear here...</p>
                </div>
              ) : (
                <p className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap">
                  {processedText}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
