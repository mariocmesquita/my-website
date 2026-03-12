'use client';

import { type Profile } from '@my-website/schemas/profile';
import { Github, Instagram, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useActiveSection } from '@/hooks/useActiveSection';

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
  const t = useTranslations('sidebar');
  const activeSection = useActiveSection();

  const NAV_ANCHORS = [
    { label: t('about'), id: 'about' },
    { label: t('career'), id: 'career' },
    { label: t('latestProjects'), id: 'projects' },
    { label: t('latestPosts'), id: 'posts' },
  ];

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
    <div className="px-5 md:px-8 lg:px-10 pt-6 lg:pt-20 pb-6 lg:pb-10 font-spectral">
      <h1 className="text-[24px] lg:text-[28px] font-bold text-foreground leading-tight">{name}</h1>
      <p className="text-[13px] lg:text-[14px] text-foreground/80 mt-1 font-sans">{position}</p>
      <p className="text-[15px] lg:text-[16px] text-foreground mt-4 lg:mt-5 leading-[1.7] max-w-[280px]">
        {description}
      </p>

      <nav className="hidden lg:flex mt-8 flex-col gap-2 font-sans">
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

      <div className="flex flex-col gap-2.5 mt-4 lg:mt-6">
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
