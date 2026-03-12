'use client';

import { useState } from 'react';
import { Controller, type FieldPath, type FieldValues, useFormContext } from 'react-hook-form';

import { cn } from '@/server/utils';

function toDisplay(value: unknown): string {
  if (!value || typeof value !== 'string') return '';
  const dateStr = value.split('T')[0] ?? '';
  const parts = dateStr.split('-');
  const year = parts[0];
  const month = parts[1];
  if (!year || !month) return '';
  return `${month}/${year}`;
}

interface InnerProps {
  field: {
    value: unknown;
    onChange: (value: string | null) => void;
    onBlur: () => void;
  };
  nullable: boolean;
}

function MonthYearInput({ field, nullable }: InnerProps) {
  const [display, setDisplay] = useState(() => toDisplay(field.value));
  const [prevValue, setPrevValue] = useState(field.value);

  if (prevValue !== field.value) {
    setPrevValue(field.value);
    setDisplay(toDisplay(field.value));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
    const next = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    setDisplay(next);

    if (digits.length === 6) {
      field.onChange(`${digits.slice(2)}-${digits.slice(0, 2)}-01`);
    } else {
      field.onChange(nullable ? null : '');
    }
  };

  const handleClear = () => {
    setDisplay('');
    field.onChange(null);
  };

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        onBlur={field.onBlur}
        placeholder="MM/YYYY"
        maxLength={7}
        className={cn(
          'w-full rounded-lg border border-brand bg-background px-3 py-2 text-sm text-foreground outline-none transition hover:border-brand/80 focus:border-brand focus:ring-2 focus:ring-brand/20',
          !display && 'placeholder:text-foreground/40',
        )}
      />
      {nullable && display && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground transition hover:text-foreground"
        >
          Limpar
        </button>
      )}
    </div>
  );
}

interface FormMonthYearInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  label: string;
  hint?: string;
  nullable?: boolean;
}

export function FormMonthYearInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, label, hint, nullable = false }: FormMonthYearInputProps<TFieldValues, TName>) {
  const { control, formState } = useFormContext<TFieldValues>();
  const error = formState.errors[name];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => <MonthYearInput field={field} nullable={nullable} />}
      />
      {error && <p className="text-xs text-destructive">{String(error.message)}</p>}
    </div>
  );
}
