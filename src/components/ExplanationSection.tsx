import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { AVERAGE } from '../data/population'

const ANNOTATIONS = [
  {
    id: 'stature',
    label: 'Stature',
    body: `At ${AVERAGE.height} cm, the average man stands as the modal figure of the social body—not the tallest, not the shortest, but the one around whom the rest of the population orbits.`,
    highlight: 'head',
  },
  {
    id: 'propensity',
    label: 'Moral propensity',
    body: `Quetelet believed that social regularities—crime rates, marriage rates, suicide rates—were as lawlike as the motions of the planets. The average man embodied the average propensity.`,
    highlight: 'torso',
  },
  {
    id: 'economy',
    label: 'Economic condition',
    body: `An income of ${AVERAGE.income} units per annum. Not poverty, not wealth. The average man neither agitates nor innovates. He is the stable center around which social disorder arranges itself.`,
    highlight: 'arms',
  },
  {
    id: 'mortality',
    label: 'Mortality',
    body: `A ${(AVERAGE.mortalityRisk * 100).toFixed(1)}% annual mortality risk, distributed evenly across the social body. Death, Quetelet argued, follows the same arithmetic regularity as birth.`,
    highlight: 'legs',
  },
]

function FigureSVG({ activeHighlight }: { activeHighlight: string | null }) {
  const isHighlighted = (part: string) => activeHighlight === part

  return (
    <svg
      width="200"
      height="280"
      viewBox="0 0 160 220"
      aria-label="Composite figure of the average man with annotated body regions"
    >
      <ellipse cx="80" cy="215" rx="45" ry="6" fill="#C4B8A8" opacity="0.3" />
      {/* Body */}
      <motion.path
        d="M80 70 C50 70 35 90 35 120 L35 170 C35 185 55 195 80 195 C105 195 125 185 125 170 L125 120 C125 90 110 70 80 70 Z"
        fill={isHighlighted('torso') ? '#2B4B6F' : '#3D3D3D'}
        opacity={isHighlighted('torso') ? 0.95 : 0.8}
        animate={{ fill: isHighlighted('torso') ? '#2B4B6F' : '#3D3D3D' }}
        transition={{ duration: 0.4 }}
      />
      {/* Head */}
      <motion.ellipse
        cx="80"
        cy="45"
        rx="28"
        ry="32"
        fill={isHighlighted('head') ? '#2B4B6F' : '#3D3D3D'}
        opacity={isHighlighted('head') ? 0.95 : 0.8}
        animate={{ fill: isHighlighted('head') ? '#2B4B6F' : '#3D3D3D' }}
        transition={{ duration: 0.4 }}
      />
      {/* Arms */}
      <motion.line
        x1="35" y1="115" x2="10" y2="155"
        stroke={isHighlighted('arms') ? '#2B4B6F' : '#3D3D3D'}
        strokeWidth="12"
        strokeLinecap="round"
        animate={{ stroke: isHighlighted('arms') ? '#2B4B6F' : '#3D3D3D' }}
        transition={{ duration: 0.4 }}
        opacity={isHighlighted('arms') ? 0.95 : 0.75}
      />
      <motion.line
        x1="125" y1="115" x2="150" y2="155"
        stroke={isHighlighted('arms') ? '#2B4B6F' : '#3D3D3D'}
        strokeWidth="12"
        strokeLinecap="round"
        animate={{ stroke: isHighlighted('arms') ? '#2B4B6F' : '#3D3D3D' }}
        transition={{ duration: 0.4 }}
        opacity={isHighlighted('arms') ? 0.95 : 0.75}
      />
      {/* Legs */}
      <motion.line
        x1="60" y1="190" x2="50" y2="220"
        stroke={isHighlighted('legs') ? '#2B4B6F' : '#3D3D3D'}
        strokeWidth="14"
        strokeLinecap="round"
        animate={{ stroke: isHighlighted('legs') ? '#2B4B6F' : '#3D3D3D' }}
        transition={{ duration: 0.4 }}
        opacity={isHighlighted('legs') ? 0.95 : 0.8}
      />
      <motion.line
        x1="100" y1="190" x2="110" y2="220"
        stroke={isHighlighted('legs') ? '#2B4B6F' : '#3D3D3D'}
        strokeWidth="14"
        strokeLinecap="round"
        animate={{ stroke: isHighlighted('legs') ? '#2B4B6F' : '#3D3D3D' }}
        transition={{ duration: 0.4 }}
        opacity={isHighlighted('legs') ? 0.95 : 0.8}
      />
    </svg>
  )
}

