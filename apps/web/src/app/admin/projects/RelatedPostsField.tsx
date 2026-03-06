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
import { type PostAdmin } from '@/http/post';

interface RelatedPostsFieldProps {
  name: string;
  posts: PostAdmin[];
}

export function RelatedPostsField({ name, posts }: RelatedPostsFieldProps) {
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

  const selectedPosts = posts.filter((p) => selectedIds.includes(p.id));

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-foreground">Posts relacionados</label>

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
                ? 'Selecionar posts...'
                : `${selectedIds.length} post${selectedIds.length > 1 ? 's' : ''} selecionado${selectedIds.length > 1 ? 's' : ''}`}
            </span>
            <ChevronsUpDown size={14} className="shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar posts..." />
            <CommandList>
              <CommandEmpty>Nenhum post encontrado.</CommandEmpty>
              <CommandGroup>
                {posts.map((post) => (
                  <CommandItem key={post.id} value={post.title} onSelect={() => toggle(post.id)}>
                    <Check
                      size={14}
                      className={selectedIds.includes(post.id) ? 'opacity-100' : 'opacity-0'}
                    />
                    {post.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedPosts.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedPosts.map((post) => (
            <Badge
              key={post.id}
              variant="outline"
              className="flex items-center gap-1 border-brand/40 pl-2.5 pr-1.5"
            >
              {post.title}
              <button
                type="button"
                onClick={() => remove(post.id)}
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
