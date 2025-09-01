export type ProviderType =
  | "openai"
  | "anthropic"
  | "mistral"
  | "ollama"
  | "custom";

export interface BaseProviderConfig {
  name: string;
  apiKey?: string;
  baseUrl?: string;
  temperature: number;
  maxTokens: number;
}

export interface OpenAIConfig extends BaseProviderConfig {
  model: string;
  organization?: string;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface AnthropicConfig extends BaseProviderConfig {
  model: string;
  topK?: number;
  topP?: number;
  systemPrompt?: string;
}

export interface MistralConfig extends BaseProviderConfig {
  model: string;
  topP?: number;
  randomSeed?: number;
  safePrompt?: boolean;
}

export interface OllamaConfig extends BaseProviderConfig {
  model: string;
  keepAlive?: string;
  numCtx?: number;
  repeatLastN?: number;
  repeatPenalty?: number;
  seed?: number;
  stop?: string[];
  tfsZ?: number;
  topK?: number;
  topP?: number;
}

export interface CustomConfig extends BaseProviderConfig {
  model: string;
  headers?: Record<string, string>;
  authType?: "none" | "bearer" | "api-key" | "custom";
  customAuthHeader?: string;
}

export type ProviderConfig =
  | { type: "openai"; config: OpenAIConfig }
  | { type: "anthropic"; config: AnthropicConfig }
  | { type: "mistral"; config: MistralConfig }
  | { type: "ollama"; config: OllamaConfig }
  | { type: "custom"; config: CustomConfig };

export interface ProviderSettings {
  providers: Record<string, ProviderConfig>;
  defaultProvider?: string;
}

export interface TestConnectionResult {
  success: boolean;
  message: string;
  latency?: number;
}

export interface ProviderModels {
  [key: string]: string[];
}

export const PROVIDER_MODELS: ProviderModels = {
  openai: [
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-4-turbo",
    "gpt-4",
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-16k",
  ],
  anthropic: [
    "claude-3-5-sonnet-20241022",
    "claude-3-5-haiku-20241022",
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
  ],
  mistral: [
    "mistral-large-latest",
    "mistral-small-latest",
    "codestral-latest",
    "mistral-embed",
  ],
  ollama: ["llama3.2", "llama3.1", "phi3", "gemma2", "codegemma", "qwen2.5"],
};
