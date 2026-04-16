export interface Person {
  id: number
  height: number       // cm, ~170 ± 10
  weight: number       // kg, ~72 ± 12
  income: number       // annual units, ~4800 ± 1600
  education: number    // years, 6–18
  maritalStatus: 'married' | 'single' | 'widowed'
  healthScore: number  // 0–100
  crimeRisk: number    // 0–1 probability
  mortalityRisk: number // 0–1 probability
}

// Seeded pseudo-random (mulberry32)
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function boxMuller(rand: () => number): number {
  const u1 = rand()
  const u2 = rand()
  return Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2)
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

export function generatePopulation(n: number, seed = 42): Person[] {
  const rand = mulberry32(seed)
  const people: Person[] = []

  for (let i = 0; i < n; i++) {
    const height = clamp(170 + boxMuller(rand) * 10, 145, 200)
    const weight = clamp(72 + boxMuller(rand) * 12, 40, 120)
    const income = clamp(4800 + boxMuller(rand) * 1600, 400, 12000)
    const education = clamp(Math.round(12 + boxMuller(rand) * 3), 4, 20)
    const r = rand()
    const maritalStatus: Person['maritalStatus'] =
      r < 0.55 ? 'married' : r < 0.85 ? 'single' : 'widowed'
    const healthScore = clamp(68 + boxMuller(rand) * 14, 0, 100)
    const crimeRisk = clamp(0.06 + boxMuller(rand) * 0.04, 0, 1)
    const mortalityRisk = clamp(0.08 + boxMuller(rand) * 0.04, 0, 1)

    people.push({
      id: i,
      height: +height.toFixed(1),
      weight: +weight.toFixed(1),
      income: +income.toFixed(0),
      education,
      maritalStatus,
      healthScore: +healthScore.toFixed(1),
      crimeRisk: +crimeRisk.toFixed(3),
      mortalityRisk: +mortalityRisk.toFixed(3),
    })
  }
  return people
}

export function computeAverage(people: Person[]) {
  const n = people.length
  const sum = people.reduce(
    (acc, p) => ({
      height: acc.height + p.height,
      weight: acc.weight + p.weight,
      income: acc.income + p.income,
      education: acc.education + p.education,
      healthScore: acc.healthScore + p.healthScore,
      crimeRisk: acc.crimeRisk + p.crimeRisk,
      mortalityRisk: acc.mortalityRisk + p.mortalityRisk,
      married: acc.married + (p.maritalStatus === 'married' ? 1 : 0),
    }),
    { height: 0, weight: 0, income: 0, education: 0, healthScore: 0, crimeRisk: 0, mortalityRisk: 0, married: 0 }
  )
  return {
    height: +(sum.height / n).toFixed(1),
    weight: +(sum.weight / n).toFixed(1),
    income: +(sum.income / n).toFixed(0),
    education: +(sum.education / n).toFixed(1),
    healthScore: +(sum.healthScore / n).toFixed(1),
    crimeRisk: +(sum.crimeRisk / n).toFixed(3),
    mortalityRisk: +(sum.mortalityRisk / n).toFixed(3),
    marriageRate: +((sum.married / n) * 100).toFixed(1),
  }
}

export type PopulationAverage = ReturnType<typeof computeAverage>

// Pre-generate the canonical population used across the app
export const POPULATION = generatePopulation(200)
export const AVERAGE = computeAverage(POPULATION)
