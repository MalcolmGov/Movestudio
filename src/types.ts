// Shared types across Brand Studio SaaS

export interface BrandKit {
  logo: string | null
  companyName?: string
  primary: string
  secondary: string
  accent: string
  font: string
  industry: string
  tone: string
}

export type SectionType =
  | 'hero' | 'features' | 'stats' | 'testimonials' | 'pricing' | 'cta' | 'footer'
  | 'faq' | 'team' | 'logobar' | 'newsletter' | 'contact' | 'video' | 'timeline' | 'ctabanner'
  | 'gallery' | 'services' | 'process' | 'blog' | 'comparison' | 'map' | 'booking'
  | 'navbar'

export interface SectionContent {
  // Navbar
  navLinks?: { label: string; href: string }[]
  navCta?: string
  // Hero
  headline?: string
  subheadline?: string
  ctaText?: string
  ctaSecondary?: string
  badgeText?: string
  // Features
  featuresTitle?: string
  features?: { icon: string; title: string; desc: string }[]
  // Stats
  stats?: { value: string; label: string }[]
  // Testimonials
  testimonials?: { name: string; role: string; company: string; quote: string; avatar: string }[]
  // Pricing
  pricingTitle?: string
  plans?: { name: string; price: string; period: string; desc: string; features: string[]; cta: string; highlight?: boolean }[]
  // CTA
  ctaTitle?: string
  ctaBody?: string
  ctaButton?: string
  // Footer
  footerBrand?: string
  footerTagline?: string
  footerLinks?: { group: string; links: string[] }[]
  // FAQ
  faqTitle?: string
  faqs?: { q: string; a: string }[]
  // Team
  teamTitle?: string
  teamMembers?: { name: string; role: string; avatar: string; bio: string }[]
  // Logo Bar
  logoBarLabel?: string
  logos?: { name: string; icon: string }[]
  // Newsletter
  newsletterTitle?: string
  newsletterBody?: string
  newsletterPlaceholder?: string
  newsletterButton?: string
  // Contact
  contactTitle?: string
  contactBody?: string
  // Video
  videoTitle?: string
  videoBody?: string
  videoUrl?: string
  videoThumbnail?: string
  // Timeline
  timelineTitle?: string
  milestones?: { year: string; title: string; desc: string }[]
  // CTA Banner
  bannerText?: string
  bannerButton?: string
  bannerSub?: string
  // Gallery
  galleryTitle?: string
  gallerySubtitle?: string
  galleryItems?: { src?: string; label: string; category?: string }[]
  // Services
  servicesTitle?: string
  servicesSubtitle?: string
  serviceItems?: { icon: string; title: string; desc: string; price?: string; cta?: string }[]
  // Process / How It Works
  processTitle?: string
  processSubtitle?: string
  processSteps?: { number: string; title: string; desc: string; icon?: string }[]
  // Blog Posts
  blogTitle?: string
  blogSubtitle?: string
  blogPosts?: { title: string; excerpt: string; date: string; category: string; readTime: string; author: string }[]
  // Comparison Table
  comparisonTitle?: string
  comparisonSubtitle?: string
  comparisonFeatures?: string[]
  comparisonPlans?: { name: string; highlight?: boolean; values: (boolean | string)[] }[]
  // Map / Location
  mapTitle?: string
  mapSubtitle?: string
  mapAddress?: string
  mapCity?: string
  mapHours?: { day: string; time: string }[]
  mapPhone?: string
  mapEmail?: string
  // Booking / Appointment
  bookingTitle?: string
  bookingSubtitle?: string
  bookingButton?: string
  bookingServices?: string[]
  // Gallery image uploads (base64, one per card slot)
  galleryImage0?: string
  galleryImage1?: string
  galleryImage2?: string
  galleryImage3?: string
  galleryImage4?: string
  galleryImage5?: string
  // Component Block (registry component dropped into page)
  componentKey?: string
  componentName?: string
  componentText?: string
  // Component block text colour override
  componentTextColorMode?: 'solid' | 'gradient'
  componentTextColor?: string
  componentTextGradientFrom?: string
  componentTextGradientTo?: string
  componentTextGradientAngle?: string
  // Regular section heading colour override
  headingColorMode?: 'solid' | 'gradient'
  headingColor?: string
  headingGradientFrom?: string
  headingGradientTo?: string
  headingGradientAngle?: string
  // Section background override
  sectionBgType?: 'default' | 'solid' | 'gradient' | 'image'
  sectionBgColor?: string
  sectionBgGradientFrom?: string
  sectionBgGradientTo?: string
  sectionBgGradientAngle?: string
  sectionBgImage?: string   // base64 or URL
  sectionBgOverlay?: string // rgba overlay opacity for image backgrounds
  // Section font override
  sectionFont?: string
}


