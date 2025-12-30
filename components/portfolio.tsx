"use client"

import { useEffect, useRef, useCallback, useMemo } from "react"
import { gsap } from "gsap"
import { Github, ExternalLink } from "lucide-react"
import Link from "next/link"

// Type definitions
interface Project {
  title: string
  description: string
  tags: string[]
  link: string
  github?: string
  icon: React.ReactNode
}

// Move projects data to a separate file or make it dynamic
const projects: Project[] = [
  // ... existing projects data ...
]

// Animation configuration constants
const ANIMATION_CONFIG = {
  header: {
    y: 50,
    opacity: 0,
    duration: 1,
    trigger: {
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  },
  cards: {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out",
    trigger: {
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  },
} as const

export function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null)

  // Memoize ScrollTrigger import to avoid repeated requires
  const ScrollTrigger = useMemo(() => {
    if (typeof window === "undefined") return null
    return require("gsap/ScrollTrigger").ScrollTrigger
  }, [])

  // Cleanup function for ScrollTrigger instances
  const cleanupScrollTriggers = useCallback(() => {
    if (ScrollTrigger) {
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
    }
  }, [ScrollTrigger])

  // Animation setup function
  const setupAnimations = useCallback(() => {
    if (!sectionRef.current || !ScrollTrigger) return

    gsap.registerPlugin(ScrollTrigger)

    // Header animation with error handling
    const headerElement = sectionRef.current.querySelector(".portfolio-header")
    if (headerElement) {
      gsap.from(headerElement, {
        ...ANIMATION_CONFIG.header,
        scrollTrigger: {
          trigger: sectionRef.current,
          ...ANIMATION_CONFIG.header.trigger,
        },
      })
    }

    // Project cards animation with error handling
    const cards = sectionRef.current.querySelectorAll(".project-card")
    const gridElement = sectionRef.current.querySelector(".projects-grid")
    
    if (cards.length > 0 && gridElement) {
      gsap.from(cards, {
        ...ANIMATION_CONFIG.cards,
        scrollTrigger: {
          trigger: gridElement,
          ...ANIMATION_CONFIG.cards.trigger,
        },
      })
    }
  }, [ScrollTrigger])

  useEffect(() => {
    if (typeof window === "undefined") return

    setupAnimations()
    return cleanupScrollTriggers
  }, [setupAnimations, cleanupScrollTriggers])

  // Render project card component
  const renderProjectCard = useCallback((project: typeof projects[0]) => (
    <article
      key={project.title}
      className="project-card group relative bg-card/40 backdrop-blur-sm border border-border/50 rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
      role="article"
      aria-labelledby={`project-${project.title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="flex flex-col h-full">
        {/* Visual Header */}
        <header className="relative h-56 bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center p-12 overflow-hidden">
          <div
            className="text-primary/40 group-hover:text-primary group-hover:scale-125 transition-all duration-700 ease-out z-10"
            aria-hidden="true"
          >
            {project.icon}
          </div>

          {/* Geometric Decorations */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 group-hover:opacity-20 transition-opacity" aria-hidden="true">
            <div className="absolute -top-10 -left-10 w-40 h-40 border border-primary rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 border border-primary rounded-full" />
          </div>

          {/* Quick Action Overlay */}
          <nav className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm flex items-center justify-center gap-6 translate-y-full group-hover:translate-y-0">
            {project.github && (
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-background rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`View source code for ${project.title}`}
              >
                <Github className="w-6 h-6" />
              </Link>
            )}
            {project.link && (
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-background rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`Visit live demo of ${project.title}`}
              >
                <ExternalLink className="w-6 h-6" />
              </Link>
            )}
          </nav>
        </header>

        {/* Content */}
        <div className="p-10 flex-1 flex flex-col">
          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6" role="list" aria-label="Technologies used">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20"
                  role="listitem"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Title */}
          <h3
            id={`project-${project.title.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors"
          >
            {project.title}
          </h3>
          
          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
            {project.description}
          </p>

          {/* Footer with improved structure */}
          <footer className="flex items-center justify-between pt-6 border-t border-border/50">
            {project.link ? (
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold flex items-center gap-2 group/link text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1 transition-colors"
                aria-label={`View live project: ${project.title}`}
              >
                <span>View Live Project</span>
                <ExternalLink
                  className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            ) : (
              <span className="text-sm text-muted-foreground">Coming Soon</span>
            )}
          </footer>
        </div>
      </div>
    </article>
  ), [])

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="py-24 bg-background relative overflow-hidden"
      aria-labelledby="portfolio-heading"
    >
      {/* Decorative patterns */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-16 portfolio-header">
          <h2 id="portfolio-heading" className="text-3xl md:text-4xl font-extrabold mb-4">
            My Portfolio
          </h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6" aria-hidden="true" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work, ranging from web applications to data science analysis.
          </p>
        </header>

        {/* Projects Grid */}
        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {projects.length > 0 ? (
            projects.map(renderProjectCard)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No projects available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
