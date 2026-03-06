'use client';

import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { common, createLowlight } from 'lowlight';
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

import styles from './MarkdownEditor.module.css';

const lowlight = createLowlight(common);

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
      StarterKit.configure({ link: false, codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
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
            'bg-background px-5 py-4',
            styles.editor,
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
