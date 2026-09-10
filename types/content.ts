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

export interface AboutContent {
  badge: string;
  title: string;
  description: string;
  bioText1: string;
  bioText2: string;
  focusCards: FocusCardItem[];
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

export interface ContactContent {
  badge: string;
  title: string;
  description: string;
  servicesList: ContactServiceItem[];
  channels: ContactChannelItem[];
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

export interface AppContent {
  navbar: NavbarContent;
  hero: HeroContent;
  problems: ProblemsContent;
  about: AboutContent;
  services: ServicesContent;
  workflow: WorkflowContent;
  portfolio: PortfolioContent;
  faq: FaqContent;
  contact: ContactContent;
  footer: FooterContent;
}
