'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle, XCircle, Loader2, Brain, Zap, MessageSquare, Server } from 'lucide-react'

interface ProviderConfig {
  provider: string
  apiKey: string
  endpoint?: string
  model?: string
}

interface ValidationResult {
  isValid: boolean
  message: string
}

const aiProviders = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: <Brain className="w-5 h-5" />,
    description: 'GPT models and API access',
    keyFormat: 'sk-...',
    defaultEndpoint: 'https://api.openai.com/v1',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo']
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'Claude models and API access',
    keyFormat: 'sk-ant-...',
    defaultEndpoint: 'https://api.anthropic.com/v1',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku']
  },
  {
    id: 'mistral',
    name: 'Mistral',
    icon: <Zap className="w-5 h-5" />,
    description: 'Mistral AI models and API access',
    keyFormat: '...',
    defaultEndpoint: 'https://api.mistral.ai/v1',
    models: ['mistral-large', 'mistral-medium', 'mistral-small']
  },
  {
    id: 'ollama',
    name: 'Ollama',
    icon: <Server className="w-5 h-5" />,
    description: 'Local AI models via Ollama',
    keyFormat: 'Not required for local',
    defaultEndpoint: 'http://localhost:11434',
    models: ['llama2', 'codellama', 'mistral', 'neural-chat']
  }
]

export default function ConfigurationWizard() {
  const [selectedProvider, setSelectedProvider] = useState('')
  const [config, setConfig] = useState<ProviderConfig>({
    provider: '',
    apiKey: '',
    endpoint: '',
    model: ''
  })
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const { toast } = useToast()

  const selectedProviderData = aiProviders.find(p => p.id === selectedProvider)

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
    const provider = aiProviders.find(p => p.id === providerId)
    if (provider) {
      setConfig({
        provider: providerId,
        apiKey: '',
        endpoint: provider.defaultEndpoint,
        model: provider.models[0]
      })
    }
    setValidationResult(null)
  }

  const validateCredentials = async () => {
    if (!config.apiKey && selectedProvider !== 'ollama') {
      setValidationResult({ isValid: false, message: 'API key is required' })
      return
    }

    setIsValidating(true)
    try {
      const response = await fetch('/api/validate-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      const result = await response.json()
      setValidationResult({
        isValid: result.valid,
        message: result.message
      })

      if (result.valid) {
        toast({
          title: "Credentials validated successfully!",
          description: `${selectedProviderData?.name} configuration is working.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Validation failed",
          description: result.message,
        })
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        message: 'Failed to validate credentials'
      })
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Unable to connect to validation service",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const saveConfiguration = async () => {
    try {
      const response = await fetch('/api/save-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (response.ok) {
        toast({
          title: "Configuration saved!",
          description: "Your AI provider configuration has been saved successfully.",
        })
      } else {
        throw new Error('Failed to save configuration')
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Unable to save configuration. Please try again.",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your AI Provider</CardTitle>
          <CardDescription>
            Select the AI provider you want to configure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiProviders.map((provider) => (
              <Card
                key={provider.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedProvider === provider.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleProviderSelect(provider.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-primary">{provider.icon}</div>
                    <div>
                      <h3 className="font-semibold">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">{provider.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Form */}
      {selectedProvider && selectedProviderData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {selectedProviderData.icon}
              <span>Configure {selectedProviderData.name}</span>
            </CardTitle>
            <CardDescription>
              Enter your {selectedProviderData.name} configuration details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProvider !== 'ollama' && (
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder={`Enter your API key (format: ${selectedProviderData.keyFormat})`}
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Your API key will be stored securely in your environment file
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="endpoint">API Endpoint</Label>
              <Input
                id="endpoint"
                type="url"
                value={config.endpoint}
                onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Default Model</Label>
              <Select value={config.model} onValueChange={(value) => setConfig({ ...config, model: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProviderData.models.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                onClick={validateCredentials}
                disabled={isValidating}
                variant="outline"
              >
                {isValidating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Validate
              </Button>

              <Button
                onClick={saveConfiguration}
                disabled={!validationResult?.isValid}
              >
                Save Configuration
              </Button>
            </div>

            {validationResult && (
              <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                validationResult.isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {validationResult.isValid ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span className="text-sm">{validationResult.message}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}