'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: user info, 2: depth selection, 3: quiz
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedDepth, setSelectedDepth] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');

  const depthOptions = [
    {
      id: 'light',
      emoji: '🌅',
      title: 'Light Discovery',
      questions: 5,
      duration: '3-5 min',
      description: 'Quick insights into your surface-level personality',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'medium',
      emoji: '🌊',
      title: 'Medium Dive',
      questions: 10,
      duration: '7-10 min',
      description: 'Balanced exploration of your authentic self',
      color: 'from-purple-400 to-pink-400',
      recommended: true
    },
    {
      id: 'deep',
      emoji: '🌌',
      title: 'Deep Analysis',
      questions: 15,
      duration: '12-18 min',
      description: 'Comprehensive journey into your innermost thoughts',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'profound',
      emoji: '🔮',
      title: 'Profound Insight',
      questions: 20,
      duration: '20-30 min',
      description: 'Ultimate deep-dive for true self-discovery',
      color: 'from-violet-600 to-fuchsia-600'
    }
  ];

  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setStep(2);
    }
  };

  const handleDepthSelection = async (depth) => {
    setSelectedDepth(depth);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          questionCount: depth.questions,
          depthLevel: depth.id
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setQuestions(data.questions);
        setStep(3);
      } else {
        alert('Failed to generate questions. Please try again.');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (currentAnswer.trim().length < 10) {
      alert('Please write at least a few words to help us understand you better 💭');
      return;
    }

    const question = questions[currentQuestion];
    setAnswers({ ...answers, [question.id]: currentAnswer });
    setCurrentAnswer('');
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevQuestion = questions[currentQuestion - 1];
      setCurrentAnswer(answers[prevQuestion.id] || '');
    }
  };

  const handleSubmit = async () => {
    if (currentAnswer.trim().length < 10) {
      alert('Please answer the current question before submitting 💭');
      return;
    }

    const question = questions[currentQuestion];
    const finalAnswers = { ...answers, [question.id]: currentAnswer };
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userEmail,
          answers: finalAnswers,
          questions: questions,
          depthLevel: selectedDepth.id
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        const saveResponse = await fetch('/api/save-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName,
            userEmail,
            answers: finalAnswers,
            analysis: data.analysis,
            depthLevel: selectedDepth.id,
            questionCount: questions.length,
            timestamp: new Date().toISOString()
          }),
        });

        const saveData = await saveResponse.json();
        
        if (saveData.success) {
          router.push(`/results?id=${saveData.id}`);
        }
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 1: User Info
  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block p-6 bg-white rounded-full shadow-2xl mb-6 animate-float">
              <span className="text-6xl">🪞</span>
            </div>
            <h2 className="text-4xl font-bold mb-3 gradient-text">
              The Personality Mirror
            </h2>
            <p className="text-gray-600 text-lg">Your journey to self-discovery begins</p>
          </div>

          <form onSubmit={handleUserInfoSubmit} className="card space-y-6">
            <div>
              <label className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                <span className="text-xl">✨</span>
                What's your name?
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border-2 border-purple-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-lg font-medium"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                <span className="text-xl">💌</span>
                Email (optional)
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border-2 border-purple-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-lg"
                placeholder="your@email.com"
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span>🔒</span>
                Your responses are completely private
              </p>
            </div>

            <button type="submit" className="btn-primary w-full text-lg py-4 font-bold">
              Continue to Next Step →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // STEP 2: Depth Selection
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 gradient-text">
              How deeply do you want to know yourself, {userName}?
            </h2>
            <p className="text-gray-600 text-lg">
              Choose your journey depth — the more questions, the deeper the insights ✨
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {depthOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleDepthSelection(option)}
                disabled={isGenerating}
                className="card text-left relative overflow-hidden transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {option.recommended && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ⭐ RECOMMENDED
                  </div>
                )}
                
                <div className={`text-5xl mb-4 inline-block p-3 rounded-2xl bg-gradient-to-br ${option.color}`}>
                  {option.emoji}
                </div>
                
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{option.title}</h3>
                
                <div className="flex gap-3 mb-3 text-sm text-gray-600">
                  <span className="font-semibold">📝 {option.questions} questions</span>
                  <span className="font-semibold">⏱️ {option.duration}</span>
                </div>
                
                <p className="text-gray-600 mb-4">{option.description}</p>
                
                <div className="flex items-center gap-2 text-purple-600 font-semibold">
                  <span>Select this depth</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {isGenerating && (
            <div className="card text-center">
              <div className="inline-block p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 animate-spin">
                <span className="text-4xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold mb-2 gradient-text">Creating Your Personalized Questions...</h3>
              <p className="text-gray-600">AI is crafting questions specifically for you</p>
            </div>
          )}

          <div className="text-center mt-6">
            <button
              onClick={() => setStep(1)}
              disabled={isGenerating}
              className="text-purple-600 font-semibold hover:underline"
            >
              ← Back to name entry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: Quiz Questions
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canSubmit = currentAnswer.trim().length >= 10 && isLastQuestion;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 pb-20 px-4 pt-6">
      <div className="max-w-2xl mx-auto">
        {/* Enhanced Progress Bar */}
        <div className="mb-6 sticky top-4 z-10 glass-effect rounded-2xl p-5 shadow-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-purple-700 flex items-center gap-2">
              <span className="text-lg">{question.emoji || '💭'}</span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-bold text-purple-700">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 h-4 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Question Card */}
        <div className="card mb-6 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-4xl flex-shrink-0 p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
              {question.emoji || '💭'}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
              {question.question}
            </h2>
          </div>

          <div className="space-y-4">
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder={question.placeholder || "Share your thoughts..."}
              rows={6}
              className="w-full px-5 py-4 rounded-xl border-2 border-purple-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none text-base md:text-lg font-medium"
              autoFocus
            />
            
            <div className="flex items-center justify-between text-sm">
              <span className={`${currentAnswer.length >= 10 ? 'text-green-600 font-bold' : 'text-gray-400'} flex items-center gap-1`}>
                {currentAnswer.length >= 10 ? '✓ Perfect!' : `${Math.max(0, 10 - currentAnswer.length)} more characters`}
              </span>
              <span className="text-gray-400 font-medium">{currentAnswer.length} characters</span>
            </div>
          </div>

          {/* Enhanced Navigation */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-xl border-2 border-purple-300 hover:bg-purple-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all font-bold text-purple-700 flex-shrink-0 hover:shadow-lg"
            >
              ← Back
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !canSubmit}
                className="btn-primary flex-1 py-4 text-base md:text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Analyzing Your Soul...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>✨ Reveal My True Self</span>
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentAnswer.trim().length < 10}
                className="btn-primary flex-1 py-4 text-base md:text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Question →
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Encouragement */}
        <div className="text-center">
          <p className="text-sm text-gray-700 glass-effect rounded-full px-6 py-4 inline-block font-medium shadow-lg">
            {isLastQuestion ? 
              '🎉 Final question, ' + userName + '! Your insights await...' : 
              `💫 Take your time, ${userName}. Honesty unlocks deeper insights.`
            }
          </p>
        </div>
      </div>
    </div>
  );
}
