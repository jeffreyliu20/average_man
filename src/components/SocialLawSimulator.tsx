import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface SliderConfig {
  id: string
  label: string
  description: string
  min: number
  max: number
  default: number
  unit: string
}

const SLIDERS: SliderConfig[] = [
  { id: 'education', label: 'Education', description: 'Years of public schooling available', min: 0, max: 100, default: 50, unit: '%' },
  { id: 'wages', label: 'Wages', description: 'Adequacy of labor compensation', min: 0, max: 100, default: 50, unit: '%' },
  { id: 'sanitation', label: 'Sanitation', description: 'Quality of urban sanitation infrastructure', min: 0, max: 100, default: 50, unit: '%' },
  { id: 'foodSecurity', label: 'Food security', description: 'Reliability of food supply', min: 0, max: 100, default: 50, unit: '%' },
  { id: 'policing', label: 'Policing', description: 'Presence of enforcement apparatus', min: 0, max: 100, default: 50, unit: '%' },
]

interface Conditions {
  education: number
  wages: number
  sanitation: number
  foodSecurity: number
  policing: number
}

// Probabilistic model: outputs are stochastic aggregates, not deterministic
function simulateRates(c: Conditions) {
  const wellbeing = (c.education * 0.25 + c.wages * 0.3 + c.sanitation * 0.2 + c.foodSecurity * 0.25) / 100

  // Base crime rate: deprivation increases rate, policing slightly suppresses *recorded* crime
  const baseCrime = 0.22 - wellbeing * 0.14 + (1 - c.policing / 100) * 0.03
  const crimeVariance = 0.025

  // Marriage rate: stability → more formal partnerships
  const baseMarriage = 0.4 + wellbeing * 0.2

  // Mortality: deprivation kills
  const baseMortality = 0.18 - wellbeing * 0.1

  // Social instability: composite
  const baseInstability = 1 - wellbeing * 0.7 - (c.policing / 100) * 0.1

  // Simulate 20 years with light stochastic noise
  const years: { year: number; crime: number; marriage: number; mortality: number; instability: number }[] = []
  let seed = 7
  function noise() {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff
    return (seed >>> 0) / 0x100000000
  }

  for (let y = 1; y <= 20; y++) {
    const n = () => (noise() + noise() + noise() - 1.5) / 1.5 // approx normal [-1, 1]
    years.push({
      year: 1830 + y,
      crime: Math.max(0, Math.min(1, baseCrime + n() * crimeVariance)),
      marriage: Math.max(0, Math.min(1, baseMarriage + n() * 0.02)),
      mortality: Math.max(0, Math.min(1, baseMortality + n() * 0.015)),
      instability: Math.max(0, Math.min(1, baseInstability + n() * 0.03)),
    })
  }

  return {
    years,
    crimeRate: +(baseCrime * 100).toFixed(1),
    marriageRate: +(baseMarriage * 100).toFixed(1),
    mortalityRate: +(baseMortality * 100).toFixed(1),
    instabilityScore: +(baseInstability * 100).toFixed(1),
  }
}

const REFLECTIONS = [
  "If the pattern is social, who is responsible?",
  "Is crime an individual act, a social symptom, or both?",
  "When rates are stable across decades, is the criminal a product of conditions—or of choices?",
  "If improving wages reduces crime, does that exonerate the individual?",
  "Statistics describe what is. They cannot tell you what ought to be.",
]

