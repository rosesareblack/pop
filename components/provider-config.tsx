"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/lib/hooks/use-toast";
import {
  ProviderType,
  ProviderSettings,
  PROVIDER_MODELS,
} from "@/lib/types/provider-config";
import type { ProviderConfig } from "@/lib/types/provider-config";
import { providerConfigSchemas } from "@/lib/validation";
import { saveProviderSettings, loadProviderSettings } from "@/lib/storage";
import { testProviderConnection } from "@/lib/api-test";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface ProviderFormProps {
  type: ProviderType;
  onSave: (config: ProviderConfig) => void;
  initialConfig?: ProviderConfig["config"];
}

function ProviderForm({ type, onSave, initialConfig }: ProviderFormProps) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(providerConfigSchemas[type]),
    defaultValues: initialConfig || {
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Provider`,
      temperature: 0.7,
      maxTokens: 2048,
      model: PROVIDER_MODELS[type]?.[0] || "",
      ...getProviderDefaults(type),
    },
  });

  function getProviderDefaults(providerType: ProviderType) {
    switch (providerType) {
      case "openai":
        return { baseUrl: "https://api.openai.com/v1" };
      case "anthropic":
        return { baseUrl: "https://api.anthropic.com" };
      case "mistral":
        return { baseUrl: "https://api.mistral.ai/v1" };
      case "ollama":
        return { baseUrl: "http://localhost:11434", keepAlive: "5m" };
      case "custom":
        return { authType: "bearer" as const };
      default:
        return {};
    }
  }

  const handleTestConnection = async () => {
    const formData = form.getValues();
    setTesting(true);
    setTestResult(null);

    try {
      const result = await testProviderConnection({ type, config: formData });
      setTestResult(result);

      if (result.success) {
        toast({
          title: "Connection successful",
          description: `Connected in ${result.latency}ms`,
          variant: "default",
        });
      } else {
        toast({
          title: "Connection failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setTestResult({ success: false, message });
      toast({
        title: "Connection failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const onSubmit = (data: any) => {
    onSave({ type, config: data });
    toast({
      title: "Configuration saved",
      description: `${data.name} has been saved successfully.`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="My OpenAI Provider" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {(PROVIDER_MODELS[type] || []).map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {type !== "ollama" && (
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="sk-..."
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="baseUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://api.example.com/v1"
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="temperature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temperature</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxTokens"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Tokens</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    max="100000"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Provider-specific fields */}
        {renderProviderSpecificFields(type, form)}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={testing}
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Connection"
              )}
            </Button>
            {testResult && (
              <div className="flex items-center gap-1">
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm ${testResult.success ? "text-green-600" : "text-red-600"}`}
                >
                  {testResult.message}
                </span>
              </div>
            )}
          </div>
          <Button type="submit">Save Configuration</Button>
        </div>
      </form>
    </Form>
  );
}

function renderProviderSpecificFields(type: ProviderType, form: any) {
  switch (type) {
    case "openai":
      return (
        <>
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="topP"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Top P</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frequencyPenalty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency Penalty</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="presencePenalty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presence Penalty</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      );

    case "anthropic":
      return (
        <>
          <FormField
            control={form.control}
            name="systemPrompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>System Prompt (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="topK"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Top K</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topP"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Top P</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      );

    case "custom":
      return (
        <FormField
          control={form.control}
          name="authType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authentication Type</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="api-key">API Key Header</SelectItem>
                    <SelectItem value="custom">Custom Header</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    default:
      return null;
  }
}

export default function ProviderConfig() {
  const [settings, setSettings] = useState<ProviderSettings>({ providers: {} });
  const [activeTab, setActiveTab] = useState<ProviderType>("openai");

  useEffect(() => {
    const loaded = loadProviderSettings();
    if (loaded) {
      setSettings(loaded);
    }
  }, []);

  const handleSaveProvider = (config: ProviderConfig) => {
    const providerId = `${config.type}-${Date.now()}`;
    const updatedSettings = {
      ...settings,
      providers: {
        ...settings.providers,
        [providerId]: config,
      },
    };

    setSettings(updatedSettings);
    saveProviderSettings(updatedSettings);
  };

  const getExistingConfig = (type: ProviderType) => {
    const existing = Object.values(settings.providers).find(
      (p) => p.type === type,
    );
    return existing?.config;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Provider Configuration</h1>
        <p className="text-muted-foreground">
          Configure AI providers for your applications. Test connections and
          securely store API keys.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ProviderType)}
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
          <TabsTrigger value="mistral">Mistral</TabsTrigger>
          <TabsTrigger value="ollama">Ollama</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="openai" className="mt-6">
          <ProviderForm
            type="openai"
            onSave={handleSaveProvider}
            initialConfig={getExistingConfig("openai")}
          />
        </TabsContent>

        <TabsContent value="anthropic" className="mt-6">
          <ProviderForm
            type="anthropic"
            onSave={handleSaveProvider}
            initialConfig={getExistingConfig("anthropic")}
          />
        </TabsContent>

        <TabsContent value="mistral" className="mt-6">
          <ProviderForm
            type="mistral"
            onSave={handleSaveProvider}
            initialConfig={getExistingConfig("mistral")}
          />
        </TabsContent>

        <TabsContent value="ollama" className="mt-6">
          <ProviderForm
            type="ollama"
            onSave={handleSaveProvider}
            initialConfig={getExistingConfig("ollama")}
          />
        </TabsContent>

        <TabsContent value="custom" className="mt-6">
          <ProviderForm
            type="custom"
            onSave={handleSaveProvider}
            initialConfig={getExistingConfig("custom")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
