// ─── White-Label Tenant Registry ──────────────────────────────────────────────
// To add a new tenant: add one object to TENANTS.
// The `slug` becomes the URL: /white-label/<slug>
// ──────────────────────────────────────────────────────────────────────────────

export interface TenantModule {
  id: string
  icon: string
  label: string
  desc: string
  path: string
}

export interface TenantTheme {
  // Core palette
  primary: string      // main brand colour
  secondary: string    // secondary / darker shade
  accent: string       // highlight / CTA colour
  // Sidebar
  sidebarBg: string    // sidebar background
  sidebarText: string  // sidebar text colour
  sidebarActive: string // active item background
  // Page
  pageBg: string       // main content background
  cardBg: string       // card / panel background
  border: string       // border colour
  textPrimary: string  // main text
  textMuted: string    // muted text
  // Mode
  mode: 'dark' | 'light'
}

export interface Tenant {
  slug: string
  bankName: string          // e.g. "Nedbank"
  platformName: string      // e.g. "Nedbank Business Suite"
  tagline: string           // e.g. "Business Banking, Elevated"
  pitchLine: string         // one-liner for the demo picker card
  emoji: string             // logo placeholder emoji
  logoInitials: string      // e.g. "NB"
  theme: TenantTheme
  modules: TenantModule[]
  poweredBy: boolean        // show "Powered by Move Studio" badge
  demoNote?: string         // optional pitch note shown in picker
}

// ── Module presets ─────────────────────────────────────────────────────────────
const ALL_MODULES: TenantModule[] = [
  // ── Business OS
  { id: 'dashboard',    icon: '⬡',  label: 'Dashboard',         desc: 'Command centre overview',            path: '/dashboard' },
  { id: 'crm',          icon: '👥',  label: 'CRM & Pipeline',    desc: 'Contacts, deals & activities',       path: '/crm' },
  { id: 'billing',      icon: '🧾',  label: 'Invoicing',         desc: 'Invoices, quotes & payments',        path: '/billing' },
  { id: 'accounting',   icon: '📊',  label: 'Accounting',        desc: 'P&L, VAT & financial reports',       path: '/accounting' },
  { id: 'projects',     icon: '📋',  label: 'Projects',          desc: 'Tasks, board & timelines',           path: '/projects' },
  { id: 'hr',           icon: '👤',  label: 'HR & Payroll',      desc: 'People, leave & PAYE payroll',       path: '/hr' },
  { id: 'inventory',    icon: '📦',  label: 'Inventory',         desc: 'Stock, products & suppliers',        path: '/inventory' },
  // ── Creative & Marketing
  { id: 'website',      icon: '🌐',  label: 'Website Builder',   desc: 'Drag-and-drop site builder + AI',    path: '/website-builder' },
  { id: 'ads',          icon: '🎨',  label: 'Ad Studio',         desc: 'AI-powered ad & content creator',    path: '/ad-studio' },
  { id: 'analytics',    icon: '📈',  label: 'Analytics',         desc: 'Campaign & performance insights',     path: '/analytics' },
  { id: 'brand',        icon: '✦',   label: 'Brand Studio',      desc: 'Brand kit, assets & guidelines',     path: '/brand-studio' },
  { id: 'email',        icon: '✉️',  label: 'Email Studio',      desc: 'Smart email campaign builder',       path: '/email-studio' },
]

