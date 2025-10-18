import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, 'quiz-results'), {
      ...data,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      id: docRef.id
    });

  } catch (error) {
    console.error('Error saving to Firebase:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save results' },
      { status: 500 }
    );
  }
}
