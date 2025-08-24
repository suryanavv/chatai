export enum ModelProvider {
  OPENAI = "openai",
  GOOGLE = "google",
  ANTHROPIC = "anthropic",
  OPENROUTER = "openrouter",
}

export interface ModelConfig {
  provider: ModelProvider;
  model: string;
  name: string;
  description: string;
  isFree?: boolean;
}

export interface ChatConfig {
  provider: ModelProvider;
  model: string;
  apiKey?: string;
}
