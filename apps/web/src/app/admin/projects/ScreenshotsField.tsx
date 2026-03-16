'use client';

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Images, Loader2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import { uploadProjectFile } from '@/http/project';
import { useAuth } from '@/server/firebase';

interface SortableScreenshotProps {
  url: string;
  index: number;
  onRemove: (index: number) => void;
}

function SortableScreenshot({ url, index, onRemove }: SortableScreenshotProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: url,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-lg border border-border ${isDragging ? 'z-10 scale-105 opacity-75 shadow-lg' : 'cursor-grab active:cursor-grabbing'}`}
      {...attributes}
      {...listeners}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={`Screenshot ${index + 1}`}
        className="pointer-events-none h-24 w-full object-cover"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute right-1 top-1 flex items-center justify-center rounded-full bg-destructive p-1 text-white opacity-0 transition group-hover:opacity-100"
      >
        <X size={10} />
      </button>
    </div>
  );
}

interface ScreenshotsFieldProps {
  name: string;
  label: string;
}

export function ScreenshotsField({ name, label }: ScreenshotsFieldProps) {
  const { watch, setValue } = useFormContext();
  const { getToken } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const urls: string[] = watch(name) ?? [];

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 5 * 1024 * 1024;

    const oversized = files.filter((f) => f.size > MAX_SIZE);
    const invalidType = files.filter((f) => !ALLOWED.includes(f.type));

    if (oversized.length > 0) {
      toast.error(`${oversized.map((f) => f.name).join(', ')}: arquivo(s) acima de 5MB.`);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    if (invalidType.length > 0) {
      toast.error(
        `${invalidType.map((f) => f.name).join(', ')}: formato inválido. Use JPG, PNG ou WebP.`,
      );
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    try {
      const token = await getToken();
      const uploaded = await Promise.all(
        files.map((file) => uploadProjectFile(token, file, 'screenshot')),
      );
      setValue(name, [...urls, ...uploaded], { shouldValidate: true });
    } catch {
      toast.error('Erro ao fazer upload dos screenshots.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = (index: number) => {
    setValue(
      name,
      urls.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = urls.indexOf(active.id as string);
    const newIndex = urls.indexOf(over.id as string);
    setValue(name, arrayMove(urls, oldIndex, newIndex), { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-xs text-muted-foreground">
          16:9 · JPG, PNG ou WebP · máx. 5MB por imagem
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {urls.length > 0
            ? `${urls.length} screenshot${urls.length > 1 ? 's' : ''}`
            : 'Nenhum screenshot adicionado.'}
        </p>
        <label
          htmlFor="screenshots-upload"
          aria-disabled={isUploading}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-brand bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-brand hover:text-brand-foreground aria-disabled:opacity-60"
        >
          {isUploading ? <Loader2 size={12} className="animate-spin" /> : <Images size={12} />}
          {isUploading ? 'Enviando...' : 'Adicionar screenshots'}
        </label>
      </div>

      {urls.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={urls} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 gap-2">
              {urls.map((url, index) => (
                <SortableScreenshot key={url} url={url} index={index} onRemove={remove} />
              ))}
            </div>
          </SortableContext>
          {urls.length >= 2 && (
            <p className="text-xs text-muted-foreground">Arraste para reordenar</p>
          )}
        </DndContext>
      )}

      <input
        id="screenshots-upload"
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={isUploading}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
