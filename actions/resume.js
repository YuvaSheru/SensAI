"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

// Initialize Gemini with safety checks
const initializeAI = () => {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error("Missing GOOGLE_AI_API_KEY environment variable");
    }
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    return {
      genAI,
      model: genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    };
  } catch (error) {
    console.error("Error initializing AI:", error);
    return { genAI: null, model: null };
  }
};

const { genAI, model } = initializeAI();

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

export async function improveWithAI({ current, type }) {
  let user;
  
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        industryInsight: true,
      },
    });

    if (!user) throw new Error("User not found");

    // Validate AI service initialization
    if (!genAI || !model) {
      // Fallback to basic content improvement
      if (type === "summary") {
        const improved = current.trim()
          .replace(/^I am/i, "")
          .replace(/^I'm/i, "")
          .replace(/^Im/i, "")
          .trim();
        return `Experienced ${user.industry || 'technology'} professional ${improved}`;
      }
      throw new Error("AI service not properly initialized");
    }

    let prompt;
    if (type === "summary") {
      prompt = `
        As an expert resume writer, improve the following professional summary for a ${user.industry || 'technology'} professional.
        Make it more impactful and aligned with industry standards.
        Current summary: "${current}"

        Requirements:
        1. Start with a strong opening statement about professional identity
        2. Highlight key achievements and expertise
        3. Include relevant technical skills and specializations
        4. Emphasize unique value proposition
        5. Keep it concise (2-4 sentences)
        6. Use industry-specific keywords
        7. Focus on quantifiable impacts where possible
        
        Format the response as a single paragraph without any additional text or explanations.
      `;
    } else {
      prompt = `
        As an expert resume writer, improve the following ${type} description for a ${user.industry || 'technology'} professional.
        Make it more impactful, quantifiable, and aligned with industry standards.
        Current content: "${current}"

        Requirements:
        1. Use action verbs
        2. Include metrics and results where possible
        3. Highlight relevant technical skills
        4. Keep it concise but detailed
        5. Focus on achievements over responsibilities
        6. Use industry-specific keywords
        
        Format the response as a single paragraph without any additional text or explanations.
      `;
    }

    console.log('Generating content with prompt:', prompt);

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    if (!result || !result.response) {
      console.error('No result from Gemini API');
      throw new Error('Failed to generate content');
    }

    const improvedContent = result.response.text().trim();
    if (!improvedContent) {
      console.error('Empty content from AI');
      throw new Error('Generated content is empty');
    }

    console.log('Successfully generated content');
    return improvedContent;

  } catch (error) {
    console.error("Error in improveWithAI:", {
      error: error.message,
      stack: error.stack,
      type: type,
      currentLength: current?.length
    });

    // Return a basic improvement if AI fails
    if (type === "summary" && user) {
      const improved = current.trim()
        .replace(/^I am/i, "")
        .replace(/^I'm/i, "")
        .replace(/^Im/i, "")
        .trim();
      return `Experienced ${user.industry || 'technology'} professional ${improved}`;
    }

    throw new Error(`Failed to improve content: ${error.message}`);
  }
}


// Im a final year be student in computer sicencs.Passionate about web developer and developed some projects on that and java
