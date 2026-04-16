import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { POPULATION, Person } from '../data/population'

const TRAIT_LABELS: Record<string, string> = {
  height: 'Height',
  weight: 'Weight',
  income: 'Income',
  education: 'Education',
  maritalStatus: 'Marital status',
  healthScore: 'Health',
  crimeRisk: 'Crime risk',
  mortalityRisk: 'Mortality risk',
}

const UNITS: Record<string, string> = {
  height: ' cm',
  weight: ' kg',
  income: ' units/yr',
  education: ' yrs',
  maritalStatus: '',
  healthScore: '/100',
  crimeRisk: '',
  mortalityRisk: '',
}

function formatValue(key: keyof Person, value: unknown): string {
  if (key === 'maritalStatus') return value as string
  if (key === 'crimeRisk' || key === 'mortalityRisk')
    return ((value as number) * 100).toFixed(1) + '%'
  return String(value) + UNITS[key]
}

function PersonCard({ person, onClose }: { person: Person; onClose: () => void }) {
  const traitKeys = Object.keys(TRAIT_LABELS) as (keyof Person)[]
  return (
    <motion.div
      className="absolute z-30 bg-paper border border-rule shadow-lg p-4 w-52 text-xs font-sans"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      style={{ pointerEvents: 'all' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-serif text-sm text-ink">No. {person.id + 1}</span>
        <button
          onClick={onClose}
          className="text-inkfaint hover:text-ink"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="h-px bg-rule mb-3" />
      <ul className="space-y-1">
        {traitKeys.map((k) => (
          <li key={k} className="flex justify-between">
            <span className="text-inkfaint">{TRAIT_LABELS[k]}</span>
            <span className="text-inklight font-medium">{formatValue(k, person[k])}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function PopulationSwarm({ condensed = false }: { condensed?: boolean }) {
  const [selected, setSelected] = useState<Person | null>(null)
  const people = POPULATION.slice(0, 120)

  // Grid layout: 12 × 10
  const cols = 12
  const cellW = 100 / cols
  const cellH = 100 / 10

  return (
    <section
      id="swarm"
      className="py-24 bg-paper section-snap"
      aria-label="Individual variation in the population"
    >
      <div className="max-w-5xl mx-auto px-8">
        <div className="mb-12 text-center">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-inkfaint mb-4">
            Section I
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-5">
            Too Many Individuals
          </h2>
          <div className="w-16 h-px bg-rule mx-auto mb-6" aria-hidden="true" />
          <p className="font-sans text-base text-inkfaint max-w-xl mx-auto leading-relaxed">
            A science of society cannot begin with singular lives.
            Each person is too varied, too particular, too irreducible.
            Hover or tap any figure to inspect their traits.
          </p>
        </div>

        {/* Swarm grid */}
        <div
          className="relative w-full"
          style={{ paddingBottom: '80%' }}
          role="list"
          aria-label="Population of 120 individuals"
        >
          {people.map((p, i) => {
            const col = i % cols
            const row = Math.floor(i / cols)
            const x = col * cellW + cellW * 0.5
            const y = row * cellH + cellH * 0.5
            const isSelected = selected?.id === p.id

            return (
              <motion.button
                key={p.id}
                className="absolute focus:outline-none focus:ring-2 focus:ring-accent rounded-sm"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                role="listitem"
                aria-label={`Individual ${p.id + 1}`}
                onClick={() => setSelected(isSelected ? null : p)}
                whileHover={{ scale: 1.5 }}
                animate={
                  condensed
                    ? { opacity: 0.2, scale: 0.7 }
                    : { opacity: 1, scale: 1 }
                }
                transition={{ duration: 0.4, delay: condensed ? Math.random() * 0.3 : 0 }}
              >
                {/* Silhouette */}
                <svg
                  width="18"
                  height="24"
                  viewBox="0 0 18 24"
                  aria-hidden="true"
                  fill={isSelected ? '#2B4B6F' : '#3D3D3D'}
                  opacity={0.55 + (p.healthScore / 100) * 0.35}
                >
                  <ellipse cx="9" cy="5" rx="4" ry="4.5" />
                  <path d="M2 24 C2 15 16 15 16 24 Z" />
                </svg>
              </motion.button>
            )
          })}

          {/* Person detail card */}
          <AnimatePresence>
            {selected && (
              <PersonCard
                key={selected.id}
                person={selected}
                onClose={() => setSelected(null)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Noise caption */}
        <motion.p
          className="mt-8 text-center font-serif italic text-inkfaint text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          120 individuals. 120 different lives. Where does society begin?
        </motion.p>
      </div>
    </section>
  )
}
