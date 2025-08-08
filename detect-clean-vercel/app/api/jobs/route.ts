export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, must_have } = body || {};
    if (!title || !description) {
      return NextResponse.json({ error: 'title & description required' }, { status: 400 });
    }
    const job = await prisma.job.create({
      data: {
        title,
        description,
        mustHave: Array.isArray(must_have) ? must_have.map((s: string) => s.toLowerCase()) : [],
        niceToHave: [],
        tenant: { connectOrCreate: { where: { id: 'tenant-demo' }, create: { id: 'tenant-demo', name: 'Demo' } } }
      }
    });
    return NextResponse.json(job, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'failed' }, { status: 500 });
  }
}
