import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { POPULATION, AVERAGE, Person } from '../data/population'

// Build bell-curve-like histogram for height
function buildHistogram(people: Person[], key: keyof Person, bins = 16) {
  const values = people.map((p) => p[key] as number)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const binSize = range / bins
  const data: { x: number; count: number }[] = []
  for (let i = 0; i < bins; i++) {
    const lo = min + i * binSize
    const hi = lo + binSize
    data.push({ x: +(lo + binSize / 2).toFixed(1), count: values.filter((v) => v >= lo && v < hi).length })
  }
  return data
}

const heightData = buildHistogram(POPULATION, 'height')

interface StatRow {
  label: string
  value: string
  sub: string
}

function getStats(): StatRow[] {
  return [
    { label: 'Height', value: `${AVERAGE.height} cm`, sub: 'average stature' },
    { label: 'Weight', value: `${AVERAGE.weight} kg`, sub: 'average mass' },
    { label: 'Income', value: `${AVERAGE.income} units`, sub: 'per annum' },
    { label: 'Education', value: `${AVERAGE.education} yrs`, sub: 'of schooling' },
    { label: 'Marriage rate', value: `${AVERAGE.marriageRate}%`, sub: 'of the body politic' },
    { label: 'Crime risk', value: `${(AVERAGE.crimeRisk * 100).toFixed(1)}%`, sub: 'social regularity' },
    { label: 'Mortality risk', value: `${(AVERAGE.mortalityRisk * 100).toFixed(1)}%`, sub: 'per year' },
    { label: 'Health', value: `${AVERAGE.healthScore}/100`, sub: 'composite score' },
  ]
}