function AnnotationBlock({
  annotation,
  onHover,
  active,
}: {
  annotation: (typeof ANNOTATIONS)[0]
  onHover: (id: string | null) => void
  active: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-30% 0px -30% 0px' })

  React.useEffect(() => {
    if (inView) onHover(annotation.highlight)
  }, [inView, annotation.highlight, onHover])

  return (
    <div
      ref={ref}
      className="min-h-[30vh] flex items-center py-10"
    >
      <motion.div
        animate={{ opacity: active ? 1 : 0.4, x: active ? 0 : -8 }}
        transition={{ duration: 0.4 }}
      >
        <p className="font-sans text-xs tracking-[0.25em] uppercase text-accent mb-2">
          {annotation.label}
        </p>
        <p className="font-sans text-base text-inklight leading-relaxed max-w-sm">
          {annotation.body}
        </p>
      </motion.div>
    </div>
  )
}

export default function ExplanationSection() {
  const [activeHighlight, setActiveHighlight] = React.useState<string | null>(null)

  return (
    <section
      id="explanation"
      className="py-24 bg-paper section-snap rule-top"
      aria-label="What the average man is"
    >
      <div className="max-w-5xl mx-auto px-8">
        <div className="text-center mb-16">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-inkfaint mb-4">
            Section III
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-5">
            What the Average Man Is
          </h2>
          <div className="w-16 h-px bg-rule mx-auto mb-6" aria-hidden="true" />
          <p className="font-sans text-base text-inkfaint max-w-xl mx-auto">
            He is not a real individual. He is not merely a statistic.
            He is a constructed social abstraction—a fiction that became fact.
          </p>
        </div>

        {/* Sticky figure + scrolling text */}
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left: prose blocks */}
          <div>
            {/* Opening */}
            <motion.div
              className="min-h-[30vh] flex flex-col justify-center py-10 border-l-2 border-rule pl-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p className="font-sans text-base text-inklight leading-relaxed mb-4">
                In 1835, Adolphe Quetelet—a Belgian astronomer and mathematician—
                proposed a radical idea. If you could average the physical and moral
                characteristics of an entire population, the result would not be an
                abstraction. It would be a type: <em>l'homme moyen</em>, the average man.
              </p>
              <p className="font-sans text-base text-inklight leading-relaxed">
                Society, Quetelet argued, becomes legible only through aggregates.
                Not through biography, not through anecdote—but through the regularities
                that emerge when thousands of lives are measured and combined.
              </p>
            </motion.div>

            {/* Annotation blocks */}
            {ANNOTATIONS.map((a) => (
              <AnnotationBlock
                key={a.id}
                annotation={a}
                onHover={(h) => setActiveHighlight(h)}
                active={activeHighlight === a.highlight}
              />
            ))}

            {/* Closing thought */}
            <motion.div
              className="min-h-[25vh] flex flex-col justify-center py-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <blockquote className="border-l-2 border-accent pl-6">
                <p className="font-serif italic text-lg text-inklight leading-relaxed mb-3">
                  "If an individual at any epoch of society possessed all the qualities
                  of the average man, he would represent all that is great, good,
                  and beautiful."
                </p>
                <footer className="font-sans text-xs text-inkfaint tracking-wider uppercase">
                  — Adolphe Quetelet, <cite>A Treatise on Man</cite>, 1835
                </footer>
              </blockquote>
            </motion.div>
          </div>

          {/* Right: sticky composite figure */}
          <div className="hidden md:flex flex-col items-center">
            <div className="sticky top-1/4">
              <FigureSVG activeHighlight={activeHighlight} />
              <AnimatedLabel activeHighlight={activeHighlight} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AnimatedLabel({ activeHighlight }: { activeHighlight: string | null }) {
  const current = ANNOTATIONS.find((a) => a.highlight === activeHighlight)
  return (
    <motion.div
      key={activeHighlight}
      className="mt-4 text-center"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: current ? 1 : 0, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {current && (
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent">
          {current.label}
        </p>
      )}
    </motion.div>
  )
}
