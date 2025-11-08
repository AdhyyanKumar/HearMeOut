'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

export default function HistoryPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId.trim()) {
      router.push(`/conversation?id=${sessionId.trim()}`);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-900 flex flex-col p-8">
      <div className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center h-full space-y-8">
        <Button
          onClick={() => router.push('/')}
          className="absolute top-8 left-8 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full shadow-lg border border-slate-700 w-12 h-12 p-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="text-center">
          <h1 className="text-5xl font-bold text-cyan-400 mb-4">
            View Conversation
          </h1>
          <p className="text-slate-400 text-lg">
            Enter a session ID to view conversation details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-8">
            <label htmlFor="sessionId" className="block text-sm font-medium text-slate-300 mb-2">
              Session ID
            </label>
            <Input
              id="sessionId"
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Enter session ID (e.g., 12345)"
              className="w-full text-lg h-12 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <Button
            type="submit"
            disabled={!sessionId.trim()}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg h-14 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View Conversation
          </Button>
        </form>
      </div>
    </div>
  );
}
