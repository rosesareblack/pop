"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { getBrandingConfig } from "@/lib/branding"

interface BrandLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function BrandLogo({ 
  className, 
  showText = true, 
  size = "md",
  ...props 
}: BrandLogoProps) {
  const branding = getBrandingConfig()
  
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  }
  
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl"
  }

  return (
    <div className={cn("flex items-center space-x-2", className)} {...props}>
      {branding.logo ? (
        <img
          src={branding.logo.src}
          alt={branding.logo.alt}
          className={cn(sizeClasses[size], "object-contain")}
          width={branding.logo.width}
          height={branding.logo.height}
        />
      ) : (
        <div className={cn(
          sizeClasses[size],
          "bg-brand-primary rounded-md flex items-center justify-center text-white font-bold"
        )}>
          {branding.name.charAt(0).toUpperCase()}
        </div>
      )}
      {showText && (
        <span className={cn(
          textSizeClasses[size],
          "font-bold font-brand text-foreground"
        )}>
          {branding.name}
        </span>
      )}
    </div>
  )
}