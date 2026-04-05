'use client';

import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const MIN_SCALE = 0.5;
const MAX_SCALE = 2;
const STEP = 0.25;

interface LightboxProps {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
}

export function Lightbox({ src, alt, caption, onClose }: LightboxProps) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOrigin = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const didDrag = useRef(false);

  const canDrag = scale > 1;

  const zoom = (delta: number) => {
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round((scale + delta) * 100) / 100));
    setScale(next);
    if (next <= 1) setOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handlePointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!canDrag) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragOrigin.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y };
    didDrag.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!dragOrigin.current) return;
    const dx = e.clientX - dragOrigin.current.px;
    const dy = e.clientY - dragOrigin.current.py;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didDrag.current = true;
    setOffset({ x: dragOrigin.current.ox + dx, y: dragOrigin.current.oy + dy });
  };

  const handlePointerUp = () => {
    dragOrigin.current = null;
    setIsDragging(false);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-black/90"
      onClick={() => {
        if (didDrag.current) {
          didDrag.current = false;
          return;
        }
        onClose();
      }}
    >
      <div
        className="relative flex items-center justify-center px-4 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
          <button
            type="button"
            onClick={() => zoom(-STEP)}
            disabled={scale <= MIN_SCALE}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition hover:text-white disabled:opacity-30"
            aria-label="Diminuir zoom"
          >
            <ZoomOut size={15} />
          </button>
          <span className="w-12 text-center font-sans text-[13px] text-white/80 tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => zoom(STEP)}
            disabled={scale >= MAX_SCALE}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition hover:text-white disabled:opacity-30"
            aria-label="Aumentar zoom"
          >
            <ZoomIn size={15} />
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <img
          src={src}
          alt={alt}
          draggable={false}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={handleImageClick}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease',
            cursor: canDrag ? (isDragging ? 'grabbing' : 'grab') : 'default',
            userSelect: 'none',
          }}
          className="max-h-[80vh] max-w-[90vw] object-contain"
        />
      </div>

      {caption && (
        <div className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
          <p className="text-center font-sans text-[13px] text-white/60">{caption}</p>
        </div>
      )}
    </div>
  );
}
