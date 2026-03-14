'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';

import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Career } from '@/http/career';

interface CareerTableProps {
  careers: Career[];
  deletingId: string | null;
  onNew: () => void;
  onEdit: (career: Career) => void;
  onDelete: (id: string) => void;
}

function formatPeriod(startDate: string, endDate: string | null): string {
  const fmt = (d: string) => {
    const [year, month] = d.split('T')[0]!.split('-').map(Number);
    return new Date(year!, month! - 1, 1).toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric',
    });
  };
  return `${fmt(startDate)} — ${endDate ? fmt(endDate) : 'presente'}`;
}

export function CareerTable({ careers, deletingId, onNew, onEdit, onDelete }: CareerTableProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {careers.length} {careers.length === 1 ? 'entrada' : 'entradas'}
        </p>
        <button
          onClick={onNew}
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90"
        >
          <Plus size={16} />
          Nova entrada
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Período</TableHead>
              <TableHead className="w-12 text-center">PT</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {careers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Nenhuma entrada cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              careers.map((career) => {
                const hasTranslation = !!career.translated;
                return (
                  <TableRow key={career.id}>
                    <TableCell className="font-medium">{career.company}</TableCell>
                    <TableCell>{career.role}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatPeriod(career.startDate, career.endDate)}
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
                        <button
                          onClick={() => onEdit(career)}
                          className="rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          title="Editar"
                        >
                          <Pencil size={15} />
                        </button>
                        <DeleteConfirmDialog onConfirm={() => onDelete(career.id)}>
                          <button
                            disabled={deletingId === career.id}
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
