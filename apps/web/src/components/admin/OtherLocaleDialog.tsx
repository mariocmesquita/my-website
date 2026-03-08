'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

interface OtherLocaleDialogProps {
  open: boolean;
  savedLocale: 'en' | 'pt';
  onConfirm: () => void;
  onDismiss: () => void;
}

export function OtherLocaleDialog({
  open,
  savedLocale,
  onConfirm,
  onDismiss,
}: OtherLocaleDialogProps) {
  const otherLocale = savedLocale === 'en' ? 'PT' : 'EN';

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atualizar em {otherLocale}?</DialogTitle>
          <DialogDescription>
            Conteúdo salvo em {savedLocale.toUpperCase()}. Deseja também atualizar a versão em{' '}
            {otherLocale}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground transition hover:bg-foreground/10"
          >
            Agora não
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90"
          >
            Atualizar em {otherLocale}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
