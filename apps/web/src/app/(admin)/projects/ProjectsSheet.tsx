'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { type CreateProjectInput, type ProjectAdmin } from '@/http/project';

import { ProjectsForm } from './ProjectsForm';

interface ProjectsSheetProps {
  open: boolean;
  project: ProjectAdmin | null;
  isSubmitting: boolean;
  onSubmit: (values: CreateProjectInput) => void;
  onOpenChange: (open: boolean) => void;
}

export function ProjectsSheet({
  open,
  project,
  isSubmitting,
  onSubmit,
  onOpenChange,
}: ProjectsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-[600px]">
        <SheetHeader className="px-6 pb-4 pt-6">
          <SheetTitle className="font-spectral text-xl font-bold text-foreground">
            {project ? 'Editar projeto' : 'Novo projeto'}
          </SheetTitle>
        </SheetHeader>
        <div className="px-6 pb-8">
          <ProjectsForm
            project={project ?? undefined}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
