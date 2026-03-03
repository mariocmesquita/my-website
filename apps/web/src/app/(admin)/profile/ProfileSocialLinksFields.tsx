import { FormField } from '@/components/form/FormField';

export function ProfileSocialLinksFields() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-foreground">Redes sociais</p>
      <FormField
        name="socialLinks.github"
        label="GitHub"
        type="url"
        placeholder="https://github.com/usuario"
      />
      <FormField
        name="socialLinks.linkedin"
        label="LinkedIn"
        type="url"
        placeholder="https://linkedin.com/in/usuario"
      />
      <FormField
        name="socialLinks.instagram"
        label="Instagram"
        type="url"
        placeholder="https://instagram.com/usuario"
      />
      <FormField
        name="socialLinks.youtube"
        label="YouTube"
        type="url"
        placeholder="https://youtube.com/@usuario"
      />
    </div>
  );
}
