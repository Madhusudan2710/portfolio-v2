"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function Skills() {
	const [activeIsland, setActiveIsland] = useState(0)
	const [skills, setSkills] = useState([])

	const sectionRef = useRef<HTMLElement>(null)
	const islandRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		fetch("/api/skills")
			.then((response) => response.json())
			.then((data) => setSkills(data))
	}, [])

	useEffect(() => {
		if (!sectionRef.current || typeof window === "undefined") return

		const ScrollTrigger = require("gsap/ScrollTrigger").ScrollTrigger
		gsap.registerPlugin(ScrollTrigger)

		gsap.from(sectionRef.current.querySelector(".skills-header"), {
			y: 50,
			opacity: 0,
			duration: 1,
			scrollTrigger: {
				trigger: sectionRef.current,
				start: "top 80%",
				toggleActions: "play none none reverse",
			},
		})

		gsap.from(islandRef.current, {
			scale: 0.95,
			opacity: 0,
			duration: 1.2,
			ease: "expo.out",
			scrollTrigger: {
				trigger: sectionRef.current,
				start: "top 60%",
				toggleActions: "play none none reverse",
			},
		})

		return () => {
			ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
		}
	}, [])

	useEffect(() => {
		if (!islandRef.current) return

		const skillItems = islandRef.current.querySelectorAll(".skill-item")

		gsap.fromTo(
			skillItems,
			{ y: 20, opacity: 0, scale: 0.8 },
			{ y: 0, opacity: 1, scale: 1, stagger: 0.05, duration: 0.5, ease: "back.out(1.7)" },
		)
	}, [activeIsland])

	const nextIsland = () => setActiveIsland((prev) => (prev + 1) % skills.length)
	const prevIsland = () => setActiveIsland((prev) => (prev - 1 + skills.length) % skills.length)

	return (
		<section ref={sectionRef} id="skills" className="py-24 relative overflow-hidden bg-background">
			<div className="absolute inset-0 z-0 pointer-events-none">
				<div
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] transition-all duration-1000"
					style={{
						transform: `translate(-50%, -50%) rotate(${activeIsland * 90}deg)`,
					}}
				/>
			</div>

			<div className="container mx-auto px-6 relative z-10">
				<div className="text-center mb-16 skills-header">
					<h2 className="text-3xl md:text-4xl font-extrabold mb-4">My Tech Universe</h2>
					<div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6" />
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Explore my skill islands - from frontend craftsmanship to data analysis and backend architecture.
					</p>
				</div>

				<div className="relative group max-w-5xl mx-auto">
					<div
						ref={islandRef}
						className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-primary/5"
					>
						<div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
							<div className="flex items-center gap-6">
								<div className="bg-primary/20 p-5 rounded-3xl text-primary shadow-lg shadow-primary/20 animate-pulse">
									{skills[activeIsland]?.icon}
								</div>
								<div>
									<h3 className="text-3xl font-bold tracking-tight mb-1">{skills[activeIsland]?.title}</h3>
									<div className="flex gap-1">
										{[0, 1, 2, 3].map((i) => (
											<div
												key={i}
												className={cn(
													"h-1 rounded-full transition-all duration-500",
													i === activeIsland ? "w-8 bg-primary" : "w-2 bg-primary/20",
												)}
											/>
										))}
									</div>
								</div>
							</div>

							<div className="flex gap-4">
								<button
									onClick={prevIsland}
									className="p-4 rounded-2xl bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-border/50"
									aria-label="Previous island"
								>
									<ChevronLeft className="w-6 h-6" />
								</button>
								<button
									onClick={nextIsland}
									className="p-4 rounded-2xl bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-border/50"
									aria-label="Next island"
								>
									<ChevronRight className="w-6 h-6" />
								</button>
							</div>
						</div>

						<div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
							{skills[activeIsland]?.skills?.map((skill) => (
								<div key={skill.name} className="skill-item relative group/skill">
									<div className="relative aspect-square flex items-center justify-center">
										<div
											className="absolute inset-0 bg-secondary/50 group-hover/skill:bg-primary transition-all duration-500 group-hover/skill:scale-110 group-hover/skill:rotate-6"
											style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
										/>
										<div className="relative z-10 text-center px-4">
											<span className="block text-xl font-bold text-foreground group-hover/skill:text-primary-foreground mb-1 transition-colors">
												{skill.level}%
											</span>
											<span className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover/skill:text-primary-foreground transition-colors">
												{skill.name}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="flex justify-center gap-4 mt-12 overflow-x-auto py-4">
					{skills.map((island, idx) => (
						<button
							key={idx}
							onClick={() => setActiveIsland(idx)}
							className={cn(
								"px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border",
								activeIsland === idx
									? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30"
									: "bg-card/50 text-muted-foreground border-border hover:border-primary/50",
							)}
						>
							{island.title.split(" ")[0]}
						</button>
					))}
				</div>
			</div>
		</section>
	)
}