export interface PageSection {
  id: string
  type: SectionType
  enabled: boolean
  content: SectionContent
}

export interface ActivityEvent {
  id: string
  action: string
  detail: string
  at: string
  icon: string
}

export interface SEOMetadata {
  title?: string            // <title> + og:title + twitter:title
  description?: string      // <meta name="description"> + og + twitter
  ogImage?: string          // CDN URL or data-URL — 1200×630 recommended
  favicon?: string          // CDN URL or data-URL — 512×512 recommended
  keywords?: string[]       // legacy <meta name="keywords">
  canonical?: string        // <link rel="canonical">
  twitterHandle?: string    // @handle for twitter:creator
}

export interface Project {
  id: string
  name: string
  slug?: string             // URL slug for published site (e.g. 'acme-consulting')
  createdAt: string
  updatedAt: string
  kit: BrandKit
  sections: PageSection[]
  seo?: SEOMetadata         // Optional — defaults from kit.companyName + first hero headline
  activityLog: ActivityEvent[]
  publishedAt?: string      // ISO timestamp of last successful publish
  publishedUrl?: string     // Live URL if hosted
}

export interface AuthUser {
  id: string
  name: string
  email: string
  plan: 'starter' | 'pro' | 'agency'
}

// ── localStorage helpers ──────────────────────────────────
export const Storage = {
  getUser: (): AuthUser | null => {
    try { return JSON.parse(localStorage.getItem('bs_user') || 'null') } catch { return null }
  },
  setUser: (u: AuthUser) => localStorage.setItem('bs_user', JSON.stringify(u)),
  clearUser: () => localStorage.removeItem('bs_user'),

  getProjects: (): Project[] => {
    try { return JSON.parse(localStorage.getItem('bs_projects') || '[]') } catch { return [] }
  },
  saveProject: (p: Project) => {
    const projects = Storage.getProjects().filter(x => x.id !== p.id)
    localStorage.setItem('bs_projects', JSON.stringify([{ ...p, updatedAt: new Date().toISOString() }, ...projects]))
  },
  deleteProject: (id: string) => {
    localStorage.setItem('bs_projects', JSON.stringify(Storage.getProjects().filter(p => p.id !== id)))
  },

  logActivity: (projectId: string, action: string, detail: string, icon = '⚡') => {
    const projects = Storage.getProjects()
    const idx = projects.findIndex(p => p.id === projectId)
    if (idx === -1) return
    const event: ActivityEvent = { id: `evt-${Date.now()}`, action, detail, at: new Date().toISOString(), icon }
    projects[idx] = { ...projects[idx], activityLog: [event, ...(projects[idx].activityLog || [])].slice(0, 50) }
    localStorage.setItem('bs_projects', JSON.stringify(projects))
  },

  getActivity: (projectId: string): ActivityEvent[] => {
    const p = Storage.getProjects().find(x => x.id === projectId)
    return p?.activityLog || []
  },
}

