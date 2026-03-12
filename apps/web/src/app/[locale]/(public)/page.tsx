import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { AboutSection } from '@/components/sections/AboutSection';
import { CareerSection } from '@/components/sections/CareerSection';
import { PostsSection } from '@/components/sections/PostsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { BackToTopButton } from '@/components/ui/BackToTopButton';
import { getCareerData } from '@/server/career';
import { getPublishedPosts } from '@/server/post';
import { getProfileData } from '@/server/profile';
import { getPublishedProjects } from '@/server/project';

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  const [profile, careers, projects, posts] = await Promise.all([
    getProfileData(locale),
    getCareerData(locale),
    getPublishedProjects(locale),
    getPublishedPosts(locale),
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile: sticky full-width navbar */}
      <div className="sticky top-0 z-50 lg:hidden">
        <Navbar />
      </div>

      <div className="mx-auto max-w-[1200px] flex flex-col lg:flex-row min-h-screen">
        <aside className="w-full lg:w-[38%] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:shrink-0">
          <Sidebar profile={profile} />
        </aside>

        <main className="flex-1 min-w-0 px-5 md:px-8 lg:pl-10 lg:pr-6">
          {/* Desktop: navbar inside main column */}
          <div className="hidden lg:block">
            <Navbar />
          </div>
          <AboutSection profile={profile} />
          <CareerSection entries={careers} />
          <ProjectsSection projects={projects} locale={locale} />
          <PostsSection posts={posts} locale={locale} />
          <Footer />
        </main>
      </div>

      <BackToTopButton />
    </div>
  );
}
