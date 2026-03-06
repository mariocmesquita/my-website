'use client';

import { CreatePostSchema } from '@my-website/schemas/post';
import { ArrowLeft, Loader2, PanelRightClose, PanelRightOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, FormProvider } from 'react-hook-form';
import { Group, Panel, Separator, usePanelRef } from 'react-resizable-panels';

import { FormDatePicker } from '@/components/form/FormDatePicker';
import { FormTextarea } from '@/components/form/FormTextarea';
import { MarkdownEditor } from '@/components/form/MarkdownEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreatePost, usePostAdmin, useUpdatePost } from '@/hooks/usePosts';
import { useProjectsAdmin } from '@/hooks/useProjects';
import { useZodForm } from '@/hooks/useZodForm';
import { type CreatePostInput } from '@/http/post';

import { TechStackField } from '../projects/TechStackField';
import { PostBannerImageField } from './PostBannerImageField';
import { RelatedProjectsField } from './RelatedProjectsField';

interface PostEditorProps {
  postId?: string;
}

function toDateInput(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  return dateStr.split('T')[0] ?? '';
}

function toFormValues(post?: {
  title: string;
  summary: string;
  content: string;
  tags: string[];
  techStack: string[];
  bannerImage: string | null;
  status: string;
  publishDate: string | null;
  relatedProjectIds: string[];
}): CreatePostInput {
  return {
    title: post?.title ?? '',
    summary: post?.summary ?? '',
    content: post?.content ?? '',
    tags: post?.tags ?? [],
    techStack: post?.techStack ?? [],
    bannerImage: post?.bannerImage ?? null,
    status: (post?.status as 'draft' | 'published' | 'archived') ?? 'draft',
    publishDate: toDateInput(post?.publishDate) || null,
    relatedProjectIds: post?.relatedProjectIds ?? [],
  };
}

export function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter();
  const isEditing = !!postId;

  const { data: post, isLoading: isLoadingPost } = usePostAdmin(postId);
  const { data: projects = [] } = useProjectsAdmin();
  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();

  const methods = useZodForm<CreatePostInput>(CreatePostSchema, {
    defaultValues: toFormValues(),
    mode: 'onChange',
  });

  const {
    formState: { errors },
    watch,
    setValue,
    control,
  } = methods;

  const [editorReady, setEditorReady] = useState(!isEditing);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarPanelRef = usePanelRef();

  useEffect(() => {
    if (post) {
      methods.reset(toFormValues(post));
      setEditorReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const handleSave = (status: 'draft' | 'published') => {
    setValue('status', status, { shouldValidate: false });
    methods.handleSubmit((values) => {
      const data = { ...values, status };
      if (isEditing) {
        updatePost({ id: postId, data }, { onSuccess: () => router.push('/admin/posts') });
      } else {
        createPost(data, { onSuccess: () => router.push('/admin/posts') });
      }
    })();
  };

  const toggleSidebar = () => {
    const panel = sidebarPanelRef.current;
    if (!panel) return;
    if (sidebarOpen) {
      panel.collapse();
      setSidebarOpen(false);
    } else {
      panel.expand();
      setSidebarOpen(true);
    }
  };

  const isSaving = isCreating || isUpdating;

  if (isEditing && isLoadingPost) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 size={16} className="animate-spin" />
        Carregando post...
      </div>
    );
  }

  const contentValue = watch('content') ?? '';

  return (
    <FormProvider {...methods}>
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background">
        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-4 py-2">
          <Link
            href="/admin/posts"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft size={15} />
            Posts
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave('draft')}
              disabled={isSaving}
              className="rounded-lg border border-brand px-4 py-2 text-sm font-medium text-foreground transition hover:bg-brand/5 disabled:opacity-50"
            >
              {isSaving ? 'Salvando...' : 'Salvar rascunho'}
            </button>
            <button
              type="button"
              onClick={() => handleSave('published')}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              {isEditing ? 'Salvar e publicar' : 'Publicar'}
            </button>
            <button
              type="button"
              onClick={toggleSidebar}
              title={sidebarOpen ? 'Ocultar painel' : 'Mostrar painel'}
              className="rounded-lg border border-border p-2 text-muted-foreground transition hover:bg-brand/5 hover:text-foreground"
            >
              {sidebarOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
            </button>
          </div>
        </div>

        {/* Resizable editor layout */}
        <Group id="post-editor-group" orientation="horizontal" className="min-h-0 flex-1">
          {/* Editor panel */}
          <Panel id="post-editor-main" defaultSize="75%" minSize="40%">
            <div className="flex h-full flex-col overflow-hidden">
              {/* Title field */}
              <div className="shrink-0 border-b border-border bg-brand/5 px-3 py-2">
                <input
                  {...methods.register('title')}
                  placeholder="Título do post"
                  className="w-full border-0 bg-transparent font-spectral text-3xl font-bold text-foreground outline-none placeholder:text-foreground/30"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Markdown editor */}
              <div className="flex-1 overflow-hidden">
                {editorReady && (
                  <MarkdownEditor
                    key={postId ?? 'new'}
                    value={contentValue}
                    onChange={(val) => setValue('content', val, { shouldValidate: true })}
                    placeholder="Escreva seu post aqui... Use # para títulos, **negrito**, *itálico*, e / para mais opções."
                    error={errors.content?.message}
                    borderless
                  />
                )}
              </div>
            </div>
          </Panel>

          {/* Resize handle */}

          <div className="h-full w-px bg-border transition-colors hover:bg-olive hover:scale-x-200 data-[active]:bg-brand transition-[transform,background-color] duration-100 delay-200" />

          {/* Sidebar panel */}
          <Panel
            id="post-editor-sidebar"
            panelRef={sidebarPanelRef}
            defaultSize="25%"
            minSize="15%"
            maxSize="45%"
            collapsible
            onResize={({ asPercentage }) => {
              setSidebarOpen(asPercentage > 0);
            }}
          >
            <div className="h-full overflow-y-auto">
              {/* Publicação */}
              <div className="space-y-4 px-4 py-4">
                <p className="text-sm font-medium text-foreground">Publicação</p>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="border-brand text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                          <SelectItem value="archived">Arquivado</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <FormDatePicker
                  name="publishDate"
                  label="Data de publicação"
                  hint="Opcional — agenda o post"
                  toYear={new Date().getFullYear() + 5}
                />
              </div>
              <div className="h-px bg-border" />

              {/* Metadados */}
              <div className="space-y-4 px-4 py-4">
                <p className="text-sm font-medium text-foreground">Metadados</p>

                <FormTextarea
                  name="summary"
                  label="Resumo"
                  hint="máx. 300 caracteres"
                  placeholder="Breve descrição para cards e SEO"
                  rows={3}
                />

                <TechStackField name="techStack" label="Tecnologias" />

                <TechStackField name="tags" label="Tags" />
              </div>
              <div className="h-px bg-border" />

              {/* Imagem */}
              <div className="space-y-4 px-4 py-4">
                <p className="text-sm font-medium text-foreground">Imagem</p>
                <PostBannerImageField name="bannerImage" label="Imagem de capa" />
              </div>
              <div className="h-px bg-border" />

              {/* Relações */}
              <div className="space-y-4 px-4 py-4">
                <p className="text-sm font-medium text-foreground">Relações</p>
                <RelatedProjectsField name="relatedProjectIds" projects={projects} />
              </div>
            </div>
          </Panel>
        </Group>
      </div>
    </FormProvider>
  );
}
