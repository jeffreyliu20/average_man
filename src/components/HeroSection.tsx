import React, { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface Dot {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  opacity: number
}

function makeDots(w: number, h: number, n: number): Dot[] {
  const dots: Dot[] = []
  for (let i = 0; i < n; i++) {
    dots.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 2 + Math.random() * 2.5,
      opacity: 0.12 + Math.random() * 0.2,
    })
  }
  return dots
}

export default function HeroSection({ onBegin }: { onBegin: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotsRef = useRef<Dot[]>([])
  const animRef = useRef<number>(0)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || shouldReduce) return
    const ctx = canvas.getContext('2d')!
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      dotsRef.current = makeDots(canvas.width, canvas.height, 120)
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      const { width: w, height: h } = canvas
      ctx.clearRect(0, 0, w, h)
      for (const d of dotsRef.current) {
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0) d.x = w
        if (d.x > w) d.x = 0
        if (d.y < 0) d.y = h
        if (d.y > h) d.y = 0
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(43, 75, 111, ${d.opacity})`
        ctx.fill()
      }
      animRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [shouldReduce])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-paper"
      aria-label="Introduction"
    >
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Horizontal rule decorations */}
      <div className="absolute top-16 left-0 right-0 h-px bg-rule opacity-60" aria-hidden="true" />
      <div className="absolute bottom-16 left-0 right-0 h-px bg-rule opacity-60" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-8 text-center">
        <motion.p
          className="font-sans text-xs tracking-[0.3em] uppercase text-inkfaint mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          Adolphe Quetelet, 1835
        </motion.p>

        <motion.h1
          className="font-serif text-7xl md:text-8xl font-normal text-ink leading-none mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5 }}
        >
          The Average Man
        </motion.h1>

        <motion.div
          className="w-24 h-px bg-rule mx-auto mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1 }}
          aria-hidden="true"
        />

        <motion.p
          className="font-serif text-xl md:text-2xl text-inklight italic mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.1 }}
        >
          How statistics invented a social ideal
        </motion.p>

        <motion.p
          className="font-sans text-base text-inkfaint leading-relaxed max-w-xl mx-auto mb-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.4 }}
        >
          A population average is a tool for summarizing what is varied and particular.
          But what happens when the average stops being a summary and becomes a model—
          a template for what a human being is supposed to be?
        </motion.p>

        <motion.button
          onClick={onBegin}
          className="font-sans text-sm tracking-[0.2em] uppercase border border-ink text-ink px-10 py-3 hover:bg-ink hover:text-paper transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.7 }}
          aria-label="Begin reading the exhibit"
        >
          Begin
        </motion.button>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          aria-hidden="true"
        >
          <span className="font-sans text-xs tracking-widest text-inkfaint uppercase">Scroll</span>
          <motion.div
            className="w-px h-8 bg-inkfaint"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
