'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

function ResultsContent() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get('id');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('english');
  const [translatedAnalysis, setTranslatedAnalysis] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    async function fetchResult() {
      if (!resultId) return;
      
      try {
        const docRef = doc(db, 'quiz-results', resultId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setResult(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching result:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [resultId]);

  const translateToHinglish = async () => {
    if (!result) return;
    setIsTranslating(true);
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: result.analysis, targetLang: 'hi' })
      });

      const data = await response.json();
      if (data.success) {
        setTranslatedAnalysis(data.translatedText);
        setLanguage('hinglish');
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fef6e4] p-4">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">✉️</div>
          <h2 className="text-2xl font-serif mb-2 text-[#5f4339]">Someone is writing to you...</h2>
          <p className="text-[#8b7355]">Choosing the right words</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#fef6e4]">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
          <span className="text-6xl mb-4 block">📭</span>
          <h2 className="text-2xl font-serif mb-4 text-[#5f4339]">Letter Lost</h2>
          <p className="text-[#8b7355]">The envelope seems to be empty.</p>
        </div>
      </div>
    );
  }

  const analysisText = language === 'english' ? result.analysis : translatedAnalysis;

  return (
    <div className="min-h-screen bg-[#fef6e4] p-3 md:p-6">
      <div className="max-w-2xl mx-auto py-4">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">✉️</div>
          <p className="text-sm text-[#8b7355] mb-1">Someone wrote you a letter</p>
          <h1 className="text-2xl font-serif text-[#5f4339]">{result.userName}</h1>
        </div>

        {/* Language Switch */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-white/60 rounded-full p-0.5 gap-0.5 shadow-md">
            <button
              onClick={() => setLanguage('english')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                language === 'english' 
                  ? 'bg-[#d4a574] text-white' 
                  : 'text-[#8b7355]'
              }`}
            >
              English
            </button>
            <button
              onClick={translatedAnalysis ? () => setLanguage('hinglish') : translateToHinglish}
              disabled={isTranslating}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                language === 'hinglish' 
                  ? 'bg-[#d4a574] text-white' 
                  : 'text-[#8b7355] disabled:opacity-50'
              }`}
            >
              {isTranslating ? '⏳' : 'Hinglish'}
            </button>
          </div>
        </div>

        {/* The Letter - Natural Paper Feel */}
        <div className="bg-white rounded-sm shadow-2xl p-6 md:p-10 relative overflow-hidden border border-[#d4a574]/30"
             style={{
               backgroundImage: `
                 linear-gradient(90deg, transparent 0%, transparent calc(100% - 1px), rgba(212, 165, 116, 0.1) calc(100% - 1px)),
                 repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(212, 165, 116, 0.15) 27px, rgba(212, 165, 116, 0.15) 28px)
               `,
               backgroundSize: '100% 28px',
               lineHeight: '28px'
             }}>
          
          {/* Coffee Stain */}
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#d4a574]/10 blur-sm"></div>
          
          {/* Letter Content */}
          <div className="relative z-10">
            {/* Opening */}
            <div className="mb-8">
              <p className="text-xl md:text-2xl font-serif text-[#5f4339] mb-1">
                Hey {result.userName},
              </p>
              <p className="text-sm text-[#8b7355] italic">This might be hard to read. But you need to hear it.</p>
            </div>

            {/* Letter Body - Natural Flow */}
            <div className="space-y-6 text-[#5f4339] leading-[28px] text-[15px] md:text-[16px]">
              {analysisText && analysisText.split('\n\n').map((paragraph, idx) => {
                const cleanText = paragraph
                  .replace(/##\s*/g, '')
                  .replace(/\*\*/g, '')
                  .trim();
                
                if (!cleanText) return null;

                const isEmphatic = cleanText.length < 80 && (
                  cleanText.includes('truth is') || 
                  cleanText.includes('reality is') ||
                  cleanText.includes('here\'s what')
                );

                if (isEmphatic) {
                  return (
                    <div key={idx} className="my-8 py-4 border-l-4 border-[#d4a574] pl-4 bg-[#fef6e4]/50">
                      <p className="font-medium text-[#5f4339] text-base md:text-lg italic">
                        {cleanText}
                      </p>
                    </div>
                  );
                }

                return (
                  <p key={idx} className="font-serif text-justify" style={{ textIndent: '2em' }}>
                    {cleanText}
                  </p>
                );
              })}
            </div>

            {/* Closing */}
            <div className="mt-12 pt-6 border-t border-[#d4a574]/30">
              <p className="text-base font-serif text-[#8b7355] mb-6">
                I wrote this because I see you. The real you. Not the version you show everyone else.
              </p>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-lg font-serif italic text-[#5f4339]">Yours in truth,</p>
                  <p className="text-2xl font-serif font-bold text-[#d4a574] mt-2">— The Mirror</p>
                </div>
                <div className="text-right text-xs text-[#8b7355]">
                  <p>{new Date(result.timestamp).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</p>
                </div>
              </div>
            </div>

            {/* P.S. */}
            <div className="mt-8 pt-4 border-t border-dashed border-[#d4a574]/40">
              <p className="text-sm text-[#8b7355] italic font-serif">
                P.S. — Save this. You'll want to read it again when you forget.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(`Hey ${result.userName},\n\n${analysisText}\n\nYours in truth,\n— The Mirror`);
              alert('✓ Letter copied to clipboard');
            }}
            className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium text-[#5f4339] border border-[#d4a574]/30"
          >
            📋 Copy
          </button>
          
          <button 
            onClick={() => {
              const blob = new Blob([`Hey ${result.userName},\n\n${analysisText}\n\nYours in truth,\n— The Mirror`], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Letter_for_${result.userName}.txt`;
              a.click();
            }}
            className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium text-[#5f4339] border border-[#d4a574]/30"
          >
            💾 Save
          </button>
          
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium text-[#5f4339] border border-[#d4a574]/30"
          >
            🖨️ Print
          </button>
        </div>

        {/* Reflection Prompt */}
        <div className="mt-8 bg-white/60 backdrop-blur rounded-lg p-5 border border-[#d4a574]/30">
          <h3 className="text-base font-serif font-bold mb-3 text-[#5f4339]">Before you go...</h3>
          <div className="space-y-2 text-sm text-[#5f4339]">
            <p>→ What line hit you hardest? Why?</p>
            <p>→ Who needs to hear your truth this week?</p>
            <p>→ What mask are you ready to drop?</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-block px-6 py-3 bg-[#d4a574] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Help Someone Else See Themselves
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fef6e4]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">✉️</div>
          <p className="text-[#8b7355]">Loading your letter...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