export default function SocialLawSimulator() {
  const [conditions, setConditions] = useState<Conditions>({
    education: 50,
    wages: 50,
    sanitation: 50,
    foodSecurity: 50,
    policing: 50,
  })
  const [reflectionIdx, setReflectionIdx] = useState(0)
  const [showReflection, setShowReflection] = useState(false)

  const results = useMemo(() => simulateRates(conditions), [conditions])

  const handleSlider = (id: string, value: number) => {
    setConditions((prev) => ({ ...prev, [id]: value }))
  }

  const handleReflect = () => {
    setReflectionIdx((i) => (i + 1) % REFLECTIONS.length)
    setShowReflection(true)
  }

  return (
    <section
      id="social-law"
      className="py-24 bg-paper section-snap rule-top"
      aria-label="Crime, freedom, and social law simulator"
    >
      <div className="max-w-5xl mx-auto px-8">
        <div className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-inkfaint mb-4">
            Section V
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-5">
            Crime, Freedom, and Social Law
          </h2>
          <div className="w-16 h-px bg-rule mx-auto mb-6" aria-hidden="true" />
          <p className="font-sans text-base text-inkfaint max-w-xl mx-auto leading-relaxed">
            Crime rates, Quetelet observed, are stable across years. Society has its
            budget of crimes, as surely as it has its budget of taxes.
            If so—does that imply freedom is an illusion? And if conditions determine
            outcomes, who bears responsibility?
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Sliders */}
          <div className="md:col-span-2 space-y-6">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-inkfaint mb-6">
              Social conditions
            </p>
            {SLIDERS.map((s) => (
              <div key={s.id}>
                <div className="flex justify-between mb-1.5">
                  <label
                    htmlFor={`slider-${s.id}`}
                    className="font-sans text-sm text-inklight"
                  >
                    {s.label}
                  </label>
                  <span className="font-sans text-xs text-accent font-medium">
                    {conditions[s.id as keyof Conditions]}%
                  </span>
                </div>
                <p className="font-sans text-xs text-inkfaint mb-2">{s.description}</p>
                <input
                  id={`slider-${s.id}`}
                  type="range"
                  min={s.min}
                  max={s.max}
                  value={conditions[s.id as keyof Conditions]}
                  onChange={(e) => handleSlider(s.id, Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer"
                  aria-label={`${s.label}: ${conditions[s.id as keyof Conditions]}%`}
                />
              </div>
            ))}
          </div>

          {/* Chart + outputs */}
          <div className="md:col-span-3 space-y-6">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-inkfaint">
              Simulated rates, 1831–1850
            </p>
            <p className="font-sans text-xs text-inkfaint italic">
              These are probabilistic aggregates. No individual is determined by these conditions.
            </p>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={results.years} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="#C4B8A8" strokeOpacity={0.5} />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 9, fill: '#7A7370' }}
                  tickLine={false}
                  axisLine={{ stroke: '#C4B8A8' }}
                />
                <YAxis
                  domain={[0, 0.5]}
                  tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  tick={{ fontSize: 9, fill: '#7A7370' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ background: '#F5F0E8', border: '1px solid #C4B8A8', fontSize: 10, fontFamily: 'Inter', borderRadius: 0 }}
                  formatter={(v: number, name: string) => [`${(v * 100).toFixed(1)}%`, name]}
                />
                <Line type="monotone" dataKey="crime" name="Crime rate" stroke="#8B2E2E" strokeWidth={2} dot={false} isAnimationActive />
                <Line type="monotone" dataKey="marriage" name="Marriage rate" stroke="#2B4B6F" strokeWidth={2} dot={false} isAnimationActive />
                <Line type="monotone" dataKey="mortality" name="Mortality rate" stroke="#7A7370" strokeWidth={1.5} dot={false} strokeDasharray="4 3" isAnimationActive />
              </LineChart>
            </ResponsiveContainer>

            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Crime rate', value: `${results.crimeRate}%`, color: 'text-warn' },
                { label: 'Marriage rate', value: `${results.marriageRate}%`, color: 'text-accent' },
                { label: 'Mortality rate', value: `${results.mortalityRate}%`, color: 'text-inkfaint' },
                { label: 'Social instability', value: `${results.instabilityScore}%`, color: results.instabilityScore > 40 ? 'text-warn' : 'text-inklight' },
              ].map((stat) => (
                <div key={stat.label} className="border border-rule p-3">
                  <p className="font-sans text-xs text-inkfaint mb-1">{stat.label}</p>
                  <p className={`font-serif text-xl font-semibold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Reflection prompt */}
            <div className="pt-2">
              <button
                onClick={handleReflect}
                className="font-sans text-xs tracking-[0.2em] uppercase border border-rule text-inkfaint px-5 py-2 hover:border-ink hover:text-ink transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Show philosophical reflection"
              >
                Reflect →
              </button>

              <AnimatePresence mode="wait">
                {showReflection && (
                  <motion.blockquote
                    key={reflectionIdx}
                    className="mt-5 border-l-2 border-inkfaint pl-5"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="font-serif italic text-base text-inklight leading-relaxed">
                      {REFLECTIONS[reflectionIdx]}
                    </p>
                  </motion.blockquote>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
