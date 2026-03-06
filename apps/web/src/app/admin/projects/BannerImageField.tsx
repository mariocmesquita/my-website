'use client';

import { ImageUploadField } from '@/components/form/ImageUploadField';
import { uploadProjectFile } from '@/http/project';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface BannerImageFieldProps {
  name: string;
  label: string;
}

export function BannerImageField({ name, label }: BannerImageFieldProps) {
  return (
    <ImageUploadField
      name={name}
      label={label}
      uploadFn={(token, file) => uploadProjectFile(token, file, 'banner')}
      accept="image/jpeg,image/png,image/webp"
      allowedTypes={ALLOWED_TYPES}
      typeErrorMessage="Formato inválido. Use JPG, PNG ou WebP."
      hint="16:9 · mín. 1280×720px · JPG, PNG ou WebP · máx. 5MB"
      selectLabel="Clique para selecionar imagem"
    />
  );
}
