'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface RelatedItemsFieldProps {
  name: string;
  items: Array<{ id: string; title: string }>;
  label: string;
  selectPlaceholder: string;
  searchPlaceholder: string;
  emptyText: string;
  selectedCountLabel: (count: number) => string;
}

export function RelatedItemsField({
  name,
  items,
  label,
  selectPlaceholder,
  searchPlaceholder,
  emptyText,
  selectedCountLabel,
}: RelatedItemsFieldProps) {
  const { watch, setValue } = useFormContext();
  const [open, setOpen] = useState(false);

  const selectedIds: string[] = watch(name) ?? [];

  const toggle = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setValue(name, next, { shouldValidate: true });
  };

  const remove = (id: string) => {
    setValue(
      name,
      selectedIds.filter((i) => i !== id),
      { shouldValidate: true },
    );
  };

  const selectedItems = items.filter((item) => selectedIds.includes(item.id));

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            className="flex w-full items-center justify-between rounded-lg border border-brand bg-background px-3 py-2 text-sm text-foreground outline-none transition hover:border-brand/80 focus:ring-2 focus:ring-brand/20"
          >
            <span className="text-foreground/50">
              {selectedIds.length === 0
                ? selectPlaceholder
                : selectedCountLabel(selectedIds.length)}
            </span>
            <ChevronsUpDown size={14} className="shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem key={item.id} value={item.title} onSelect={() => toggle(item.id)}>
                    <Check
                      size={14}
                      className={selectedIds.includes(item.id) ? 'opacity-100' : 'opacity-0'}
                    />
                    {item.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedItems.map((item) => (
            <Badge
              key={item.id}
              variant="outline"
              className="flex items-center gap-1 border-brand/40 pl-2.5 pr-1.5"
            >
              {item.title}
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="rounded transition hover:text-destructive"
              >
                <X size={11} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
