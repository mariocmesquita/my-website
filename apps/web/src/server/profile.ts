import { env } from '@my-website/env';
import { type Profile, ProfileSchema } from '@my-website/schemas/profile';

export async function getProfileData(): Promise<Profile | null> {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/profile`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('Erro ao buscar perfil:', response.status);
      return null;
    }

    const data = await response.json();
    return ProfileSchema.parse(data.data);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
}
