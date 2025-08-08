// lib/extraction.ts
import mammoth from 'mammoth';

// ⬇️ nouveau: import dynamique de pdf-parse
async function parsePdf(buf: Buffer): Promise<string> {
  const mod: any = await import('pdf-parse');
  const pdfParse = mod.default || mod;
  const data = await pdfParse(buf);
  return data.text || '';
}

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const arrayBuffer = await file.arrayBuffer();
  // @ts-ignore Node Buffer côté server
  const buf: Buffer = Buffer.from(arrayBuffer);

  if (name.endsWith('.pdf')) {
    try { return await parsePdf(buf); } catch { /* fallback */ }
  }
  if (name.endsWith('.docx')) {
    const { value } = await mammoth.extractRawText({ buffer: buf });
    return value || '';
  }
  if (name.endsWith('.txt')) {
    return buf.toString('utf-8');
  }
  // Fallback très basique
  return buf.toString('utf-8');
}