'use client';

import { type ProjectListItem } from '@my-website/schemas/project';
import { ArrowUpDown, Check, ChevronDown, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TechBadge } from '@/components/ui/TechBadge';

interface ProjectsPageClientProps {
  projects: ProjectListItem[];
}

export function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get('q') ?? '';
  const selectedTechs = useMemo(() => {
    const raw = searchParams.get('tech');
    return raw ? raw.split(',').filter(Boolean) : [];
  }, [searchParams]);
  const sort = (searchParams.get('sort') ?? 'newest') as 'newest' | 'oldest';

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const allTechs = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) {
      for (const t of p.techStack) set.add(t);
    }
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    let result = [...projects];

    if (q.trim()) {
      const lower = q.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(lower) || p.summary.toLowerCase().includes(lower),
      );
    }

    if (selectedTechs.length > 0) {
      result = result.filter((p) => selectedTechs.every((t) => p.techStack.includes(t)));
    }

    if (sort === 'oldest') {
      result.reverse();
    }

    return result;
  }, [projects, q, selectedTechs, sort]);

  const toggleTech = (tech: string) => {
    const next = selectedTechs.includes(tech)
      ? selectedTechs.filter((t) => t !== tech)
      : [...selectedTechs, tech];
    updateParams({ tech: next.length > 0 ? next.join(',') : null });
  };

  const toggleSort = () => {
    updateParams({ sort: sort === 'newest' ? 'oldest' : 'newest' });
  };

  const clearFilters = () => {
    router.replace('/projects', { scroll: false });
  };

  const hasFilters = q !== '' || selectedTechs.length > 0 || sort !== 'newest';
  const [techSearch, setTechSearch] = useState('');
  const techSearchRef = useRef<HTMLInputElement>(null);

  const filteredTechOptions = useMemo(() => {
    if (!techSearch.trim()) return allTechs;
    const lower = techSearch.toLowerCase();
    return allTechs.filter((t) => t.toLowerCase().includes(lower));
  }, [allTechs, techSearch]);

  return (
    <div>
      {/* Controles de busca e filtro */}
      <div className="flex items-center gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar projetos..."
            value={q}
            onChange={(e) => updateParams({ q: e.target.value || null })}
            className="w-full h-10 pl-9 pr-4 bg-brand/5 border border-brand/20 rounded-xl font-sans text-[14px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-brand/50 transition-colors"
          />
        </div>

        {allTechs.length > 0 && (
          <Popover
            onOpenChange={(open) => {
              if (open) setTimeout(() => techSearchRef.current?.focus(), 50);
              else setTechSearch('');
            }}
          >
            <PopoverTrigger asChild>
              <button className="inline-flex items-center gap-2 h-10 px-4 bg-brand/5 border border-brand/20 rounded-xl font-sans text-[14px] text-foreground/70 hover:bg-brand/10 hover:border-brand/40 transition-colors whitespace-nowrap">
                {selectedTechs.length > 0 ? (
                  <>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand text-brand-foreground text-[10px] font-bold">
                      {selectedTechs.length}
                    </span>
                    Tecnologias
                  </>
                ) : (
                  'Tecnologias'
                )}
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="start">
              <div className="p-2 border-b border-brand/10">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/40 pointer-events-none" />
                  <input
                    ref={techSearchRef}
                    type="text"
                    placeholder="Filtrar..."
                    value={techSearch}
                    onChange={(e) => setTechSearch(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 bg-brand/5 rounded-lg font-sans text-[13px] text-foreground placeholder:text-foreground/40 focus:outline-none"
                  />
                </div>
              </div>
              <div className="max-h-52 overflow-y-auto py-1">
                {filteredTechOptions.length === 0 ? (
                  <p className="px-3 py-2 text-[13px] text-foreground/40 font-sans">
                    Nenhuma opção
                  </p>
                ) : (
                  filteredTechOptions.map((tech) => {
                    const active = selectedTechs.includes(tech);
                    return (
                      <button
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className="flex items-center justify-between w-full px-3 py-1.5 font-sans text-[13px] text-foreground hover:bg-brand/5 transition-colors"
                      >
                        <span>{tech}</span>
                        {active && <Check className="w-3.5 h-3.5 text-brand" />}
                      </button>
                    );
                  })
                )}
              </div>
              {selectedTechs.length > 0 && (
                <div className="border-t border-brand/10 p-2">
                  <button
                    onClick={() => updateParams({ tech: null })}
                    className="w-full text-center font-sans text-[12px] text-foreground/50 hover:text-foreground/80 transition-colors py-0.5"
                  >
                    Limpar seleção
                  </button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}

        <button
          onClick={toggleSort}
          className="inline-flex items-center gap-2 h-10 px-4 bg-brand/5 border border-brand/20 rounded-xl font-sans text-[14px] text-foreground/70 hover:bg-brand/10 hover:border-brand/40 transition-colors whitespace-nowrap"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          {sort === 'newest' ? 'Mais recentes' : 'Mais antigos'}
        </button>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 h-10 px-3 text-[13px] font-sans text-foreground/50 hover:text-foreground/80 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Limpar
          </button>
        )}
      </div>

      {/* Grid de projetos */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <ProjectGridCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-spectral text-[18px] text-foreground/60">Nenhum projeto encontrado.</p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-3 font-sans text-[14px] text-olive hover:opacity-75 transition-opacity"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ProjectGridCard({ project }: { project: ProjectListItem }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-brand/15 bg-background hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5 transition-all duration-200"
    >
      <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-stone-200 to-stone-300">
        {project.bannerImage ? (
          <Image
            src={project.bannerImage}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-stone-200 to-stone-300 group-hover:from-stone-300 group-hover:to-stone-400 transition-colors duration-300" />
        )}
      </div>
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <p className="font-spectral font-bold text-[16px] text-foreground group-hover:text-olive transition-colors leading-snug">
            {project.title}
          </p>
          <p className="font-spectral text-[14px] text-foreground/70 leading-[1.6] mt-1.5 line-clamp-3">
            {project.summary}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {project.techStack.slice(0, 4).map((tech) => (
            <TechBadge key={tech} label={tech} />
          ))}
          {project.techStack.length > 4 && (
            <span className="inline-flex items-center h-7 px-2.5 text-[12px] font-sans text-foreground/50">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
