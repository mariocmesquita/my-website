export function Footer() {
  return (
    <footer className="mt-24 pb-10 border-t border-brand/20 pt-8">
      <p className="font-sans text-[12px] text-foreground/40">
        © {new Date().getFullYear()} Mário Mesquita. Built with Next.js.
      </p>
    </footer>
  );
}
