export interface BrandingConfig {
  name: string
  tagline: string
  description: string
  logo?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  fonts: {
    family: string
    weights: number[]
  }
  spacing: {
    base: string
    sections: string
    components: string
  }
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
    discord?: string
  }
}

export const defaultBrandingConfig: BrandingConfig = {
  name: "Platform",
  tagline: "Build amazing experiences",
  description: "A powerful platform for building modern applications with ease",
  colors: {
    primary: "221.2 83.2% 53.3%",
    secondary: "210 40% 98%",
    accent: "210 40% 90%",
  },
  fonts: {
    family: "Inter, system-ui, sans-serif",
    weights: [400, 500, 600, 700],
  },
  spacing: {
    base: "1rem",
    sections: "3rem",
    components: "1.5rem",
  },
}

// Global branding configuration that can be overridden
let brandingConfig: BrandingConfig = defaultBrandingConfig

export function setBrandingConfig(config: Partial<BrandingConfig>) {
  brandingConfig = { ...brandingConfig, ...config }
  
  // Update CSS custom properties
  updateCSSProperties(brandingConfig)
}

export function getBrandingConfig(): BrandingConfig {
  return brandingConfig
}

function updateCSSProperties(config: BrandingConfig) {
  if (typeof window === 'undefined') return

  const root = document.documentElement
  
  // Update color variables
  root.style.setProperty('--brand-primary', config.colors.primary)
  root.style.setProperty('--brand-secondary', config.colors.secondary)
  root.style.setProperty('--brand-accent', config.colors.accent)
  
  // Update font variables
  root.style.setProperty('--brand-font-family', config.fonts.family)
  
  // Update spacing variables
  root.style.setProperty('--brand-spacing', config.spacing.base)
  root.style.setProperty('--brand-spacing-sections', config.spacing.sections)
  root.style.setProperty('--brand-spacing-components', config.spacing.components)
}

// React hook for using branding config
export function useBrandingConfig() {
  return getBrandingConfig()
}