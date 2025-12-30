"use client"

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { gsap } from "gsap"
import { ChevronLeft, ChevronRight, Layout, Server, Layers, BarChart3, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Types for better type safety
interface Skill {
  name: string
  level: number
}

interface SkillIsland {
  id: string
  title: string
  icon: React.ReactNode
  iconComponent: LucideIcon
  skills: Skill[]
  category: 'frontend' | 'backend' | 'framework' | 'data'
}

// Constants moved outside component to prevent recreation
const SKILL_ISLANDS: SkillIsland[] = [
  {
    id: 'frontend-galaxy',
    title: "Frontend Galaxy",
    icon: <Layout className="w-10 h-10" />,
    iconComponent: Layout,
    category: 'frontend',
    skills: [
      { name: "HTML5", level: 95 },
      { name: "CSS3", level: 92 },
      { name: "JavaScript", level: 85 },
      { name: "React", level: 85 },
      { name: "Bootstrap", level: 90 },
      { name: "Tailwind", level: 88 },
    ],
  },
  {
    id: 'backend-galaxy',
    title: "Backend Galaxy",
    icon: <Server className="w-10 h-10" />,
    iconComponent: Server,
    category: 'backend',
    skills: [
      { name: "Python", level: 90 },
      { name: "Java", level: 85 },
      { name: "C++", level: 80 },
      { name: "C", level: 75 },
      { name: "Node.js", level: 70 },
      { name: "Express", level: 75 },
    ],
  },
  {
    id: 'framework-nebula',
    title: "Framework Nebula",
    icon: <Layers className="w-10 h-10" />,
    iconComponent: Layers,
    category: 'framework',
    skills: [
      { name: "Django", level: 75 },
      { name: "Next.js", level: 80 },
      { name: "MySQL", level: 80 },
      { name: "PostgreSQL", level: 78 },
      { name: "MongoDB", level: 70 },
      { name: "Redux", level: 75 },
    ],
  },
  {
    id: 'data-constellation',
    title: "Data Constellation",
    icon: <BarChart3 className="w-10 h-10" />,
    iconComponent: BarChart3,
    category: 'data',
    skills: [
      { name: "Gen AI", level: 70 },
      { name: "Tableau", level: 75 },
      { name: "Power BI", level: 70 },
      { name: "Excel", level: 85 },
      { name: "Pandas", level: 75 },
      { name: "NumPy", level: 72 },
    ],
  },
] as const

// Animation configurations
const ANIMATION_CONFIG = {
  header: {
    y: 50,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  },
  island: {
    scale: 0.95,
    opacity: 0,
    duration: 1.2,
    ease: "expo.out",
    scrollTrigger: {
      start: "top 60%",
      toggleActions: "play none none reverse",
    },
  },
  skills: {
    from: { y: 20, opacity: 0, scale: 0.8 },
    to: { y: 0, opacity: 1, scale: 1, stagger: 0.05, duration: 0.5, ease: "back.out(1.7)" },
  },
} as const

// Custom hook for GSAP animations
function useGSAPAnimations(sectionRef: React.RefObject<HTMLElement | null>, islandRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!sectionRef.current || typeof window === "undefined") return

    let ScrollTrigger: any
    
    try {
      ScrollTrigger = require("gsap/ScrollTrigger").ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)
    } catch (error) {
      console.warn("GSAP ScrollTrigger plugin not available:", error)
      return
    }

    const headerElement = sectionRef.current.querySelector(".skills-header")
    
    if (headerElement) {
      gsap.from(headerElement, {
        ...ANIMATION_CONFIG.header,
        scrollTrigger: {
          ...ANIMATION_CONFIG.header.scrollTrigger,
          trigger: sectionRef.current,
        },
      })
    }

    if (islandRef.current) {
      gsap.from(islandRef.current, {
        ...ANIMATION_CONFIG.island,
        scrollTrigger: {
          ...ANIMATION_CONFIG.island.scrollTrigger,
          trigger: sectionRef.current,
        },
      })
    }

    return () => {
      try {
        ScrollTrigger?.getAll()?.forEach((trigger: any) => trigger.kill())
      } catch (error) {
        console.warn("Error cleaning up ScrollTrigger:", error)
      }
    }
  }, [sectionRef, islandRef])
}

// Custom hook for skill animations
function useSkillAnimations(islandRef: React.RefObject<HTMLDivElement | null>, activeIsland: number) {
  useEffect(() => {
    if (!islandRef.current) return

    const skills = islandRef.current.querySelectorAll(".skill-item")
    
    if (skills.length === 0) return

    try {
      gsap.fromTo(skills, ANIMATION_CONFIG.skills.from, ANIMATION_CONFIG.skills.to)
    } catch (error) {
      console.warn("Error animating skills:", error)
    }
  }, [activeIsland, islandRef])
}

// Memoized skill item component
const SkillItem = React.memo(({ skill }: { skill: Skill }) => {
  // Validate skill level
  const validatedLevel = Math.max(0, Math.min(100, skill.level))
  
  return (
    <div className="skill-item relative group/skill">
      <div className="relative aspect-square flex items-center justify-center">
        <div
          className="absolute inset-0 bg-secondary/50 group-hover/skill:bg-primary transition-all duration-500 group-hover/skill:scale-110 group-hover/skill:rotate-6"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
        />
        <div className="relative z-10 text-center px-4">
          <span 
            className="block text-xl font-bold text-foreground group-hover/skill:text-primary-foreground mb-1 transition-colors"
            aria-label={`${skill.name} proficiency: ${validatedLevel} percent`}
          >
            {validatedLevel}%
          </span>
          <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover/skill:text-primary-foreground transition-colors">
            {skill.name}
          </span>
        </div>
      </div>
    </div>
  )
})

