import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { ModelProvider } from './types';

export class AIProviderService {
  private static instance: AIProviderService;
  private providers: Map<ModelProvider, unknown> = new Map();

  private constructor() {
    this.initializeProviders();
  }

  public static getInstance(): AIProviderService {
    if (!AIProviderService.instance) {
      AIProviderService.instance = new AIProviderService();
    }
    return AIProviderService.instance;
  }

  private initializeProviders() {
    // Initialize OpenAI
    if (process.env.OPENAI_API_KEY) {
      this.providers.set(ModelProvider.OPENAI, openai);
    }

    // Initialize Google
    if (process.env.GOOGLE_API_KEY) {
      this.providers.set(ModelProvider.GOOGLE, google);
    }

    // Initialize Anthropic
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.set(ModelProvider.ANTHROPIC, anthropic);
    }

    // Initialize OpenRouter
    if (process.env.OPENROUTER_API_KEY) {
      this.providers.set(ModelProvider.OPENROUTER, createOpenRouter({
        apiKey: process.env.OPENROUTER_API_KEY,
      }));
    }
  }

  public getProvider(provider: ModelProvider): unknown {
    return this.providers.get(provider);
  }

  public isProviderAvailable(provider: ModelProvider): boolean {
    return this.providers.has(provider);
  }

  public getAvailableProviders(): ModelProvider[] {
    return Array.from(this.providers.keys());
  }

  public getModelConfig(provider: ModelProvider, model: string) {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new Error(`Provider ${provider} is not available`);
    }

    switch (provider) {
      case ModelProvider.OPENAI:
        return (providerInstance as typeof import('@ai-sdk/openai').openai).chat(model);
      case ModelProvider.GOOGLE:
        return (providerInstance as typeof import('@ai-sdk/google').google).chat(model);
      case ModelProvider.ANTHROPIC:
        return (providerInstance as typeof import('@ai-sdk/anthropic').anthropic).chat(model);
      case ModelProvider.OPENROUTER:
        return (providerInstance as ReturnType<typeof import('@openrouter/ai-sdk-provider').createOpenRouter>).chat(model);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}

export const aiProviderService = AIProviderService.getInstance();
