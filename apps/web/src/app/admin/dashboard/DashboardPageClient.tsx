'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLogs } from '@/hooks/useLogs';
import { type LogEntry } from '@/http/log';

const LIMIT = 50;

function LevelBadge({ level }: { level: string }) {
  if (level === 'error') {
    return <Badge variant="destructive">{level}</Badge>;
  }
  if (level === 'security') {
    return (
      <Badge className="border-amber-300 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
        {level}
      </Badge>
    );
  }
  return <Badge variant="secondary">{level}</Badge>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function LogRow({ log }: { log: LogEntry }) {
  return (
    <TableRow>
      <TableCell>
        <LevelBadge level={log.level} />
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">{log.eventType}</TableCell>
      <TableCell className="max-w-[280px] truncate text-sm" title={log.message}>
        {log.message}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {log.method && log.path ? (
          <span className="font-mono">
            {log.method} {log.path}
          </span>
        ) : (
          '—'
        )}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">{log.ip ?? '—'}</TableCell>
      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
        {formatDate(log.createdAt)}
      </TableCell>
    </TableRow>
  );
}

export function DashboardPageClient() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useLogs(page, LIMIT);

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Logs</h2>
          <p className="text-xs text-muted-foreground">Atualiza automaticamente a cada 30s</p>
        </div>
        {data && (
          <p className="text-sm text-muted-foreground">
            {data.total} {data.total === 1 ? 'entrada' : 'entradas'}
          </p>
        )}
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Nível</TableHead>
              <TableHead className="w-36">Tipo</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead className="w-48">Rota</TableHead>
              <TableHead className="w-32">IP</TableHead>
              <TableHead className="w-36">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  Carregando logs...
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-destructive">
                  Erro ao carregar logs.
                </TableCell>
              </TableRow>
            )}
            {data && data.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum log registrado.
                </TableCell>
              </TableRow>
            )}
            {data && data.items.map((log) => <LogRow key={log.id} log={log} />)}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border border-border px-3 py-1.5 text-sm transition hover:bg-muted disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-md border border-border px-3 py-1.5 text-sm transition hover:bg-muted disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
