import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, apiKey, endpoint, model } = body

    const envPath = join(process.cwd(), '.env.local')
    let envContent = ''

    try {
      envContent = readFileSync(envPath, 'utf8')
    } catch (error) {
      // File doesn't exist, create new content
      envContent = ''
    }

    // Parse existing env content
    const envLines = envContent.split('\n').filter(line => line.trim() !== '')
    const envMap = new Map<string, string>()
    
    envLines.forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        envMap.set(key.trim(), valueParts.join('=').trim())
      }
    })

    // Update with new configuration
    const providerUpper = provider.toUpperCase()
    
    if (apiKey) {
      envMap.set(`${providerUpper}_API_KEY`, apiKey)
    }
    if (endpoint) {
      envMap.set(`${providerUpper}_ENDPOINT`, endpoint)
    }
    if (model) {
      envMap.set(`${providerUpper}_MODEL`, model)
    }

    // Set active provider
    envMap.set('ACTIVE_AI_PROVIDER', provider)

    // Convert back to env file format
    const newEnvContent = Array.from(envMap.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    writeFileSync(envPath, newEnvContent)

    return NextResponse.json({
      success: true,
      message: 'Configuration saved successfully'
    })

  } catch (error) {
    console.error('Error saving configuration:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to save configuration'
    }, { status: 500 })
  }
}