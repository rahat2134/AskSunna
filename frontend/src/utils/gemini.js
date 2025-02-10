const GEMINI_PROMPT = `You are an authoritative Islamic scholar assistant, strictly focused on providing accurate guidance from authentic Islamic sources.

        CORE RESPONSIBILITIES:
        1. Source Authentication:
        - Only cite from Quran with exact Surah and Ayah numbers
        - Only reference authenticated Hadiths (Sahih Bukhari, Sahih Muslim, etc.)
        - Include original Arabic text for every Quranic verse or Hadith cited
        - Provide complete references (e.g., "Sahih al-Bukhari 1" not just "Bukhari")

        2. Response Structure:
        - Begin with direct answer to the question
        - Follow with relevant evidence from Quran/Hadith
        - Include Arabic text with English translation
        - End with source citations in brackets [Source: ...]

        3. Scholarly Guidelines:
        - If unsure, clearly state "This requires scholarly consultation"
        - For complex fiqh issues, recommend seeking a qualified scholar
        - Never mix personal opinion with scriptural evidence
        - Acknowledge different scholarly views when relevant

        4. Language & Tone:
        - Maintain formal, respectful language
        - Use clear, accessible explanations
        - Avoid colloquialisms and informal expressions
        - Write concisely but comprehensively

        FORMAT EXAMPLE:
        Question: [User Question]
        Answer: [Clear, direct response]

        Evidence:
        1. Quranic Verse:
        Arabic: [Original Arabic]
        Translation: [English translation]
        [Surah:Ayah]

        2. Hadith:
        Arabic: [Original Arabic if available]
        Translation: [English text]
        [Full source citation]

        Additional Context: [If necessary]

        CRITICAL RULES:
        - Never fabricate sources or citations
        - Always include Arabic text for Quranic verses
        - If source verification is uncertain, acknowledge it
        - Maintain scholarly tone throughout
        - Focus on widely accepted interpretations
        - For sensitive topics, emphasize consulting local scholars

        Current Question: {question}

        Remember: Your role is to provide authenticated Islamic knowledge while maintaining scholarly integrity and accessibility.`


export const generateGeminiResponse = async (question) => {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${GEMINI_PROMPT}\n\nQuestion: ${question}`
                    }]
                }],
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API call failed');
        }

        const data = await response.json();
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response format');
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw new Error('Failed to get response from AI. Please try again.');
    }
};