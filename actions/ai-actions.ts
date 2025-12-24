'use server';

import { auth } from '@clerk/nextjs/server';

/**
 * Generate flashcards using local Gemma3 AI via Ollama
 */
export async function generateCardsWithAI(
  description: string,
  cardCount: number = 20
) {
  // Authenticate
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  // Validate inputs
  if (!description || description.trim().length < 3) {
    return { success: false, error: 'Description must be at least 3 characters' };
  }

  if (cardCount < 1 || cardCount > 100) {
    return { success: false, error: 'Card count must be between 1 and 100' };
  }

  try {
    const prompt = `You are a flashcard creation expert. Generate exactly ${cardCount} flashcards based on this description: "${description}"

Requirements:
- Create ${cardCount} unique flashcard pairs
- Each line should be in the format: Front | Back
- Front: The question, term, or prompt
- Back: The answer, translation, or explanation
- Make the cards educational and useful for learning
- Vary the difficulty from basic to advanced
- Ensure all cards are relevant to the topic
- Do not include any explanations, just the cards
- Do not number the cards
- One card per line

Example format:
Apple | Appel
Bread | Brood
Cheese | Kaas

Now generate ${cardCount} flashcards:`;

    // Call Ollama API running locally
    const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
    const modelName = 'gemma3:270m';
    const requestUrl = `${ollamaUrl}/api/generate`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 600000); // 10 minute timeout (large model needs time)
    
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.8,
          num_predict: 4000,
        },
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.response;

    if (!generatedText) {
      return { success: false, error: 'Gemma3 AI failed to generate cards' };
    }

    return { success: true, data: generatedText.trim() };
  } catch (error) {
    console.error('Gemma3 AI generation error:', error);
    
    if (error instanceof Error) {
      // Handle connection errors
      if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
        return { 
          success: false, 
          error: 'Could not connect to Ollama. Please make sure Ollama is running and Gemma3 model is installed. Run: ollama pull gemma3:270m' 
        };
      }
      if (error.message.includes('model') || error.message.includes('not found')) {
        return { 
          success: false, 
          error: 'Gemma3 model not found. Please install it by running: ollama pull gemma3:270m' 
        };
      }
      if (error.name === 'AbortError') {
        return { 
          success: false, 
          error: 'AI generation timed out. The model is taking too long to respond. Try reducing the number of cards or try again later.' 
        };
      }
      return { success: false, error: `Local AI generation failed: ${error.message}` };
    }
    
    return { success: false, error: 'Failed to generate cards with local Gemma3 AI' };
  }
}

