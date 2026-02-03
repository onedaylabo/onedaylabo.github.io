
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const askGeminiAboutProjects = async (userPrompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: "あなたはクリエイティブ・ソフトウェア・スタジオ 'One Day Labo' のAIアシスタントです。ポートフォリオのプロジェクト、スタジオの理念（「日々革新し、優雅に構築する」）、サイトの操作方法について回答してください。プロフェッショナルで簡潔、かつ少し未来的なトーンの丁寧な日本語（です・ます調）で話してください。",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "ラボのネットワークとの接続に一時的な問題が発生しています。しばらくしてから再度お試しください。";
  }
};
