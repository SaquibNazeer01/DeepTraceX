
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
  const modelName = 'gemini-2.5-flash-lite';

  const systemInstruction = `
    You are a Master Forensic Image Analyst specializing in Synthetic Media Detection. 
    Your mission is to uncover even the most minute hints of AI generation using pixel-level forensics and semantic logic.

    Examine the image for these specific "micro-hints":
    1. ANATOMY & GEOMETRY: Look for asymmetric pupils, irregular teeth shapes, "floating" hair, merged fingers, or inconsistent ear anatomy.
    2. LIGHTING & OPTICS: Identify impossible shadows, lack of corneal reflections, multi-directional light sources without cause, or inconsistent depth-of-field blurring.
    3. TEXTURES & NOISE: Detect "over-smoothed" skin (plastic look), loss of natural pores, or irregular digital noise that deviates from standard camera sensor patterns.
    4. BOUNDARIES: Check for "halos" or weird anti-aliasing artifacts where the subject meets the background.
    5. COHERENCE: Spot jewelry merging into skin, clothing patterns that break logic, or nonsensical text in the background.

    JSON Requirements:
    - isAI: Boolean, true if synthetic/AI-generated.
    - confidenceScore: A number from 0 to 100 representing your certainty level.
    - verdict: A 2-3 word clinical forensic result (e.g., "Synthetic Engine Trace", "Organic Capture").
    - artifacts: List specific minute findings with exact 'type' and a technical 'description'.
    - detailedReasoning: A comprehensive, expert-level summary explaining the exact "minute hints" that led to the verdict.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{
        role: 'user',
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "Is this photo made by AI or is it real? Tell me in simple words."
          }
        ],
      }],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        // thinkingConfig removed as it's not supported by this model
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAI: { type: Type.BOOLEAN },
            confidenceScore: { type: Type.NUMBER },
            verdict: { type: Type.STRING },
            artifacts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING }
                },
                required: ["type", "description", "severity"]
              }
            },
            detailedReasoning: { type: Type.STRING }
          },
          required: ["isAI", "confidenceScore", "verdict", "artifacts", "detailedReasoning"]
        }
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error Details:", error);
    if (error instanceof Error) {
      console.error("Error Message:", error.message);
    }
    throw new Error("Failed to scan photo.");
  }
};
