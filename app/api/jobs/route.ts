export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, description, must_have = [], nice_to_have = [], location, tenant_id = 'tenant-demo' } = body || {}
  if (!title || !description) return NextResponse.json({ error: 'title & description required' }, { status: 400 })
  const job = await prisma.job.create({
    data: {
      title, description, mustHave: must_have, niceToHave: nice_to_have, location,
      tenant: { connectOrCreate: { where: { id: tenant_id }, create: { id: tenant_id, name: 'Demo' } } }
    }
  })
  return NextResponse.json({ job })
}
