'use client';

import { useState } from 'react';

import { useDeletePost, usePostsAdmin } from '@/hooks/usePosts';

import { PostsTable } from './PostsTable';

export function PostsPageClient() {
  const { data: posts = [], isLoading, isError } = usePostsAdmin();
  const { mutate: deletePost } = useDeletePost();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deletePost(id, { onSettled: () => setDeletingId(null) });
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando posts...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Erro ao carregar os posts. Tente recarregar a página.
      </p>
    );
  }

  return <PostsTable posts={posts} deletingId={deletingId} onDelete={handleDelete} />;
}
