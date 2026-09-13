import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemsSection from "@/components/ProblemsSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import WorkflowSection from "@/components/WorkflowSection";
import PortfolioSection, { DbProject } from "@/components/PortfolioSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import { fetchProjects } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  let initialProjects: DbProject[] = [];

  try {
    const rawProjects = await fetchProjects();
    if (rawProjects && rawProjects.length > 0) {
      initialProjects = rawProjects.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        description: p.description,
        techStack: p.techStack || [],
        features: p.features || [],
        imageUrl: p.imageUrl,
        domain: p.domain,
      }));
    }
  } catch (err) {
    console.warn("Lỗi khi tải dự án từ Supabase, sử dụng dữ liệu mặc định:", err);
  }

  return (
    <main className="min-h-screen w-full flex flex-col bg-[#fafafa]">
      <Navbar />
      <HeroSection />
      <ProblemsSection />
      <AboutSection />
      <ServicesSection />
      <WorkflowSection />
      <PortfolioSection initialProjects={initialProjects} />
      <FaqSection />
      <ContactSection />
      <Footer />
      <ContactModal />
    </main>
  );
}
