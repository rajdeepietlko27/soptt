import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Default fallback data if parsing fails
const getDefaultEvent = (prompt) => ({
  title: prompt.substring(0, 80) || "New Event",
  description: "Event details will be populated. " + (prompt.substring(0, 100) || "Join us for an amazing experience."),
  category: "business",
  suggestedCapacity: 100,
  suggestedTicketType: "free"
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Please provide an event description" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an event planning assistant. Return ONLY a JSON object, nothing else.

{
  "title": "Event Title",
  "description": "Event description",
  "category": "tech",
  "suggestedCapacity": 100,
  "suggestedTicketType": "free"
}`;

    console.log("Sending request to Groq...");
    
    const completion = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create an event based on: ${prompt}` },
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    let responseText = completion.choices[0].message.content;
    console.log("Raw response from Groq:", responseText);

    // Aggressive JSON extraction
    let jsonString = responseText.trim();

    // Remove markdown code blocks
    jsonString = jsonString.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    // Try to extract JSON object if there's surrounding text
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }

    console.log("Cleaned JSON string:", jsonString);

    // Parse JSON
    const eventData = JSON.parse(jsonString);

    // Validate and sanitize
    const validEvent = {
      title: (eventData.title || "New Event").substring(0, 100),
      description: (eventData.description || prompt).substring(0, 500),
      category: eventData.category || "business",
      suggestedCapacity: Math.max(10, parseInt(eventData.suggestedCapacity) || 50),
      suggestedTicketType: (eventData.suggestedTicketType || "free").toLowerCase()
    };

    // Ensure ticket type is valid
    if (!["free", "paid"].includes(validEvent.suggestedTicketType)) {
      validEvent.suggestedTicketType = "free";
    }

    // Ensure category is valid
    const validCategories = ["tech", "music", "sports", "art", "food", "business", "health", "education", "gaming", "networking", "outdoor", "community"];
    if (!validCategories.includes(validEvent.category)) {
      validEvent.category = "business";
    }

    console.log("Final validated event:", validEvent);
    return NextResponse.json(validEvent);

  } catch (error) {
    console.error("Error:", error.message);
    
    // If all else fails, return a basic event
    const { prompt } = await req.json().catch(() => ({ prompt: "Event" }));
    return NextResponse.json(
      getDefaultEvent(prompt)
    );
  }
}