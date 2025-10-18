'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Compact Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      {/* Compact Mobile Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-5 py-10">
        
        {/* Compact Badge */}
        <div className="mb-4 px-3 py-1.5 rounded-full glass-effect border border-white/20 text-white/90 text-xs font-medium inline-flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          AI-Powered • Free
        </div>

        {/* Compact Emoji */}
        <div className="text-6xl mb-5 animate-float">
          🪞
        </div>

        {/* Compact Hero Text */}
        <h1 className="text-4xl font-black text-center mb-3 leading-tight">
          <span className="block text-white mb-1">Discover</span>
          <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Your True Self
          </span>
        </h1>

        <p className="text-base text-white/70 text-center mb-6 max-w-xs leading-snug px-4">
          We all wear masks. Let AI reveal who you really are.
        </p>

        {/* Compact CTA */}
        <Link href="/quiz" className="w-full max-w-sm px-5 mb-6">
          <button className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg text-white shadow-xl shadow-purple-500/40 active:scale-95 transition-transform">
            <span className="flex items-center justify-center gap-2">
              Start Your Journey
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </Link>

        {/* Compact Feature Pills */}
        <div className="w-full max-w-sm space-y-3 mb-8 px-5">
          {/* Feature 1 */}
          <div className="glass-card p-3.5 rounded-xl border border-white/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl flex-shrink-0">
              💭
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-0.5">AI Questions</h3>
              <p className="text-white/50 text-xs">5-20 personalized questions</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-3.5 rounded-xl border border-white/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-xl flex-shrink-0">
              🤖
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-0.5">Deep Analysis</h3>
              <p className="text-white/50 text-xs">AI reveals hidden patterns</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-3.5 rounded-xl border border-white/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl flex-shrink-0">
              ✨
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-0.5">True Self</h3>
              <p className="text-white/50 text-xs">See beyond your mask</p>
            </div>
          </div>
        </div>

        {/* Compact Stats */}
        <div className="flex items-center justify-center gap-5 text-center mb-6">
          <div>
            <div className="text-xl font-black text-white">5-20</div>
            <div className="text-white/50 text-xs">Questions</div>
          </div>
          <div className="w-px h-6 bg-white/20"></div>
          <div>
            <div className="text-xl font-black text-white">~10min</div>
            <div className="text-white/50 text-xs">Time</div>
          </div>
          <div className="w-px h-6 bg-white/20"></div>
          <div>
            <div className="text-xl font-black text-white">100%</div>
            <div className="text-white/50 text-xs">Private</div>
          </div>
        </div>

        {/* Compact Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-2.5 text-white/40 text-xs">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Private
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Instant
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            No Signup
          </div>
        </div>
      </div>
    </div>
  );
}
