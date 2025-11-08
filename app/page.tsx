'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, History, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote: "HearMeOut transformed how I capture ideas. The real-time transcription is incredibly accurate and the processing features save me hours of work.",
    author: "Adhyyan Kumar",
    role: "Front End Developer, HearMeOut"
  },
  {
    quote: "The dual processing types give me exactly what I need. Type A for quick notes, Type B for detailed analysis. It's like having an assistant.",
    author: "Ansh Mathur",
    role: "Back End Developer, HearMeOut"
  },
  {
    quote: "I use HearMeOut for all my meetings now. The transcription quality is exceptional and I never miss important details anymore.",
    author: "Diyan Chokshi",
    role: "Back End Developer, HearMeOut"
  },
  {
    quote: "As a researcher, accurate transcription is crucial. HearMeOut delivers consistently and the interface is beautifully intuitive.",
    author: "ChatGPT And Bolt",
    role: "The Goats Behind Everything, HearMeOut"
  }
];

export default function LandingPage() {
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        setIsTransitioning(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      setIsTransitioning(false);
    }, 300);
  };
  const prevTestimonial = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-900 flex">
      <div className="flex-1 flex flex-col justify-between p-12 lg:p-16">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-cyan-400">HearMeOut</h1>
          </div>

          <div className="max-w-xl">
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Turn your voice into reality
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Join thousands of professionals who are capturing their ideas in real-time with HearMeOut's intelligent transcription and processing.
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 relative overflow-hidden">
            <div className="text-cyan-400 mb-4 text-4xl">"</div>
            <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                {testimonials[currentTestimonial].quote}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{testimonials[currentTestimonial].author}</p>
                  <p className="text-cyan-400 text-sm">{testimonials[currentTestimonial].role}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prevTestimonial}
                    className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-300" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'w-8 bg-cyan-400' : 'w-1 bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-px bg-slate-800" />

      <div className="flex-1 flex flex-col items-center justify-center p-12 lg:p-16">
        <div className="max-w-md w-full">
          <h3 className="text-3xl font-bold text-white text-center mb-4">
            Start Your Journey
          </h3>
          <p className="text-slate-400 text-center mb-8">
            Begin capturing and processing your voice instantly
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

          <div className="mt-12 space-y-6">
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
                <h4 className="text-white font-semibold mb-1">Understand Your Doctor And Patient</h4>
                <p className="text-slate-400 text-sm">Choose between Doctor And Patient processing</p>
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
