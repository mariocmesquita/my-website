'use client';

import { Node } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { NodeViewProps } from '@tiptap/react';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import NextImage from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/server/utils';

interface MarkdownSerializerState {
  write: (text: string) => void;
  closeBlock: (node: ProseMirrorNode) => void;
}

function FigureView({ node, updateAttributes, selected }: NodeViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = useCallback(() => {
    setDraft(node.attrs.caption ?? '');
    setIsEditing(true);
  }, [node.attrs.caption]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const commitCaption = () => {
    setIsEditing(false);
    updateAttributes({ caption: draft });
  };

  return (
    <NodeViewWrapper as="figure" className="my-6 text-center">
      {node.attrs.src && (
        <NextImage
          src={node.attrs.src as string}
          alt={(node.attrs.alt as string) ?? ''}
          width={800}
          height={450}
          unoptimized
          className={cn(
            'mx-auto max-w-full rounded-xl border transition',
            selected ? 'border-brand ring-2 ring-brand/30' : 'border-brand/15',
          )}
        />
      )}
      <div className="mt-2">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitCaption}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitCaption();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            className="mx-auto block w-full max-w-md border-b border-brand/30 bg-transparent pb-0.5 text-center text-sm text-muted-foreground outline-none"
            placeholder="Clique para adicionar legenda..."
          />
        ) : (
          <figcaption
            onClick={startEditing}
            className={cn(
              'cursor-text text-center text-sm transition hover:text-muted-foreground',
              node.attrs.caption ? 'text-muted-foreground' : 'text-muted-foreground/40',
            )}
          >
            {(node.attrs.caption as string) || 'Clique para adicionar legenda...'}
          </figcaption>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const FigureExtension = Node.create({
  name: 'figure',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
      caption: { default: '' },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        getAttrs(dom: HTMLElement | string) {
          if (typeof dom === 'string') return false;
          const img = dom.querySelector('img');
          const figcaption = dom.querySelector('figcaption');
          return {
            src: img?.getAttribute('src') ?? null,
            alt: img?.getAttribute('alt') ?? '',
            caption: figcaption?.textContent ?? '',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    return [
      'figure',
      {},
      ['img', { src: HTMLAttributes.src, alt: HTMLAttributes.alt ?? '' }],
      ['figcaption', {}, HTMLAttributes.caption ?? ''],
    ];
  },

  addStorage() {
    return {
      markdown: {
        serialize(state: MarkdownSerializerState, node: ProseMirrorNode) {
          const src = node.attrs.src ?? '';
          const alt = node.attrs.alt ?? '';
          const caption = node.attrs.caption ?? '';
          state.write(
            `<figure><img src="${src}" alt="${alt}"><figcaption>${caption}</figcaption></figure>`,
          );
          state.closeBlock(node);
        },
        parse: {},
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureView);
  },
});
