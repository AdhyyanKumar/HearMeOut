'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mic, History } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-5xl mx-auto w-full text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            HearMeOut
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-light">
            Your Voice, Instantly Understood
          </p>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          <p className="text-base md:text-lg text-slate-700 leading-relaxed px-4">
            Transform your spoken words into actionable insights. HearMeOut captures your voice in real-time,
            transcribes it instantly, and processes it intelligently.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Real-Time</h3>
              <p className="text-sm text-slate-600">Instant transcription</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Accurate</h3>
              <p className="text-sm text-slate-600">AI-powered processing</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Secure</h3>
              <p className="text-sm text-slate-600">Private conversations</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            onClick={() => router.push('/record')}
            className="w-64 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </Button>

          <Button
            onClick={() => router.push('/history')}
            className="w-64 h-14 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 border-2 border-slate-200"
          >
            <History className="w-5 h-5" />
            View History
          </Button>
        </div>

        <p className="text-sm text-slate-500 pt-4 px-4">
          Start speaking and watch your words come to life
        </p>
      </div>
    </div>
  );
}
