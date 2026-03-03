'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface TechStackFieldProps {
  name: string;
  label: string;
}

export function TechStackField({ name, label }: TechStackFieldProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [input, setInput] = useState('');
  const items: string[] = watch(name) ?? [];
  const error = errors[name]?.message as string | undefined;

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed || items.includes(trimmed)) return;
    setValue(name, [...items, trimmed], { shouldValidate: true });
    setInput('');
  };

  const remove = (item: string) => {
    setValue(
      name,
      items.filter((i) => i !== item),
      { shouldValidate: true },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    }
    if (e.key === ',') {
      e.preventDefault();
      add();
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ex: Next.js — Enter ou vírgula para adicionar"
          className="flex-1 rounded-lg border-1 border-brand bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-olive focus:ring-2 focus:ring-olive/30 hover:border-brand/80"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-lg border-1 border-brand bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-brand hover:text-brand-foreground"
        >
          Adicionar
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 h-7 pl-2.5 pr-1.5 bg-brand text-brand-foreground rounded-lg text-[12px] font-sans"
            >
              {item}
              <button
                type="button"
                onClick={() => remove(item)}
                className="flex items-center justify-center rounded hover:bg-brand-foreground/20 transition p-0.5"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