export default function AverageTransformation({
  onComputed,
}: {
  onComputed: () => void
}) {
  const [computed, setComputed] = useState(false)
  const shouldReduce = useReducedMotion()
  const stats = getStats()

  const handleCompute = () => {
    setComputed(true)
    setTimeout(onComputed, shouldReduce ? 200 : 1800)
  }

  return (
    <section
      id="transform"
      className="py-24 bg-paperdark section-snap rule-top"
      aria-label="Compute the average man"
    >
      <div className="max-w-5xl mx-auto px-8">
        <div className="text-center mb-16">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-inkfaint mb-4">
            Section II
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-5">
            Compute the Average Man
          </h2>
          <div className="w-16 h-px bg-rule mx-auto mb-6" aria-hidden="true" />
          <p className="font-sans text-base text-inkfaint max-w-xl mx-auto">
            From 200 varied individuals, a single synthetic figure can be distilled.
            Watch what happens when particularity is averaged away.
          </p>
        </div>

        {!computed ? (
          <div className="flex flex-col items-center gap-10">
            {/* Mini swarm hint */}
            <div className="flex flex-wrap justify-center gap-1.5 max-w-sm opacity-60" aria-hidden="true">
              {POPULATION.slice(0, 48).map((p) => (
                <svg key={p.id} width="10" height="14" viewBox="0 0 18 24" fill="#3D3D3D"
                  style={{ opacity: 0.4 + (p.healthScore / 100) * 0.4 }}>
                  <ellipse cx="9" cy="5" rx="4" ry="4.5" />
                  <path d="M2 24 C2 15 16 15 16 24 Z" />
                </svg>
              ))}
            </div>

            <button
              onClick={handleCompute}
              className="group relative font-serif text-xl border-2 border-ink text-ink px-12 py-5 hover:bg-ink hover:text-paper transition-all duration-400 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paperdark"
              aria-label="Compute the average man from the population"
            >
              <span className="group-hover:opacity-0 transition-opacity duration-200">
                Compute the Average Man
              </span>
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-sans text-sm tracking-widest uppercase">
                Aggregate →
              </span>
            </button>

            <p className="font-sans text-xs text-inkfaint text-center max-w-xs">
              A population of 200 fictional individuals, generated with fixed statistical parameters.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-16 items-start"
          >
            {/* Composite figure */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: shouldReduce ? 0.1 : 1.2, type: 'spring', stiffness: 60 }}
                className="mb-8"
                aria-label="Composite human figure representing the average man"
              >
                <svg width="160" height="220" viewBox="0 0 160 220" aria-hidden="true">
                  {/* Shadow */}
                  <ellipse cx="80" cy="215" rx="45" ry="6" fill="#C4B8A8" opacity="0.4" />
                  {/* Body */}
                  <path
                    d="M80 70 C50 70 35 90 35 120 L35 170 C35 185 55 195 80 195 C105 195 125 185 125 170 L125 120 C125 90 110 70 80 70 Z"
                    fill="#3D3D3D"
                    opacity="0.85"
                  />
                  {/* Head */}
                  <ellipse cx="80" cy="45" rx="28" ry="32" fill="#3D3D3D" opacity="0.85" />
                  {/* Arms */}
                  <line x1="35" y1="115" x2="10" y2="155" stroke="#3D3D3D" strokeWidth="12" strokeLinecap="round" opacity="0.75" />
                  <line x1="125" y1="115" x2="150" y2="155" stroke="#3D3D3D" strokeWidth="12" strokeLinecap="round" opacity="0.75" />
                  {/* Legs */}
                  <line x1="60" y1="190" x2="50" y2="220" stroke="#3D3D3D" strokeWidth="14" strokeLinecap="round" opacity="0.8" />
                  <line x1="100" y1="190" x2="110" y2="220" stroke="#3D3D3D" strokeWidth="14" strokeLinecap="round" opacity="0.8" />
                  {/* Data annotations */}
                  <line x1="25" y1="45" x2="5" y2="45" stroke="#C4B8A8" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="3" y="40" fontSize="8" fill="#7A7370" textAnchor="end">{AVERAGE.height}cm</text>
                  <line x1="135" y1="130" x2="155" y2="130" stroke="#C4B8A8" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="157" y="134" fontSize="8" fill="#7A7370" textAnchor="start">{AVERAGE.weight}kg</text>
                </svg>
              </motion.div>

              <motion.p
                className="font-sans text-xs tracking-[0.2em] uppercase text-inkfaint text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Representative of the social body
              </motion.p>
            </div>

            {/* Stats + bell curve */}
            <div className="space-y-6">
              {/* Bell curve */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduce ? 0 : 0.4, duration: 0.8 }}
                className="mb-2"
              >
                <p className="font-sans text-xs tracking-widest uppercase text-inkfaint mb-2">
                  Height distribution (cm)
                </p>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={heightData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="heightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2B4B6F" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#2B4B6F" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="x" tick={{ fontSize: 9, fill: '#7A7370' }} tickLine={false} axisLine={{ stroke: '#C4B8A8' }} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ background: '#F5F0E8', border: '1px solid #C4B8A8', fontSize: 11, fontFamily: 'Inter' }}
                      formatter={(v: number) => [v, 'individuals']}
                    />
                    {/* Average line */}
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#2B4B6F"
                      strokeWidth={2}
                      fill="url(#heightGrad)"
                      dot={false}
                      isAnimationActive={!shouldReduce}
                      animationDuration={1200}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                {/* Mean marker */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-px border-t border-dashed border-accent" />
                  <span className="font-sans text-xs text-accent">mean = {AVERAGE.height} cm</span>
                </div>
              </motion.div>

              {/* Stat rows */}
              <div className="space-y-0 divide-y divide-rule">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    className="flex justify-between items-baseline py-2.5"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: shouldReduce ? 0 : 0.3 + i * 0.07 }}
                  >
                    <div>
                      <span className="font-sans text-sm text-inklight">{s.label}</span>
                      <span className="font-sans text-xs text-inkfaint ml-2">{s.sub}</span>
                    </div>
                    <span className="font-serif text-base text-ink font-semibold">{s.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
