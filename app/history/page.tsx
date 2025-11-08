'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function HistoryPage() {
  const router = useRouter();

  const mockConversations = [
    {
      id: 1,
      title: 'Team Meeting Notes',
      date: '2025-11-08',
      time: '10:30 AM',
      preview: 'Discussed project timeline and deliverables...',
    },
    {
      id: 2,
      title: 'Product Brainstorm',
      date: '2025-11-07',
      time: '2:15 PM',
      preview: 'New feature ideas and user feedback review...',
    },
    {
      id: 3,
      title: 'Client Call',
      date: '2025-11-06',
      time: '11:00 AM',
      preview: 'Requirements gathering and scope discussion...',
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col p-8">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/')}
            className="bg-white hover:bg-slate-50 text-slate-700 rounded-full shadow-lg border border-slate-200 w-12 h-12 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Conversation History
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-6 h-[calc(100vh-180px)] overflow-y-auto">
          {mockConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-slate-500 text-lg">No conversations yet</p>
              <p className="text-slate-400 text-sm mt-2">Start recording to create your first conversation</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer"
                  onClick={() => alert('This will open the conversation details (backend integration pending)')}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-800 mb-2">
                        {conversation.title}
                      </h3>
                      <p className="text-slate-600 mb-3">{conversation.preview}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{conversation.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{conversation.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => router.push('/record')}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-full shadow-lg px-8 h-12"
          >
            New Recording
          </Button>
        </div>
      </div>
    </div>
  );
}
