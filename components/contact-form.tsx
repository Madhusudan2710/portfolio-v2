"use client"

import type React from "react"

import { useState } from "react"
import { Send, User, Mail, MessageSquare, Type } from "lucide-react"
import { submitContactForm } from "@/app/actions/contact"
import { toast } from "sonner"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const result = await submitContactForm(formData)

    if (result.success) {
      toast.success(result.message)
      ;(event.target as HTMLFormElement).reset()
    } else {
      toast.error(result.message)
    }

    setIsSubmitting(false)
  }

  return (
    <div className="bg-card border border-border/50 rounded-3xl p-8 md:p-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full bg-secondary/30 border border-border/50 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="w-full bg-secondary/30 border border-border/50 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              required
              className="w-full bg-secondary/30 border border-border/50 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
            <textarea
              name="message"
              placeholder="Your Message"
              required
              rows={5}
              className="w-full bg-secondary/30 border border-border/50 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}
