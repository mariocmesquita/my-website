'use client';

import { useState } from 'react';

import {
  useCreateProject,
  useDeleteProject,
  useProjectsAdmin,
  useUpdateProject,
} from '@/hooks/useProjects';
import { type CreateProjectInput, type ProjectAdmin } from '@/http/project';

import { ProjectsSheet } from './ProjectsSheet';
import { ProjectsTable } from './ProjectsTable';

type SheetState = { open: boolean; project: ProjectAdmin | null };

export function ProjectsPageClient() {
  const { data: projects = [], isLoading, isError } = useProjectsAdmin();
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutate: deleteProject } = useDeleteProject();

  const [sheet, setSheet] = useState<SheetState>({ open: false, project: null });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openNew = () => setSheet({ open: true, project: null });
  const openEdit = (project: ProjectAdmin) => setSheet({ open: true, project });
  const closeSheet = () => setSheet({ open: false, project: null });

  const handleSubmit = (values: CreateProjectInput) => {
    if (sheet.project) {
      updateProject({ id: sheet.project.id, data: values }, { onSuccess: closeSheet });
    } else {
      createProject(values, { onSuccess: closeSheet });
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteProject(id, { onSettled: () => setDeletingId(null) });
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando projetos...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Erro ao carregar os projetos. Tente recarregar a página.
      </p>
    );
  }

  return (
    <>
      <ProjectsTable
        projects={projects}
        deletingId={deletingId}
        onNew={openNew}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <ProjectsSheet
        open={sheet.open}
        project={sheet.project}
        isSubmitting={isCreating || isUpdating}
        onSubmit={handleSubmit}
        onOpenChange={(open) => !open && closeSheet()}
      />
    </>
  );
}
