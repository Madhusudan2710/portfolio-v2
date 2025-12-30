"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

gsap.registerPlugin(ScrollTrigger)

const experiences = [
  {
    title: "Senior Full Stack Developer",
    company: "TechNova Solutions",
    period: "2022 - Present",
    description: "Lead developer for enterprise-level React applications, optimizing performance by 40%.",
    skills: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
  },
  {
    title: "Frontend Engineer",
    company: "Creative Digital Agency",
    period: "2020 - 2022",
    description: "Built high-performance marketing sites and interactive dashboards using GSAP and Framer Motion.",
    skills: ["React", "GSAP", "Tailwind CSS", "Three.js"],
  },
  {
    title: "Software Engineer Intern",
    company: "StartUp Inc.",
    period: "2019 - 2020",
    description: "Developed and maintained internal tools and contributed to the migration from REST to GraphQL.",
    skills: ["JavaScript", "React", "Express", "MongoDB"],
  },
]

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
          },
          x: i % 2 === 0 ? -50 : 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="experience" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center tracking-tight">
          Professional <span className="text-primary italic">Journey</span>
        </h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />

          {experiences.map((exp, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) cardsRef.current[i] = el
              }}
              className={`relative mb-12 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto text-left"}`}
            >
              {/* Timeline Dot */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background hidden md:block" />

              <Card className="bg-background/40 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <span className="text-sm font-mono text-primary mb-2 block">{exp.period}</span>
                  <h3 className="text-xl font-bold mb-1">{exp.title}</h3>
                  <p className="text-muted-foreground font-medium mb-4">{exp.company}</p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{exp.description}</p>
                  <div className={`flex flex-wrap gap-2 ${i % 2 === 0 ? "md:justify-end" : "justify-start"}`}>
                    {exp.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
