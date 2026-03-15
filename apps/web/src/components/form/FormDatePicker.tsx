'use client';

import { format, parseISO, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, type FieldPath, type FieldValues, useFormContext } from 'react-hook-form';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/server/utils';

interface FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  label: string;
  hint?: string;
  nullable?: boolean;
  disablePast?: boolean;
  showNowButton?: boolean;
  fromYear?: number;
  toYear?: number;
}

export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  hint,
  nullable = false,
  disablePast = false,
  showNowButton = false,
  fromYear = 1990,
  toYear = new Date().getFullYear(),
}: FormDatePickerProps<TFieldValues, TName>) {
  const { control, formState } = useFormContext<TFieldValues>();
  const error = formState.errors[name];
  const [open, setOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState<Date | undefined>();

  const handleOpenChange = (nextOpen: boolean, selectedDate?: Date) => {
    if (nextOpen) {
      setDisplayMonth(selectedDate ?? new Date());
    }
    setOpen(nextOpen);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const selectedDate = field.value ? parseISO(field.value as string) : undefined;

          return (
            <Popover
              open={open}
              onOpenChange={(nextOpen) => handleOpenChange(nextOpen, selectedDate)}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg border-1 border-brand bg-background px-3 py-2 text-sm text-foreground outline-none transition hover:border-brand/80 focus:border-brand focus:ring-2 focus:ring-brand/20',
                    !field.value && 'text-foreground/40',
                  )}
                >
                  <CalendarIcon className="size-4 shrink-0 opacity-60" />
                  {selectedDate
                    ? format(selectedDate, "d 'de' MMM. 'de' yyyy", { locale: ptBR })
                    : 'Selecionar data'}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  month={displayMonth}
                  onMonthChange={setDisplayMonth}
                  onSelect={(date) => {
                    field.onChange(date ? format(date, 'yyyy-MM-dd') : null);
                    if (date) setOpen(false);
                  }}
                  disabled={disablePast ? { before: startOfDay(new Date()) } : undefined}
                  captionLayout="dropdown"
                  fromYear={fromYear}
                  toYear={toYear}
                  locale={ptBR}
                />
                {(nullable || showNowButton) && (
                  <div className="flex gap-1 border-t border-border px-3 pb-3 pt-2">
                    {showNowButton && (
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(format(new Date(), 'yyyy-MM-dd'));
                          setOpen(false);
                        }}
                        className="flex-1 rounded-md py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                      >
                        Agora
                      </button>
                    )}
                    {nullable && (
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(null);
                          setOpen(false);
                        }}
                        className="flex-1 rounded-md py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                )}
              </PopoverContent>
            </Popover>
          );
        }}
      />
      {error && <p className="text-xs text-destructive">{String(error.message)}</p>}
    </div>
  );
}
