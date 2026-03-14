'use client';

import { type TextareaHTMLAttributes } from 'react';
import { type FieldPath, type FieldValues, useFormContext } from 'react-hook-form';

interface FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: TName;
  label: string;
  hint?: string;
}

export function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, label, hint, ...props }: FormTextareaProps<TFieldValues, TName>) {
  const { register, formState } = useFormContext<TFieldValues>();
  const error = formState.errors[name];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <label htmlFor={String(name)} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      <div className="overflow-hidden rounded-lg border-1 border-brand transition focus-within:ring-2 focus-within:ring-brand/20 hover:border-brand/80 focus-within:border-brand">
        <textarea
          id={String(name)}
          {...register(name)}
          {...props}
          className="block min-h-24 w-full resize-y bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-foreground/40"
        />
      </div>
      {error && <p className="text-xs text-destructive">{String(error.message)}</p>}
    </div>
  );
}
