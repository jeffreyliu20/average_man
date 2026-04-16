import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { POPULATION } from '../data/population'

interface Particle {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  opacity: number
  size: number
}

function buildParticles(w: number, h: number): Particle[] {
  const cols = 12
  const rows = Math.ceil(POPULATION.length / cols)
  const cellW = w / cols
  const cellH = h / rows

  return POPULATION.slice(0, 120).map((p, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    return {
      id: p.id,
      x: w / 2 + (Math.random() - 0.5) * 20, // start near center
      y: h / 2 + (Math.random() - 0.5) * 20,
      targetX: col * cellW + cellW / 2,
      targetY: row * cellH + cellH / 2,
      opacity: 0.5 + (p.healthScore / 100) * 0.4,
      size: 10 + (p.height - 145) / 55 * 6,
    }
  })
}

export default function EndingSection() {
  const [dissolved, setDissolved] = useState(false)
  const [animating, setAnimating] = useState(false)
  const shouldReduce = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDissolve = () => {
    if (animating) return
    setAnimating(true)
    setTimeout(
      () => {
        setDissolved(true)
        setAnimating(false)
      },
      shouldReduce ? 100 : 1400
    )
  }

  const handleReturn = () => {
    setDissolved(false)
  }

  const cols = 12
  const people = POPULATION.slice(0, 120)

  return (
    <section
      id="ending"
      className="py-24 bg-paper section-snap rule-top"
      aria-label="Conclusion"
    >
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center mb-16">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-inkfaint mb-4">
            Conclusion
          </p>
          <motion.h2
            className="font-serif text-4xl md:text-5xl text-ink mb-5 leading-tight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            The Weight of the Mean
          </motion.h2>
          <div className="w-16 h-px bg-rule mx-auto mb-8" aria-hidden="true" />

          <motion.div
            className="max-w-2xl mx-auto space-y-5 text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="font-sans text-base text-inklight leading-relaxed">
              The average man helped invent social science. Before Quetelet,
              there was no systematic way to speak about society as an object of knowledge—
              something with regularities, patterns, predictable tendencies.
              The average made that possible.
            </p>
            <p className="font-sans text-base text-inklight leading-relaxed">
              But the average man also taught modern societies to mistake statistical order
              for human truth. The mean became a norm. The norm became an ideal.
              The ideal became a standard against which real, varied, irreducible people
              were quietly measured and found wanting.
            </p>
          </motion.div>

          {/* Pull quote */}
          <motion.blockquote
            className="mt-12 mb-10 mx-auto max-w-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-8 h-px bg-rule mx-auto mb-5" aria-hidden="true" />
            <p className="font-serif text-xl md:text-2xl italic text-ink leading-snug">
              The average man helped invent social science.
              He also taught modern societies to mistake statistical order for human truth.
            </p>
            <div className="w-8 h-px bg-rule mx-auto mt-5" aria-hidden="true" />
          </motion.blockquote>
        </div>

        {/* Composite figure → individuals interaction */}
        <div className="flex flex-col items-center gap-8">
          <AnimatePresence mode="wait">
            {!dissolved ? (
              <motion.div
                key="composite"
                className="flex flex-col items-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: shouldReduce ? 0.01 : 0.6 }}
              >
                {/* Composite figure */}
                <motion.div
                  animate={animating ? { scale: [1, 1.08, 0.95], opacity: [1, 0.8, 0.3] } : { scale: 1, opacity: 1 }}
                  transition={{ duration: shouldReduce ? 0.01 : 1.2 }}
                >
                  <svg width="120" height="168" viewBox="0 0 160 220" aria-label="Composite average man figure">
                    <ellipse cx="80" cy="215" rx="45" ry="6" fill="#C4B8A8" opacity="0.3" />
                    <path d="M80 70 C50 70 35 90 35 120 L35 170 C35 185 55 195 80 195 C105 195 125 185 125 170 L125 120 C125 90 110 70 80 70 Z" fill="#3D3D3D" opacity="0.85" />
                    <ellipse cx="80" cy="45" rx="28" ry="32" fill="#3D3D3D" opacity="0.85" />
                    <line x1="35" y1="115" x2="10" y2="155" stroke="#3D3D3D" strokeWidth="12" strokeLinecap="round" opacity="0.75" />
                    <line x1="125" y1="115" x2="150" y2="155" stroke="#3D3D3D" strokeWidth="12" strokeLinecap="round" opacity="0.75" />
                    <line x1="60" y1="190" x2="50" y2="220" stroke="#3D3D3D" strokeWidth="14" strokeLinecap="round" opacity="0.8" />
                    <line x1="100" y1="190" x2="110" y2="220" stroke="#3D3D3D" strokeWidth="14" strokeLinecap="round" opacity="0.8" />
                  </svg>
                </motion.div>

                <button
                  onClick={handleDissolve}
                  disabled={animating}
                  className="font-sans text-sm tracking-[0.2em] uppercase border border-ink text-ink px-10 py-3 hover:bg-ink hover:text-paper transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper disabled:opacity-40"
                  aria-label="Return to the individuals"
                >
                  Return to the Individuals
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="individuals"
                className="flex flex-col items-center gap-8 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: shouldReduce ? 0.01 : 0.8 }}
              >
                {/* Individual swarm */}
                <div
                  ref={containerRef}
                  className="relative w-full"
                  style={{ paddingBottom: '60%' }}
                  aria-label="Population of 120 individuals"
                >
                  {people.map((p, i) => {
                    const col = i % cols
                    const row = Math.floor(i / cols)
                    const x = (col / cols) * 100 + (100 / cols) * 0.5
                    const y = (row / 10) * 100 + (100 / 10) * 0.5
                    return (
                      <motion.div
                        key={p.id}
                        className="absolute"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        initial={{ opacity: 0, scale: 0, x: '0%', y: '0%' }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: shouldReduce ? 0.01 : 0.5,
                          delay: shouldReduce ? 0 : i * 0.006,
                          type: 'spring',
                          stiffness: 80,
                        }}
                      >
                        <svg
                          width="14"
                          height="18"
                          viewBox="0 0 18 24"
                          aria-hidden="true"
                          fill="#3D3D3D"
                          opacity={0.4 + (p.healthScore / 100) * 0.45}
                        >
                          <ellipse cx="9" cy="5" rx="4" ry="4.5" />
                          <path d="M2 24 C2 15 16 15 16 24 Z" />
                        </svg>
                      </motion.div>
                    )
                  })}
                </div>

                <motion.p
                  className="font-serif italic text-base text-inkfaint text-center max-w-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: shouldReduce ? 0 : 1.2 }}
                >
                  The average was always built from many irreducible lives.
                </motion.p>

                <button
                  onClick={handleReturn}
                  className="font-sans text-xs tracking-[0.2em] uppercase border border-rule text-inkfaint px-6 py-2 hover:border-ink hover:text-ink transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Return to composite view"
                >
                  ← Return to composite
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.footer
          className="mt-24 text-center border-t border-rule pt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="font-sans text-xs text-inkfaint tracking-widest uppercase mb-2">
            An interactive exhibit on the history of statistics
          </p>
          <p className="font-sans text-xs text-inkfaint">
            After Adolphe Quetelet, <em>Sur l'homme et le développement de ses facultés</em>, 1835
          </p>
        </motion.footer>
      </div>
    </section>
  )
}
