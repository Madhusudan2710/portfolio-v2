"use client"

import { useEffect, useRef, useCallback, useMemo, useState } from "react"
import { gsap } from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { Github, ExternalLink, FolderCode } from "lucide-react"
import Link from "next/link"

gsap.registerPlugin(ScrollTrigger)

// =====================
// Types
// =====================
interface RawProject {
  id: string
  name: string
  description: string
  technologies: string[]
  link: string
  github?: string
}

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  link: string
  github?: string
  icon: React.ReactNode
}

// =====================
// Component
// =====================
export function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null)
  const [projects, setProjects] = useState<Project[]>([])

  // =====================
  // Fetch & normalize data
  // =====================
  useEffect(() => {
    fetch("/projects.json")
      .then((res) => res.json())
      .then((data: RawProject[]) => {
        const normalized: Project[] = data.map((p) => ({
          id: p.id,
          title: p.name,
          description: p.description,
          tags: p.technologies,
          link: p.link,
          github: p.github,
          icon: <FolderCode className="w-16 h-16" />,
        }))
        setProjects(normalized)
      })
  }, [])

  // =====================
  // Animations
  // =====================
  useEffect(() => {
    if (!sectionRef.current || projects.length === 0) return

    const ctx = gsap.context(() => {
      gsap.from(".portfolio-header", {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })

      gsap.from(".project-card", {
        y: 80,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".projects-grid",
          start: "top 75%",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [projects])

  // =====================
  // Render card
  // =====================
  const renderProjectCard = useCallback((project: Project) => {
    return (
      <article
        key={project.id} // ✅ STABLE UNIQUE KEY
        className="project-card group relative bg-card/40 backdrop-blur-sm border border-border/50 rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
        aria-labelledby={`project-${project.id}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="relative h-56 bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center p-12">
            <div className="text-primary/40 group-hover:text-primary group-hover:scale-125 transition-all duration-700">
              {project.icon}
            </div>

            {/* Overlay */}
            <nav className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-6">
              {project.github && (
                <Link href={project.github} target="_blank" aria-label="GitHub">
                  <Github className="w-6 h-6 text-background" />
                </Link>
              )}
              <Link href={project.link} target="_blank" aria-label="Live Demo">
                <ExternalLink className="w-6 h-6 text-background" />
              </Link>
            </nav>
          </header>

          {/* Content */}
          <div className="p-10 flex-1 flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[10px] font-bold uppercase bg-primary/10 text-primary rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3
              id={`project-${project.id}`}
              className="text-2xl font-bold mb-3 group-hover:text-primary"
            >
              {project.title}
            </h3>

            <p className="text-muted-foreground flex-1">
              {project.description}
            </p>
          </div>
        </div>
      </article>
    )
  }, [])

  // =====================
  // JSX
  // =====================
  return (
    <section ref={sectionRef} id="portfolio" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <header className="portfolio-header text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4">My Portfolio</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent projects and work.
          </p>
        </header>

        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {projects.map(renderProjectCard)}
        </div>
      </div>
    </section>
  )
}
