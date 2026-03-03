import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { AboutSection } from '@/components/sections/AboutSection';
import { CareerSection } from '@/components/sections/CareerSection';
import { PostsSection } from '@/components/sections/PostsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { BackToTopButton } from '@/components/ui/BackToTopButton';
import { getProfileData } from '@/lib/profile';

export default async function Home() {
  const profile = await getProfileData();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] flex flex-col lg:flex-row min-h-screen">
        <aside className="w-full lg:w-[38%] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:shrink-0">
          <Sidebar profile={profile} />
        </aside>

        <main className="flex-1 min-w-0 pl-10 pr-6">
          <Navbar />
          <AboutSection profile={profile} />
          <CareerSection />
          <ProjectsSection />
          <PostsSection />
          <Footer />
        </main>
      </div>

      <BackToTopButton />
    </div>
  );
}
