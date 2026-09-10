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
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  let initialProjects: DbProject[] = [];

  try {
    const rawProjects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    initialProjects = rawProjects.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      techStack: p.techStack,
      features: p.features,
      imageUrl: p.imageUrl,
      domain: p.domain,
    }));
  } catch {
    // Nếu cơ sở dữ liệu chưa sẵn sàng ở bước đầu local dev, không để app crash
    console.warn("Chưa thể nạp projects từ PostgreSQL (chờ Phase 3 khởi động DB). Sẽ dùng dữ liệu mẫu mặc định.");
  }

  return (
    <main className="min-h-screen w-full flex flex-col bg-white">
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
