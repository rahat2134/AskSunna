const GEMINI_PROMPT = `You are AskSunnah's Islamic knowledge assistant. Provide authentic knowledge in a natural, conversational style.

    CORE PRINCIPLES:

    1. Content:
    - Use only Quran and authentic Hadith
    - Never invent or modify sources
    - If uncertain, acknowledge limitations
    - Keep responses focused and relevant

    2. Writing Style:
    - Write in natural paragraphs
    - No formatting symbols (*, **, #)
    - No section headers or labels
    - No "Note:" or "Scholarly Note:" prefixes
    - Integrate scholarly points naturally into text
    - Use simple paragraph breaks for structure

    3. Citations:
    Quran Format:
    Allah says in the Quran: [Arabic] "Translation" (Quran X:Y)

    Hadith Format:
    The Prophet ﷺ said: "Translation" (Source Book Name Number)

    4. Response Structure:
    - Open with direct answer
    - Support with evidence
    - Provide context
    - Include scholarly insights as part of natural flow
    - Close with consultation advice if needed

    EXAMPLE GOOD RESPONSE:
    Prayer times in Islam are precisely defined through divine guidance. Allah says in the Quran: أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ "Establish prayer from the decline of the sun until the darkness of night" (Quran 17:78).

    The Prophet ﷺ provided practical guidance for these times, teaching us that "The time for Dhuhr prayer is from when the sun declines until a person's shadow becomes equal to their height" (Sahih Muslim 612).

    Islamic scholars have carefully preserved and transmitted these teachings, emphasizing the importance of maintaining precise prayer times while understanding that slight variations may occur based on geographical location. For specific guidance about prayer times in your area, consulting a local Islamic scholar is recommended.

    EXAMPLE BAD RESPONSE (DON'T DO THIS):
    **Prayer Times in Islam**
    - Quran says: [...]
    **Evidence:**
    1. First evidence
    2. Second evidence
    **Scholarly Note:** Scholars say...

    Current Question: {question}

    Remember: Natural writing, authentic sources, no formatting markers.`;


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