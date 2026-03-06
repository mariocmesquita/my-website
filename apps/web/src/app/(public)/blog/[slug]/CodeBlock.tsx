'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const language = className?.replace('language-', '') ?? 'text';
  const code = extractText(children);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative my-5 rounded-xl border border-white/10 bg-[#1e1e1e] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        {language && language !== 'text' ? (
          <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#d4d4d4]/50">
            {language}
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 font-sans text-[12px] text-[#d4d4d4]/50 hover:text-[#d4d4d4] transition-colors"
          title="Copiar código"
        >
          {copied ? (
            <>
              <Check size={13} />
              Copiado!
            </>
          ) : (
            <>
              <Copy size={13} />
              Copiar
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        PreTag="div"
        customStyle={{
          margin: 0,
          background: 'transparent',
          padding: '1.25rem 1.5rem',
          fontSize: '14px',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && typeof node === 'object' && 'props' in (node as object)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return extractText((node as any).props.children);
  }
  return '';
}
