"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { BrandingConfig, getBrandingConfig, setBrandingConfig } from "@/lib/branding"
import { BrandHeader } from "@/components/branding"

export default function BrandingAdminPage() {
  const [config, setConfig] = React.useState<BrandingConfig>(getBrandingConfig())
  const [previewConfig, setPreviewConfig] = React.useState<BrandingConfig>(config)

  const handleInputChange = (
    section: keyof BrandingConfig, 
    field: string, 
    value: string
  ) => {
    setPreviewConfig(prev => {
      if (section === "name" || section === "tagline" || section === "description") {
        return {
          ...prev,
          [section]: value
        }
      }
      
      const currentSection = prev[section] as any
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value
        }
      }
    })
  }

  const handleSave = () => {
    setBrandingConfig(previewConfig)
    setConfig(previewConfig)
  }

  const handleReset = () => {
    setPreviewConfig(config)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Typography variant="h1" className="mb-8">
        Branding Configuration
      </Typography>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Configure your platform&apos;s basic branding elements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Platform Name</label>
                <input
                  type="text"
                  value={previewConfig.name}
                  onChange={(e) => handleInputChange("name", "", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tagline</label>
                <input
                  type="text"
                  value={previewConfig.tagline}
                  onChange={(e) => handleInputChange("tagline", "", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={previewConfig.description}
                  onChange={(e) => handleInputChange("description", "", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
              <CardDescription>
                Customize your brand colors (HSL format)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Primary Color</label>
                <input
                  type="text"
                  value={previewConfig.colors.primary}
                  onChange={(e) => handleInputChange("colors", "primary", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="221.2 83.2% 53.3%"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Secondary Color</label>
                <input
                  type="text"
                  value={previewConfig.colors.secondary}
                  onChange={(e) => handleInputChange("colors", "secondary", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="210 40% 98%"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Accent Color</label>
                <input
                  type="text"
                  value={previewConfig.colors.accent}
                  onChange={(e) => handleInputChange("colors", "accent", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="210 40% 90%"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Configure font family and styling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Font Family</label>
                <input
                  type="text"
                  value={previewConfig.fonts.family}
                  onChange={(e) => handleInputChange("fonts", "family", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Inter, system-ui, sans-serif"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button onClick={handleSave} variant="brand">
              Save Changes
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                See how your branding changes look in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                style={{
                  "--brand-primary": previewConfig.colors.primary,
                  "--brand-secondary": previewConfig.colors.secondary,
                  "--brand-accent": previewConfig.colors.accent,
                  "--brand-font-family": previewConfig.fonts.family,
                } as React.CSSProperties}
                className="border rounded-lg p-6 space-y-4"
              >
                <BrandHeader variant="section" />
                <div className="flex space-x-2">
                  <Button variant="brand">Primary Button</Button>
                  <Button variant="outline">Secondary Button</Button>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Sample Card</CardTitle>
                    <CardDescription>
                      This shows how your branding affects components
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Typography variant="p">
                      Sample content to demonstrate typography and spacing with your custom branding configuration.
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}