'use client';

import { useEffect, useState } from 'react';

const NAV_ANCHORS = [
  { label: 'Sobre mim', id: 'about' },
  { label: 'Carreira', id: 'career' },
  { label: 'Últimos projetos', id: 'projects' },
  { label: 'Últimos posts', id: 'posts' },
];

export function useActiveSection() {
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
