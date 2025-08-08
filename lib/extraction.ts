import pdfParse from 'pdf-parse-fixed-promise'
import mammoth from 'mammoth'

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase()
  const arrayBuffer = await file.arrayBuffer()
  const buf = Buffer.from(arrayBuffer)
  if (name.endsWith('.pdf')) {
    const data = await pdfParse(buf)
    return data.text || ''
  }
  if (name.endsWith('.docx')) {
    const { value } = await mammoth.extractRawText({ buffer: buf })
    return value || ''
  }
  if (name.endsWith('.txt')) {
    return buf.toString('utf-8')
  }
  // fallback: try text anyway
  return buf.toString('utf-8')
}

const SKILL_REGEX = /\b(react|node(?:\.js)?|typescript|javascript|python|java|kafka|docker|kubernetes|postgres(?:ql)?|aws|gcp|azure)\b/ig

export function extractSkills(text: string): string[] {
  const set = new Set<string>()
  for (const m of text.matchAll(SKILL_REGEX)) {
    set.add((m[1] || m[0]).toLowerCase())
  }
  return Array.from(set).sort()
}
