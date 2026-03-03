'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { type Career, type CreateCareerInput } from '@/http/career';

import { CareerForm } from './CareerForm';

interface CareerSheetProps {
  open: boolean;
  career: Career | null;
  isSubmitting: boolean;
  onSubmit: (values: CreateCareerInput) => void;
  onOpenChange: (open: boolean) => void;
}

export function CareerSheet({
  open,
  career,
  isSubmitting,
  onSubmit,
  onOpenChange,
}: CareerSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[560px] overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="font-spectral text-xl font-bold text-foreground">
            {career ? 'Editar entrada' : 'Nova entrada'}
          </SheetTitle>
        </SheetHeader>
        <div className="px-6 pb-8">
          <CareerForm
            career={career ?? undefined}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
