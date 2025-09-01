"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { getBrandingConfig } from "@/lib/branding"
import { Typography } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"

interface BrandTaglineProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "badge"
  size?: "sm" | "md" | "lg"
}

export function BrandTagline({ 
  className, 
  variant = "text",
  size = "md",
  ...props 
}: BrandTaglineProps) {
  const branding = getBrandingConfig()
  
  if (variant === "badge") {
    return (
      <Badge variant="brand" className={cn("font-brand", className)} {...props}>
        {branding.tagline}
      </Badge>
    )
  }
  
  const typographyVariant = size === "sm" ? "small" : size === "lg" ? "lead" : "muted"
  
  return (
    <Typography 
      variant={typographyVariant}
      className={cn("font-brand", className)} 
      {...props}
    >
      {branding.tagline}
    </Typography>
  )
}