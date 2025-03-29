import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const questionBank = {
  technical: [
    "Explain how you would implement a binary search tree.",
    "How would you design a rate limiter?",
    "Explain the difference between REST and GraphQL.",
    "How would you optimize a slow database query?",
    "Explain how garbage collection works in JavaScript.",
  ],
  behavioral: [
    "Tell me about a challenging project you worked on.",
    "How do you handle tight deadlines?",
    "Describe a time when you had to work with a difficult team member.",
    "How do you stay updated with new technologies?",
    "Tell me about a time when you had to learn something quickly.",
  ],
  'system-design': [
    "How would you design a scalable chat application?",
    "Design a distributed cache system.",
    "How would you build a real-time analytics system?",
    "Design a content delivery network (CDN).",
    "How would you design a recommendation system?",
  ],
};

// Simulated feedback generator
const generateSimulatedFeedback = (answer, questionType) => {
  const feedback = {
    strengths: [
      "Clear and structured explanation",
      "Good technical understanding",
      "Provided practical examples"
    ],
    improvements: [
      "Could elaborate more on edge cases",
      "Consider adding time/space complexity analysis",
      "Include more real-world applications"
    ],
    analysis: `Your answer demonstrates good understanding of the core concepts. 
    You explained the main points clearly and provided some good examples. 
    To make your answer even stronger, consider discussing edge cases and performance implications. 
    Overall, this is a solid response that shows your technical knowledge.`
  };

  return feedback;
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'technical';
    const questionIndex = parseInt(searchParams.get('index') || '0');

    const questions = questionBank[type] || questionBank.technical;
    const question = questions[questionIndex % questions.length];

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Error fetching interview question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview question' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { answer, questionType } = await request.json();

    if (!answer || !questionType) {
      return NextResponse.json(
        { error: 'Missing required fields: answer and questionType' },
        { status: 400 }
      );
    }

    let feedback;
    try {
      // Initialize Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `As an expert interviewer, analyze this interview answer for a ${questionType} question:
      "${answer}"
      
      Provide feedback in the following format:
      1. List 2-3 key strengths in the answer
      2. List 2-3 specific areas for improvement
      3. Provide a detailed analysis of the answer's structure, clarity, and technical accuracy
      
      Format the response as a JSON object with the following structure:
      {
        "strengths": ["strength1", "strength2"],
        "improvements": ["improvement1", "improvement2"],
        "analysis": "detailed analysis text"
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      feedback = JSON.parse(text);
    } catch (geminiError) {
      console.warn('Gemini API error, using simulated feedback:', geminiError);
      // If Gemini fails, use simulated feedback
      feedback = generateSimulatedFeedback(answer, questionType);
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error processing interview feedback:', error);
    // If all else fails, return simulated feedback
    const feedback = generateSimulatedFeedback(answer, questionType);
    return NextResponse.json(feedback);
  }
} 