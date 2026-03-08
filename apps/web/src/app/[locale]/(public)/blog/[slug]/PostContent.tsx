import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

import { CodeBlock } from './CodeBlock';

export function PostContent({ content }: { content: string }) {
  return (
    <div className="prose-content font-spectral text-[16px] text-foreground/85 leading-[1.85]">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="font-spectral font-bold text-[28px] text-foreground mt-10 mb-4 leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-spectral font-bold text-[22px] text-foreground mt-8 mb-3 leading-snug">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-spectral font-bold text-[18px] text-foreground mt-6 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="font-spectral text-[16px] text-foreground/85 leading-[1.85] mb-5">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-6 mb-5 space-y-1.5 font-spectral text-[16px] text-foreground/85 leading-[1.75]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-6 mb-5 space-y-1.5 font-spectral text-[16px] text-foreground/85 leading-[1.75]">
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-brand/40 pl-5 my-6 text-foreground/65 italic">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-');
            if (isBlock) {
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
          pre: ({ children }) => <>{children}</>,
          a: ({ href, children }) => {
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
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          hr: () => <hr className="border-brand/15 my-8" />,
          img: ({ src, alt }) =>
            typeof src === 'string' ? (
              <span className="block my-6">
                <Image
                  src={src}
                  alt={alt ?? ''}
                  width={800}
                  height={450}
                  className="rounded-xl border border-brand/15 w-full h-auto"
                />
              </span>
            ) : null,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
