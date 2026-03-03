'use client';

import { ImageIcon, Loader2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import { uploadProjectFile } from '@/http/project';
import { useAuth } from '@/lib/firebase';

interface BannerImageFieldProps {
  name: string;
  label: string;
}

export function BannerImageField({ name, label }: BannerImageFieldProps) {
  const { watch, setValue } = useFormContext();
  const { getToken } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const url: string | null = watch(name) ?? null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo permitido: 5MB.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED.includes(file.type)) {
      toast.error('Formato inválido. Use JPG, PNG ou WebP.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    try {
      const token = await getToken();
      const uploadedUrl = await uploadProjectFile(token, file, 'banner');
      setValue(name, uploadedUrl, { shouldValidate: true });
    } catch {
      toast.error('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setValue(name, null, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-xs text-muted-foreground">
          16:9 · mín. 1280×720px · JPG, PNG ou WebP · máx. 5MB
        </span>
      </div>

      {url ? (
        <div className="relative w-full overflow-hidden rounded-lg border border-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Banner" className="h-44 w-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-destructive px-2 py-1 text-xs font-medium text-white transition hover:opacity-90"
          >
            <X size={12} />
            Remover
          </button>
        </div>
      ) : (
        <label
          htmlFor="banner-upload"
          aria-disabled={isUploading}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand/40 p-8 transition hover:border-brand/70 hover:bg-brand/5 aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
        >
          {isUploading ? (
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          ) : (
            <ImageIcon size={20} className="text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {isUploading ? 'Enviando...' : 'Clique para selecionar imagem'}
          </p>
        </label>
      )}

      <input
        id="banner-upload"
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={isUploading}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
