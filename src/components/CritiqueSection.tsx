import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  CartesianGrid,
} from 'recharts'
import { POPULATION, AVERAGE } from '../data/population'

type ViewMode = 'mean' | 'distribution' | 'clusters'

interface ViewConfig {
  label: string
  description: string
}

const VIEWS: Record<ViewMode, ViewConfig> = {
  mean: {
    label: 'Mean',
    description:
      'One number. One figure. The average man stands alone, representative of all, identical to none. This is Quetelet\'s dream: a population reduced to its center of gravity.',
  },
  distribution: {
    label: 'Distribution',
    description:
      'The spread matters as much as the center. Every individual is a point in a distribution—not a deviation from a norm, but a member of a range. The bell curve reveals what the mean conceals.',
  },
  clusters: {
    label: 'Clusters',
    description:
      'No single mean describes this population cleanly. There are subgroups, tendencies, overlapping patterns. The average man was always a weighted sum of many different kinds of people.',
  },
}

// Build height distribution
function buildDist() {
  const bins = 20
  const min = 145, max = 200
  const binSize = (max - min) / bins
  return Array.from({ length: bins }, (_, i) => {
    const lo = min + i * binSize
    const mid = lo + binSize / 2
    const count = POPULATION.filter((p) => p.height >= lo && p.height < lo + binSize).length
    return { x: +mid.toFixed(1), count }
  })
}

// Build clusters by education quartile
function buildClusters() {
  const sorted = [...POPULATION].sort((a, b) => a.education - b.education)
  const q = Math.floor(sorted.length / 4)
  const groups = [
    { label: 'Low ed.', color: '#7A7370', people: sorted.slice(0, q) },
    { label: 'Mid-low ed.', color: '#4A7BA7', people: sorted.slice(q, q * 2) },
    { label: 'Mid-high ed.', color: '#2B4B6F', people: sorted.slice(q * 2, q * 3) },
    { label: 'High ed.', color: '#1C3A54', people: sorted.slice(q * 3) },
  ]
  return groups.flatMap((g) =>
    g.people.map((p) => ({
      height: p.height,
      income: p.income,
      color: g.color,
      group: g.label,
    }))
  )
}

const DIST = buildDist()
const CLUSTERS = buildClusters()

function MeanView() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-8">
      {/* Single composite figure */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <svg width="120" height="168" viewBox="0 0 160 220" aria-label="Average man figure">
          <ellipse cx="80" cy="215" rx="45" ry="6" fill="#C4B8A8" opacity="0.3" />
          <path d="M80 70 C50 70 35 90 35 120 L35 170 C35 185 55 195 80 195 C105 195 125 185 125 170 L125 120 C125 90 110 70 80 70 Z" fill="#3D3D3D" opacity="0.85" />
          <ellipse cx="80" cy="45" rx="28" ry="32" fill="#3D3D3D" opacity="0.85" />
          <line x1="35" y1="115" x2="10" y2="155" stroke="#3D3D3D" strokeWidth="12" strokeLinecap="round" opacity="0.75" />
          <line x1="125" y1="115" x2="150" y2="155" stroke="#3D3D3D" strokeWidth="12" strokeLinecap="round" opacity="0.75" />
          <line x1="60" y1="190" x2="50" y2="220" stroke="#3D3D3D" strokeWidth="14" strokeLinecap="round" opacity="0.8" />
          <line x1="100" y1="190" x2="110" y2="220" stroke="#3D3D3D" strokeWidth="14" strokeLinecap="round" opacity="0.8" />
        </svg>
      </motion.div>
      <div className="text-center">
        <p className="font-serif text-2xl text-ink mb-1">{AVERAGE.height} cm · {AVERAGE.weight} kg</p>
        <p className="font-sans text-xs text-inkfaint tracking-widest uppercase">The average man</p>
      </div>
    </div>
  )
}

