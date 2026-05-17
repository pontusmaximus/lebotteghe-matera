import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-50 bg-plaster flex items-center justify-center text-center px-6">
      <div>
        <span className="text-gold-500 text-xs uppercase tracking-widest2">404</span>
        <h1 className="display text-6xl text-bottega-800 mt-2">Pagina non trovata</h1>
        <div className="gold-rule" />
        <p className="text-bottega-700/85 max-w-md mx-auto">
          La pagina che cerchi non esiste o è stata spostata.
        </p>
        <Link href="/" className="btn-primary mt-8 inline-flex">Torna alla home</Link>
      </div>
    </div>
  );
}
