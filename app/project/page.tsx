import type { Metadata } from "next";
import ProjectNavbar from "@/components/ProjectNavbar";
import ProjectShowcase, { ProjectItem } from "@/components/ProjectShowcase";
import { prisma } from "@/lib/prisma";
import { appContent } from "@/constants/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dự Án & Sản Phẩm Kỹ Thuật | Hưng Dev - Full-Stack Developer",
  description: "Trưng bày danh mục các dự án website thực tế, hệ thống web app và giải pháp số của Hưng Dev. Chuẩn TypeScript, Next.js, tối ưu hiệu năng và responsive 100%.",
  openGraph: {
    title: "Dự Án & Sản Phẩm Kỹ Thuật | Hưng Dev - Full-Stack Developer",
    description: "Khám phá danh mục dự án thực tế, kiến trúc công nghệ và mã nguồn tối ưu chuẩn SEO.",
  },
};

export default async function ProjectPage() {
  let projects: ProjectItem[] = [];

  try {
    const rawProjects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (rawProjects && rawProjects.length > 0) {
      projects = rawProjects.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        description: p.description,
        techStack: p.techStack || [],
        features: p.features && p.features.length > 0 ? p.features : ["Tối ưu PageSpeed xanh", "Chuẩn SEO onpage", "Responsive di động"],
        imageUrl: p.imageUrl,
        domain: p.domain,
      }));
    }
  } catch (error) {
    console.warn("Chưa thể kết nối Database trong route /project, chuyển sang dùng dữ liệu mẫu dự án:", error);
  }

  // Nếu trong database chưa có dự án nào (hoặc DB phản hồi chậm), sử dụng danh sách mẫu hoàn chỉnh từ content
  if (projects.length === 0) {
    projects = appContent.portfolio.projects.map((p, idx) => ({
      id: `fallback-${idx}`,
      name: p.title,
      category: p.category,
      description: p.desc,
      techStack: p.techStack,
      features: p.features,
      imageUrl: "",
      domain: null,
    }));
  }

  return (
    <main className="min-h-screen w-full flex flex-col bg-[#fafafa] selection:bg-blue-100 selection:text-blue-900">
      <ProjectNavbar />
      <ProjectShowcase projects={projects} />
    </main>
  );
}
