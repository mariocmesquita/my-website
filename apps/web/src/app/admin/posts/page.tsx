import { PostsPageClient } from './PostsPageClient';

export default function PostsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-spectral text-3xl font-bold text-foreground">Posts</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gerencie os posts do seu blog.</p>
      </div>
      <PostsPageClient />
    </div>
  );
}
