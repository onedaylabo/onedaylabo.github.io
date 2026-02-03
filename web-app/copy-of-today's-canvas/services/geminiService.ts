
import { GoogleGenAI } from "@google/genai";
import { MoodType, StyleType } from "../types";

export const generateArtFromDay = async (
  text: string,
  mood: MoodType,
  style: StyleType
): Promise<{ imageUrl: string; prompt: string }> => {
  // Fix: Proper initialization using named parameter and direct env access
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Step 1: Create a single visual prompt that explicitly asks for a 4-panel layout
  const promptInterpreter = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
      Convert the following daily journal entry into a single high-quality visual prompt for an image generator.
      The output image MUST be a 4-panel grid (collage/quad-split) representing the progression of the day.
      
      User's Day: "${text}"
      Mood: ${mood}
      Art Style: ${style}
      
      Requirements for the prompt:
      1. Describe a grid of 4 distinct cinematic panels.
      2. Each panel shows a different scene or feeling from the day (e.g. dawn, peak, transition, quiet night).
      3. Maintain a consistent aesthetic and color palette across all panels.
      4. No text, no clear faces (silhouettes or artistic distance).
      5. Emphasize "high-end gallery art", "minimalist layout", and "cinematic textures".
      6. Output ONLY the English prompt.
    `,
  });

  // Fix: Access .text property directly as per guidelines
  const finalPrompt = promptInterpreter.text || "A 4-panel artistic collage representing a day, cinematic lighting, soft textures.";

  // Step 2: Generate the single 4-panel image
  const imageResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: finalPrompt }] },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  let imageUrl = "";
  for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!imageUrl) {
    throw new Error("画像の生成に失敗しました。");
  }

  return { imageUrl, prompt: finalPrompt };
};
