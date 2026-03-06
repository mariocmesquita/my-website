'use client';

import { type Profile } from '@my-website/schemas/profile';
import { Github, Instagram, Linkedin } from 'lucide-react';

import { useActiveSection } from '@/hooks/useActiveSection';

const NAV_ANCHORS = [
  { label: 'Sobre mim', id: 'about' },
  { label: 'Carreira', id: 'career' },
  { label: 'Últimos projetos', id: 'projects' },
  { label: 'Últimos posts', id: 'posts' },
];

const SOCIAL_ICONS: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
};

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

interface SidebarProps {
  profile: Profile | null;
}

export function Sidebar({ profile }: SidebarProps) {
  const activeSection = useActiveSection();

  const name = profile?.name ?? '';
  const position = profile?.position ?? '';
  const description = profile?.description ?? '';
  const email = profile?.email ?? '';
  const socialLinks = profile?.socialLinks ?? {};

  const displaySocialLinks = Object.entries(socialLinks)
    .filter(([, url]) => url && url.trim())
    .map(([platform, url]) => ({
      platform,
      icon: SOCIAL_ICONS[platform] ?? Github,
      href: url,
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
    }));

  return (
    <div className="px-10 pt-12 lg:pt-20 pb-10 font-spectral">
      <h1 className="text-[28px] font-bold text-foreground leading-tight">{name}</h1>
      <p className="text-[14px] text-foreground/80 mt-1 font-sans">{position}</p>
      <p className="text-[16px] text-foreground mt-5 leading-[1.7] max-w-[280px]">{description}</p>

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
          {displaySocialLinks.length > 0
            ? displaySocialLinks.map(({ platform, icon: Icon, href, label }) => (
                <a
                  key={platform}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-olive transition-colors"
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))
            : null}
        </div>
        <p className="text-[14px] text-foreground/70 font-sans">{email}</p>
      </div>
    </div>
  );
}
