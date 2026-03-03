import { ProfileFormContainer } from './ProfileFormContainer';

export default function ProfilePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-spectral mb-2 text-3xl font-bold text-foreground">Perfil</h1>
      <p className="mb-8 text-muted-foreground">
        Edite as informações exibidas no seu site público.
      </p>
      <ProfileFormContainer />
    </div>
  );
}
