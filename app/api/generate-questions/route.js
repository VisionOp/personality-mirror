import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  let userName, questionCount, depthLevel;
  
  try {
    // Parse body once at the start
    const body = await request.json();
    userName = body.userName;
    questionCount = body.questionCount;
    depthLevel = body.depthLevel;

    const depthDescriptions = {
      light: 'surface-level, casual questions',
      medium: 'moderately deep questions exploring values',
      deep: 'deeply introspective questions',
      profound: 'profoundly philosophical questions'
    };

    const prompt = `Generate EXACTLY ${questionCount} personality questions for ${userName}.

Level: ${depthLevel} - ${depthDescriptions[depthLevel]}

Return ONLY valid JSON array:
[
  {
    "id": 1,
    "category": "self_perception",
    "question": "Question text",
    "placeholder": "Placeholder",
    "emoji": "💭"
  }
]

Categories: self_perception, authentic_desires, emotional_expression, social_mask, childhood_connection, stress_response, love_language, authentic_self, fear_vulnerability, hidden_needs, relationship_patterns, inner_child

Generate ${questionCount} questions in JSON:`;

    // FIXED: Use Gemini 2.5 Flash (October 2025 model)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean JSON
    text = text.replace(/``````\n?/g, '').trim();
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      text = text.substring(jsonStart, jsonEnd + 1);
      const questions = JSON.parse(text);
      
      if (Array.isArray(questions) && questions.length > 0) {
        return NextResponse.json({
          success: true,
          questions: questions
        });
      }
    }
    
    throw new Error('Failed to parse AI response');

  } catch (error) {
    console.error('Error generating questions:', error);
    
    // Fallback questions (using variables from outer scope)
    const fallbackQuestions = [
      {
        id: 1,
        category: "self_perception",
        question: `${userName}, when people first meet you, what impression do you think they get?`,
        placeholder: "Share your honest thoughts...",
        emoji: "💭"
      },
      {
        id: 2,
        category: "authentic_desires",
        question: "What gift would truly make your heart happy?",
        placeholder: "Describe what would make you feel loved...",
        emoji: "🎁"
      },
      {
        id: 3,
        category: "social_mask",
        question: "Complete this: 'People think I am _____, but actually I am _____'",
        placeholder: "Be completely honest...",
        emoji: "🎭"
      },
      {
        id: 4,
        category: "emotional_expression",
        question: "When you're hurt or sad, what do you really do?",
        placeholder: "How do you handle emotions?",
        emoji: "💔"
      },
      {
        id: 5,
        category: "childhood_connection",
        question: "What childhood comfort do you secretly still crave?",
        placeholder: "What do you miss?",
        emoji: "🧸"
      },
      {
        id: 6,
        category: "stress_response",
        question: "When life gets overwhelming, how do you cope?",
        placeholder: "Your honest coping mechanism...",
        emoji: "😰"
      },
      {
        id: 7,
        category: "love_language",
        question: "When did you feel truly loved and understood?",
        placeholder: "Share a memory...",
        emoji: "💖"
      },
      {
        id: 8,
        category: "authentic_self",
        question: "When you're alone, who are you really?",
        placeholder: "Your true self...",
        emoji: "🌟"
      },
      {
        id: 9,
        category: "fear_vulnerability",
        question: "What's your biggest fear about showing your real self?",
        placeholder: "What holds you back?",
        emoji: "😨"
      },
      {
        id: 10,
        category: "hidden_needs",
        question: "What do you need but find hard to ask for?",
        placeholder: "What support do you crave?",
        emoji: "🤗"
      },
      {
        id: 11,
        category: "relationship_patterns",
        question: "What pattern do you notice in your relationships?",
        placeholder: "How do they unfold?",
        emoji: "🔄"
      },
      {
        id: 12,
        category: "inner_child",
        question: "What does your younger self need to hear?",
        placeholder: "Message to your inner child...",
        emoji: "👶"
      },
      {
        id: 13,
        category: "life_purpose",
        question: "What makes you feel most alive?",
        placeholder: "When do you feel yourself?",
        emoji: "🌈"
      },
      {
        id: 14,
        category: "core_values",
        question: "What principle would you never compromise?",
        placeholder: "Your non-negotiable value...",
        emoji: "⚖️"
      },
      {
        id: 15,
        category: "vulnerability",
        question: "When did you last cry and why?",
        placeholder: "Be vulnerable...",
        emoji: "💧"
      },
      {
        id: 16,
        category: "self_worth",
        question: "What makes you worthy of love?",
        placeholder: "Why do you deserve love?",
        emoji: "💝"
      },
      {
        id: 17,
        category: "future_aspirations",
        question: "If you woke up as your ideal self, who would you be?",
        placeholder: "Your authentic ideal...",
        emoji: "✨"
      },
      {
        id: 18,
        category: "conflict_resolution",
        question: "How do you handle disagreements?",
        placeholder: "Your approach to conflict...",
        emoji: "⚡"
      },
      {
        id: 19,
        category: "success_definition",
        question: "What does success mean to you?",
        placeholder: "Beyond money or status...",
        emoji: "🏆"
      },
      {
        id: 20,
        category: "decision_making",
        question: "Do you trust your head or heart?",
        placeholder: "How do you decide?",
        emoji: "🧠"
      }
    ];

    const questionsToReturn = fallbackQuestions.slice(0, Math.min(questionCount || 10, fallbackQuestions.length));

    return NextResponse.json({
      success: true,
      questions: questionsToReturn
    });
  }
}
