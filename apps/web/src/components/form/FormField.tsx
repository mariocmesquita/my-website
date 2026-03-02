'use client';

import { type InputHTMLAttributes } from 'react';
import { type FieldPath, type FieldValues, useFormContext } from 'react-hook-form';

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends InputHTMLAttributes<HTMLInputElement> {
  name: TName;
  label: string;
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, label, ...props }: FormFieldProps<TFieldValues, TName>) {
  const { register, formState } = useFormContext<TFieldValues>();
  const error = formState.errors[name];

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={String(name)} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={String(name)}
        {...register(name)}
        {...props}
        className="rounded-lg border-1 border-brand bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-olive focus:ring-2 focus:ring-olive/30 hover:border-brand/80"
      />
      {error && <p className="text-xs text-destructive">{String(error.message)}</p>}
    </div>
  );
}