// ── Default content ───────────────────────────────────────
export const DEFAULT_CONTENT: SectionContent = {
  headline: 'Build faster. Ship smarter.',
  subheadline: 'The modern platform for teams that move at the speed of business. Beautifully designed, infinitely customisable.',
  ctaText: 'Get Started Free',
  ctaSecondary: 'View Demo',
  badgeText: '🚀 Now in public beta',
  featuresTitle: 'Everything you need to scale',
  features: [
    { icon: '⚡', title: 'Lightning Fast', desc: 'Optimised for performance at every layer.' },
    { icon: '🔒', title: 'Enterprise Security', desc: 'Bank-grade encryption and compliance.' },
    { icon: '🌍', title: 'Global Scale', desc: 'Deploy to 40+ regions with one click.' },
    { icon: '📊', title: 'Real-time Analytics', desc: 'Live dashboards with no setup required.' },
    { icon: '🔗', title: '200+ Integrations', desc: 'Connect your existing tools instantly.' },
    { icon: '🤝', title: 'Dedicated Support', desc: '24/7 human support for every plan.' },
  ],
  stats: [
    { value: '10M+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '<50ms', label: 'Avg Response' },
    { value: '150+', label: 'Countries' },
  ],
  testimonials: [
    { name: 'Sarah Chen', role: 'CTO', company: 'Nexus Labs', quote: 'This platform cut our time-to-market in half. The DX is exceptional.', avatar: 'SC' },
    { name: 'Marcus Williams', role: 'Founder', company: 'SwiftPay', quote: 'Finally a product that just works. Our team adopted it in a day.', avatar: 'MW' },
    { name: 'Aisha Patel', role: 'VP Engineering', company: 'Fintex', quote: 'The performance improvements were immediate and measurable.', avatar: 'AP' },
  ],
  pricingTitle: 'Simple, transparent pricing',
  plans: [
    { name: 'Starter', price: 'Free', period: '', desc: 'Perfect for individuals and small projects.', features: ['1 Project', '5 Pages', 'Community support', 'Basic components'], cta: 'Get Started' },
    { name: 'Pro', price: 'R499', period: '/mo', desc: 'For growing teams that need more power.', features: ['5 Projects', 'Unlimited pages', 'Priority support', 'All components', 'Custom domain', 'Remove watermark'], cta: 'Start Pro Trial', highlight: true },
    { name: 'Agency', price: 'R1,499', period: '/mo', desc: 'For agencies managing multiple clients.', features: ['Unlimited projects', 'White-label', 'Dedicated manager', 'API access', 'Custom integrations', 'SLA guarantee'], cta: 'Contact Sales' },
  ],
  ctaTitle: 'Ready to launch your brand?',
  ctaBody: 'Join 10,000+ companies using Move Design Library to build stunning digital experiences.',
  ctaButton: 'Start Building Free',
  footerBrand: 'YourBrand',
  footerTagline: 'Built with Move Design Library',
  footerLinks: [
    { group: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
    { group: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
    { group: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
  ],
}

export const DEFAULT_SECTIONS: PageSection[] = [
  { id: 'navbar',      type: 'navbar',      enabled: true,  content: {} },
  { id: 'hero',        type: 'hero',        enabled: true,  content: {} },
  { id: 'logobar',     type: 'logobar',     enabled: true,  content: {} },
  { id: 'features',    type: 'features',    enabled: true,  content: {} },
  { id: 'stats',       type: 'stats',       enabled: true,  content: {} },
  { id: 'process',     type: 'process',     enabled: false, content: {} },
  { id: 'services',    type: 'services',    enabled: false, content: {} },
  { id: 'gallery',     type: 'gallery',     enabled: false, content: {} },
  { id: 'video',       type: 'video',       enabled: false, content: {} },
  { id: 'timeline',    type: 'timeline',    enabled: false, content: {} },
  { id: 'testimonials',type: 'testimonials',enabled: false, content: {} },
  { id: 'blog',        type: 'blog',        enabled: false, content: {} },
  { id: 'team',        type: 'team',        enabled: false, content: {} },
  { id: 'comparison',  type: 'comparison',  enabled: false, content: {} },
  { id: 'faq',         type: 'faq',         enabled: false, content: {} },
  { id: 'newsletter',  type: 'newsletter',  enabled: false, content: {} },
  { id: 'booking',     type: 'booking',     enabled: false, content: {} },
  { id: 'contact',     type: 'contact',     enabled: false, content: {} },
  { id: 'map',         type: 'map',         enabled: false, content: {} },
  { id: 'pricing',     type: 'pricing',     enabled: false, content: {} },
  { id: 'ctabanner',   type: 'ctabanner',   enabled: false, content: {} },
  { id: 'cta',         type: 'cta',         enabled: true,  content: {} },
  { id: 'footer',      type: 'footer',      enabled: true,  content: {} },
]
