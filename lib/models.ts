import { ModelConfig, ModelProvider } from './types';

export const AI_MODELS: Record<ModelProvider, ModelConfig[]> = {
  [ModelProvider.OPENAI]: [
    {
      provider: ModelProvider.OPENAI,
      model: 'gpt-4o',
      name: 'GPT-4o',
      description: 'Latest GPT-4 model with improved reasoning and coding capabilities',
      isFree: false,
    },
    {
      provider: ModelProvider.OPENAI,
      model: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      description: 'Faster and more cost-effective GPT-4 model',
      isFree: false,
    },
    {
      provider: ModelProvider.OPENAI,
      model: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      description: 'Latest GPT-4 Turbo model with improved performance',
      isFree: false,
    },
    {
      provider: ModelProvider.OPENAI,
      model: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Fast and efficient model for most tasks',
      isFree: false,
    },
  ],
  [ModelProvider.GOOGLE]: [
    {
      provider: ModelProvider.GOOGLE,
      model: 'gemini-2.0-flash-exp',
      name: 'Gemini 2.0 Flash',
      description: 'Fast and efficient Gemini model',
      isFree: false,
    },
    {
      provider: ModelProvider.GOOGLE,
      model: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      description: 'Latest Gemini 2.5 Flash model',
      isFree: false,
    },
    {
      provider: ModelProvider.GOOGLE,
      model: 'gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      description: 'Latest Gemini 2.5 Pro model',
      isFree: false,
    },
    {
      provider: ModelProvider.GOOGLE,
      model: 'gemini-1.5-flash',
      name: 'Gemini 1.5 Flash',
      description: 'Balanced performance and speed',
      isFree: false,
    },
    {
      provider: ModelProvider.GOOGLE,
      model: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro',
      description: 'Advanced reasoning and analysis',
      isFree: false,
    },
  ],
  [ModelProvider.ANTHROPIC]: [
    {
      provider: ModelProvider.ANTHROPIC,
      model: 'claude-3-5-sonnet-20241022',
      name: 'Claude 3.5 Sonnet',
      description: 'Latest Claude model with improved reasoning and Computer Use capabilities',
      isFree: false,
    },
    {
      provider: ModelProvider.ANTHROPIC,
      model: 'claude-3-5-haiku-20241022',
      name: 'Claude 3.5 Haiku',
      description: 'Fast and efficient Claude model',
      isFree: false,
    },
    {
      provider: ModelProvider.ANTHROPIC,
      model: 'claude-3-opus-20240229',
      name: 'Claude 3 Opus',
      description: 'Most capable Claude model',
      isFree: false,
    },
    {
      provider: ModelProvider.ANTHROPIC,
      model: 'claude-3-sonnet-20240229',
      name: 'Claude 3 Sonnet',
      description: 'Balanced Claude 3 model',
      isFree: false,
    },
  ],
  [ModelProvider.OPENROUTER]: [
    {
      provider: ModelProvider.OPENROUTER,
      model: 'openai/gpt-oss-20b:free',
      name: 'GPT-OSS 20B (Free)',
      description: 'Open source GPT model',
      isFree: true,
    },
    {
      provider: ModelProvider.OPENROUTER,
      model: 'z-ai/glm-4.5-air:free',
      name: 'GLM-4.5 Air (Free)',
      description: 'Chinese language model',
      isFree: true,
    },
    {
      provider: ModelProvider.OPENROUTER,
      model: 'meta-llama/llama-3.3-70b-instruct:free',
      name: 'Llama 3.3 70B (Free)',
      description: 'Meta\'s latest Llama model',
      isFree: true,
    },
    {
      provider: ModelProvider.OPENROUTER,
      model: 'qwen/qwen3-coder:free',
      name: 'Qwen3 Coder (Free)',
      description: 'Specialized coding model',
      isFree: true,
    },
    {
      provider: ModelProvider.OPENROUTER,
      model: 'moonshotai/kimi-k2:free',
      name: 'Kimi K2 (Free)',
      description: 'Moonshot AI model',
      isFree: true,
    },
    {
      provider: ModelProvider.OPENROUTER,
      model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
      name: 'Dolphin Mistral 24B (Free)',
      description: 'Mistral-based model',
      isFree: true,
    },
    {
      provider: ModelProvider.OPENROUTER,
      model: 'google/gemma-3n-e2b-it:free',
      name: 'Gemma 3N E2B (Free)',
      description: 'Google\'s Gemma model',
      isFree: true,
    },
    {
      provider: ModelProvider.OPENROUTER,
      model: 'tencent/hunyuan-a13b-instruct:free',
      name: 'Hunyuan A13B (Free)',
      description: 'Tencent\'s Hunyuan model',
      isFree: true,
    },
    {
      provider: ModelProvider.OPENROUTER,
      model: 'tngtech/deepseek-r1t2-chimera:free',
      name: 'DeepSeek R1T2 Chimera (Free)',
      description: 'DeepSeek\'s latest model',
      isFree: true,
    },
    {
      provider: ModelProvider.OPENROUTER,
      model: 'mistralai/mistral-small-3.2-24b-instruct:free',
      name: 'Mistral Small 3.2 (Free)',
      description: 'Mistral\'s small model',
      isFree: true,
    },
    {
      provider: ModelProvider.OPENROUTER,
      model: 'deepseek/deepseek-r1:free',
      name: 'DeepSeek R1 (Free)',
      description: 'DeepSeek\'s R1 model',
      isFree: true,
    },
    {
      provider: ModelProvider.OPENROUTER,
      model: 'sarvamai/sarvam-m:free',
      name: 'Sarvam M (Free)',
      description: 'Sarvam AI model',
      isFree: true,
    },
    {
      provider: ModelProvider.OPENROUTER,
      model: 'qwen/qwen3-30b-a3b:free',
      name: 'Qwen3 30B A3B (Free)',
      description: 'Qwen3 30B model',
      isFree: true,
    },
    {
      provider: ModelProvider.OPENROUTER,
      model: 'qwen/qwen3-235b-a22b:free',
      name: 'Qwen3 235B A22B (Free)',
      description: 'Qwen3 235B model',
      isFree: true,
    },
    {
      provider: ModelProvider.OPENROUTER,
      model: 'microsoft/mai-ds-r1:free',
      name: 'Microsoft MAI DS R1 (Free)',
      description: 'Microsoft\'s MAI model',
      isFree: true,
    },
    {
      provider: ModelProvider.OPENROUTER,
      model: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
      name: 'Nemotron Ultra 253B (Free)',
      description: 'NVIDIA\'s Nemotron model',
      isFree: true,
    },
    {
      provider: ModelProvider.OPENROUTER,
      model: 'google/gemini-2.5-pro-exp-03-25:free',
      name: 'Gemini 2.5 Pro (Free)',
      description: 'Google\'s latest Gemini model',
      isFree: true,
    },
  ],
};

export const getModelsByProvider = (provider: ModelProvider): ModelConfig[] => {
  return AI_MODELS[provider] || [];
};

export const getAllModels = (): ModelConfig[] => {
  return Object.values(AI_MODELS).flat();
};
