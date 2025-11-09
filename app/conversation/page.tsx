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
  words: any[];
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

        // Handle if API returns array
        const parsedResult = Array.isArray(result) && result.length > 0 ? result[0] : result || {};

        // 🧩 Safely normalize fields
        const safeValue = (val: any) =>
          val === null || val === undefined ? "" : String(val);

        let rawWords = parsedResult.WORDS ?? parsedResult.words ?? [];
        if (!Array.isArray(rawWords)) {
          if (typeof rawWords === "string" && rawWords.trim().length > 0) {
            try {
              rawWords = JSON.parse(rawWords);
            } catch {
              rawWords = rawWords.split(/[,;]+/).map((w: string) => w.trim());
            }
          } else {
            rawWords = [];
          }
        }

        // ✅ Construct safe normalized data object
        setData({
          conversationId,
          transcript: safeValue(parsedResult.CLASSIFIED || parsedResult.transcript),
          summary: safeValue(parsedResult.SUMMARY || parsedResult.summary),
          soap: safeValue(parsedResult.SOAP || parsedResult.soap),
          ehr: safeValue(parsedResult.EHR || parsedResult.ehr),
          words: Array.isArray(rawWords) ? rawWords.filter(Boolean) : [],
        });
      } catch (err) {
        console.error("Error loading conversation:", err);
        setError("Failed to load conversation");
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [conversationId]);

  if (loading) {
    return (
      <div className="h-screen overflow-hidden bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-screen overflow-hidden bg-slate-900 flex items-center justify-center">
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

  const renderMessage = (text: string) => {
    const parts = text.split(/(<[^>]+>)/g);

    return parts.map((part, index) => {
      if (part.match(/^<[^>]+>$/)) {
        const cleanText = part.slice(1, -1);
        return (
          <span key={index} className="relative font-semibold px-1 rounded" style={{
            backgroundColor: 'rgba(255, 255, 0, 0.15)',
            borderBottom: '2px solid rgba(255, 255, 0, 0.6)',}}>
            {cleanText}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => router.push('/history')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full shadow-lg border border-slate-700 w-12 h-12 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl font-bold text-cyan-400">Conversation Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              <h2 className="text-xl font-semibold text-white">Transcript</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {renderMessage(data.transcript || 'No transcript available')}
              </p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Summary</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {renderMessage(data.summary || 'No summary available')}
              </p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <h2 className="text-xl font-semibold text-white">SOAP Notes</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {renderMessage(data.soap || 'No SOAP notes available')}
              </p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-purple-400" />
              <h2 className="text-xl font-semibold text-white">EHR Notes</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {renderMessage(data.ehr || 'No EHR notes available')}
              </p>
            </div>
          </div>

          {/* <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <h2 className="text-xl font-semibold text-white">Key Words</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.words && data.words.length > 0 ? (
                data.words.map((word, index) => (
                  <span
                    key={index}
                    className="bg-slate-700 text-slate-200 px-4 py-2 rounded-full text-sm"
                  >
                    {typeof word === 'string' ? word : JSON.stringify(word)}
                  </span>
                ))
              ) : (
                <p className="text-slate-500">No key words available</p>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
