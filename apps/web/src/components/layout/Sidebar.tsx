'use client';

import { Github, Instagram, Linkedin } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV_ANCHORS = [
  { label: 'Sobre mim', id: 'about' },
  { label: 'Carreira', id: 'career' },
  { label: 'Últimos projetos', id: 'projects' },
  { label: 'Últimos posts', id: 'posts' },
];

const SOCIAL_LINKS = [
  { icon: Github, href: 'https://github.com/mariocmesquita', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/mariocmesquita', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com/mariocmesquita', label: 'Instagram' },
];

function useActiveSection() {
  const [active, setActive] = useState('about');

  useEffect(() => {
    const update = () => {
      const threshold = window.innerHeight * 0.4;

      let current = NAV_ANCHORS[0]?.id ?? 'about';
      for (const { id } of NAV_ANCHORS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) current = id;
      }
      setActive(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return active;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function Sidebar() {
  const activeSection = useActiveSection();

  return (
    <div className="px-10 pt-12 lg:pt-20 pb-10 font-spectral">
      <h1 className="text-[28px] font-bold text-foreground leading-tight">Mário Mesquita</h1>
      <p className="text-[14px] text-foreground/80 mt-1 font-sans">Fullstack Engineer</p>
      <p className="text-[16px] text-foreground mt-5 leading-[1.7] max-w-[280px]">
        Senior Fullstack Engineer with a product mindset, 5+ years building and evolving web
        products using TypeScript, Node.js and React.
      </p>

      <nav className="mt-8 flex flex-col gap-2 font-sans">
        {NAV_ANCHORS.map(({ id, label }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`w-fit text-left text-[14px] cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'text-foreground font-medium translate-x-1'
                  : 'text-foreground/50 hover:text-foreground/80'
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col gap-2.5 mt-6">
        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-olive transition-colors"
            >
              <Icon className="w-6 h-6" />
            </a>
          ))}
        </div>
        <p className="text-[14px] text-foreground/70 font-sans">contact@mariocmesquita.com</p>
      </div>
    </div>
  );
}
