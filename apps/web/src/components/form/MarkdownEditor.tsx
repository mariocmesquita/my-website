'use client';

import { Extension } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { EditorContent, useEditor } from '@tiptap/react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Strikethrough,
  Table as TableIcon,
  Upload,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Markdown } from 'tiptap-markdown';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { uploadPostFile } from '@/http/post';
import { BASE_EXTENSIONS } from '@/lib/tiptap-extensions';
import { useAuth } from '@/server/firebase';
import { cn } from '@/server/utils';

import { FigureExtension } from './FigureExtension';
import styles from './MarkdownEditor.module.css';

interface MarkdownStorage {
  markdown: {
    parser: { parse: (text: string) => unknown };
  };
}

const COLOR_ROWS = [
  ['#000000', '#374151', '#6b7280', '#9ca3af', '#ffffff'],
  ['#4a3428', '#7c5c42', '#6c7a4e', '#8b9e5e', '#3d5a3e'],
  ['#c0392b', '#d97706', '#ca8a04', '#0d9488', '#2563eb'],
  ['#7c3aed', '#be185d', '#db2777', '#0ea5e9', '#059669'],
];

const HEADING_OPTIONS = [
  { label: 'Texto', level: 0 },
  { label: 'Título 1', level: 1 },
  { label: 'Título 2', level: 2 },
  { label: 'Título 3', level: 3 },
  { label: 'Título 4', level: 4 },
  { label: 'Título 5', level: 5 },
  { label: 'Título 6', level: 6 },
] as const;

const HEADING_STYLES: Record<number, string> = {
  0: 'text-[15px]',
  1: 'font-spectral font-bold text-[22px]',
  2: 'font-spectral font-bold text-[18px]',
  3: 'font-bold text-[16px]',
  4: 'font-bold text-[15px]',
  5: 'font-bold text-[14px]',
  6: 'font-bold text-[13px] text-foreground/70',
};

