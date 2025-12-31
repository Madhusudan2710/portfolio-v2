"use client"

import { Github, Linkedin, Twitter, Instagram, Download, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { memo, useMemo } from "react"

// Image configuration with responsive breakpoints and validation
const PROFILE_IMAGE = {
  src: "/images/Profile.png",
  alt: "Madhusudan's Profile Picture",
  sizes: {
    mobile: { width: 256, height: 256, breakpoint: 'max-width: 768px' }, // w-64 h-64
    tablet: { width: 320, height: 320, breakpoint: 'max-width: 1024px' }, // md:w-80 md:h-80
    desktop: { width: 384, height: 384, breakpoint: 'min-width: 1025px' } // lg:w-96 lg:h-96
  },
  // Fallback dimensions for error cases
  fallback: { width: 256, height: 256 },
  // Supported formats for progressive enhancement
  formats: ['webp', 'jpeg'] as const,
  // Quality settings for different screen densities
  quality: {
    standard: 75,
    retina: 85
  }
} as const

// Type definitions for better type safety
type ImageSize = typeof PROFILE_IMAGE.sizes[keyof typeof PROFILE_IMAGE.sizes]
type ImageFormat = typeof PROFILE_IMAGE.formats[number]

// Utility functions for image handling
const generateImageSizes = (sizes: typeof PROFILE_IMAGE.sizes): string => {
  const { mobile, tablet, desktop } = sizes
  return `(${mobile.breakpoint}) ${mobile.width}px, (${tablet.breakpoint}) ${tablet.width}px, ${desktop.width}px`
}

const generateUniqueId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

// Performance optimization: Preload critical image
if (typeof window !== 'undefined') {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = PROFILE_IMAGE.src
  document.head.appendChild(link)
}

const SOCIAL_LINKS = [
  {
    href: "https://github.com/Madhusudan04337",
    icon: Github,
    label: "GitHub Profile",
    isExternal: true
  },
  {
    href: "https://www.linkedin.com/in/madhu-sudan-0006a429a/",
    icon: Linkedin,
    label: "LinkedIn Profile",
    isExternal: true
  },
  {
    href: "#",
    icon: Twitter,
    label: "Twitter Profile",
    isExternal: false
  },
  {
    href: "#",
    icon: Instagram,
    label: "Instagram Profile",
    isExternal: false
  }
] as const

const FLOATING_ELEMENTS = [
  {
    className: "absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-float",
    delay: "0s"
  },
  {
    className: "absolute bottom-10 -left-6 w-12 h-12 bg-primary/40 rounded-full animate-float",
    delay: "1s"
  },
  {
    className: "absolute top-1/2 -right-8 w-6 h-6 bg-primary/60 rounded-full animate-float",
    delay: "2s"
  }
] as const

// Memoized components for better performance
const BackgroundDecoration = memo(() => (
  <div className="absolute inset-0 z-0" aria-hidden="true">
    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700" />
  </div>
))
BackgroundDecoration.displayName = "BackgroundDecoration"

const SocialLinks = memo(() => (
  <div className="flex justify-center lg:justify-start gap-6" role="list">
    {SOCIAL_LINKS.map(({ href, icon: Icon, label, isExternal }) => (
      <Link
        key={label}
        href={href}
        {...(isExternal && {
          target: "_blank",
          rel: "noopener noreferrer"
        })}
        className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-md p-1"
        aria-label={label}
        role="listitem"
      >
        <Icon className="w-6 h-6" aria-hidden="true" />
      </Link>
    ))}
  </div>
))
SocialLinks.displayName = "SocialLinks"

const ProfileImage = memo(() => {
  // Generate responsive sizes string with all breakpoints
  const profileImageSizes = useMemo(() => generateImageSizes(PROFILE_IMAGE.sizes), [])

  // Error handling for image loading with retry mechanism
  const handleImageError = (event: React.SyntheticEvent<SVGImageElement>) => {
    console.warn('Profile image failed to load, using fallback dimensions')
    const target = event.target as SVGImageElement

    // Apply fallback dimensions
    target.setAttribute('width', PROFILE_IMAGE.fallback.width.toString())
    target.setAttribute('height', PROFILE_IMAGE.fallback.height.toString())

    // Optional: Try alternative image format if available
    const currentSrc = target.getAttribute('href')
    if (currentSrc && !currentSrc.includes('fallback')) {
      // Could implement fallback to different format here
      console.info('Consider implementing fallback image format')
    }
  }

  // Generate unique mask ID to avoid conflicts in SSR/multiple instances
  const maskId = useMemo(() => generateUniqueId('blobMask'), [])

  return (
    <div className="relative w-72 h-[420px] md:w-80 md:h-[460px] lg:w-96 lg:h-[520px] relative hidden lg:block w-96 h-[520px] mx-auto">
      <svg
        viewBox="0 0 500 700"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* BORDER */}
          <filter id="personBorder" x="-30%" y="-30%" width="160%" height="160%">
            <feMorphology
              in="SourceAlpha"
              operator="dilate"
              radius="3"
              result="outline"
            />
            <feColorMatrix
              type="matrix"
              values="
            0 0 0 0 0
            0 1 0 0 0.7
            0 1 0 0 1
            0 0 0 1 0"
            />
            <feComposite in="outline" in2="SourceAlpha" operator="out" />
          </filter>

          {/* GLOW */}
          <filter id="personGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="12" />
            <feColorMatrix
              type="matrix"
              values="
            0 0 0 0 0
            0 1 0 0 0.6
            0 1 0 0 1
            0 0 0 1 0"
            />
          </filter>
        </defs>

        {/* 🔵 BORDER */}
        <image
          href="/images/Profile.png"
          width="500"
          height="700"
          filter="url(#personBorder)"
        />

        {/* ✨ GLOW */}
        <image
          href="/images/Profile.png"
          width="500"
          height="700"
          filter="url(#personGlow)"
          opacity="0.6"
        />

        {/* 🧍 MAIN IMAGE */}
        <image
          href="/images/Profile.png"
          width="500"
          height="700"
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    </div>
  )
})
ProfileImage.displayName = "ProfileImage"

export const Hero = memo(() => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      aria-label="Hero section"
    >
      <BackgroundDecoration />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Content Section */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-balance">
              Hi, I'm <span className="text-primary gradient-text">Madhusudan</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-muted-foreground mb-6 text-balance">
              Python & Full Stack Developer
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 text-pretty">
              As a Python and full-stack developer, I’m constantly learning new tools and improving my skills to build better, more efficient applications.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              <Link
                href="/Madhusudan_cv_7719.pdf"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                aria-label="Download CV (PDF)"
              >
                <Download className="w-5 h-5" aria-hidden="true" />
                Download CV
              </Link>
              <Link
                href="#contact"
                className="border border-primary text-primary px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-primary/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                aria-label="Go to contact section"
              >
                Contact Me
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>

            {/* Social Links */}
            <SocialLinks />
          </div>

          {/* Profile Image Section */}
          <ProfileImage />
        </div>
      </div>
    </section>
  )
})

Hero.displayName = "Hero"
