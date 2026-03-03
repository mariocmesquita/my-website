import { ProjectsPageClient } from './ProjectsPageClient';

export default function ProjectsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-spectral text-3xl font-bold text-foreground">Projetos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie os projetos exibidos no seu portfólio.
        </p>
      </div>
      <ProjectsPageClient />
    </div>
  );
}
