'use client';

import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Code,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  Table as TableIcon,
} from 'lucide-react';
import { Markdown } from 'tiptap-markdown';

import { cn } from '@/lib/utils';

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
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Placeholder.configure({ placeholder: placeholder ?? 'Escreva seu post aqui...' }),
      Link.configure({ openOnClick: false, linkOnPaste: true }),
      Image,
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      Markdown.configure({ transformPastedText: true, transformCopiedText: true }),
    ],
    content: value,
    onUpdate: ({ editor: e }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange((e.storage as any).markdown.getMarkdown() as string);
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[400px]',
      },
    },
    immediatelyRender: false,
  });

  const addLink = () => {
    const url = window.prompt('URL do link:');
    if (!url) return;
    editor?.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('URL da imagem:');
    if (!url) return;
    editor?.chain().focus().setImage({ src: url }).run();
  };

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
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor?.isActive('heading', { level: 1 })}
            title="Título 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor?.isActive('heading', { level: 2 })}
            title="Título 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor?.isActive('heading', { level: 3 })}
            title="Título 3"
          >
            H3
          </ToolbarButton>
          <Divider />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            active={editor?.isActive('bold')}
            title="Negrito (Ctrl+B)"
          >
            <Bold size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            active={editor?.isActive('italic')}
            title="Itálico (Ctrl+I)"
          >
            <Italic size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            active={editor?.isActive('strike')}
            title="Tachado"
          >
            <Strikethrough size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCode().run()}
            active={editor?.isActive('code')}
            title="Código inline"
          >
            <Code size={14} />
          </ToolbarButton>
          <Divider />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            active={editor?.isActive('bulletList')}
            title="Lista"
          >
            <List size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            active={editor?.isActive('orderedList')}
            title="Lista numerada"
          >
            <ListOrdered size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            active={editor?.isActive('blockquote')}
            title="Citação"
          >
            <Quote size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            active={editor?.isActive('codeBlock')}
            title="Bloco de código"
          >
            {'</>'}
          </ToolbarButton>
          <Divider />
          <ToolbarButton onClick={addLink} active={editor?.isActive('link')} title="Link (Ctrl+K)">
            <Link2 size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={addImage} title="Imagem por URL">
            <ImageIcon size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
            title="Tabela"
          >
            <TableIcon size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            title="Linha divisória"
          >
            <Minus size={14} />
          </ToolbarButton>
        </div>

        {/* Editor area */}
        <div
          className={cn(
            borderless && 'flex-1 overflow-auto',
            `bg-background px-5 py-4
            [&_.ProseMirror]:outline-none
            [&_.ProseMirror_h1]:font-spectral [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:text-foreground [&_.ProseMirror_h1]:mt-6 [&_.ProseMirror_h1]:mb-3
            [&_.ProseMirror_h2]:font-spectral [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:text-foreground [&_.ProseMirror_h2]:mt-5 [&_.ProseMirror_h2]:mb-2
            [&_.ProseMirror_h3]:text-base [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:text-foreground [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:mb-2
            [&_.ProseMirror_p]:mb-3 [&_.ProseMirror_p]:leading-relaxed [&_.ProseMirror_p]:text-foreground
            [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ul]:mb-3
            [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_ol]:mb-3
            [&_.ProseMirror_li]:mb-1
            [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-brand/40 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-muted-foreground [&_.ProseMirror_blockquote]:mb-3
            [&_.ProseMirror_code:not(pre_code)]:bg-muted [&_.ProseMirror_code:not(pre_code)]:px-1.5 [&_.ProseMirror_code:not(pre_code)]:py-0.5 [&_.ProseMirror_code:not(pre_code)]:rounded [&_.ProseMirror_code:not(pre_code)]:text-sm [&_.ProseMirror_code:not(pre_code)]:font-mono
            [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:mb-3 [&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:p-0 [&_.ProseMirror_pre_code]:text-sm [&_.ProseMirror_pre_code]:font-mono
            [&_.ProseMirror_a]:text-olive [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:underline-offset-2
            [&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:my-3
            [&_.ProseMirror_hr]:border-border [&_.ProseMirror_hr]:my-4
            [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:mb-3
            [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-border [&_.ProseMirror_th]:bg-muted [&_.ProseMirror_th]:px-3 [&_.ProseMirror_th]:py-2 [&_.ProseMirror_th]:text-left [&_.ProseMirror_th]:text-sm [&_.ProseMirror_th]:font-medium
            [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-border [&_.ProseMirror_td]:px-3 [&_.ProseMirror_td]:py-2 [&_.ProseMirror_td]:text-sm
            [&_.ProseMirror_.is-editor-empty]:before:float-left [&_.ProseMirror_.is-editor-empty]:before:content-[attr(data-placeholder)] [&_.ProseMirror_.is-editor-empty]:before:text-muted-foreground/50 [&_.ProseMirror_.is-editor-empty]:before:pointer-events-none [&_.ProseMirror_.is-editor-empty]:before:h-0
          `,
          )}
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
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded px-2 py-1 text-sm font-medium transition ${
        active
          ? 'bg-brand text-brand-foreground'
          : 'text-foreground/70 hover:bg-brand/10 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-0.5 h-6 w-px self-center bg-brand/20" />;
}
