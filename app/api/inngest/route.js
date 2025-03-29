import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { generateIndustryInsights } from "@/lib/inngest/function";

// Create a simple GET handler to test if the route is accessible
export async function GET() {
  return new Response("Inngest endpoint is accessible", {
    status: 200,
  });
}

// Export the Inngest serve handler
const handler = serve({
  client: inngest,
  functions: [generateIndustryInsights],
  signingKey: process.env.INNGEST_SIGNING_KEY,
});

export const POST = handler.POST;
export const PUT = handler.PUT;
