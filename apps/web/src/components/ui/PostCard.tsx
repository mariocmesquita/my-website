import { Heart, MessageCircle } from 'lucide-react';

export interface Post {
  title: string;
  excerpt: string;
  date: string;
  likes: number;
  comments: number;
  bannerColor: string;
}

export function PostCard({ post }: { post: Post }) {
  return (
    <div className="group flex items-start gap-5 -mx-4 px-4 py-3 rounded-2xl hover:bg-brand/5 transition-colors cursor-default">
      <div
        className={`w-42 h-30 rounded-xl border-2 border-brand/60 overflow-hidden shrink-0 bg-gradient-to-br ${post.bannerColor}`}
      />
      <div className="flex-1 min-w-0">
        <p className="font-spectral font-bold text-[16px] text-foreground group-hover:text-olive transition-colors">
          {post.title}
        </p>
        <p className="font-spectral text-[16px] text-foreground/80 leading-[1.65] mt-1 max-w-lg">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-5 mt-2.5 font-sans text-[12px] text-foreground/60">
          <span>{post.date}</span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            {post.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {post.comments}
          </span>
        </div>
      </div>
    </div>
  );
}
