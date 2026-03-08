'use client';

import { useState } from 'react';

import {
  useCareersAdmin,
  useCreateCareer,
  useDeleteCareer,
  useUpdateCareer,
} from '@/hooks/useCareer';
import { type Career, type CreateCareerInput } from '@/http/career';

import { CareerSheet } from './CareerSheet';
import { CareerTable } from './CareerTable';

type SheetState = { open: boolean; career: Career | null };

export function CareerPageClient() {
  const { data: careers = [], isLoading, isError } = useCareersAdmin();
  const { mutate: createCareer, isPending: isCreating } = useCreateCareer();
  const { mutate: updateCareer, isPending: isUpdating } = useUpdateCareer();
  const { mutate: deleteCareer } = useDeleteCareer();

  const [sheet, setSheet] = useState<SheetState>({ open: false, career: null });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openNew = () => setSheet({ open: true, career: null });
  const openEdit = (career: Career) => setSheet({ open: true, career });
  const closeSheet = () => setSheet({ open: false, career: null });

  const handleSubmit = (values: CreateCareerInput, onSuccess: () => void) => {
    if (sheet.career) {
      updateCareer({ id: sheet.career.id, data: values }, { onSuccess });
    } else {
      createCareer(values, {
        onSuccess: (created) => {
          setSheet({ open: true, career: created });
          onSuccess();
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteCareer(id, { onSettled: () => setDeletingId(null) });
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando carreiras...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Erro ao carregar as carreiras. Tente recarregar a página.
      </p>
    );
  }

  return (
    <>
      <CareerTable
        careers={careers}
        deletingId={deletingId}
        onNew={openNew}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <CareerSheet
        open={sheet.open}
        career={sheet.career}
        isSubmitting={isCreating || isUpdating}
        onSubmit={handleSubmit}
        onOpenChange={(open) => !open && closeSheet()}
      />
    </>
  );
}
