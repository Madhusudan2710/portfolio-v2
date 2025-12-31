"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

interface Experience {
    period: string
    title: string
    company: string
    description: string
    skills: string[]
    certificate?: string
}

export function Experience() {
    const sectionRef = useRef<HTMLElement>(null)
    const cardsRef = useRef<HTMLDivElement[]>([])
    const [experience, setExperience] = useState<Experience[]>([])
    const [activeCertificate, setActiveCertificate] = useState<string | null>(null)

    useEffect(() => {
        fetch("/experience.json")
            .then((res) => res.json())
            .then((data: Experience[]) => setExperience(data))
    }, [])

    useEffect(() => {
        const ctx = gsap.context(() => {
            cardsRef.current.forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom-=100",
                    },
                    x: i % 2 === 0 ? -50 : 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                })
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [experience])

    return (
        <section
            ref={sectionRef}
            id="experience"
            className="py-24 relative overflow-hidden"
        >
            <div className="container mx-auto px-6">
                <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">
                    Professional <span className="text-primary italic">Journey</span>
                </h2>

                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />

                    {experience.map((exp, i) => (
                        <div
                            key={i}
                            ref={(el) => {
                                if (el) {
                                    cardsRef.current[i] = el
                                }
                            }}

                            className={`relative mb-12 md:w-1/2 ${i % 2 === 0
                                ? "md:pr-12 md:text-right"
                                : "md:pl-12 md:ml-auto"
                                }`}
                        >
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background hidden md:block" />

                            <Card className="bg-background/40 backdrop-blur-sm border border-primary/20 rounded-xl shadow-lg">
                                <CardContent className="p-8">
                                    <span className="text-sm font-mono text-primary block mb-2">
                                        {exp.period}
                                    </span>

                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                                            {exp.title}
                                        </h3>

                                        {exp.certificate && (
                                            <button
                                                type="button"
                                                title="View Certificate"
                                                onClick={() => exp.certificate && setActiveCertificate(exp.certificate)}

                                                className="text-primary"
                                                onMouseEnter={(e) =>
                                                    gsap.to(e.currentTarget, {
                                                        scale: 1.15,
                                                        rotate: 10,
                                                        duration: 0.3,
                                                    })
                                                }
                                                onMouseLeave={(e) =>
                                                    gsap.to(e.currentTarget, {
                                                        scale: 1,
                                                        rotate: 0,
                                                        duration: 0.3,
                                                    })
                                                }
                                            >
                                                <ExternalLink size={20} />
                                            </button>
                                        )}
                                    </div>

                                    <p className="text-muted-foreground font-semibold mb-4">
                                        {exp.company}
                                    </p>

                                    <p className="text-muted-foreground mb-6">
                                        {exp.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {exp.skills.map((skill) => (
                                            <Badge key={skill} variant="secondary">
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

            {/* ✅ MODAL  */}
            {activeCertificate && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setActiveCertificate(null)}
                >
                    <div
                        className="relative bg-background rounded-2xl shadow-2xl 
                 w-[95vw] max-w-5xl h-[90vh] 
                 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-3 right-4 z-10 
                   text-muted-foreground hover:text-primary 
                   text-2xl font-bold"
                            onClick={() => setActiveCertificate(null)}
                        >
                            ✕
                        </button>

                        {/* Content Wrapper */}
                        <div className="w-full h-full pt-10">
                            <iframe
                                src={activeCertificate}
                                className="w-full h-full border-none"
                                title="Certificate Viewer"
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
