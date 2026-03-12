'use client';

import { useState } from 'react';

import { LocaleToggle } from '@/components/admin/LocaleToggle';
import { OtherLocaleDialog } from '@/components/admin/OtherLocaleDialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { type Career, type CreateCareerInput } from '@/http/career';

import { CareerForm } from './CareerForm';
import { CareerTranslationForm } from './CareerTranslationForm';

interface CareerSheetProps {
  open: boolean;
  career: Career | null;
  isSubmitting: boolean;
  onSubmit: (values: CreateCareerInput, onSuccess: () => void) => void;
  onOpenChange: (open: boolean) => void;
}

export function CareerSheet({
  open,
  career,
  isSubmitting,
  onSubmit,
  onOpenChange,
}: CareerSheetProps) {
  const [locale, setLocale] = useState<'en' | 'pt'>('en');
  const [showLocaleDialog, setShowLocaleDialog] = useState(false);

  const handleEnSubmit = (values: CreateCareerInput) => {
    onSubmit(values, () => setShowLocaleDialog(true));
  };

  const handleLocaleDialogConfirm = () => {
    setShowLocaleDialog(false);
    setLocale(locale === 'en' ? 'pt' : 'en');
  };

  const handleLocaleDialogDismiss = () => {
    setShowLocaleDialog(false);
    setLocale('en');
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
        <SheetContent className="w-full sm:max-w-[560px] overflow-y-auto">
          <SheetHeader className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-spectral text-xl font-bold text-foreground">
                {career ? 'Editar entrada' : 'Nova entrada'}
              </SheetTitle>
              <LocaleToggle
                locale={locale}
                onChange={setLocale}
                disabled={!career || isSubmitting}
              />
            </div>
          </SheetHeader>
          <div className="px-6 pb-8">
            {locale === 'pt' && career ? (
              <CareerTranslationForm
                careerId={career.id}
                onSuccess={() => setShowLocaleDialog(true)}
              />
            ) : (
              <CareerForm
                career={career ?? undefined}
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
