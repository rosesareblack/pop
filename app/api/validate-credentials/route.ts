import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, apiKey, endpoint, model } = body

    let isValid = false
    let message = ''

    switch (provider) {
      case 'openai':
        try {
          const response = await axios.get(`${endpoint}/models`, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000
          })
          isValid = response.status === 200
          message = isValid ? 'OpenAI credentials validated successfully' : 'Invalid OpenAI credentials'
        } catch (error) {
          message = 'OpenAI validation failed: Invalid API key or endpoint'
        }
        break

      case 'anthropic':
        try {
          const response = await axios.post(`${endpoint}/messages`, {
            model: model || 'claude-3-haiku-20240307',
            max_tokens: 1,
            messages: [{ role: 'user', content: 'test' }]
          }, {
            headers: {
              'x-api-key': apiKey,
              'Content-Type': 'application/json',
              'anthropic-version': '2023-06-01'
            },
            timeout: 10000
          })
          isValid = response.status === 200
          message = isValid ? 'Anthropic credentials validated successfully' : 'Invalid Anthropic credentials'
        } catch (error: any) {
          if (error.response?.status === 400 && error.response?.data?.error?.type === 'invalid_request_error') {
            isValid = true
            message = 'Anthropic credentials validated successfully'
          } else {
            message = 'Anthropic validation failed: Invalid API key or endpoint'
          }
        }
        break

      case 'mistral':
        try {
          const response = await axios.get(`${endpoint}/models`, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000
          })
          isValid = response.status === 200
          message = isValid ? 'Mistral credentials validated successfully' : 'Invalid Mistral credentials'
        } catch (error) {
          message = 'Mistral validation failed: Invalid API key or endpoint'
        }
        break

      case 'ollama':
        try {
          const response = await axios.get(`${endpoint}/api/tags`, {
            timeout: 5000
          })
          isValid = response.status === 200
          message = isValid ? 'Ollama connection validated successfully' : 'Unable to connect to Ollama'
        } catch (error) {
          message = 'Ollama validation failed: Unable to connect to local instance'
        }
        break

      default:
        message = 'Unknown provider'
    }

    return NextResponse.json({
      valid: isValid,
      message
    })

  } catch (error) {
    return NextResponse.json({
      valid: false,
      message: 'Validation service error'
    }, { status: 500 })
  }
}