'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { transcriptionService } from '@/lib/transcription-service';

function LoadingDots() {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '.';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <span>Starting Recording{dots}</span>;
}

export default function TranscriptDisplay() {
  const router = useRouter();
  const [transcript, setTranscript] = useState<string>('');
  const [processedText, setProcessedText] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [processType, setProcessType] = useState<'a' | 'b'>('a');
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

  const handleToggleRecording = async () => {
    if (isRecording) {
      setIsStopping(true);
      const result = await transcriptionService.stop();
      setIsStopping(false);
      setIsRecording(false);

      if (result) {
        sessionStorage.setItem('conversationResult', JSON.stringify(result));
        router.push(`/conversation?id=${result.conversationId}`);
      }
    } else {
      setTranscript('');
      setProcessedText('');
      setIsStarting(true);
      const success = await transcriptionService.start();
      setIsStarting(false);
      if (success) {
        setIsRecording(true);
      }
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
    <div className="h-screen overflow-hidden bg-slate-900 flex flex-col items-center p-8">
      <Button
        onClick={() => router.push('/')}
        className="absolute top-8 left-8 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full shadow-lg border border-slate-700 w-12 h-12 p-0 z-10"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <div className={`transition-all duration-700 ease-in-out flex flex-col items-center absolute left-1/2 -translate-x-1/2 ${isRecording ? 'top-8' : 'top-1/2 -translate-y-1/2'}`}>
        <h1 className={`transition-all duration-700 ease-in-out font-bold text-cyan-400 mb-6 ${
          isRecording ? 'text-5xl' : 'text-7xl'
        }`}>
          HearMeOut
        </h1>
        <Button
          onClick={handleToggleRecording}
          disabled={isStarting || isStopping}
          className={`transition-all duration-500 ease-in-out flex items-center gap-4 shadow-2xl hover:shadow-3xl ${
            isStarting || isStopping
              ? 'w-64 h-24 bg-slate-600 cursor-wait scale-110'
              : isRecording
              ? 'w-48 h-16 bg-red-500 hover:bg-red-600 animate-pulse'
              : 'w-64 h-24 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 scale-110 border border-cyan-500/50'
          } text-white font-semibold text-lg rounded-full disabled:opacity-100`}
        >
          <div className={`transition-all duration-300 ${isRecording && !isStopping ? 'w-5 h-5' : 'w-6 h-6'} rounded-full bg-white`} />
          {isStarting ? <LoadingDots /> : isStopping ? 'Processing...' : isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </div>

      <div className={`w-full max-w-7xl absolute bottom-8 left-1/2 -translate-x-1/2 grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 ${
        isRecording ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
      }`} style={{ height: 'calc(100vh - 280px)' }}>
        <div className="transform transition-all duration-700 ease-out h-full" style={{
          transform: isRecording ? 'translateX(0)' : 'translateX(-100px)',
        }}>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
              <h2 className="text-xl font-semibold text-white">Live Transcription</h2>
            </div>
            <div ref={transcriptRef} className="flex-1 overflow-y-auto">
              {transcript.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-500 text-center">Waiting for speech...</p>
                </div>
              ) : (
                <p className="text-slate-300 leading-relaxed text-base whitespace-pre-wrap">
                  {renderMessage(transcript)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="transform transition-all duration-700 ease-out delay-100 h-full" style={{
          transform: isRecording ? 'translateX(0)' : 'translateX(100px)',
        }}>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 h-full flex flex-col">
            <div className="flex border-b border-slate-700">
              <button
                onClick={() => setProcessType('a')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 transition-all duration-200 ${
                  processType === 'a'
                    ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                    : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${processType === 'a' ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                Type A
              </button>
              <button
                onClick={() => setProcessType('b')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 transition-all duration-200 ${
                  processType === 'b'
                    ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                    : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${processType === 'b' ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                Type B
              </button>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div ref={processedRef} className="flex-1 overflow-y-auto">
                {processedText.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-slate-500 text-center">
                      {processType === 'a' ? 'Type A processing will appear here...' : 'Type B processing will appear here...'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-xs text-slate-500 mb-2">Using Process Type {processType.toUpperCase()}</div>
                    <p className="text-slate-300 leading-relaxed text-base whitespace-pre-wrap">
                      {processedText}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