const BANKING_MODULES: TenantModule[] = [
  // ── Business OS
  { id: 'dashboard',    icon: '⬡',  label: 'Overview',          desc: 'Business snapshot',                  path: '/dashboard' },
  { id: 'billing',      icon: '🧾',  label: 'Invoicing & Quotes',desc: 'Send invoices, collect payments',     path: '/billing' },
  { id: 'accounting',   icon: '📊',  label: 'Cash Flow',         desc: 'Income, expenses & VAT',             path: '/accounting' },
  { id: 'crm',          icon: '👥',  label: 'Customers',         desc: 'Contacts, deals & follow-ups',        path: '/crm' },
  { id: 'inventory',    icon: '📦',  label: 'Inventory',         desc: 'Stock tracking & suppliers',          path: '/inventory' },
  { id: 'projects',     icon: '📋',  label: 'Projects',          desc: 'Tasks & team collaboration',          path: '/projects' },
  { id: 'hr',           icon: '👤',  label: 'Payroll',           desc: 'PAYE, UIF & leave management',        path: '/hr' },
  // ── Digital Growth Tools
  { id: 'website',      icon: '🌐',  label: 'Website Builder',   desc: 'Build & publish your site with AI',  path: '/website-builder' },
  { id: 'ads',          icon: '🎨',  label: 'Ad Generator',      desc: 'AI-powered ad & content creator',    path: '/ad-studio' },
  { id: 'analytics',    icon: '📈',  label: 'Analytics',         desc: 'Campaign & performance insights',     path: '/analytics' },
  { id: 'brand',        icon: '✦',   label: 'Brand Studio',      desc: 'Brand kit, assets & guidelines',     path: '/brand-studio' },
  { id: 'email',        icon: '✉️',  label: 'Email Studio',      desc: 'Smart email campaign builder',       path: '/email-studio' },
]

