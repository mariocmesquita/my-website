import { CareerPageClient } from './CareerPageClient';

export default function CareerPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-spectral text-3xl font-bold text-foreground">Carreira</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie as entradas exibidas na seção de carreira do site.
        </p>
      </div>
      <CareerPageClient />
    </div>
  );
}
