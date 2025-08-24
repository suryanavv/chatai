import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { ModelProvider } from '@/lib/types';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { messages, provider, model, apiKeys }: { 
      messages: UIMessage[]; 
      provider: ModelProvider; 
      model: string;
      apiKeys: Record<ModelProvider, string>;
    } = body;

    if (!provider || !model) {
      return new Response('Missing provider or model', { status: 400 });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Invalid or missing messages', { status: 400 });
    }

    if (!apiKeys || !apiKeys[provider]) {
      return new Response(`API key required for ${provider}`, { status: 400 });
    }

    let modelConfig;

    try {
      switch (provider) {
        case ModelProvider.OPENAI:
          // Set the API key for OpenAI
          process.env.OPENAI_API_KEY = apiKeys[provider];
          modelConfig = openai(model);
          break;

        case ModelProvider.ANTHROPIC:
          // Set the API key for Anthropic
          process.env.ANTHROPIC_API_KEY = apiKeys[provider];
          modelConfig = anthropic(model);
          break;

        case ModelProvider.GOOGLE:
          // Set the API key for Google
          process.env.GOOGLE_GENERATIVE_AI_API_KEY = apiKeys[provider];
          modelConfig = google(model);
          break;

        case ModelProvider.OPENROUTER:
          const openrouterClient = createOpenRouter({
            apiKey: apiKeys[provider],
          });
          modelConfig = openrouterClient.chat(model);
          break;

        default:
          return new Response(`Provider ${provider} not yet implemented.`, { status: 400 });
      }
    } catch (error) {
      return new Response(`Failed to configure ${provider} client`, { status: 500 });
    }

    // Format messages manually to avoid conversion issues
    const formattedMessages = (messages as any[]).map(msg => ({
      role: msg.role,
      content: typeof msg.content === 'string' ? msg.content : 
               msg.parts?.[0]?.text || msg.parts?.[0] || '',
    }));

    // Use the latest AI SDK streamText function for proper streaming
    const result = streamText({
      model: modelConfig,
      messages: formattedMessages,
      system: `You are a helpful AI assistant. Provide clear, accurate, and helpful responses.`,
    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    return new Response('Internal server error', { status: 500 });
  }
}