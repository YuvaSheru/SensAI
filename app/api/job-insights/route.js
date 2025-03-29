import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(req) {
  try {
    const { company, position, requirements } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `As an AI career coach, analyze this job application and provide valuable insights:

Company: ${company}
Position: ${position}
Requirements: ${requirements}

Please provide:
1. Key skills and qualifications needed
2. Potential interview topics to prepare for
3. Company culture insights
4. Growth opportunities
5. Tips for standing out in the application

Format the response in a clear, concise way.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ insights: text });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
} 