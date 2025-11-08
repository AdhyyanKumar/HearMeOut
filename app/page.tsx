'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mic, History } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            HearMeOut
          </h1>
          <p className="text-2xl text-slate-600 font-light">
            Your Voice, Instantly Understood
          </p>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
          <p className="text-lg text-slate-700 leading-relaxed">
            Transform your spoken words into actionable insights. HearMeOut captures your voice in real-time,
            transcribes it instantly, and processes it intelligently to help you communicate more effectively.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Real-Time</h3>
              <p className="text-sm text-slate-600">Instant transcription as you speak</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Accurate</h3>
              <p className="text-sm text-slate-600">Powered by advanced AI processing</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Secure</h3>
              <p className="text-sm text-slate-600">Your conversations stay private</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          <Button
            onClick={() => router.push('/record')}
            className="w-72 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3"
          >
            <Mic className="w-6 h-6" />
            Start Recording
          </Button>

          <Button
            onClick={() => router.push('/history')}
            className="w-72 h-16 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 border-2 border-slate-200"
          >
            <History className="w-6 h-6" />
            View History
          </Button>
        </div>

        <p className="text-sm text-slate-500 pt-8">
          Start speaking and watch your words come to life in real-time
        </p>
      </div>
    </div>
  );
}
