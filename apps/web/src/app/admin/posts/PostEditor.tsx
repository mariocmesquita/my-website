'use client';

import { CreatePostSchema, UpsertPostTranslationSchema } from '@my-website/schemas/post';
import { parseISO, startOfDay } from 'date-fns';
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Globe,
  Languages,
  Loader2,
  PanelRightClose,
  PanelRightOpen,
  Save,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { Group, Panel, usePanelRef } from 'react-resizable-panels';

import { LocaleToggle } from '@/components/admin/LocaleToggle';
import { OtherLocaleDialog } from '@/components/admin/OtherLocaleDialog';
import { FormDatePicker } from '@/components/form/FormDatePicker';
import { FormTextarea } from '@/components/form/FormTextarea';
import { MarkdownEditor } from '@/components/form/MarkdownEditor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  useCreatePost,
  usePostAdmin,
  usePostTranslation,
  useUpdatePost,
  useUpsertPostTranslation,
} from '@/hooks/usePosts';
import { useProjectsAdmin } from '@/hooks/useProjects';
import { useZodForm } from '@/hooks/useZodForm';
import { type CreatePostInput, type UpsertPostTranslationInput } from '@/http/post';

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

function toEnFormValues(post?: {
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
  const { data: translation, isLoading: isLoadingTranslation } = usePostTranslation(postId, 'pt');
  const { mutate: upsertTranslation, isPending: isSavingTranslation } = useUpsertPostTranslation();

  const enMethods = useZodForm<CreatePostInput>(CreatePostSchema, {
    defaultValues: toEnFormValues(),
    mode: 'onChange',
  });

  const {
    formState: { errors: enErrors },
    watch: enWatch,
    setValue: enSetValue,
    setError: enSetError,
  } = enMethods;

  const ptMethods = useZodForm<UpsertPostTranslationInput>(UpsertPostTranslationSchema, {
    defaultValues: { title: '', summary: '', content: '', tags: [] },
    mode: 'onChange',
  });

  const {
    formState: { errors: ptErrors },
    register: ptRegister,
    setValue: ptSetValue,
    watch: ptWatch,
  } = ptMethods;

  const [enEditorReady, setEnEditorReady] = useState(!isEditing);
  const [ptEditorReady, setPtEditorReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarPanelRef = usePanelRef();
  const [locale, setLocale] = useState<'en' | 'pt'>('en');
  const [showLocaleDialog, setShowLocaleDialog] = useState(false);
  const [createdPostId, setCreatedPostId] = useState<string | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  useEffect(() => {
    if (post) {
      enMethods.reset(toEnFormValues(post));
      setEnEditorReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  useEffect(() => {
    if (!isLoadingTranslation) {
      if (translation) {
        ptMethods.reset({
          title: translation.title,
          summary: translation.summary,
          content: translation.content,
          tags: translation.tags,
        });
      }
      setPtEditorReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingTranslation, translation]);

  const handleSaveEn = (status: 'draft' | 'published' | 'archived', skipLocaleDialog = false) => {
    enSetValue('status', status, { shouldValidate: false });
    enMethods.handleSubmit((values) => {
      const data = { ...values, status };
      if (isEditing) {
        updatePost(
          { id: postId, data },
          { onSuccess: () => !skipLocaleDialog && setShowLocaleDialog(true) },
        );
      } else {
        createPost(data, {
          onSuccess: (created) => {
            if (skipLocaleDialog) {
              router.push(`/admin/posts/${created.id}/edit`);
            } else {
              setCreatedPostId(created.id);
              setShowLocaleDialog(true);
            }
          },
        });
      }
    })();
  };

  const handleTryPublish = async () => {
    const publishDate = enWatch('publishDate');

    if (!publishDate) {
      enSetError('publishDate', { message: 'Data de publicação é obrigatória para publicar.' });
      return;
    }

    const date = parseISO(publishDate);
    if (date < startOfDay(new Date())) {
      enSetError('publishDate', { message: 'A data de publicação deve ser hoje ou no futuro.' });
      return;
    }

    const isValid = await enMethods.trigger();
    if (!isValid) return;

    setShowPublishDialog(true);
  };

  const handleSavePt = ptMethods.handleSubmit((values) => {
    upsertTranslation(
      { id: postId!, locale: 'pt', data: values },
      { onSuccess: () => setShowLocaleDialog(true) },
    );
  });

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
  const currentStatus = enWatch('status') as 'draft' | 'published' | 'archived';
  const currentPublishDate = enWatch('publishDate');

  const statusBadge = (() => {
    if (currentStatus === 'archived')
      return { label: 'Arquivado', variant: 'destructive' } as const;
    if (currentStatus === 'draft') return { label: 'Rascunho', variant: 'secondary' } as const;
    if (currentPublishDate && new Date(currentPublishDate) > new Date())
      return { label: 'Agendado', variant: 'outline' } as const;
    return { label: 'Publicado', variant: 'default' } as const;
  })();

  if (isEditing && isLoadingPost) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 size={16} className="animate-spin" />
        Carregando post...
      </div>
    );
  }

  return (
    <>
      <FormProvider {...enMethods}>
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background">
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-4 py-2">
            <Link
              href="/admin/posts"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft size={15} />
              Posts
            </Link>

            <div className="flex flex-1 items-center justify-center gap-2">
              {locale === 'pt' && isEditing && (
                <p className="text-sm text-muted-foreground">
                  Tradução em <strong className="text-foreground">Português</strong>
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {locale === 'en' && (
                <>
                  {currentStatus === 'draft' && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveEn('draft')}
                        disabled={isSaving}
                      >
                        {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                        Salvar rascunho
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleTryPublish}
                        disabled={isSaving}
                      >
                        {isSaving ? <Loader2 className="animate-spin" /> : <Globe />}
                        Publicar
                      </Button>
                    </>
                  )}

                  {currentStatus === 'published' && isEditing && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveEn('published')}
                        disabled={isSaving}
                      >
                        {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                        Salvar
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowArchiveDialog(true)}
                        disabled={isSaving}
                      >
                        <Archive />
                        Arquivar
                      </Button>
                    </>
                  )}

                  {currentStatus === 'archived' && isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveEn('draft', true)}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="animate-spin" /> : <ArchiveRestore />}
                      Restaurar rascunho
                    </Button>
                  )}
                </>
              )}

              {locale === 'pt' && isEditing && (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSavePt}
                  disabled={isSavingTranslation}
                >
                  {isSavingTranslation ? <Loader2 className="animate-spin" /> : <Languages />}
                  Salvar tradução
                </Button>
              )}
              <LocaleToggle
                locale={locale}
                onChange={setLocale}
                disabled={!isEditing || isSaving || isSavingTranslation}
              />
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

          <Group id="post-editor-group" orientation="horizontal" className="min-h-0 flex-1">
            <Panel id="post-editor-main" defaultSize="75%" minSize="40%">
              <div className="flex h-full flex-col overflow-hidden">
                <div className="shrink-0 border-b border-border bg-brand/5 px-3 py-2">
                  {locale === 'en' ? (
                    <>
                      <input
                        {...enMethods.register('title')}
                        placeholder="Título do post"
                        className="w-full border-0 bg-transparent font-spectral text-3xl font-bold text-foreground outline-none placeholder:text-foreground/30"
                      />
                      {enErrors.title && (
                        <p className="mt-1 text-xs text-destructive">{enErrors.title.message}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <input
                        {...ptRegister('title')}
                        placeholder="Título do post"
                        className="w-full border-0 bg-transparent font-spectral text-3xl font-bold text-foreground outline-none placeholder:text-foreground/30"
                      />
                      {ptErrors.title && (
                        <p className="mt-1 text-xs text-destructive">{ptErrors.title.message}</p>
                      )}
                    </>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  {locale === 'en' && enEditorReady && (
                    <MarkdownEditor
                      key={`en-${postId ?? 'new'}`}
                      value={enWatch('content') ?? ''}
                      onChange={(val) => enSetValue('content', val, { shouldValidate: true })}
                      placeholder="Escreva seu post aqui... Use # para títulos, **negrito**, *itálico*, e / para mais opções."
                      error={enErrors.content?.message}
                      borderless
                    />
                  )}
                  {locale === 'pt' && isLoadingTranslation && (
                    <div className="flex items-center gap-2 p-8 text-sm text-muted-foreground">
                      <Loader2 size={16} className="animate-spin" />
                      Carregando tradução...
                    </div>
                  )}
                  {locale === 'pt' && ptEditorReady && (
                    <MarkdownEditor
                      key={`pt-${postId}`}
                      value={ptWatch('content') ?? ''}
                      onChange={(val) => ptSetValue('content', val, { shouldValidate: true })}
                      placeholder="Escreva o conteúdo em português aqui..."
                      error={ptErrors.content?.message}
                      borderless
                    />
                  )}
                </div>
              </div>
            </Panel>

            <div className="h-full w-px bg-border transition-[transform,background-color] delay-200 duration-100 hover:scale-x-200 hover:bg-olive data-[active]:bg-brand" />

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
                {locale === 'en' ? (
                  <>
                    <div className="space-y-4 px-4 py-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">Publicação</p>
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      </div>

                      <FormDatePicker
                        name="publishDate"
                        label="Data de publicação"
                        hint="Obrigatório para publicar"
                        disablePast
                        showNowButton
                        toYear={new Date().getFullYear() + 5}
                      />
                    </div>
                    <div className="h-px bg-border" />

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

                    <div className="space-y-4 px-4 py-4">
                      <p className="text-sm font-medium text-foreground">Imagem</p>
                      <PostBannerImageField name="bannerImage" label="Imagem de capa" />
                    </div>
                    <div className="h-px bg-border" />

                    <div className="space-y-4 px-4 py-4">
                      <p className="text-sm font-medium text-foreground">Relações</p>
                      <RelatedProjectsField name="relatedProjectIds" projects={projects} />
                    </div>
                  </>
                ) : (
                  <FormProvider {...ptMethods}>
                    <div className="space-y-4 px-4 py-4">
                      <p className="text-sm font-medium text-foreground">Metadados</p>

                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-foreground">Resumo</label>
                        <div className="overflow-hidden rounded-lg border border-input transition focus-within:ring-1 focus-within:ring-brand">
                          <textarea
                            value={ptWatch('summary') ?? ''}
                            onChange={(e) =>
                              ptSetValue('summary', e.target.value, { shouldValidate: true })
                            }
                            placeholder="Breve descrição em português"
                            rows={3}
                            className="block w-full resize-none bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                          />
                        </div>
                        {ptErrors.summary && (
                          <p className="text-xs text-destructive">{ptErrors.summary.message}</p>
                        )}
                      </div>

                      <TechStackField name="tags" label="Tags" />
                    </div>
                  </FormProvider>
                )}
              </div>
            </Panel>
          </Group>
        </div>
      </FormProvider>

      <ConfirmDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        title="Confirmar publicação"
        description="O post ficará visível publicamente após esta ação."
        actionLabel="Publicar"
        onConfirm={() => {
          setShowPublishDialog(false);
          handleSaveEn('published', true);
        }}
      />

      <ConfirmDialog
        open={showArchiveDialog}
        onOpenChange={setShowArchiveDialog}
        title="Confirmar arquivamento"
        description="O post será removido da listagem pública. Você poderá restaurá-lo depois."
        actionLabel="Arquivar"
        onConfirm={() => {
          setShowArchiveDialog(false);
          handleSaveEn('archived', true);
        }}
      />

      <OtherLocaleDialog
        open={showLocaleDialog}
        savedLocale={locale}
        onConfirm={() => {
          setShowLocaleDialog(false);
          if (createdPostId) {
            router.push(`/admin/posts/${createdPostId}/edit`);
          } else {
            setLocale(locale === 'en' ? 'pt' : 'en');
          }
        }}
        onDismiss={() => {
          setShowLocaleDialog(false);
          router.push('/admin/posts');
        }}
      />
    </>
  );
}
