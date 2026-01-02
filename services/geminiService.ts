
import { GoogleGenAI } from '@google/genai';
import { Message, Topic } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_PROMPT = `You are a world-class C++ Senior Architect and Tutor. 
Your goal is to help students master C++ from fundamentals to the latest standards (C++17, C++20, C++23, C++26).
- Provide concise, technically accurate explanations.
- Use C++ terminology correctly (RAII, Move Semantics, SFINAE, CRTP, etc.).
- When explaining code, emphasize best practices and modern alternatives.
- Be encouraging but rigorous.
- If a user provides code, review it for performance, safety (memory), and style.
- Support queries about design patterns in a C++ context.
- Keep responses in clean Markdown format.`;

export async function getTutorResponse(
  history: Message[],
  context: { topicTitle: string; code: string }
) {
  try {
    const model = 'gemini-3-pro-preview';
    
    const contextInfo = `[Current Context]\nTopic: ${context.topicTitle}\nUser's Current Code:\n\`\`\`cpp\n${context.code}\n\`\`\``;
    
    const messages = [
      { role: 'user', content: `${SYSTEM_PROMPT}\n\n${contextInfo}\n\nUser Question: ${history[history.length - 1].content}` }
    ];

    const response = await ai.models.generateContent({
      model: model,
      contents: { 
        parts: messages.map(m => ({ text: m.content }))
      },
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "I'm sorry, I couldn't process that request. Let's try another way!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a bit of trouble connecting to my knowledge base. Please try again in a moment.";
  }
}

export async function getTopicExplanation(topic: Topic) {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `Provide a comprehensive technical deep-dive for the C++ topic: "${topic.title}".
Difficulty Level: ${topic.difficulty}
Category: ${topic.category}
Standard: ${topic.standard || 'General C++'}

Please structure the explanation as follows:
1. **The "Why"**: Why does this feature exist and what problem does it solve?
2. **Deep Dive**: How does it work under the hood? (Mention compiler behavior, memory, or performance implications).
3. **Modern Best Practices**: How should this be used in ${topic.standard || 'modern C++'} projects?
4. **Common Pitfalls**: What do beginners and even advanced devs often get wrong?

**CRITICAL REQUIREMENT**: If the topic refers to a specific C++ standard feature (C++20, C++23, or C++26), you MUST include a "References & Further Reading" section at the end with direct, clickable Markdown links to:
- The relevant documentation page at **cppreference.com**.
- The official **ISO C++ proposal** document (e.g., P2530 for Hazard Pointers, P2996 for Reflection).

Use professional, encouraging language. Formatting should be clean Markdown with vibrant headings.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.3,
      }
    });

    return response.text || "Could not generate an explanation at this time.";
  } catch (error) {
    console.error("Gemini Explanation Error:", error);
    return "The knowledge base is temporarily unavailable. Try selecting the topic again or ask the AI Tutor directly.";
  }
}
