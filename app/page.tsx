'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Stethoscope, Mic, History } from 'lucide-react';

// testimonials removed; replaced with promo button

export default function LandingPage() {
  const router = useRouter();
  // testimonial carousel removed
  const bars = useMemo(
    () =>
      Array.from({ length: 20 }).map(() => ({
        delay: Math.random() * 1.0, // 0s - 1s
        duration: 1.35 + Math.random(), // 0.9s - 1.8s
        height: 30 + Math.floor(Math.random() * 50), // 35% - 85%
      })),
    []
  );

  return (
    <div className="h-screen overflow-hidden bg-slate-900 flex">
      <div className="flex-1 flex flex-col justify-between p-12 lg:p-16">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-cyan-400">HearMeOut</h1>
          </div>

          <div className="max-w-xl">
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Turn your voice into clarity
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              HearMeOut transcribes, simplifies, and summarizes your consultations in real-time — so you can stay present with your patient, not your paperwork.
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          <button
            onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank', 'noopener,noreferrer')}
            className="group relative w-full h-56 lg:h-64 rounded-2xl border border-slate-700 overflow-hidden bg-slate-800/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow"
          >
            <div className="absolute inset-0 flex items-center justify-center gap-2 px-6">
              {bars.map((b, i) => (
                <span
                  key={i}
                  className="bar block w-[8px] bg-gradient-to-t from-cyan-500 to-blue-500/80 rounded-sm opacity-80"
                  style={{
                    height: `${b.height}%`,
                    animationDelay: `${b.delay}s`,
                    animationDuration: `${b.duration}s`,
                  }}
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-slate-900/70 group-hover:bg-slate-900/60 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center text-center px-8">
              <p className="text-slate-100 text-lg lg:text-xl font-medium">
                See how HearMeOut captures and organizes<br></br>doctor-patient conversations in real-time
              </p>
            </div>
            <style jsx>{`
              .bar {
                transform-origin: center;
                animation: wave ease-in-out infinite;
              }
              @keyframes wave {
                0% { transform: scaleY(0.3); }
                20% { transform: scaleY(0.9); }
                50% { transform: scaleY(1); }
                80% { transform: scaleY(0.6); }
                100% { transform: scaleY(0.3); }
              }
            `}</style>
          </button>
        </div>
      </div>

      <div className="w-px bg-slate-800" />

      <div className="flex-1 flex flex-col items-center justify-center p-12 lg:p-16">
        <div className="max-w-md w-full">
          <h3 className="text-3xl font-bold text-white text-center mb-2">
            Start A New Session
          </h3>
          <p className="text-slate-400 text-center mb-8">
            Begin capturing and processing<br></br>your consultations instantly
          </p>

          <div className="space-y-4">
            <Button
              onClick={() => router.push('/record')}
              className="w-full h-16 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 border border-cyan-500/50"
            >
              <Mic className="w-6 h-6" />
              Start Recording
            </Button>

            <Button
              onClick={() => router.push('/history')}
              className="w-full h-16 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 border border-slate-700"
            >
              <History className="w-6 h-6" />
              View History
            </Button>
          </div>

          <div className="mt-32 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Real-Time Transcription</h4>
                <p className="text-slate-400 text-sm">Instant, accurate transcription as you speak</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Dual-View for Doctor & Patient</h4>
                <p className="text-slate-400 text-sm">Clinical for doctors, simplified for patients</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Secure & Private</h4>
                <p className="text-slate-400 text-sm">Your conversations stay completely private</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
