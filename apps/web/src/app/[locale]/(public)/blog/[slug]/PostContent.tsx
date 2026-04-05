'use client';

import { Node } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import { generateHTML } from '@tiptap/html';
import type { Element, ElementContent, Text } from 'hast';
import NextImage from 'next/image';
import { useMemo, useState } from 'react';
import type { Components, ExtraProps } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import { Lightbox } from '@/components/ui/Lightbox';
import { BASE_EXTENSIONS } from '@/lib/tiptap-extensions';

import { CodeBlock } from './CodeBlock';

const FigureNode = Node.create({
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
    return [{ tag: 'figure' }];
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    return [
      'figure',
      {},
      ['img', { src: HTMLAttributes.src, alt: HTMLAttributes.alt ?? '' }],
      ['figcaption', {}, HTMLAttributes.caption ?? ''],
    ];
  },
});

const RENDER_EXTENSIONS = [...BASE_EXTENSIONS, Link.configure({ openOnClick: false }), FigureNode];

function jsonToHtml(content: string): string | null {
  try {
    const json = JSON.parse(content);
    return generateHTML(json, RENDER_EXTENSIONS);
  } catch {
    return null;
  }
}

interface LightboxItem {
  src: string;
  alt: string;
  caption: string;
}

type SetLightbox = (item: LightboxItem | null) => void;

function findChildElement(children: ElementContent[], tagName: string): Element | undefined {
  return children.find((c): c is Element => c.type === 'element' && c.tagName === tagName);
}

function extractTextContent(children: ElementContent[]): string {
  return children
    .filter((c): c is Text => c.type === 'text')
    .map((c) => c.value)
    .join('');
}

function extractFigureData(node: Element | undefined): LightboxItem | null {
  if (!node) return null;
  const imgEl = findChildElement(node.children, 'img');
  const captionEl = findChildElement(node.children, 'figcaption');
  const src = typeof imgEl?.properties?.src === 'string' ? imgEl.properties.src : undefined;
  if (!src) return null;
  const alt = typeof imgEl?.properties?.alt === 'string' ? imgEl.properties.alt : '';
  const caption = captionEl ? extractTextContent(captionEl.children) : '';
  return { src, alt, caption };
}

function buildComponents(setLightbox: SetLightbox): Components {
  return {
    figure: ({ children, node }: React.ComponentPropsWithoutRef<'figure'> & ExtraProps) => {
      const item = extractFigureData(node);
      return (
        <figure
          className="my-8 text-center"
          style={{ cursor: item ? 'zoom-in' : undefined }}
          onClick={() => item && setLightbox(item)}
        >
          {children}
        </figure>
      );
    },

    figcaption: ({ children }: React.ComponentPropsWithoutRef<'figcaption'>) => (
      <figcaption className="mt-2 text-center font-sans text-[13px] text-foreground/50">
        {children}
      </figcaption>
    ),

    h1: ({ children, style }: React.ComponentPropsWithoutRef<'h1'>) => (
      <h1
        className="font-spectral font-bold text-[28px] text-foreground mt-10 mb-4 leading-tight"
        style={style}
      >
        {children}
      </h1>
    ),

    h2: ({ children, style }: React.ComponentPropsWithoutRef<'h2'>) => (
      <h2
        className="font-spectral font-bold text-[22px] text-foreground mt-8 mb-3 leading-snug"
        style={style}
      >
        {children}
      </h2>
    ),

    h3: ({ children, style }: React.ComponentPropsWithoutRef<'h3'>) => (
      <h3 className="font-spectral font-bold text-[18px] text-foreground mt-6 mb-2" style={style}>
        {children}
      </h3>
    ),

    p: ({ children, style }: React.ComponentPropsWithoutRef<'p'>) => (
      <p className="font-spectral text-[16px] text-foreground/85 leading-[1.85] mb-5" style={style}>
        {children}
      </p>
    ),

    ul: ({ children }: React.ComponentPropsWithoutRef<'ul'>) => (
      <ul className="list-disc list-outside pl-6 mb-5 space-y-1.5 font-spectral text-[16px] text-foreground/85 leading-[1.75]">
        {children}
      </ul>
    ),

    ol: ({ children }: React.ComponentPropsWithoutRef<'ol'>) => (
      <ol className="list-decimal list-outside pl-6 mb-5 space-y-1.5 font-spectral text-[16px] text-foreground/85 leading-[1.75]">
        {children}
      </ol>
    ),

    li: ({ children }: React.ComponentPropsWithoutRef<'li'>) => <li>{children}</li>,

    blockquote: ({ children }: React.ComponentPropsWithoutRef<'blockquote'>) => (
      <blockquote className="border-l-4 border-brand/40 pl-5 my-6 text-foreground/65 italic">
        {children}
      </blockquote>
    ),

    code: ({ children, className }: React.ComponentPropsWithoutRef<'code'>) => {
      if (className?.includes('language-')) {
        return <CodeBlock className={className}>{children}</CodeBlock>;
      }
      return (
        <code
          className="rounded px-1.5 py-0.5 font-mono text-[14px]"
          style={{ background: '#2d2d2d', color: '#ce9178' }}
        >
          {children}
        </code>
      );
    },

    pre: ({ children }: React.ComponentPropsWithoutRef<'pre'>) => <>{children}</>,

    a: ({ href, children }: React.ComponentPropsWithoutRef<'a'>) => {
      const safe = href && /^https?:\/\//i.test(href) ? href : '#';
      return (
        <a
          href={safe}
          target="_blank"
          rel="noopener noreferrer"
          className="text-olive underline underline-offset-2 hover:opacity-75 transition-opacity"
        >
          {children}
        </a>
      );
    },

    strong: ({ children }: React.ComponentPropsWithoutRef<'strong'>) => (
      <strong className="font-bold text-foreground">{children}</strong>
    ),

    em: ({ children }: React.ComponentPropsWithoutRef<'em'>) => (
      <em className="italic">{children}</em>
    ),

    hr: () => <hr className="border-brand/15 my-8" />,

    span: ({ children, style }: React.ComponentPropsWithoutRef<'span'>) => (
      <span style={style}>{children}</span>
    ),

    img: ({ src, alt }: React.ComponentPropsWithoutRef<'img'>) =>
      typeof src === 'string' ? (
        <span
          className="block my-6 cursor-zoom-in"
          onClick={() => setLightbox({ src, alt: alt ?? '', caption: '' })}
        >
          <NextImage
            src={src}
            alt={alt ?? ''}
            width={800}
            height={450}
            className="rounded-xl border border-brand/15 w-full h-auto"
          />
        </span>
      ) : null,
  };
}

export function PostContent({ content }: { content: string }) {
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null);
  const renderedContent = jsonToHtml(content) ?? content;

  const components = useMemo(() => buildComponents(setLightbox), [setLightbox]);

  return (
    <>
      <div className="prose-content font-spectral text-[16px] text-foreground/85 leading-[1.85]">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components}>
          {renderedContent}
        </ReactMarkdown>
      </div>

      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          caption={lightbox.caption}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
