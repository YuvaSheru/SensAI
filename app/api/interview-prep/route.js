import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(req) {
  try {
    const { position, company, requirements } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `As an AI career coach, generate relevant interview questions for this job application:

Position: ${position}
Company: ${company}
Requirements: ${requirements}

Please provide 5-7 specific interview questions that:
1. Are tailored to this role and company
2. Cover both technical and behavioral aspects
3. Help assess the candidate's fit for the position
4. Are commonly asked in similar roles
5. Help evaluate the candidate's experience and skills

Format each question clearly and concisely.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Split the response into individual questions
    const questions = text
      .split('\n')
      .filter(line => line.trim().length > 0 && (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') || line.startsWith('5.') || line.startsWith('6.') || line.startsWith('7.')))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate interview questions' },
      { status: 500 }
    );
  }
} 