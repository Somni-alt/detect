export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractTextFromFile } from '@/lib/extraction';
import { scoreCandidateForJob } from '@/lib/scoring';

export async function POST(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobId = params?.jobId;
    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId in URL' }, { status: 400 });
    }
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    const form = await req.formData();
    const files = form.getAll('files').filter((f): f is File => f instanceof File);
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded. Use form-data with field name "files".' },
        { status: 400 }
      );
    }
    const results: Array<Record<string, unknown>> = [];
    for (const file of files) {
      const filename = file.name || 'upload';
      const lower = filename.toLowerCase();
      if (!(lower.endsWith('.pdf') || lower.endsWith('.docx') || lower.endsWith('.txt'))) {
        results.push({ file: filename, error: 'Unsupported file type (use PDF, DOCX or TXT)' });
        continue;
      }
      const text = await extractTextFromFile(file);
      const displayName =
        (text.split('\n').map(s => s.trim()).find(Boolean) ?? 'Candidat').slice(0, 120);

      const candidate = await prisma.candidate.create({
        data: { fullName: displayName, tenant: { connect: { id: 'tenant-demo' } } }
      });

      const doc = await prisma.document.create({
        data: {
          kind: 'cv',
          storageUri: `upload://${filename}`,
          textContent: text,
          tenantId: 'tenant-demo',
          candidateId: candidate.id,
          jobId
        }
      });

      await prisma.extraction.create({
        data: { documentId: doc.id, schemaVersion: 'v0', payload: {} }
      });

      const match = await scoreCandidateForJob(candidate.id, jobId, text);

      results.push({
        file: filename,
        candidate_id: candidate.id,
        ...match
      });
    }
    return NextResponse.json({ job_id: jobId, results });
  } catch (error: any) {
    console.error('[ingest] error:', error);
    return NextResponse.json(
      { error: 'Ingestion failed', details: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}
