'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ConversationData {
  conversationId: string;
  transcript: string;
  summary: string;
  soap: string;
  ehr: string;
}

const GET_CONVERSATION_WEBHOOK = "https://hear-me-out.app.n8n.cloud/webhook/e867834e-49e6-4919-8370-6bf8adfe78cb";

export default function ConversationDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('id');

  const [data, setData] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setError('No conversation ID provided');
      setLoading(false);
      return;
    }

    const loadConversation = async () => {
      const stored = sessionStorage.getItem("conversationResult");

      if (stored) {
        const parsedData = JSON.parse(stored);
        if (parsedData.conversationId === conversationId) {
          setData(parsedData);
          setLoading(false);
          sessionStorage.removeItem("conversationResult");
          return;
        }
      }

      try {
        const response = await fetch(GET_CONVERSATION_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversation_id: conversationId }),
        });

        if (!response.ok) throw new Error("Failed to fetch conversation");

        const result = await response.json();
        const parsedResult = Array.isArray(result) && result.length > 0 ? result[0] : result || {};

        const normalizedData = {
          conversationId,
          transcript: String(parsedResult.CLASSIFIED || parsedResult.transcript || ''),
          summary: String(parsedResult.SUMMARY || parsedResult.summary || ''),
          soap: String(parsedResult.SOAP || parsedResult.soap || ''),
          ehr: String(parsedResult.EHR || parsedResult.ehr || ''),
        };

        setData(normalizedData);
      } catch (err) {
        console.error("Error loading conversation:", err);
        setError("Failed to load conversation");
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [conversationId]);

  const formatText = (text: string) => {
    if (!text) return null;

    const lines = text.split('\n');

    return lines.map((line, i) => {
      if (line.match(/^\*\*[^*]+\*\*$/)) {
        const cleanText = line.replace(/\*\*/g, '');
        return (
          <div key={i} className="font-bold text-cyan-300 mt-4 mb-2 text-lg">
            {cleanText}
          </div>
        );
      }

      if (line.includes('<') && line.includes('>')) {
        const parts = line.split(/(<[^>]+>)/g);
        return (
          <div key={i} className="mb-2">
            {parts.map((part, j) => {
              if (part.match(/^<[^>]+>$/)) {
                const cleanText = part.slice(1, -1);
                return (
                  <span key={j} className="font-semibold px-1 bg-yellow-500/20 border-b-2 border-yellow-500/60">
                    {cleanText}
                  </span>
                );
              }
              return <span key={j}>{part}</span>;
            })}
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }

      return <div key={i} className="mb-1">{line}</div>;
    });
  };

  if (loading) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || 'Conversation not found'}</p>
          <Button
            onClick={() => router.push('/history')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Back to History
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/history')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full w-12 h-12 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-cyan-400">Conversation Details</h1>
        </div>
        <Button
          onClick={() => console.log('Export EHR:', data.ehr)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 text-lg rounded-full"
        >
          Export EHR
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <h2 className="text-xl font-semibold text-white">Transcript</h2>
          </div>
          <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-700/40 max-h-[600px] overflow-y-auto">
            <div className="text-slate-300 leading-relaxed">
              {formatText(data.transcript) || <p className="text-slate-500">No transcript available</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Summary</h2>
            </div>
            <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-700/40 max-h-[250px] overflow-y-auto">
              <div className="text-slate-300 leading-relaxed">
                {formatText(data.summary) || <p className="text-slate-500">No summary available</p>}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <h2 className="text-xl font-semibold text-white">SOAP Notes</h2>
            </div>
            <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-700/40 max-h-[320px] overflow-y-auto">
              <div className="text-slate-300 leading-relaxed">
                {formatText(data.soap) || <p className="text-slate-500">No SOAP notes available</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
