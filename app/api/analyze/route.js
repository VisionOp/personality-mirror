import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { userName, answers, questions, depthLevel } = await request.json();

    const formattedAnswers = questions.map((q) => ({
      question: q.question,
      category: q.category,
      answer: answers[q.id] || 'No answer provided'
    }));

    const depthInstructions = {
      light: 'Provide concise 2-3 paragraph analysis.',
      medium: 'Provide balanced 4-5 paragraph analysis.',
      deep: 'Provide comprehensive 6-8 paragraph analysis.',
      profound: 'Provide extensive 10+ paragraph analysis.'
    };

  const prompt = `You're writing an intimate, raw letter to ${userName}. Like a letter from their future self who's already figured it out. Or from someone who loves them enough to tell them the truth.

THEIR ANSWERS (read carefully):
${JSON.stringify(formattedAnswers, null, 2)}

Write naturally. Like you're sitting across from them at 2am, finally saying what needs to be said.

FLOW OF THE LETTER:

**Opening (warm but direct)**
Start with "Hey ${userName}," and immediately call out something specific from their answers. Show you actually read what they wrote.

**The Pattern You See**
Describe the pattern in their life. The thing they do over and over. Use their actual words as proof. Don't sugarcoat.

**The Truth They're Avoiding**
What are they running from? What don't they want to admit? Be specific. This should make them uncomfortable.

**Why They Built The Mask**
Explain with compassion WHY they hide. What happened? What are they protecting? Make them understand themselves.

**What It's Costing Them**
Real talk about what they're missing out on. Love? Connection? Joy? Peace? Use their answers to show the price.

**What You See In Them (That They Don't)**
The beautiful stuff they can't see. Their potential. Be specific to their answers.

**The Uncomfortable Truth About Change**
It won't be easy. It will be scary. They might lose people. But...

**The Three Things (This Week, Not Someday)**
Three concrete actions they can take in the next 7 days. Be specific. No vague "be yourself" bullshit.

**The Closing (Hope + Reality)**
End with hope but keep it real. They can change, but they have to choose it.

WRITING STYLE:
- Natural paragraphs, not sections
- Use "you" throughout (second person)
- Mix short punchy sentences with longer reflective ones
- Quote their actual answers back to them
- Be warm but brutally honest
- No corporate speak, no therapy-talk
- Write like a human who cares

LENGTH: ${depthInstructions[depthLevel]}

Make ${userName} feel seen, called out, and ready to change. Write the letter now.`;



    // FIXED: Use Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    return NextResponse.json({
      success: true,
      analysis: analysis
    });

  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze responses' },
      { status: 500 }
    );
  }
}
