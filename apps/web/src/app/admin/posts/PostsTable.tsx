'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type PostAdmin } from '@/http/post';

interface PostsTableProps {
  posts: PostAdmin[];
  deletingId: string | null;
  onDelete: (id: string) => void;
}

function getStatus(post: PostAdmin): {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
} {
  if (post.status === 'archived') return { label: 'Arquivado', variant: 'destructive' };
  if (post.status === 'draft') return { label: 'Rascunho', variant: 'secondary' };
  if (post.publishDate && new Date(post.publishDate) > new Date())
    return { label: 'Agendado', variant: 'outline' };
  return { label: 'Publicado', variant: 'default' };
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('T')[0]!.split('-').map(Number);
  return new Date(year!, month! - 1, day!).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function PostsTable({ posts, deletingId, onDelete }: PostsTableProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90"
        >
          <Plus size={16} />
          Novo post
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Resumo</TableHead>
              <TableHead>Publicação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12 text-center">PT</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Nenhum post cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => {
                const status = getStatus(post);
                const hasTranslation = !!post.translated;
                return (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="hidden max-w-[200px] truncate text-sm text-muted-foreground md:table-cell">
                      {post.summary}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(post.publishDate)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {hasTranslation ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          title="Editar"
                        >
                          <Pencil size={15} />
                        </Link>
                        <DeleteConfirmDialog onConfirm={() => onDelete(post.id)}>
                          <button
                            disabled={deletingId === post.id}
                            className="rounded p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                            title="Remover"
                          >
                            <Trash2 size={15} />
                          </button>
                        </DeleteConfirmDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
