import { ProviderConfig, TestConnectionResult } from "./types/provider-config";

export async function testProviderConnection(
  provider: ProviderConfig,
): Promise<TestConnectionResult> {
  const startTime = Date.now();

  try {
    switch (provider.type) {
      case "openai":
        return await testOpenAI(provider.config, startTime);
      case "anthropic":
        return await testAnthropic(provider.config, startTime);
      case "mistral":
        return await testMistral(provider.config, startTime);
      case "ollama":
        return await testOllama(provider.config, startTime);
      case "custom":
        return await testCustom(provider.config, startTime);
      default:
        return {
          success: false,
          message: "Unknown provider type",
        };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      latency: Date.now() - startTime,
    };
  }
}

async function testOpenAI(
  config: any,
  startTime: number,
): Promise<TestConnectionResult> {
  if (!config.apiKey) {
    return {
      success: false,
      message: "API key is required for OpenAI",
    };
  }

  const baseUrl = config.baseUrl || "https://api.openai.com/v1";
  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.apiKey}`,
    "Content-Type": "application/json",
  };

  if (config.organization) {
    headers["OpenAI-Organization"] = config.organization;
  }

  const response = await fetch(`${baseUrl}/models`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    return {
      success: false,
      message: `OpenAI API error: ${response.status} ${error}`,
      latency: Date.now() - startTime,
    };
  }

  return {
    success: true,
    message: "Connection successful",
    latency: Date.now() - startTime,
  };
}

async function testAnthropic(
  config: any,
  startTime: number,
): Promise<TestConnectionResult> {
  if (!config.apiKey) {
    return {
      success: false,
      message: "API key is required for Anthropic",
    };
  }

  const baseUrl = config.baseUrl || "https://api.anthropic.com";

  const response = await fetch(`${baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "x-api-key": config.apiKey,
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model || "claude-3-haiku-20240307",
      max_tokens: 1,
      messages: [{ role: "user", content: "test" }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return {
      success: false,
      message: `Anthropic API error: ${response.status} ${error}`,
      latency: Date.now() - startTime,
    };
  }

  return {
    success: true,
    message: "Connection successful",
    latency: Date.now() - startTime,
  };
}

async function testMistral(
  config: any,
  startTime: number,
): Promise<TestConnectionResult> {
  if (!config.apiKey) {
    return {
      success: false,
      message: "API key is required for Mistral",
    };
  }

  const baseUrl = config.baseUrl || "https://api.mistral.ai/v1";

  const response = await fetch(`${baseUrl}/models`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    return {
      success: false,
      message: `Mistral API error: ${response.status} ${error}`,
      latency: Date.now() - startTime,
    };
  }

  return {
    success: true,
    message: "Connection successful",
    latency: Date.now() - startTime,
  };
}

async function testOllama(
  config: any,
  startTime: number,
): Promise<TestConnectionResult> {
  const baseUrl = config.baseUrl || "http://localhost:11434";

  try {
    const response = await fetch(`${baseUrl}/api/tags`, {
      method: "GET",
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Ollama server error: ${response.status}`,
        latency: Date.now() - startTime,
      };
    }

    return {
      success: true,
      message: "Connection successful",
      latency: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to connect to Ollama server. Make sure it's running.",
      latency: Date.now() - startTime,
    };
  }
}

async function testCustom(
  config: any,
  startTime: number,
): Promise<TestConnectionResult> {
  if (!config.baseUrl) {
    return {
      success: false,
      message: "Base URL is required for custom provider",
    };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...config.headers,
  };

  if (config.authType === "bearer" && config.apiKey) {
    headers["Authorization"] = `Bearer ${config.apiKey}`;
  } else if (config.authType === "api-key" && config.apiKey) {
    headers["X-API-Key"] = config.apiKey;
  } else if (
    config.authType === "custom" &&
    config.customAuthHeader &&
    config.apiKey
  ) {
    headers[config.customAuthHeader] = config.apiKey;
  }

  try {
    // Test with a basic GET request to the base URL
    const response = await fetch(config.baseUrl, {
      method: "GET",
      headers,
    });

    return {
      success: true,
      message: `Connection test completed (status: ${response.status})`,
      latency: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Connection failed",
      latency: Date.now() - startTime,
    };
  }
}