SkillItem.displayName = 'SkillItem'

// Memoized navigation button component
const NavigationButton = React.memo(({ 
  onClick, 
  icon: Icon, 
  label, 
  direction 
}: { 
  onClick: () => void
  icon: LucideIcon
  label: string
  direction: 'prev' | 'next'
}) => (
  <button
    onClick={onClick}
    className="p-4 rounded-2xl bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    aria-label={label}
    type="button"
  >
    <Icon className="w-6 h-6" />
  </button>
))

NavigationButton.displayName = 'NavigationButton'

export function Skills() {
  const [activeIsland, setActiveIsland] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const islandRef = useRef<HTMLDivElement>(null)

  // Validate activeIsland index
  const safeActiveIsland = Math.max(0, Math.min(SKILL_ISLANDS.length - 1, activeIsland))
  const currentIsland = SKILL_ISLANDS[safeActiveIsland]

  // Custom hooks for animations
  useGSAPAnimations(sectionRef, islandRef)
  useSkillAnimations(islandRef, safeActiveIsland)

  // Memoized navigation functions
  const nextIsland = useCallback(() => {
    setActiveIsland((prev) => (prev + 1) % SKILL_ISLANDS.length)
  }, [])

  const prevIsland = useCallback(() => {
    setActiveIsland((prev) => (prev - 1 + SKILL_ISLANDS.length) % SKILL_ISLANDS.length)
  }, [])

  const selectIsland = useCallback((index: number) => {
    if (index >= 0 && index < SKILL_ISLANDS.length) {
      setActiveIsland(index)
    }
  }, [])

  // Memoized background rotation style
  const backgroundStyle = useMemo(() => ({
    transform: `translate(-50%, -50%) rotate(${safeActiveIsland * 90}deg)`,
  }), [safeActiveIsland])

  // Memoized progress indicators
  const progressIndicators = useMemo(() => 
    SKILL_ISLANDS.map((_, i) => (
      <div
        key={`indicator-${i}`}
        className={cn(
          "h-1 rounded-full transition-all duration-500",
          i === safeActiveIsland ? "w-8 bg-primary" : "w-2 bg-primary/20",
        )}
      />
    )), [safeActiveIsland]
  )

  // Error boundary fallback
  if (!currentIsland) {
    return (
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">Unable to load skills data. Please try again later.</p>
        </div>
      </section>
    )
  }

  return (
    <section 
      ref={sectionRef} 
      id="skills" 
      className="py-24 relative overflow-hidden bg-background"
      aria-labelledby="skills-heading"
    >
      {/* Animated background */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] transition-all duration-1000"
          style={backgroundStyle}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <header className="text-center mb-16 skills-header">
          <h2 id="skills-heading" className="text-3xl md:text-4xl font-extrabold mb-4">
            My Tech Universe
          </h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6" aria-hidden="true" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore my skill islands - from frontend craftsmanship to data analysis and backend architecture.
          </p>
        </header>

        {/* Main content */}
        <div className="relative group max-w-5xl mx-auto">
          <div
            ref={islandRef}
            className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-primary/5"
          >
            {/* Island header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-6">
                <div 
                  className="bg-primary/20 p-5 rounded-3xl text-primary shadow-lg shadow-primary/20 animate-pulse"
                  aria-hidden="true"
                >
                  {currentIsland.icon}
                </div>
                <div>
                  <h3 className="text-3xl font-bold tracking-tight mb-1">
                    {currentIsland.title}
                  </h3>
                  <div className="flex gap-1" role="progressbar" aria-label="Island navigation progress">
                    {progressIndicators}
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <nav className="flex gap-4" aria-label="Island navigation">
                <NavigationButton
                  onClick={prevIsland}
                  icon={ChevronLeft}
                  label="Previous skill island"
                  direction="prev"
                />
                <NavigationButton
                  onClick={nextIsland}
                  icon={ChevronRight}
                  label="Next skill island"
                  direction="next"
                />
              </nav>
            </div>

            {/* Skills grid */}
            <div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-8"
              role="grid"
              aria-label={`${currentIsland.title} skills`}
            >
              {currentIsland.skills.map((skill) => (
                <div key={`${currentIsland.id}-${skill.name}`} role="gridcell">
                  <SkillItem skill={skill} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Island selector */}
        <nav className="flex justify-center gap-4 mt-12 overflow-x-auto py-4" aria-label="Select skill island">
          {SKILL_ISLANDS.map((island, idx) => (
            <button
              key={island.id}
              onClick={() => selectIsland(idx)}
              className={cn(
                "px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                safeActiveIsland === idx
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30"
                  : "bg-card/50 text-muted-foreground border-border hover:border-primary/50",
              )}
              aria-pressed={safeActiveIsland === idx}
              type="button"
            >
              {island.title.split(" ")[0]}
            </button>
          ))}
        </nav>
      </div>
    </section>
  )
}