// ── Tenant Registry ────────────────────────────────────────────────────────────
export const TENANTS: Tenant[] = [

  // ── Nedbank ──────────────────────────────────────────────────────────────────
  {
    slug: 'nedbank',
    bankName: 'Nedbank',
    platformName: 'Nedbank Business Suite',
    tagline: 'Business Banking, Elevated',
    pitchLine: 'A complete Business OS for Nedbank SME clients — included with your Business Account.',
    emoji: '🟢',
    logoInitials: 'NB',
    poweredBy: true,
    demoNote: "SA's most valuable bank brand offering a full-stack Business OS to their SME segment.",
    theme: {
      primary:      '#009B4E',
      secondary:    '#007B3E',
      accent:       '#00C167',
      sidebarBg:    '#003D2B',
      sidebarText:  'rgba(255,255,255,0.75)',
      sidebarActive:'rgba(0,155,78,0.25)',
      pageBg:       '#060f0a',
      cardBg:       'rgba(0,155,78,0.05)',
      border:       'rgba(0,155,78,0.18)',
      textPrimary:  '#ffffff',
      textMuted:    'rgba(255,255,255,0.45)',
      mode:         'dark',
    },
    modules: BANKING_MODULES,
  },

  // ── Standard Bank ─────────────────────────────────────────────────────────────
  {
    slug: 'standardbank',
    bankName: 'Standard Bank',
    platformName: 'Standard Bank Business OS',
    tagline: 'Africa is Our Home. We Drive Her Growth.',
    pitchLine: 'Empowering Standard Bank business clients with a fully integrated management platform.',
    emoji: '🔵',
    logoInitials: 'SB',
    poweredBy: true,
    demoNote: 'Pan-African reach — pitch this as a digital toolkit bundled with Standard Bank Business accounts across 20 countries.',
    theme: {
      primary:      '#0033A0',
      secondary:    '#002280',
      accent:       '#009FDF',
      sidebarBg:    '#00144A',
      sidebarText:  'rgba(255,255,255,0.75)',
      sidebarActive:'rgba(0,51,160,0.3)',
      pageBg:       '#04061a',
      cardBg:       'rgba(0,51,160,0.05)',
      border:       'rgba(0,159,223,0.18)',
      textPrimary:  '#ffffff',
      textMuted:    'rgba(255,255,255,0.45)',
      mode:         'dark',
    },
    modules: BANKING_MODULES,
  },

  // ── FNB ────────────────────────────────────────────────────────────────────
  {
    slug: 'fnb',
    bankName: 'FNB',
    platformName: 'FNB Business Hub',
    tagline: 'How can we help you?',
    pitchLine: "Integrating seamlessly into FNB's existing digital ecosystem for business clients.",
    emoji: '🟠',
    logoInitials: 'FNB',
    poweredBy: true,
    demoNote: "FNB's digital-first culture makes this a natural extension of their award-winning app.",
    theme: {
      primary:      '#E8730C',
      secondary:    '#C8590A',
      accent:       '#FF9A3C',
      sidebarBg:    '#1A0A00',
      sidebarText:  'rgba(255,255,255,0.75)',
      sidebarActive:'rgba(232,115,12,0.2)',
      pageBg:       '#0f0800',
      cardBg:       'rgba(232,115,12,0.05)',
      border:       'rgba(232,115,12,0.2)',
      textPrimary:  '#ffffff',
      textMuted:    'rgba(255,255,255,0.45)',
      mode:         'dark',
    },
    modules: BANKING_MODULES,
  },

  // ── Absa ───────────────────────────────────────────────────────────────────
  {
    slug: 'absa',
    bankName: 'Absa',
    platformName: 'Absa Business Suite',
    tagline: 'Your Story Matters',
    pitchLine: "A white-label Business OS positioned as Absa's SME growth platform.",
    emoji: '🔴',
    logoInitials: 'AB',
    poweredBy: true,
    demoNote: "Absa's re-brand and pan-African expansion creates a strong opening for a bundled Business OS product.",
    theme: {
      primary:      '#DC0028',
      secondary:    '#B30020',
      accent:       '#FF4A6A',
      sidebarBg:    '#1A0008',
      sidebarText:  'rgba(255,255,255,0.75)',
      sidebarActive:'rgba(220,0,40,0.2)',
      pageBg:       '#0f0004',
      cardBg:       'rgba(220,0,40,0.05)',
      border:       'rgba(220,0,40,0.18)',
      textPrimary:  '#ffffff',
      textMuted:    'rgba(255,255,255,0.45)',
      mode:         'dark',
    },
    modules: BANKING_MODULES,
  },

  // ── Capitec ────────────────────────────────────────────────────────────────
  {
    slug: 'capitec',
    bankName: 'Capitec',
    platformName: 'Capitec Business Tools',
    tagline: 'Simplicity is our Strength',
    pitchLine: "Simple, affordable business management tools for Capitec's growing SME base.",
    emoji: '🟣',
    logoInitials: 'CAP',
    poweredBy: true,
    demoNote: "Capitec's massive retail footprint and growing business banking segment is an ideal land-and-expand market.",
    theme: {
      primary:      '#5C2D91',
      secondary:    '#461E73',
      accent:       '#00B2A9',
      sidebarBg:    '#1A0D2E',
      sidebarText:  'rgba(255,255,255,0.75)',
      sidebarActive:'rgba(92,45,145,0.3)',
      pageBg:       '#080412',
      cardBg:       'rgba(92,45,145,0.05)',
      border:       'rgba(0,178,169,0.18)',
      textPrimary:  '#ffffff',
      textMuted:    'rgba(255,255,255,0.45)',
      mode:         'dark',
    },
    modules: BANKING_MODULES,
  },

  // ── Investec ───────────────────────────────────────────────────────────────
  {
    slug: 'investec',
    bankName: 'Investec',
    platformName: 'Investec Business Intelligence',
    tagline: 'Out of the Ordinary',
    pitchLine: "A premium business management suite for Investec's high-net-worth business clients.",
    emoji: '⬛',
    logoInitials: 'INV',
    poweredBy: true,
    demoNote: "Investec's premium positioning makes a feature-rich, white-glove Business OS a compelling premium add-on.",
    theme: {
      primary:      '#1C1C1C',
      secondary:    '#000000',
      accent:       '#C9A84C',
      sidebarBg:    '#111111',
      sidebarText:  'rgba(255,255,255,0.75)',
      sidebarActive:'rgba(201,168,76,0.15)',
      pageBg:       '#080808',
      cardBg:       'rgba(201,168,76,0.05)',
      border:       'rgba(201,168,76,0.2)',
      textPrimary:  '#ffffff',
      textMuted:    'rgba(255,255,255,0.4)',
      mode:         'dark',
    },
    modules: ALL_MODULES,
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────
export const getTenant = (slug: string): Tenant | undefined =>
  TENANTS.find(t => t.slug === slug.toLowerCase())

export const defaultTenant = TENANTS[0]
