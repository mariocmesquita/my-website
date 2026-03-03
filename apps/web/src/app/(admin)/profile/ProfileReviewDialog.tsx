'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { type UpdateProfileInput } from '@/http/profile';

interface ProfileReviewDialogProps {
  open: boolean;
  currentValues: UpdateProfileInput;
  pendingValues: UpdateProfileInput;
  isLoading: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}

type DiffRow = {
  label: string;
  before: string;
  after: string;
  changed: boolean;
};

function buildDiff(current: UpdateProfileInput, pending: UpdateProfileInput): DiffRow[] {
  const rows: DiffRow[] = [
    {
      label: 'Nome',
      before: current.name,
      after: pending.name,
      changed: current.name !== pending.name,
    },
    {
      label: 'Cargo',
      before: current.position,
      after: pending.position,
      changed: current.position !== pending.position,
    },
    {
      label: 'Descrição',
      before: current.description,
      after: pending.description,
      changed: current.description !== pending.description,
    },
    { label: 'Bio', before: current.bio, after: pending.bio, changed: current.bio !== pending.bio },
    {
      label: 'E-mail',
      before: current.email,
      after: pending.email,
      changed: current.email !== pending.email,
    },
    {
      label: 'GitHub',
      before: current.socialLinks?.github ?? '',
      after: pending.socialLinks?.github ?? '',
      changed: current.socialLinks?.github !== pending.socialLinks?.github,
    },
    {
      label: 'LinkedIn',
      before: current.socialLinks?.linkedin ?? '',
      after: pending.socialLinks?.linkedin ?? '',
      changed: current.socialLinks?.linkedin !== pending.socialLinks?.linkedin,
    },
    {
      label: 'Instagram',
      before: current.socialLinks?.instagram ?? '',
      after: pending.socialLinks?.instagram ?? '',
      changed: current.socialLinks?.instagram !== pending.socialLinks?.instagram,
    },
    {
      label: 'YouTube',
      before: current.socialLinks?.youtube ?? '',
      after: pending.socialLinks?.youtube ?? '',
      changed: current.socialLinks?.youtube !== pending.socialLinks?.youtube,
    },
  ];

  return rows.map((row) => ({ ...row, changed: row.before !== row.after }));
}

export function ProfileReviewDialog({
  open,
  currentValues,
  pendingValues,
  isLoading,
  onConfirm,
  onOpenChange,
}: ProfileReviewDialogProps) {
  const diff = buildDiff(currentValues, pendingValues);
  const changedCount = diff.filter((r) => r.changed).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Revisar alterações</DialogTitle>
          <DialogDescription>
            {changedCount === 0
              ? 'Nenhuma alteração detectada.'
              : `${changedCount} campo(s) modificado(s). Confirme para salvar.`}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto rounded-lg border border-brand divide-y divide-brand/30">
          {diff
            .filter((row) => row.changed)
            .map((row) => {
              const isLong = row.before.length > 80 || row.after.length > 80;

              if (isLong) {
                return (
                  <div key={row.label} className="px-3 py-2">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">{row.label}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded border border-destructive/30 bg-destructive/5 p-2">
                        <p className="mb-1 text-xs text-muted-foreground">Antes</p>
                        <p className="max-h-28 overflow-y-auto whitespace-pre-wrap break-words text-sm text-destructive">
                          {row.before || '—'}
                        </p>
                      </div>
                      <div className="rounded border border-olive/30 bg-olive/5 p-2">
                        <p className="mb-1 text-xs text-muted-foreground">Depois</p>
                        <p className="max-h-28 overflow-y-auto whitespace-pre-wrap break-words text-sm text-olive">
                          {row.after || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={row.label}
                  className="grid items-baseline gap-x-2 px-3 py-2 text-sm"
                  style={{ gridTemplateColumns: '6rem 1fr 1rem 1fr' }}
                >
                  <span className="text-xs font-medium text-muted-foreground">{row.label}</span>
                  <span className="break-words text-destructive line-through">
                    {row.before || '—'}
                  </span>
                  <span className="text-center text-muted-foreground">→</span>
                  <span className="break-words text-olive">{row.after || '—'}</span>
                </div>
              );
            })}
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground transition hover:bg-foreground/10 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading || changedCount === 0}
            className="rounded-lg bg-olive px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? 'Salvando...' : 'Confirmar'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
