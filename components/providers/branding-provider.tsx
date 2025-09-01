"use client"

import * as React from "react"
import { BrandingConfig, getBrandingConfig, setBrandingConfig } from "@/lib/branding"

interface BrandingProviderProps {
  children: React.ReactNode
  config?: Partial<BrandingConfig>
}

export function BrandingProvider({ children, config }: BrandingProviderProps) {
  React.useEffect(() => {
    if (config) {
      setBrandingConfig(config)
    }
  }, [config])

  return <>{children}</>
}

// Hook for accessing branding config in components
export function useBranding() {
  return getBrandingConfig()
}