function DistributionView() {
  return (
    <div className="py-6">
      <p className="font-sans text-xs text-inkfaint tracking-widest uppercase mb-4 text-center">
        Height distribution — 200 individuals
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={DIST} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
          <defs>
            <linearGradient id="distGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2B4B6F" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2B4B6F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="x" tick={{ fontSize: 9, fill: '#7A7370' }} tickLine={false} axisLine={{ stroke: '#C4B8A8' }}
            label={{ value: 'Height (cm)', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#7A7370' }} />
          <YAxis hide />
          <Tooltip contentStyle={{ background: '#F5F0E8', border: '1px solid #C4B8A8', fontSize: 11, fontFamily: 'Inter', borderRadius: 0 }}
            formatter={(v: number) => [v, 'individuals']} />
          <Area type="monotone" dataKey="count" stroke="#2B4B6F" strokeWidth={2} fill="url(#distGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-center mt-2">
        <span className="font-sans text-xs text-inkfaint">
          Mean = {AVERAGE.height} cm &nbsp;·&nbsp; the curve conceals every individual within it
        </span>
      </p>
    </div>
  )
}

function ClusterView() {
  return (
    <div className="py-6">
      <p className="font-sans text-xs text-inkfaint tracking-widest uppercase mb-4 text-center">
        Height × income, colored by education quartile
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#C4B8A8" strokeOpacity={0.4} />
          <XAxis
            type="number"
            dataKey="height"
            domain={[145, 200]}
            tick={{ fontSize: 9, fill: '#7A7370' }}
            tickLine={false}
            axisLine={{ stroke: '#C4B8A8' }}
            label={{ value: 'Height (cm)', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#7A7370' }}
          />
          <YAxis
            type="number"
            dataKey="income"
            tick={{ fontSize: 9, fill: '#7A7370' }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Income', angle: -90, position: 'insideLeft', offset: 8, fontSize: 11, fill: '#7A7370' }}
          />
          <ZAxis range={[20, 20]} />
          <Tooltip
            contentStyle={{ background: '#F5F0E8', border: '1px solid #C4B8A8', fontSize: 11, fontFamily: 'Inter', borderRadius: 0 }}
            formatter={(v: number, name: string) => [
              name === 'height' ? `${v} cm` : `${v} units`,
              name === 'height' ? 'Height' : 'Income',
            ]}
            labelFormatter={() => ''}
          />
          <Scatter
            name="Population"
            data={CLUSTERS}
            shape={(props: { cx?: number; cy?: number; payload?: { color: string } }) => (
              <circle
                cx={props.cx}
                cy={props.cy}
                r={4}
                fill={props.payload?.color ?? '#3D3D3D'}
                opacity={0.55}
              />
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-5 mt-3">
        {['Low ed.', 'Mid-low ed.', 'Mid-high ed.', 'High ed.'].map((label, i) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: ['#7A7370', '#4A7BA7', '#2B4B6F', '#1C3A54'][i] }}
              aria-hidden="true"
            />
            <span className="font-sans text-xs text-inkfaint">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CritiqueSection() {
  const [viewMode, setViewMode] = useState<ViewMode>('mean')
  const shouldReduce = useReducedMotion()
  const cfg = VIEWS[viewMode]
  const modes: ViewMode[] = ['mean', 'distribution', 'clusters']

  return (
    <section
      id="critique"
      className="py-24 bg-paperdark section-snap rule-top"
      aria-label="The critique of the average"
    >
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-inkfaint mb-4">
            Section VI
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-5">
            The Critique of the Average
          </h2>
          <div className="w-16 h-px bg-rule mx-auto mb-6" aria-hidden="true" />
          <p className="font-sans text-base text-inkfaint max-w-xl mx-auto leading-relaxed">
            Later thinkers insisted that variation is not noise to be dismissed.
            It is the signal. The spread, the clusters, the subgroups—these are
            the things that a single mean quietly erases.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex justify-center mb-10" role="group" aria-label="Population view mode">
          <div className="inline-flex border border-rule divide-x divide-rule overflow-hidden">
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-6 py-2.5 font-sans text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset ${
                  viewMode === m ? 'bg-ink text-paper' : 'bg-paper text-inklight hover:bg-paperdark'
                }`}
                aria-pressed={viewMode === m}
              >
                {VIEWS[m].label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart area */}
        <div className="border border-rule bg-paper min-h-[300px] mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: shouldReduce ? 0.01 : 0.4 }}
              className="px-6"
            >
              {viewMode === 'mean' && <MeanView />}
              {viewMode === 'distribution' && <DistributionView />}
              {viewMode === 'clusters' && <ClusterView />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mode description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduce ? 0.01 : 0.35 }}
            className="border-l-2 border-accent pl-6 py-3"
          >
            <p className="font-sans text-base text-inklight leading-relaxed">
              {cfg.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Philosophical note */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="font-serif italic text-lg text-inklight max-w-lg mx-auto leading-relaxed">
            "The average man is not a portrait of any actual person.
            He is a statistical fiction—useful, powerful,
            and capable of doing quiet violence to everyone who does not resemble him."
          </p>
        </motion.div>
      </div>
    </section>
  )
}
