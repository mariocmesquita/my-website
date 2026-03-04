import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Projetos', href: '/projects' },
  { label: 'Blog', href: '/blog' },
];

export function Navbar() {
  return (
    <nav className="mt-5 mb-10">
      <div className="flex items-center gap-6 bg-brand h-11 px-6 rounded-xl font-sans w-full">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-[14px] text-brand-foreground hover:opacity-75 transition-opacity"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
