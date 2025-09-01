import { z } from "zod";

const baseConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  apiKey: z.string().optional(),
  baseUrl: z.string().url("Invalid URL format").optional(),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().min(1).max(100000),
});

const openaiConfigSchema = baseConfigSchema.extend({
  model: z.string().min(1, "Model is required"),
  organization: z.string().optional(),
  topP: z.number().min(0).max(1).optional(),
  frequencyPenalty: z.number().min(-2).max(2).optional(),
  presencePenalty: z.number().min(-2).max(2).optional(),
});

const anthropicConfigSchema = baseConfigSchema.extend({
  model: z.string().min(1, "Model is required"),
  topK: z.number().min(0).optional(),
  topP: z.number().min(0).max(1).optional(),
  systemPrompt: z.string().optional(),
});

const mistralConfigSchema = baseConfigSchema.extend({
  model: z.string().min(1, "Model is required"),
  topP: z.number().min(0).max(1).optional(),
  randomSeed: z.number().optional(),
  safePrompt: z.boolean().optional(),
});

const ollamaConfigSchema = baseConfigSchema.extend({
  model: z.string().min(1, "Model is required"),
  keepAlive: z.string().optional(),
  numCtx: z.number().min(1).optional(),
  repeatLastN: z.number().min(0).optional(),
  repeatPenalty: z.number().min(0).optional(),
  seed: z.number().optional(),
  stop: z.array(z.string()).optional(),
  tfsZ: z.number().min(0).max(1).optional(),
  topK: z.number().min(0).optional(),
  topP: z.number().min(0).max(1).optional(),
});

const customConfigSchema = baseConfigSchema.extend({
  model: z.string().min(1, "Model is required"),
  headers: z.record(z.string()).optional(),
  authType: z.enum(["none", "bearer", "api-key", "custom"]).optional(),
  customAuthHeader: z.string().optional(),
});

export const providerConfigSchemas = {
  openai: openaiConfigSchema,
  anthropic: anthropicConfigSchema,
  mistral: mistralConfigSchema,
  ollama: ollamaConfigSchema,
  custom: customConfigSchema,
};

export type OpenAIFormData = z.infer<typeof openaiConfigSchema>;
export type AnthropicFormData = z.infer<typeof anthropicConfigSchema>;
export type MistralFormData = z.infer<typeof mistralConfigSchema>;
export type OllamaFormData = z.infer<typeof ollamaConfigSchema>;
export type CustomFormData = z.infer<typeof customConfigSchema>;
