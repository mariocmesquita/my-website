'use client';

import { type ProjectDetail } from '@my-website/schemas/project';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/Dialog';

export function ScreenshotsLightbox({ project }: { project: ProjectDetail }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { screenshots } = project;

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + screenshots.length) % screenshots.length);
  }, [screenshots.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % screenshots.length);
  }, [screenshots.length]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, prev, next]);

  if (screenshots.length === 0) return null;

  const openAt = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  return (
    <section className="mb-10">
      <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-foreground/40 mb-4">
        Screenshots
      </p>

      {/* Grid de thumbnails */}
      <div
        className={`grid gap-4 ${screenshots.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}
      >
        {screenshots.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openAt(i)}
            className="group relative aspect-video overflow-hidden rounded-xl border border-brand/15 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <Image
              src={src}
              alt={`Screenshot ${i + 1} — ${project.title}`}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/8 transition-colors duration-300 flex items-center justify-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-foreground/90 shadow-lg opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                <ZoomIn className="w-4 h-4 text-brand" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/85 backdrop-blur-md" />

          {/* Backdrop clicável para fechar */}
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in-0 duration-200"
            onClick={() => setOpen(false)}
          >
            {/* Barra superior: contador + fechar */}
            <div
              className="w-full max-w-5xl flex items-center justify-between mb-3 px-1"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-sans text-[12px] tabular-nums text-white/40">
                {activeIndex + 1} / {screenshots.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full text-white/50 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Fechar</span>
              </Button>
            </div>

            {/* Imagem + botões de navegação */}
            <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black/30">
                <Image
                  src={screenshots[activeIndex]!}
                  alt={`Screenshot ${activeIndex + 1} — ${project.title}`}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-contain"
                  priority
                />
              </div>

              {screenshots.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border-white/15 text-white hover:bg-black/65 hover:text-white hover:border-white/30 backdrop-blur-sm shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="sr-only">Anterior</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border-white/15 text-white hover:bg-black/65 hover:text-white hover:border-white/30 backdrop-blur-sm shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                    <span className="sr-only">Próximo</span>
                  </Button>
                </>
              )}
            </div>

            {/* Dots de paginação */}
            {screenshots.length > 1 && (
              <div className="flex items-center gap-2 mt-5" onClick={(e) => e.stopPropagation()}>
                {screenshots.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Screenshot ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? 'w-5 h-1.5 bg-white'
                        : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/55'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogPortal>
      </Dialog>
    </section>
  );
}
