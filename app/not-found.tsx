export const dynamic = 'force-dynamic';
import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Page introuvable</h1>
      <p className="mb-4">Désolé, cette page n'existe pas.</p>
      <Link href="/" className="underline">Revenir à l'accueil</Link>
    </main>
  );
}
