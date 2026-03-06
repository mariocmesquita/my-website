'use client';

import { Check, ChevronDown, Search } from 'lucide-react';
import { type RefObject } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface FilterPopoverProps {
  label: string;
  count: number;
  searchRef: RefObject<HTMLInputElement | null>;
  searchValue: string;
  onSearchChange: (v: string) => void;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  onClear: () => void;
  onOpenChange: (open: boolean) => void;
}

export function FilterPopover({
  label,
  count,
  searchRef,
  searchValue,
  onSearchChange,
  options,
  selected,
  onToggle,
  onClear,
  onOpenChange,
}: FilterPopoverProps) {
  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-2 h-10 px-4 bg-brand/5 border border-brand/20 rounded-xl font-sans text-[14px] text-foreground/70 hover:bg-brand/10 hover:border-brand/40 transition-colors whitespace-nowrap">
          {count > 0 ? (
            <>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand text-brand-foreground text-[10px] font-bold">
                {count}
              </span>
              {label}
            </>
          ) : (
            label
          )}
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <div className="p-2 border-b border-brand/10">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/40 pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Filtrar..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-brand/5 rounded-lg font-sans text-[13px] text-foreground placeholder:text-foreground/40 focus:outline-none"
            />
          </div>
        </div>
        <div className="max-h-52 overflow-y-auto py-1">
          {options.length === 0 ? (
            <p className="px-3 py-2 text-[13px] text-foreground/40 font-sans">Nenhuma opção</p>
          ) : (
            options.map((opt) => {
              const active = selected.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => onToggle(opt)}
                  className="flex items-center justify-between w-full px-3 py-1.5 font-sans text-[13px] text-foreground hover:bg-brand/5 transition-colors"
                >
                  <span>{opt}</span>
                  {active && <Check className="w-3.5 h-3.5 text-brand" />}
                </button>
              );
            })
          )}
        </div>
        {selected.length > 0 && (
          <div className="border-t border-brand/10 p-2">
            <button
              onClick={onClear}
              className="w-full text-center font-sans text-[12px] text-foreground/50 hover:text-foreground/80 transition-colors py-0.5"
            >
              Limpar seleção
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
