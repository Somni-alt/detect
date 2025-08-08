export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const message = String(body?.message || '')
  const jobId = String(body?.job_id || '')
  const answer = `Stub: tu as demandé « ${message} » pour l'offre ${jobId || '(aucune)'}.    Quand le RAG sera branché, je citerai les passages des CV/LM et de la fiche de poste.`
  return NextResponse.json({ answer })
}
