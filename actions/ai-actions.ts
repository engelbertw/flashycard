'use server';

import { auth } from '@clerk/nextjs/server';
import { parseAndNormalizeFlashcards, removeDuplicateCards } from '@/lib/text-utils';

/**
 * Authenticate with Cptain API and get access token
 */
async function getCptainAuthToken(): Promise<{ 
  token: string | null; 
  error?: string; 
  authSucceeded?: boolean;
  authData?: any;
}> {
  const authUrl = process.env.CPTAIN_AUTH_URL;
  const apiKey = process.env.CPTAIN_API_KEY;

  console.log('[Cptain Auth] Starting authentication...');
  console.log('[Cptain Auth] Auth URL configured:', !!authUrl);
  console.log('[Cptain Auth] API Key configured:', !!apiKey);

  if (!authUrl || !apiKey) {
    const error = 'Cptain API credentials not configured in .env file';
    console.error('[Cptain Auth] Error:', error);
    return { token: null, error };
  }

  try {
    // Use the correct Cptain API auth endpoint: /v0/auth
    const authEndpoint = `${authUrl}/v0/auth`;
    
    console.log('[Cptain Auth] Auth URL:', authUrl);
    console.log('[Cptain Auth] Auth Endpoint:', authEndpoint);
    console.log('[Cptain Auth] API Key (first 10 chars):', apiKey.substring(0, 10) + '...');

    // Try different authentication payload formats
    const authPayloads = [
      { apiKey: apiKey },
      { api_key: apiKey },
      { key: apiKey },
      { token: apiKey },
    ];

    for (const payload of authPayloads) {
      try {
        console.log(`[Cptain Auth] Trying POST ${authEndpoint} with payload:`, Object.keys(payload));

        const response = await fetch(authEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        console.log(`[Cptain Auth] Response status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('[Cptain Auth] ✓ Response status 200 OK!');
          console.log('[Cptain Auth] Response data keys:', Object.keys(data));
          console.log('[Cptain Auth] Full response data:', JSON.stringify(data, null, 2));
          
          // Check for token in various fields
          const token = data.token || data.access_token || data.accessToken || data.bearer_token || data.jwt;
          
          if (token) {
            console.log('[Cptain Auth] ✓ Token found in response!');
            return { token };
          } else {
            // If no token but response is OK, maybe we need to use the API key directly
            // or the authentication works differently (session-based, etc.)
            console.log('[Cptain Auth] ⚠️  No token field found in response');
            console.log('[Cptain Auth] Response contains:', {
              realm: !!data.realm,
              username: !!data.username, 
              roles: !!data.roles,
              hasOtherFields: Object.keys(data).filter(k => !['realm', 'username', 'roles'].includes(k))
            });
            
            // Maybe the API uses the original API key for requests?
            // Return a special indicator that auth succeeded but we use API key
            return { token: null, authSucceeded: true, authData: data };
          }
        } else {
          const errorText = await response.text();
          console.log(`[Cptain Auth] Failed with status ${response.status}:`, errorText.substring(0, 200));
        }
      } catch (error) {
        console.log(`[Cptain Auth] Request error:`, error);
      }
    }

    // If all payloads failed
    const error = `Authentication failed on ${authEndpoint}. Check API key in .env file.`;
    console.error('[Cptain Auth]', error);
    return { token: null, error };

  } catch (error) {
    console.error('[Cptain Auth] Unexpected error:', error);
    return { 
      token: null, 
      error: error instanceof Error ? error.message : 'Unknown authentication error'
    };
  }
}

/**
 * Generate flashcards using Cptain AI API (cloud-based)
 */
export async function generateCardsWithCptainAI(
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
    console.log('[Cptain] Starting card generation...');
    
    // Call Cptain API
    const apiUrl = process.env.CPTAIN_API_URL;
    const apiKey = process.env.CPTAIN_API_KEY;
    
    if (!apiUrl) {
      return { success: false, error: 'Cptain API URL not configured in .env file' };
    }
    
    if (!apiKey) {
      return { success: false, error: 'Cptain API Key not configured in .env file' };
    }

    console.log('[Cptain] API URL:', apiUrl);
    console.log('[Cptain] API Key configured:', !!apiKey);
    console.log('[Cptain] Calling API with:', { description, cardCount });
    
    // Get authentication token from /v0/auth (REQUIRED for Cptain API)
    console.log('[Cptain] Attempting authentication via /v0/auth...');
    const authResult = await getCptainAuthToken();
    const authToken = authResult.token || null;
    
    if (authToken) {
      console.log('[Cptain] ✓ Authentication token obtained successfully!');
      console.log('[Cptain] Token (first 20 chars):', authToken.substring(0, 20) + '...');
    } else if (authResult.authSucceeded) {
      // Auth succeeded but no token - API might use API key directly
      console.log('[Cptain] ✓ Authentication succeeded (no token returned)');
      console.log('[Cptain] Auth response:', authResult.authData);
      console.log('[Cptain] Will use API key directly for requests');
    } else {
      console.log('[Cptain] ❌ Failed to authenticate:', authResult.error);
      return {
        success: false,
        error: `Authentication required but failed: ${authResult.error}. Check your API key in .env file.`,
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

    // Try different API endpoints based on Cptain API documentation
    const endpoints = [
      `${apiUrl}/v0/generate-flashcards`,
      `${apiUrl}/v0/flashcards`,
      `${apiUrl}/v0/generate`,
      `${apiUrl}/v0/cards`,
      `${apiUrl}/v0/ai/generate`,
      `${apiUrl}/v1/generate-flashcards`,
      `${apiUrl}/generate-flashcards`,
      `${apiUrl}/flashcards`,
    ];

    let data: any = null;
    let lastError: string = '';
    let successEndpoint: string = '';

    for (const endpoint of endpoints) {
      // Try multiple authentication methods for each endpoint
      const authMethods = [
        // Method 1: Bearer token from /v0/auth (if we got one)
        authToken ? {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          method: 'Bearer token from /v0/auth'
        } : null,
        // Method 2: Token without Bearer prefix (if we got one)
        authToken ? {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken,
          },
          method: 'Token without Bearer prefix'
        } : null,
        // Method 3: X-API-Key header with original key (LIKELY - since auth returns no token)
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
          method: 'X-API-Key header with original key'
        },
        // Method 4: Authorization: Bearer with original API key
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          method: 'Authorization: Bearer with original key'
        },
        // Method 5: Authorization: API key directly
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': apiKey,
          },
          method: 'Authorization with API key directly'
        },
      ].filter(Boolean);

      for (const authMethod of authMethods) {
        try {
          console.log(`[Cptain] Trying: ${endpoint} with ${authMethod!.method}`);
          
          // Try different request body formats that Cptain API might expect
          const requestBody: any = {
            description: description,
            prompt: description,
            topic: description,
            count: cardCount,
            cardCount: cardCount,
            num_cards: cardCount,
            format: 'flashcard',
            type: 'flashcard',
          };
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: authMethod!.headers,
            body: JSON.stringify(requestBody),
            signal: controller.signal,
          }).finally(() => clearTimeout(timeout));

          console.log(`[Cptain] Response status: ${response.status}`);

          if (response.ok) {
            data = await response.json();
            successEndpoint = endpoint;
            console.log('[Cptain] ✓ SUCCESS! Endpoint:', endpoint);
            console.log('[Cptain] ✓ Auth method:', authMethod!.method);
            console.log('[Cptain] Response keys:', Object.keys(data));
            console.log('[Cptain] Response sample:', JSON.stringify(data).substring(0, 500));
            break; // Success, exit auth methods loop
          } else {
            const errorText = await response.text();
            lastError = `${response.status} - ${errorText.substring(0, 200)}`;
            console.log(`[Cptain] Failed: ${lastError}`);
          }
        } catch (endpointError) {
          lastError = endpointError instanceof Error ? endpointError.message : 'Unknown error';
          console.log(`[Cptain] Error:`, lastError);
        }
      }
      
      if (data) break; // Success, exit endpoints loop
    }

    if (!data) {
      console.error('[Cptain] ❌ All attempts failed. Last error:', lastError);
      throw new Error(`Cptain API request failed on all endpoints and auth methods. Last error: ${lastError}. Check the console for detailed logs.`);
    }

    // Parse the API response - adapt based on actual response format
    let parsedCards: Array<{ front: string; back: string }> = [];

    // Try different response formats
    if (data.cards && Array.isArray(data.cards)) {
      // Format 1: Structured cards array
      parsedCards = data.cards
        .map((card: any) => ({
          front: (card.front || card.question || card.term || '').toString().trim(),
          back: (card.back || card.answer || card.definition || '').toString().trim(),
        }))
        .filter((card: any) => card.front && card.back);
    } else if (data.flashcards && Array.isArray(data.flashcards)) {
      // Format 2: flashcards array
      parsedCards = data.flashcards
        .map((card: any) => ({
          front: (card.front || card.question || card.term || '').toString().trim(),
          back: (card.back || card.answer || card.definition || '').toString().trim(),
        }))
        .filter((card: any) => card.front && card.back);
    } else if (data.text || data.response || data.content) {
      // Format 3: Text that needs parsing
      const generatedText = data.text || data.response || data.content;
      parsedCards = parseAndNormalizeFlashcards(generatedText);
    } else if (typeof data === 'string') {
      // Format 4: Direct text response
      parsedCards = parseAndNormalizeFlashcards(data);
    }

    if (parsedCards.length === 0) {
      console.error('Failed to parse Cptain API response:', data);
      return {
        success: false,
        error: 'No valid cards could be generated. The API response could not be parsed. Please check the console for details.',
        debug: JSON.stringify(data).substring(0, 500),
      };
    }

    // Remove duplicates
    const uniqueCards = removeDuplicateCards(parsedCards);

    // Limit to requested count
    const finalCards = uniqueCards.slice(0, cardCount);

    const percentageGenerated = (finalCards.length / cardCount) * 100;

    return {
      success: true,
      data: {
        rawText: JSON.stringify(data),
        cards: finalCards,
        count: finalCards.length,
        requestedCount: cardCount,
        warning: finalCards.length === cardCount
          ? `✓ Successfully generated exactly ${cardCount} cards with Cptain AI!`
          : finalCards.length < cardCount
          ? `Generated ${finalCards.length} out of ${cardCount} requested cards. ${
              percentageGenerated < 50
                ? 'Try generating with a more specific description or fewer cards.'
                : 'You can generate more if needed.'
            }`
          : `✓ Generated ${finalCards.length} cards!`,
      },
    };
  } catch (error) {
    console.error('Cptain AI generation error:', error);

    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
        return {
          success: false,
          error: 'Could not connect to Cptain API. Please check your internet connection and API URL configuration.',
        };
      }
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'API request timed out. Please try again with fewer cards or a simpler description.',
        };
      }
      return { success: false, error: `Cptain AI generation failed: ${error.message}` };
    }

    return { success: false, error: 'Failed to generate cards with Cptain AI' };
  }
}

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
    // Request 100% more cards (2x) to account for filtering/duplicates/meta-words
    const requestCount = Math.ceil(cardCount * 2.0);
    
    // Build examples based on keywords in description
    const descLower = description.toLowerCase();
    
    let exampleCards: string[];
    
    // Check for specific language/topic keywords
    if (descLower.includes('dutch')) {
      exampleCards = [
        'appel | apple',
        'kaas | cheese',
        'brood | bread',
        'melk | milk',
        'water | water',
        'huis | house',
        'auto | car',
        'boek | book',
        'tafel | table',
        'stoel | chair',
        'deur | door',
        'raam | window',
        'kat | cat',
        'hond | dog',
        'fiets | bicycle',
        'boom | tree',
        'bloem | flower',
        'kind | child',
        'man | man',
        'vrouw | woman',
        'dag | day',
        'nacht | night',
        'zon | sun',
        'maan | moon',
        'blauw | blue',
        'rood | red',
        'groen | green',
        'groot | big',
        'klein | small',
        'eten | food'
      ];
    } else if (descLower.includes('spanish')) {
      exampleCards = [
        'hola | hello',
        'gracias | thank you',
        'adiós | goodbye',
        'por favor | please',
        'sí | yes',
        'no | no',
        'buenos días | good morning',
        'buenas noches | good night',
        'agua | water',
        'comida | food'
      ];
    } else if (descLower.includes('french')) {
      exampleCards = [
        'bonjour | hello',
        'merci | thank you',
        'au revoir | goodbye',
        's\'il vous plaît | please',
        'oui | yes',
        'non | no',
        'bonne journée | good day',
        'bonsoir | good evening',
        'eau | water',
        'pain | bread'
      ];
    } else if (descLower.includes('german')) {
      exampleCards = [
        'hallo | hello',
        'danke | thank you',
        'auf wiedersehen | goodbye',
        'bitte | please',
        'ja | yes',
        'nein | no',
        'guten morgen | good morning',
        'gute nacht | good night',
        'wasser | water',
        'brot | bread'
      ];
    } else if (descLower.includes('capital') || descLower.includes('cities')) {
      exampleCards = [
        'paris | france',
        'london | united kingdom',
        'berlin | germany',
        'madrid | spain',
        'rome | italy',
        'amsterdam | netherlands',
        'brussels | belgium',
        'vienna | austria',
        'lisbon | portugal',
        'athens | greece'
      ];
    } else if (descLower.includes('math')) {
      exampleCards = [
        'addition | combining numbers',
        'subtraction | taking away',
        'multiplication | repeated addition',
        'division | splitting into parts',
        'fraction | part of a whole',
        'decimal | base ten number',
        'percentage | parts per hundred',
        'equation | mathematical statement',
        'variable | unknown value',
        'constant | fixed value'
      ];
    } else if (descLower.includes('science')) {
      exampleCards = [
        'atom | smallest unit of matter',
        'molecule | group of atoms',
        'cell | basic unit of life',
        'photosynthesis | plants making food',
        'gravity | force of attraction',
        'energy | ability to do work',
        'matter | anything with mass',
        'element | pure substance',
        'compound | combined elements',
        'reaction | chemical change'
      ];
    } else {
      // Default examples for translations
      exampleCards = [
        'apple | appel',
        'water | water',
        'bread | brood',
        'cheese | kaas',
        'milk | melk',
        'house | huis',
        'dog | hond',
        'cat | kat',
        'book | boek',
        'table | tafel'
      ];
    }
    
    // Detect if user wants translations
    const wantsTranslations = descLower.includes('translation') || descLower.includes('english');
    const isDutchToEnglish = descLower.includes('dutch') && descLower.includes('english');
    
    let prompt;
    
    if (isDutchToEnglish) {
      // Special prompt for Dutch to English translations - SIMPLE and example-focused
      prompt = `Study these Dutch-English flashcard examples:
${exampleCards.join('\n')}

Generate ${requestCount} more unique cards about: ${description}

Output ONLY the flashcards in format: dutch | english
NO explanations, NO intro text, NO numbering:`;
    } else if (wantsTranslations) {
      prompt = `Study these vocabulary flashcard examples:
${exampleCards.join('\n')}

Generate ${requestCount} more unique cards about: ${description}

Output ONLY the flashcards, NO intro text:`;
    } else {
      prompt = `Study these flashcard examples:
${exampleCards.join('\n')}

Generate ${requestCount} more unique cards about: ${description}

Output ONLY the flashcards, NO intro text:`;
    }


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
          temperature: 0.8, // Higher for more variety in responses
          num_predict: Math.max(12000, requestCount * 250), // Even higher token limit
          top_k: 60, // More options for diverse vocabulary
          top_p: 0.95, // High for diverse output
          repeat_penalty: 2.0, // MUCH higher to strongly prevent repetition
          frequency_penalty: 0.8, // Higher to avoid repeating same words
          presence_penalty: 0.6, // Higher to encourage new vocabulary
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

    console.log('AI Response (first 500 chars):', generatedText.substring(0, 500));

    // Parse and normalize the generated cards
    let parsedCards = parseAndNormalizeFlashcards(generatedText);
    
    console.log('Parsed cards count:', parsedCards.length);
    
    // If parsing failed completely, try a more lenient approach
    if (parsedCards.length === 0) {
      console.log('Standard parsing failed, trying lenient parsing...');
      
      const metaWords = ['woorden', 'woord', 'tekst', 'text', 'word', 'words', 'translation', 'vertaling', 'vertalingen'];
      
      // Try splitting by any common separators and being very lenient
      const lines = generatedText.split('\n');
      for (const line of lines) {
        const cleaned = line.trim().toLowerCase();
        if (!cleaned || cleaned.length < 5) continue;
        
        // Try to find ANY separator
        for (const sep of ['|', ':', '-', '=', '\t']) {
          if (cleaned.includes(sep)) {
            const idx = cleaned.indexOf(sep);
            let front = cleaned.substring(0, idx).trim().replace(/^\d+[\.)]\s*/, '');
            let back = cleaned.substring(idx + 1).trim();
            
            // Remove parenthetical parts like "(apple)" or "(word)"
            front = front.replace(/\s*\([^)]*\)/g, '').trim();
            back = back.replace(/\s*\([^)]*\)/g, '').trim();
            
            // Filter out meta-words
            const isMetaWord = metaWords.includes(front) || metaWords.includes(back);
            
            if (front && back && front.length > 0 && back.length > 0 && !isMetaWord && front !== back) {
              parsedCards.push({ front, back });
              break;
            }
          }
        }
      }
      
      console.log('Lenient parsing result:', parsedCards.length, 'cards');
    }
    
    if (parsedCards.length === 0) {
      // Log the raw response for debugging
      console.error('Failed to parse any cards from AI response');
      console.error('First 1000 chars of response:', generatedText.substring(0, 1000));
      
      return { 
        success: false, 
        error: `No valid cards could be generated. The AI response could not be parsed. Please try with a simpler, more specific description (e.g., "Dutch food words" or "Spanish greetings"). Expected format: "front | back".`,
        debug: generatedText.substring(0, 500)
      };
    }

    // Remove duplicates
    let uniqueCards = removeDuplicateCards(parsedCards);

    // If we have more cards than requested, take only the requested amount
    if (uniqueCards.length > cardCount) {
      uniqueCards = uniqueCards.slice(0, cardCount);
    }

    // Calculate how close we are to the target
    const percentageGenerated = (uniqueCards.length / cardCount) * 100;
    
    // If we generated less than 40% of requested cards, still return them but with error/warning
    if (percentageGenerated < 40) {
      // Still return the cards we did get, but as a "partial success"
      return {
        success: true, // Changed to true so cards are shown
        data: {
          rawText: generatedText.trim(),
          cards: uniqueCards,
          count: uniqueCards.length,
          requestedCount: cardCount,
          warning: `⚠️ Only generated ${uniqueCards.length} out of ${cardCount} requested cards.

💡 Suggestions to get more cards:
• Try ${Math.floor(cardCount / 2)} cards instead of ${cardCount}
• Be more specific: "20 dutch dishes with english names"
• Generate multiple smaller batches
• The Gemma3 270M model is small - larger models work better for big requests

You can still create the deck with these ${uniqueCards.length} cards, or try generating again.`,
        }
      };
    }

    // Generate appropriate warning/success message
    let warning: string | undefined;
    if (uniqueCards.length === cardCount) {
      warning = `✓ Successfully generated exactly ${cardCount} cards!`;
    } else if (uniqueCards.length < cardCount) {
      const difference = cardCount - uniqueCards.length;
      warning = `Generated ${uniqueCards.length} cards instead of ${cardCount} (${difference} duplicates or invalid cards were removed). You can generate more if needed.`;
    }

    return { 
      success: true, 
      data: {
        rawText: generatedText.trim(),
        cards: uniqueCards,
        count: uniqueCards.length,
        requestedCount: cardCount,
        warning,
      }
    };
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

