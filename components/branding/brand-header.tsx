"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { getBrandingConfig } from "@/lib/branding"
import { Typography } from "@/components/ui/typography"
import { BrandLogo } from "./brand-logo"
import { BrandTagline } from "./brand-tagline"

interface BrandHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showLogo?: boolean
  showTagline?: boolean
  variant?: "hero" | "section" | "compact"
}

export function BrandHeader({ 
  className,
  showLogo = true,
  showTagline = true,
  variant = "hero",
  ...props 
}: BrandHeaderProps) {
  const branding = getBrandingConfig()
  
  const variantClasses = {
    hero: "text-center space-y-4 py-12",
    section: "space-y-3 py-6",
    compact: "space-y-2 py-3"
  }
  
  const titleVariant = variant === "hero" ? "h1" : variant === "section" ? "h2" : "h3"
  const logoSize = variant === "hero" ? "lg" : variant === "section" ? "md" : "sm"

  return (
    <div className={cn(variantClasses[variant], className)} {...props}>
      {showLogo && (
        <div className="flex justify-center">
          <BrandLogo size={logoSize} />
        </div>
      )}
      <div className="space-y-2">
        <Typography variant={titleVariant} className="font-brand">
          {branding.name}
        </Typography>
        {showTagline && (
          <BrandTagline 
            size={variant === "hero" ? "lg" : "md"}
            className="text-center"
          />
        )}
        {variant === "hero" && branding.description && (
          <Typography variant="lead" className="text-center max-w-2xl mx-auto">
            {branding.description}
          </Typography>
        )}
      </div>
    </div>
  )
}