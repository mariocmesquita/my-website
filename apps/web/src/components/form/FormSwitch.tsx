'use client';

import { Controller, type FieldPath, type FieldValues, useFormContext } from 'react-hook-form';

import { Switch } from '@/components/ui/switch';

interface FormSwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  label: string;
  hint?: string;
}

export function FormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, label, hint }: FormSwitchProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center justify-between rounded-lg border-1 border-brand bg-background px-3 py-2.5">
          <div>
            <p className="text-sm font-medium text-foreground">{label}</p>
            {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
          </div>
          <Switch
            checked={field.value as boolean}
            onCheckedChange={field.onChange}
            id={String(name)}
          />
        </div>
      )}
    />
  );
}
