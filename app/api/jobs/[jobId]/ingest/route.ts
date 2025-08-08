export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // tu l’as déjà normalement
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTextFromFile } from '@/lib/extraction'
import { scoreCandidateForJob } from '@/lib/scoring'

export async function POST(req: NextRequest, { params }: { params: { jobId: string } }) {
  const { jobId } = params
  const form = await req.formData()
  const files = form.getAll('files')
  if (!files.length) return NextResponse.json({ error: 'No files' }, { status: 400 })
  const results: any[] = []
  for (const f of files) {
    if (!(f instanceof File)) continue
    const text = await extractTextFromFile(f)
    const firstLine = (text.split('\n').map(s => s.trim()).filter(Boolean)[0] || 'Candidat').slice(0, 120)
    const candidate = await prisma.candidate.create({ data: { fullName: firstLine, tenant: { connect: { id: 'tenant-demo' } } } })
    const doc = await prisma.document.create({
      data: { kind: 'cv', storageUri: `upload://${f.name}`, textContent: text, tenantId: 'tenant-demo', candidateId: candidate.id, jobId }
    })
    await prisma.extraction.create({ data: { documentId: doc.id, schemaVersion: 'v0', payload: {} } })
    const match = await scoreCandidateForJob(candidate.id, jobId, text)
    results.push({ candidate_id: candidate.id, ...match })
  }
  return NextResponse.json({ results })
}
