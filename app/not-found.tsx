import Link from 'next/link';
import { Car } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <div className="h-24 w-24 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
            <Car className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Sivua ei löytynyt</h2>
        <p className="text-slate-300 text-lg mb-8 max-w-md mx-auto">
          Etsimäsi sivu ei valitettavasti ole olemassa tai se on siirretty.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition"
        >
          Palaa etusivulle
        </Link>
      </div>
    </div>
  );
}