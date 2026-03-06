'use client';

import { RelatedItemsField } from '@/components/form/RelatedItemsField';
import { type ProjectAdmin } from '@/http/project';

interface RelatedProjectsFieldProps {
  name: string;
  projects: ProjectAdmin[];
}

export function RelatedProjectsField({ name, projects }: RelatedProjectsFieldProps) {
  return (
    <RelatedItemsField
      name={name}
      items={projects}
      label="Projetos relacionados"
      selectPlaceholder="Selecionar projetos..."
      searchPlaceholder="Buscar projetos..."
      emptyText="Nenhum projeto encontrado."
      selectedCountLabel={(count) =>
        `${count} projeto${count > 1 ? 's' : ''} selecionado${count > 1 ? 's' : ''}`
      }
    />
  );
}
