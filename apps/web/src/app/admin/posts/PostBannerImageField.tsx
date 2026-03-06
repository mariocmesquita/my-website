'use client';

import { ImageUploadField } from '@/components/form/ImageUploadField';
import { uploadPostFile } from '@/http/post';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface PostBannerImageFieldProps {
  name: string;
  label: string;
}

export function PostBannerImageField({ name, label }: PostBannerImageFieldProps) {
  return (
    <ImageUploadField
      name={name}
      label={label}
      uploadFn={(token, file) => uploadPostFile(token, file)}
      accept="image/jpeg,image/png,image/webp,image/gif"
      allowedTypes={ALLOWED_TYPES}
      typeErrorMessage="Formato inválido. Use JPG, PNG, WebP ou GIF."
      hint="JPG, PNG, WebP, GIF · máx. 5MB"
      previewHeight="h-36"
    />
  );
}
