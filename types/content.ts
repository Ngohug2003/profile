export interface MenuItem {
  name: string;
  id: string;
}

export interface NavbarContent {
  logoText: string;
  menuItems: MenuItem[];
  ctaText: string;
}

export interface TrustCardItem {
  iconName: "Smartphone" | "Search" | "Zap";
  title: string;
  subtitle: string;
}

export interface HeroContent {
  badge: string;
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trustCards: TrustCardItem[];
}

export interface ProblemItem {
  iconName: "Zap" | "Smartphone" | "Search" | "LineChart" | "TrendingDown" | "Smile";
  title: string;
  desc: string;
}

export interface ProblemsContent {
  badge: string;
  title: string;
  description: string;
  problems: ProblemItem[];
}

export interface FocusCardItem {
  iconName: "Code" | "Cpu" | "ShieldAlert";
  title: string;
  desc: string;
}

export interface SkillItem {
  name: string;
  highlight: boolean;
}

export interface SkillCategoryItem {
  id: "frontend" | "backend" | "cloud" | "tools";
  tag: string;
  label: string;
  iconName: "Layers" | "Server" | "Cloud" | "Wrench";
  badgeClass: string;
  title: string;
  desc: string;
  skills: SkillItem[];
  highlights: string[];
}

export interface DeveloperStatItem {
  label: string;
  value: string;
  subtext: string;
}

export interface AboutProfileCard {
  name: string;
  role: string;
  location: string;
  avatarUrl: string;
  stats: DeveloperStatItem[];
  coreTechBadges: string[];
  qualityPledge: string;
}

export interface AboutContent {
  badge: string;
  title: string;
  description: string;
  bioText1: string;
  bioText2: string;
  focusCards: FocusCardItem[];
  skillCategories: SkillCategoryItem[];
  profileCard: AboutProfileCard;
}

export interface ServiceTierItem {
  name: string;
  price: string;
  desc: string;
  popular: boolean;
  popularBadge?: string;
  features: string[];
  ctaText: string;
  illustrationType: "landing" | "ecommerce" | "seo";
}

export interface ServicesContent {
  badge: string;
  title: string;
  description: string;
  services: ServiceTierItem[];
}

export interface WorkflowStepItem {
  number: string;
  title: string;
  desc: string;
  details: string[];
}

export interface WorkflowContent {
  badge: string;
  title: string;
  description: string;
  steps: WorkflowStepItem[];
}

export interface ProjectItem {
  title: string;
  category: string;
  desc: string;
  imageAlt: string;
  features: string[];
  ctaText: string;
  techStack: string[];
}

export interface PortfolioContent {
  badge: string;
  title: string;
  description: string;
  categories: string[];
  projects: ProjectItem[];
  bannerTitle: string;
  bannerDesc: string;
  bannerCta: string;
}

export interface FaqItem {
  title: string;
  content: string;
  illustrationType?: "calendar";
}

export interface FaqContent {
  badge: string;
  title: string;
  description: string;
  faqItems: FaqItem[];
  supportTitle: string;
  supportDesc: string;
  supportCta: string;
  supportBenefits: string[];
  supportEmail: string;
  supportPhone: string;
}

export interface ContactServiceItem {
  title: string;
  desc: string;
}

export interface ContactChannelItem {
  type: "phone" | "email" | "facebook";
  label: string;
  href: string;
}

export interface ServiceOptionItem {
  value: string;
  label: string;
}

export interface ContactContent {
  badge: string;
  title: string;
  description: string;
  servicesList: ContactServiceItem[];
  channels: ContactChannelItem[];
  serviceOptions: ServiceOptionItem[];
  formTitle: string;
  formSubtitle: string;
  formSubmitText: string;
}

export interface FooterColumn {
  title: string;
  links: { text: string; href: string; }[];
}

export interface FooterContent {
  brandDesc: string;
  email: string;
  phone: string;
  facebook: string;
  columns: FooterColumn[];
  copyright: string;
  privacyText: string;
  backToTopText: string;
}

export interface DeveloperProfile {
  fullName: string;
  role: string;
  shortTitle: string;
  location: string;
  phone: string;
  phoneRaw: string;
  email: string;
  githubUrl: string;
  githubDisplay: string;
  zaloUrl: string;
  avatarUrl: string;
  cvUrl: string;
  cvDownloadUrl: string;
  cvName: string;
}

export interface ProjectPageSkillGroup {
  id: string;
  name: string;
  tag: string;
  badgeClass: string;
  summary: string;
  skills: string[];
}

export interface ProjectPageStandard {
  title: string;
  desc: string;
  iconName: "Zap" | "ShieldCheck" | "Cpu" | "GitBranch";
}

export interface ProjectShowcaseMetric {
  value: string;
  label: string;
  subtext: string;
  iconName: "Zap" | "Smartphone" | "ShieldCheck" | "Clock";
}

export interface ProjectPageTabItem {
  id: "projects" | "profile";
  label: string;
  iconName: "FolderKanban" | "UserCheck";
  description: string;
}

export interface ProjectShowcaseContent {
  badge: string;
  title: string;
  subtitle: string;
  recruiterNote: string;
  tabs: ProjectPageTabItem[];
  metrics: ProjectShowcaseMetric[];
  skillGroups: ProjectPageSkillGroup[];
  engineeringStandards: ProjectPageStandard[];
  popularTechFilters: string[];
}

export interface AppContent {
  developer: DeveloperProfile;
  navbar: NavbarContent;
  hero: HeroContent;
  problems: ProblemsContent;
  about: AboutContent;
  services: ServicesContent;
  workflow: WorkflowContent;
  portfolio: PortfolioContent;
  projectShowcase: ProjectShowcaseContent;
  faq: FaqContent;
  contact: ContactContent;
  footer: FooterContent;
}
