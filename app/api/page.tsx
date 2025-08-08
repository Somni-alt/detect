import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('home')
  const locale = await getLocale()
  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Detect</h1>
        <nav className="flex gap-3">
          <Link href="/" locale={locale==='fr'?'en':'fr'} className="underline">{locale==='fr'?'EN':'FR'}</Link>
        </nav>
      </div>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-4 bg-white">
          <h2 className="font-semibold mb-2">{t('jobs_title')}</h2>
          <p className="text-sm opacity-80">{t('jobs_desc')}</p>
        </div>
        <div className="rounded-2xl border p-4 bg-white">
          <h2 className="font-semibold mb-2">{t('candidates_title')}</h2>
          <p className="text-sm opacity-80">{t('candidates_desc')}</p>
        </div>
        <div className="rounded-2xl border p-4 bg-white">
          <h2 className="font-semibold mb-2">{t('chat_title')}</h2>
          <p className="text-sm opacity-80">{t('chat_desc')}</p>
        </div>
      </section>
    </main>
  )
}
