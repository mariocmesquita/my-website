'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type ProjectAdmin } from '@/http/project';

interface ProjectsTableProps {
  projects: ProjectAdmin[];
  deletingId: string | null;
  onNew: () => void;
  onEdit: (project: ProjectAdmin) => void;
  onDelete: (id: string) => void;
}

function getStatus(project: ProjectAdmin): {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
} {
  if (project.archived) return { label: 'Arquivado', variant: 'destructive' };
  if (new Date(project.publishDate) > new Date()) return { label: 'Agendado', variant: 'outline' };
  return { label: 'Publicado', variant: 'default' };
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('T')[0]!.split('-').map(Number);
  return new Date(year!, month! - 1, day!).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function ProjectsTable({
  projects,
  deletingId,
  onNew,
  onEdit,
  onDelete,
}: ProjectsTableProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {projects.length} {projects.length === 1 ? 'projeto' : 'projetos'}
        </p>
        <button
          onClick={onNew}
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90"
        >
          <Plus size={16} />
          Novo projeto
        </button>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Resumo</TableHead>
              <TableHead>Publicação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Nenhum projeto cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => {
                const status = getStatus(project);
                return (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell className="hidden max-w-[200px] truncate text-sm text-muted-foreground md:table-cell">
                      {project.summary}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(project.publishDate)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(project)}
                          className="rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          title="Editar"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => onDelete(project.id)}
                          disabled={deletingId === project.id}
                          className="rounded p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                          title="Remover"
                        >
                          <Trash2 size={15} />
                        </button>
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
