import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const application = await request.json();

    const prompt = `Based on this job application, provide strategic recommendations:
    Position: ${application.position}
    Company: ${application.company}
    Current Status: ${application.status}
    Requirements: ${application.requirements}

    Please provide specific recommendations for:
    1. Next steps in the application process
    2. How to stand out as a candidate
    3. Skills to highlight or develop
    4. Preparation strategies for upcoming stages
    5. Potential questions to ask the employer

    Format the response as a list of actionable recommendations.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the recommendations into an array
    const recommendations = text
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
} 