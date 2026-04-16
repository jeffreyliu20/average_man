import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { POPULATION, AVERAGE } from '../data/population'

type Mode = 'difference' | 'variation' | 'error'

interface ModeConfig {
  label: string
  description: string
  philosophicalNote: string
  barColor: (deviation: number) => string
  outlierOpacity: (deviation: number) => number
}

const MODES: Record<Mode, ModeConfig> = {
  difference: {
    label: 'Difference',
    description:
      'Each height is simply what it is. Distance from the mean is neutral—a description, not a judgment. The range of human stature is merely the range of human stature.',
    philosophicalNote:
      'Seen this way, diversity is a feature of the population, not a flaw in its members.',
    barColor: (_) => '#2B4B6F',
    outlierOpacity: (_) => 0.75,
  },
  variation: {
    label: 'Variation',
    description:
      'The same distribution, reframed. Subgroups cluster. Spread matters. The population contains multitudes—ranges, tendencies, overlapping patterns that a single mean cannot capture.',
    philosophicalNote:
      'Variation is generative: it is the raw material from which adaptation, change, and diversity arise.',
    barColor: (d) => {
      const abs = Math.abs(d)
      if (abs > 20) return '#4A7BA7'
      if (abs > 10) return '#2B4B6F'
      return '#1C3A54'
    },
    outlierOpacity: (d) => 0.4 + Math.min(0.5, Math.abs(d) / 40),
  },
  error: {
    label: 'Error',
    description:
      'Now the mean becomes a target and all departures from it become errors—deviations from a true type. The further you are from the average, the more you look like a mistake in nature\'s design.',
    philosophicalNote:
      'This is how statistics quietly becomes morality: the descriptive mean becomes a prescriptive norm.',
    barColor: (d) => {
      const abs = Math.abs(d)
      if (abs > 20) return '#8B2E2E'
      if (abs > 10) return '#B84444'
      return '#2B4B6F'
    },
    outlierOpacity: (d) => 0.3 + Math.min(0.65, Math.abs(d) / 28),
  },
}

// Build binned data with deviation from mean
function buildData() {
  const mean = AVERAGE.height
  const bins = 20
  const values = POPULATION.map((p) => p.height)
  const min = 145
  const max = 200
  const binSize = (max - min) / bins

  return Array.from({ length: bins }, (_, i) => {
    const lo = min + i * binSize
    const hi = lo + binSize
    const mid = lo + binSize / 2
    const count = values.filter((v) => v >= lo && v < hi).length
    return {
      x: +mid.toFixed(1),
      count,
      deviation: +(mid - mean).toFixed(1),
    }
  })
}

const DATA = buildData()

export default function InterpretationToggle() {
  const [mode, setMode] = useState<Mode>('difference')
  const shouldReduce = useReducedMotion()
  const cfg = MODES[mode]

  const modes: Mode[] = ['difference', 'variation', 'error']

  return (
    <section
      id="norm"
      className="py-24 bg-paperdark section-snap rule-top"
      aria-label="From average to norm: interpretation toggle"
    >
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-inkfaint mb-4">
            Section IV
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-5">
            From Average to Norm
          </h2>
          <div className="w-16 h-px bg-rule mx-auto mb-6" aria-hidden="true" />
          <p className="font-sans text-base text-inkfaint max-w-xl mx-auto">
            The same distribution. The same data. Three different ways of reading it.
            Watch how a change of framing transforms a neutral description into a moral ranking.
          </p>
        </div>

        {/* Toggle control */}
        <div
          className="flex justify-center mb-12"
          role="group"
          aria-label="Interpret deviation as"
        >
          <div className="inline-flex border border-rule divide-x divide-rule overflow-hidden">
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-6 py-2.5 font-sans text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset ${
                  mode === m
                    ? m === 'error'
                      ? 'bg-warn text-paper'
                      : 'bg-ink text-paper'
                    : 'bg-paper text-inklight hover:bg-paperdark'
                }`}
                aria-pressed={mode === m}
              >
                {MODES[m].label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="mb-8">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={DATA} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <XAxis
                dataKey="x"
                tick={{ fontSize: 10, fill: '#7A7370' }}
                tickLine={false}
                axisLine={{ stroke: '#C4B8A8' }}
                label={{ value: 'Height (cm)', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#7A7370' }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#7A7370' }}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Individuals', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#7A7370' }}
              />
              <ReferenceLine
                x={AVERAGE.height}
                stroke="#2B4B6F"
                strokeDasharray="4 3"
                strokeWidth={1.5}
                label={{ value: `mean`, position: 'top', fontSize: 10, fill: '#2B4B6F' }}
              />
              <Tooltip
                contentStyle={{
                  background: '#F5F0E8',
                  border: '1px solid #C4B8A8',
                  fontSize: 11,
                  fontFamily: 'Inter',
                  borderRadius: 0,
                }}
                formatter={(v: number, _name, props) => [
                  `${v} people  |  deviation: ${props.payload.deviation > 0 ? '+' : ''}${props.payload.deviation} cm`,
                  '',
                ]}
                labelFormatter={(l) => `Height ≈ ${l} cm`}
              />
              <Bar
                dataKey="count"
                isAnimationActive={!shouldReduce}
                animationDuration={600}
              >
                {DATA.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={cfg.barColor(entry.deviation)}
                    opacity={cfg.outlierOpacity(entry.deviation)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mode description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: shouldReduce ? 0.01 : 0.35 }}
            className={`border-l-4 pl-6 py-4 ${
              mode === 'error' ? 'border-warn' : mode === 'variation' ? 'border-accentlight' : 'border-accent'
            }`}
          >
            <p className="font-sans text-base text-inklight leading-relaxed mb-3">
              {cfg.description}
            </p>
            <p className="font-sans text-sm text-inkfaint italic">
              {cfg.philosophicalNote}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Closing note */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="font-serif italic text-lg text-inklight max-w-lg mx-auto leading-relaxed">
            "A statistical tool can quietly become a moral or political ranking system—
            depending entirely on the story told about deviation."
          </p>
        </motion.div>
      </div>
    </section>
  )
}
