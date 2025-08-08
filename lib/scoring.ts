import { prisma } from './prisma'
import type { Job } from '@prisma/client'
import { extractSkills } from './extraction'

function normYearsFromText(text: string): number {
  const m = text.match(/(\d+)\s*(?:ans|years)/i)
  return m ? Math.min(10, parseInt(m[1], 10)) : 0
}
function normalizeYears(y: number): number {
  return Math.max(0, Math.min(1, y / 10))
}

export async function scoreCandidateForJob(candidateId: string, jobId: string, text: string) {
  const job: Job | null = await prisma.job.findUnique({ where: { id: jobId } })
  if (!job) throw new Error('job not found')
  const skills = extractSkills(text)
  const years = normYearsFromText(text)
  const mustHave = job.mustHave || []

  const mustHaveCoverage = mustHave.length ? mustHave.filter(s => skills.includes(s.toLowerCase())).length / mustHave.length : 0
  const semanticSimilarity = skills.length ? Math.min(1, (skills.length) / (mustHave.length + 5)) : 0.1
  const locationMatch = true

  const score = 0.45 * mustHaveCoverage + 0.30 * semanticSimilarity + 0.15 * normalizeYears(years) + 0.10 * (locationMatch ? 1 : 0)
  const TH_GREEN = Number(process.env.THRESHOLD_GREEN || 0.75)
  const TH_ORANGE = Number(process.env.THRESHOLD_ORANGE || 0.45)
  const label = score >= TH_GREEN ? 'green' : score >= TH_ORANGE ? 'orange' : 'red'
  const missing = mustHave.filter(s => !skills.includes(s.toLowerCase()))
  const rationale = `${Math.round(mustHaveCoverage*100)}% must-have; sim ${semanticSimilarity.toFixed(2)}; ${years} ans d'exp; ` + (missing.length ? `manque: ${missing.slice(0,3).join(', ')}` : 'couverture complète')
  const features = { must_have_coverage: mustHaveCoverage, semantic_similarity: semanticSimilarity, years_experience: years, location_match: locationMatch, skills }

  const match = await prisma.matchScore.create({
    data: { jobId, candidateId, score: Number(score.toFixed(2)), label, rationale, features }
  })
  return match
  import { extractSkills } from './extraction';
}
