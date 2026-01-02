import { GoogleGenAI, Type } from "@google/genai";
import { AddItemResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractMetadata = async (url: string): Promise<AddItemResponse> => {
  try {
    const model = 'gemini-3-pro-preview';

    const response = await ai.models.generateContent({
      model: model,
      contents: `Analyze this URL and extract metadata: ${url}. 
      If the URL is a specific article, try to find the specific title and author.
      If you cannot access the live page, infer the metadata from the URL structure or your knowledge base.
      Provide a concise summary (approx 30-50 words) of what the page is about.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The title of the article or page" },
            author: { type: Type.STRING, description: "The author name, or 'Unknown' if not found" },
            siteName: { type: Type.STRING, description: "The name of the website (e.g., 'The Verge', 'Medium')" },
            summary: { type: Type.STRING, description: "A concise 30-50 word summary of the content" }
          },
          required: ["title", "author", "siteName", "summary"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as AddItemResponse;
  } catch (error) {
    console.error("Failed to extract metadata:", error);
    // Fallback if Gemini fails
    return {
      title: url,
      author: "Unknown",
      siteName: new URL(url).hostname,
      summary: "Could not retrieve metadata automatically."
    };
  }
};
