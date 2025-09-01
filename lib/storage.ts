import { ProviderSettings, ProviderConfig } from "./types/provider-config";
import { encryptData, decryptData } from "./crypto";

const STORAGE_KEY = "provider-settings";

export function saveProviderSettings(settings: ProviderSettings): void {
  try {
    // Encrypt sensitive data (API keys)
    const encryptedSettings = { ...settings };
    Object.keys(encryptedSettings.providers).forEach((key) => {
      const provider = encryptedSettings.providers[key];
      if (provider.config.apiKey) {
        encryptedSettings.providers[key] = {
          ...provider,
          config: {
            ...provider.config,
            apiKey: encryptData(provider.config.apiKey),
          },
        };
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(encryptedSettings));
  } catch (error) {
    console.error("Failed to save provider settings:", error);
  }
}

export function loadProviderSettings(): ProviderSettings | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const settings: ProviderSettings = JSON.parse(stored);

    // Decrypt sensitive data (API keys)
    Object.keys(settings.providers).forEach((key) => {
      const provider = settings.providers[key];
      if (provider.config.apiKey) {
        settings.providers[key] = {
          ...provider,
          config: {
            ...provider.config,
            apiKey: decryptData(provider.config.apiKey),
          },
        };
      }
    });

    return settings;
  } catch (error) {
    console.error("Failed to load provider settings:", error);
    return null;
  }
}

export function deleteProviderSettings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to delete provider settings:", error);
  }
}
