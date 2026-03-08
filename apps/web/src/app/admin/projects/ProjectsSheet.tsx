'use client';

import { useState } from 'react';

import { LocaleToggle } from '@/components/admin/LocaleToggle';
import { OtherLocaleDialog } from '@/components/admin/OtherLocaleDialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { type PostAdmin } from '@/http/post';
import { type CreateProjectInput, type ProjectAdmin } from '@/http/project';

import { ProjectsForm } from './ProjectsForm';
import { ProjectsTranslationForm } from './ProjectsTranslationForm';

interface ProjectsSheetProps {
  open: boolean;
  project: ProjectAdmin | null;
  posts: PostAdmin[];
  isSubmitting: boolean;
  onSubmit: (values: CreateProjectInput, onSuccess: () => void) => void;
  onOpenChange: (open: boolean) => void;
}

export function ProjectsSheet({
  open,
  project,
  posts,
  isSubmitting,
  onSubmit,
  onOpenChange,
}: ProjectsSheetProps) {
  const [locale, setLocale] = useState<'en' | 'pt'>('en');
  const [showLocaleDialog, setShowLocaleDialog] = useState(false);

  const handleEnSubmit = (values: CreateProjectInput) => {
    onSubmit(values, () => setShowLocaleDialog(true));
  };

  const handleLocaleDialogConfirm = () => {
    setShowLocaleDialog(false);
    setLocale(locale === 'en' ? 'pt' : 'en');
  };

  const handleLocaleDialogDismiss = () => {
    setShowLocaleDialog(false);
    onOpenChange(false);
  };

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(v) => {
          if (!v) setLocale('en');
          onOpenChange(v);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-[600px]">
          <SheetHeader className="px-6 pb-4 pt-6">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-spectral text-xl font-bold text-foreground">
                {project ? 'Editar projeto' : 'Novo projeto'}
              </SheetTitle>
              <LocaleToggle
                locale={locale}
                onChange={setLocale}
                disabled={!project || isSubmitting}
              />
            </div>
          </SheetHeader>
          <div className="px-6 pb-8">
            {locale === 'pt' && project ? (
              <ProjectsTranslationForm
                projectId={project.id}
                onSuccess={() => setShowLocaleDialog(true)}
              />
            ) : (
              <ProjectsForm
                project={project ?? undefined}
                posts={posts}
                isSubmitting={isSubmitting}
                onSubmit={handleEnSubmit}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
      <OtherLocaleDialog
        open={showLocaleDialog}
        savedLocale={locale}
        onConfirm={handleLocaleDialogConfirm}
        onDismiss={handleLocaleDialogDismiss}
      />
    </>
  );
}
