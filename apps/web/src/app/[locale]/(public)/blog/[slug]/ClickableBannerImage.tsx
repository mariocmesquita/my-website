'use client';

import NextImage from 'next/image';
import { useState } from 'react';

import { Lightbox } from '@/components/ui/Lightbox';

interface ClickableBannerImageProps {
  src: string;
  alt: string;
}

export function ClickableBannerImage({ src, alt }: ClickableBannerImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="cursor-zoom-in" onClick={() => setOpen(true)}>
        <NextImage
          src={src}
          alt={alt}
          width={1280}
          height={720}
          sizes="(max-width: 728px) 100vw, 728px"
          className="w-full h-auto"
          priority
        />
      </div>
      {open && <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}
