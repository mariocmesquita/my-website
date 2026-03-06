'use client';

import { RelatedItemsField } from '@/components/form/RelatedItemsField';
import { type PostAdmin } from '@/http/post';

interface RelatedPostsFieldProps {
  name: string;
  posts: PostAdmin[];
}

export function RelatedPostsField({ name, posts }: RelatedPostsFieldProps) {
  return (
    <RelatedItemsField
      name={name}
      items={posts}
      label="Posts relacionados"
      selectPlaceholder="Selecionar posts..."
      searchPlaceholder="Buscar posts..."
      emptyText="Nenhum post encontrado."
      selectedCountLabel={(count) =>
        `${count} post${count > 1 ? 's' : ''} selecionado${count > 1 ? 's' : ''}`
      }
    />
  );
}