const MarkdownPasteExtension = Extension.create({
  name: 'markdownPaste',
  priority: 200,
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('markdownPaste'),
        props: {
          handlePaste: (_view: unknown, event: ClipboardEvent) => {
            const plain = event.clipboardData?.getData('text/plain') ?? '';
            if (!plain || !/^#{1,6} \S/m.test(plain)) return false;
            const parsed = (
              this.editor.storage as unknown as MarkdownStorage
            ).markdown.parser.parse(plain);
            if (!parsed) return false;
            this.editor.chain().focus().insertContent(parsed).run();
            return true;
          },
        },
      }),
    ];
  },
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  borderless?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  error,
  borderless,
}: MarkdownEditorProps) {
  const { getToken } = useAuth();

  const [showHeadings, setShowHeadings] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [customHex, setCustomHex] = useState('');
  const [showImagePanel, setShowImagePanel] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageFileInputId = 'editor-image-upload';

  const closeAllPanels = () => {
    setShowHeadings(false);
    setShowColors(false);
    setShowImagePanel(false);
  };

  const initialContent = (() => {
    if (!value) return '';
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  })();

  const editor = useEditor({
    extensions: [
      ...BASE_EXTENSIONS,
      Link.configure({ openOnClick: false, linkOnPaste: true }),
      Placeholder.configure({ placeholder: placeholder ?? 'Escreva seu post aqui...' }),
      FigureExtension,
      MarkdownPasteExtension,
      Markdown.configure({ transformPastedText: true, transformCopiedText: true }),
    ],
    content: initialContent,
    onUpdate: ({ editor: e }) => {
      onChange(JSON.stringify(e.getJSON()));
    },
    editorProps: {
      attributes: { class: 'outline-none min-h-[400px]' },
    },
    immediatelyRender: false,
  });

  const activeColor: string =
    (editor?.getAttributes('textStyle') as { color?: string } | undefined)?.color ?? 'currentColor';

  const activeHeading = (() => {
    for (let i = 1; i <= 6; i++) {
      if (editor?.isActive('heading', { level: i })) return i;
    }
    return 0;
  })();

  const activeHeadingLabel =
    HEADING_OPTIONS.find((o) => o.level === activeHeading)?.label ?? 'Texto';

  const insertFigure = (src: string) => {
    editor
      ?.chain()
      .focus()
      .insertContent({ type: 'figure', attrs: { src, alt: '', caption: '' } })
      .run();
  };

  const handleImageUrlInsert = () => {
    if (!imageUrl.trim()) return;
    insertFigure(imageUrl.trim());
    setImageUrl('');
    setShowImagePanel(false);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo: 5MB.');
      e.target.value = '';
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Formato inválido. Use JPG, PNG ou WebP.');
      e.target.value = '';
      return;
    }

    setIsUploadingImage(true);
    try {
      const token = await getToken();
      const url = await uploadPostFile(token, file);
      insertFigure(url);
      setShowImagePanel(false);
    } catch {
      toast.error('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const applyColor = (hex: string | null) => {
    if (hex) {
      editor?.chain().focus().setColor(hex).run();
    } else {
      editor?.chain().focus().unsetColor().run();
    }
    setShowColors(false);
  };

  const applyCustomHex = () => {
    if (/^[0-9a-fA-F]{6}$/.test(customHex)) {
      applyColor(`#${customHex}`);
    }
  };

  const isValidHex = /^[0-9a-fA-F]{6}$/.test(customHex);

  return (
    <div className={cn(borderless ? 'flex h-full flex-col' : 'flex flex-col gap-1')}>
      <div
        className={cn(
          borderless
            ? 'flex flex-1 flex-col overflow-hidden'
            : cn(
                'overflow-hidden rounded-lg border transition',
                error ? 'border-destructive' : 'border-brand',
              ),
        )}
      >
        {/* Toolbar */}
        <div
          className={cn(
            'flex flex-wrap gap-0.5 border-b border-brand/20 bg-brand/5 p-1.5',
            borderless && 'shrink-0',
          )}
        >
          {/* Heading dropdown */}
          <div className="relative">
            <ToolbarButton
              onClick={() => {
                setShowHeadings((v) => !v);
                setShowColors(false);
                setShowImagePanel(false);
              }}
              active={showHeadings}
              tooltip="Estilo de texto"
            >
              <span className="flex items-center gap-1">
                <span className="min-w-[54px] text-left">{activeHeadingLabel}</span>
                <ChevronDown size={11} />
              </span>
            </ToolbarButton>

            {showHeadings && (
              <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] rounded-lg border border-border bg-background py-1 shadow-md">
                {HEADING_OPTIONS.map(({ label, level }) => {
                  const isActive = activeHeading === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        if (level === 0) {
                          editor?.chain().focus().setParagraph().run();
                        } else {
                          editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
                            .run();
                        }
                        setShowHeadings(false);
                      }}
                      className={cn(
                        'block w-full px-3 py-1.5 text-left transition hover:bg-brand/5',
                        isActive && 'bg-brand/10',
                        HEADING_STYLES[level],
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Divider />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            active={editor?.isActive('bold')}
            tooltip="Negrito (Ctrl+B)"
          >
            <Bold size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            active={editor?.isActive('italic')}
            tooltip="Itálico (Ctrl+I)"
          >
            <Italic size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            active={editor?.isActive('strike')}
            tooltip="Tachado"
          >
            <Strikethrough size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCode().run()}
            active={editor?.isActive('code')}
            tooltip="Código inline"
          >
            <Code size={14} />
          </ToolbarButton>

          {/* Text color */}
          <div className="relative">
            <ToolbarButton
              onClick={() => {
                const opening = !showColors;
                setShowColors(opening);
                setShowHeadings(false);
                setShowImagePanel(false);
                if (opening) {
                  const hex = activeColor.startsWith('#') ? activeColor.slice(1) : '';
                  setCustomHex(hex);
                }
              }}
              active={showColors}
              tooltip="Cor do texto"
            >
              <span className="flex flex-col items-center gap-px leading-none">
                <span
                  className="text-[13px] font-bold"
                  style={{ color: showColors ? undefined : activeColor }}
                >
                  A
                </span>
                <span
                  className="h-[3px] w-[14px] rounded-sm"
                  style={{ backgroundColor: showColors ? 'currentColor' : activeColor }}
                />
              </span>
            </ToolbarButton>

            {showColors && (
              <div className="absolute left-0 top-full z-20 mt-1 w-[164px] rounded-lg border border-border bg-background p-2 shadow-md">
                <button
                  type="button"
                  onClick={() => applyColor(null)}
                  className="mb-2 w-full rounded border border-dashed border-border px-2 py-1 text-xs text-foreground/60 transition hover:bg-brand/5"
                >
                  Remover cor
                </button>

                <div className="grid grid-cols-5 gap-1">
                  {COLOR_ROWS.flat().map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      title={hex}
                      onClick={() => applyColor(hex)}
                      className="h-5 w-5 rounded border border-border/50 transition hover:scale-110"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>

                <div className="mt-2 flex items-center gap-1">
                  <span
                    className="h-5 w-5 shrink-0 rounded border border-border"
                    style={{ backgroundColor: isValidHex ? `#${customHex}` : 'transparent' }}
                  />
                  <span className="text-xs text-muted-foreground">#</span>
                  <input
                    type="text"
                    value={customHex}
                    maxLength={6}
                    placeholder="000000"
                    onChange={(e) => setCustomHex(e.target.value.replace(/[^0-9a-fA-F]/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && applyCustomHex()}
                    className="min-w-0 flex-1 rounded border border-input bg-background px-1.5 py-0.5 font-mono text-xs outline-none focus:ring-1 focus:ring-brand"
                  />
                  <button
                    type="button"
                    disabled={!isValidHex}
                    onClick={applyCustomHex}
                    className="rounded bg-brand px-1.5 py-0.5 text-xs font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-40"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>

          <Divider />

          {/* Alignment */}
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign('left').run()}
            active={editor?.isActive({ textAlign: 'left' })}
            tooltip="Alinhar à esquerda"
          >
            <AlignLeft size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign('center').run()}
            active={editor?.isActive({ textAlign: 'center' })}
            tooltip="Centralizar"
          >
            <AlignCenter size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
            active={editor?.isActive({ textAlign: 'right' })}
            tooltip="Alinhar à direita"
          >
            <AlignRight size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
            active={editor?.isActive({ textAlign: 'justify' })}
            tooltip="Justificar"
          >
            <AlignJustify size={14} />
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            active={editor?.isActive('bulletList')}
            tooltip="Lista"
          >
            <List size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            active={editor?.isActive('orderedList')}
            tooltip="Lista numerada"
          >
            <ListOrdered size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            active={editor?.isActive('blockquote')}
            tooltip="Citação"
          >
            <Quote size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            active={editor?.isActive('codeBlock')}
            tooltip="Bloco de código"
          >
            {'</>'}
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            onClick={() => {
              const url = window.prompt('URL do link:');
              if (!url) return;
              editor?.chain().focus().setLink({ href: url }).run();
            }}
            active={editor?.isActive('link')}
            tooltip="Link (Ctrl+K)"
          >
            <Link2 size={14} />
          </ToolbarButton>

          {/* Image insert panel */}
          <div className="relative">
            <ToolbarButton
              onClick={() => {
                setShowImagePanel((v) => !v);
                setShowHeadings(false);
                setShowColors(false);
              }}
              active={showImagePanel}
              tooltip="Inserir imagem"
            >
              <ImageIcon size={14} />
            </ToolbarButton>

            {showImagePanel && (
              <div className="absolute left-0 top-full z-20 mt-1 w-[240px] rounded-lg border border-border bg-background p-3 shadow-md">
                {/* Upload from device */}
                <label
                  htmlFor={imageFileInputId}
                  aria-disabled={isUploadingImage}
                  className="mb-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand/40 px-3 py-2.5 transition hover:border-brand/70 hover:bg-brand/5 aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
                >
                  {isUploadingImage ? (
                    <Loader2 size={14} className="animate-spin text-muted-foreground" />
                  ) : (
                    <Upload size={14} className="text-muted-foreground" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {isUploadingImage ? 'Enviando...' : 'Enviar do dispositivo'}
                  </span>
                </label>
                <input
                  id={imageFileInputId}
                  type="file"
                  accept="image/*"
                  disabled={isUploadingImage}
                  className="hidden"
                  onChange={handleImageFileChange}
                />

                <div className="mb-3 flex items-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">ou</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* URL input */}
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleImageUrlInsert()}
                    placeholder="URL da imagem"
                    className="min-w-0 flex-1 rounded border border-input bg-background px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-brand"
                  />
                  <button
                    type="button"
                    onClick={handleImageUrlInsert}
                    disabled={!imageUrl.trim()}
                    className="rounded bg-brand px-2 py-1 text-xs font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-40"
                  >
                    Inserir
                  </button>
                </div>
              </div>
            )}
          </div>

          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
            tooltip="Tabela"
          >
            <TableIcon size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            tooltip="Linha divisória"
          >
            <Minus size={14} />
          </ToolbarButton>
        </div>

        {/* Editor area */}
        <div
          className={cn(
            borderless && 'flex-1 overflow-auto',
            'bg-background px-5 py-4',
            styles.editor,
          )}
          onClick={closeAllPanels}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  tooltip,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  tooltip?: string;
  children: React.ReactNode;
}) {
  const btn = (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm font-medium transition ${
        active
          ? 'bg-brand text-brand-foreground'
          : 'text-foreground/70 hover:bg-brand/10 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );

  if (!tooltip) return btn;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{btn}</TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

function Divider() {
  return <div className="mx-0.5 h-6 w-px self-center bg-brand/20" />;
}
