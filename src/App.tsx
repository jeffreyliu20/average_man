import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HeroSection from './components/HeroSection'
import PopulationSwarm from './components/PopulationSwarm'
import AverageTransformation from './components/AverageTransformation'
import ExplanationSection from './components/ExplanationSection'
import InterpretationToggle from './components/InterpretationToggle'
import SocialLawSimulator from './components/SocialLawSimulator'
import CritiqueSection from './components/CritiqueSection'
import EndingSection from './components/EndingSection'

const NAV_ITEMS = [
  { id: 'hero', label: 'Intro' },
  { id: 'swarm', label: 'I. Individuals' },
  { id: 'transform', label: 'II. Average' },
  { id: 'explanation', label: 'III. What It Is' },
  { id: 'norm', label: 'IV. The Norm' },
  { id: 'social-law', label: 'V. Social Law' },
  { id: 'critique', label: 'VI. Critique' },
  { id: 'ending', label: 'Conclusion' },
]

function SideNav({ activeSection }: { activeSection: string }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-3"
      aria-label="Section navigation"
    >
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className="group flex items-center gap-2 focus:outline-none"
          aria-label={`Navigate to ${item.label}`}
          aria-current={activeSection === item.id ? 'true' : undefined}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              activeSection === item.id
                ? 'bg-accent scale-150'
                : 'bg-rule group-hover:bg-inkfaint'
            }`}
          />
          <span
            className={`font-sans text-xs transition-all duration-200 whitespace-nowrap ${
              activeSection === item.id
                ? 'text-accent opacity-100'
                : 'text-inkfaint opacity-0 group-hover:opacity-100'
            }`}
          >
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  )
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [computed, setComputed] = useState(false)

  // Intersection observer for section tracking
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [started])

  const handleBegin = useCallback(() => {
    setStarted(true)
    setTimeout(() => {
      document.getElementById('swarm')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [])

  return (
    <div className="relative min-h-screen bg-paper grain">
      <SideNav activeSection={activeSection} />

      <main>
        <HeroSection onBegin={handleBegin} />

        <AnimatePresence>
          {started && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <PopulationSwarm condensed={computed} />
              <AverageTransformation onComputed={() => setComputed(true)} />
              <ExplanationSection />
              <InterpretationToggle />
              <SocialLawSimulator />
              <CritiqueSection />
              <EndingSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
