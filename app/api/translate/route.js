import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  let text, targetLang;
  
  try {
    // Parse body once at the start
    const body = await request.json();
    text = body.text;
    targetLang = body.targetLang;

    // Use Gemini to translate to Romanized Hinglish
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Translate the following English text to natural Hinglish (Hindi written in English/Roman letters - the way Indians type on phones).

STRICT RULES:
1. Use ONLY English/Roman alphabet - NO Devanagari script
2. Write Hindi words phonetically in English letters (dil, pyaar, kya, hai, etc.)
3. Mix Hindi and English naturally - how people actually chat/text
4. Keep emotional words in Romanized Hindi (dil, dard, khushi, pyaar)
5. Keep modern/technical words in English
6. Make it sound conversational and natural
7. Use common Hinglish words like: aap, tumhara, apna, hai, ho, kya, kyu, achha, bura, dil, mann, pyaar, dost, etc.

EXAMPLES OF GOOD HINGLISH:
- "Aap apni feelings ko hide karte ho"
- "Tumhara dil bahut sensitive hai"
- "Aapko apne emotions ko express karna chahiye"
- "Yeh pattern aapki relationships mein dikhta hai"

Original English text:
${text}

Translate to Romanized Hinglish (Hindi words in English letters):`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text().trim();

    return NextResponse.json({
      success: true,
      translatedText: translatedText
    });

  } catch (error) {
    console.error('Translation error:', error);
    
    // Fallback: Return original text
    return NextResponse.json({
      success: true,
      translatedText: text || 'Translation failed. Please try again.'
    });
  }
}
