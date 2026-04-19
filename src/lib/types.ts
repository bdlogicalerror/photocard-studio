// src/lib/types.ts
export type PhotoSlot = {
  id: string
  src: string | null
  objectPosition: string
  objectFit: 'cover' | 'contain' | 'fill'
  scale: number
}

export type BlurRegion = {
  id: string
  x: number      // position in percentage (0-100)
  y: number
  width: number  // size in percentage (0-100)
  height: number
}

export type TemplateLayout =
  | 'single-top'       // 1 photo top, text bottom
  | 'single-bottom'    // text top, 1 photo bottom
  | 'dual-top'         // 2 photos top, text bottom
  | 'dual-side'        // 1 photo left, text right
  | 'dual-side-reverse'// text left, 1 photo right
  | 'full-overlay'     // 1 photo full bleed, text overlaid
  | 'triple-mosaic'    // 2 photos top-left stack + 1 right, text bottom
  | 'poll-vote'        // Vote buttons at the bottom
  | 'versus-clash'     // 2 photos splitting with a VS shield
  | 'quote-focus'      // Giant quote marks emphasizes the headline
  | 'breaking-alert'   // Breaking news ribbon/overlay
  | 'stat-highlight'   // Highlights numeric subheadline predominantly
  | 'portrait-editorial' // Half-width tall photo, serif headline
  | 'impact-hero'      // Small square photo, massive vertical headline
  | 'news-reel'        // Full-bleed with rounded translucent bars
  | 'modern-duo'       // Symmetrical vertical split with accent gap

export type Template = {
  id: string
  name: string
  description: string
  layout: TemplateLayout
  photoCount: 1 | 2 | 3
  isBuiltIn?: boolean
  style: TemplateStyle
}

export type TemplateStyle = {
  accentColor: string
  backgroundColor: string
  headlineColor: string
  subheadlineColor: string
  brandBarBg: string
  brandColor: string
  headlineFontSize: number      // in px, for 1080px canvas
  subheadlineFontSize: number
  headlineFontWeight: 400 | 700 | 900
  fontFamily: 'bengali' | 'bengali-sans' | 'display' | 'sans'
  photoDividerColor: string
  accentBarHeight: number       // px
  accentBarPosition: 'top' | 'bottom' | 'none'
  overlayOpacity: number        // 0-1, for full-overlay layout
  borderRadius: number
  padding: number
  showBrandBar: boolean
  showAdBar: boolean
  adBarBg: string
  showWatermark: boolean
  watermarkOpacity: number
}

export type CardData = {
  headline: string
  subheadline: string
  brandName: string
  handle: string
  website: string
  adText: string
  watermarkText: string
  source?: string
  pollOptions?: [string, string]
  photos: PhotoSlot[]
  blurRegions: BlurRegion[]
}

export const DEFAULT_STYLE: TemplateStyle = {
  accentColor: '#c0392b',
  backgroundColor: '#c0392b',
  headlineColor: '#ffffff',
  subheadlineColor: 'rgba(255,255,255,0.88)',
  brandBarBg: '#111111',
  brandColor: '#e8b422',
  headlineFontSize: 58,
  subheadlineFontSize: 28,
  headlineFontWeight: 900,
  fontFamily: 'bengali',
  photoDividerColor: '#222222',
  accentBarHeight: 8,
  accentBarPosition: 'top',
  overlayOpacity: 0.55,
  borderRadius: 0,
  padding: 40,
  showBrandBar: true,
  showAdBar: false,
  adBarBg: '#f5f5f5',
  showWatermark: true,
  watermarkOpacity: 0.3,
}

export const DEFAULT_CARD_DATA: CardData = {
  headline: 'সবাই সংসদে গেলে আমার গাড়ির পিছনে দৌড়াবে কে?',
  subheadline: 'আবিদকে উদ্দেশ্য করে তারেক রহমান',
  brandName: 'মুজিব বাহিনী',
  handle: 'মুজিব বাহিনী',
  website: 'মুজিব বাহিনী',
  adText: '',
  watermarkText: 'মুজিব বাহিনী',
  pollOptions: ['হ্যাঁ', 'না'],
  photos: [
    { id: 'p1', src: null, objectPosition: 'center', objectFit: 'cover', scale: 1 },
    { id: 'p2', src: null, objectPosition: 'center', objectFit: 'cover', scale: 1 },
  ],
  blurRegions: [],
}

export const BUILT_IN_TEMPLATES: Template[] = [
  {
    id: 'dual-classic',
    name: 'Dual Classic',
    description: '2 photos top, bold headline below',
    layout: 'dual-top',
    photoCount: 2,
    isBuiltIn: true,
    style: { ...DEFAULT_STYLE },
  },
  {
    id: 'single-news',
    name: 'Single News',
    description: '1 photo top, text block below',
    layout: 'single-top',
    photoCount: 1,
    isBuiltIn: true,
    style: {
      ...DEFAULT_STYLE,
      accentColor: '#1a3a6b',
      backgroundColor: '#1a3a6b',
      brandBarBg: '#0f2347',
      brandColor: '#4fc3f7',
      headlineFontSize: 62,
    },
  },
  {
    id: 'full-overlay',
    name: 'Full Overlay',
    description: '1 photo full bleed with text overlay',
    layout: 'full-overlay',
    photoCount: 1,
    isBuiltIn: true,
    style: {
      ...DEFAULT_STYLE,
      accentColor: '#000000',
      backgroundColor: 'rgba(0,0,0,0)',
      headlineColor: '#ffffff',
      brandBarBg: 'rgba(0,0,0,0.85)',
      overlayOpacity: 0.7, // Increased for better readability
      accentBarPosition: 'none',
    },
  },
  {
    id: 'side-story',
    name: 'Side Story',
    description: '1 photo left, headline right',
    layout: 'dual-side',
    photoCount: 1,
    isBuiltIn: true,
    style: {
      ...DEFAULT_STYLE,
      accentColor: '#2d6a4f',
      backgroundColor: '#2d6a4f',
      brandBarBg: '#1b4332',
      brandColor: '#95d5b2',
      headlineFontSize: 52,
    },
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    description: 'Clean white with color accent',
    layout: 'single-top',
    photoCount: 1,
    isBuiltIn: true,
    style: {
      ...DEFAULT_STYLE,
      accentColor: '#e63946',
      backgroundColor: '#ffffff',
      headlineColor: '#1a1a1a',
      subheadlineColor: '#555555',
      brandBarBg: '#1a1a1a',
      brandColor: '#e63946',
      headlineFontSize: 56,
      accentBarHeight: 5,
      accentBarPosition: 'top',
    },
  },
  {
    id: 'dual-mosaic',
    name: 'Mosaic',
    description: '3-photo mosaic with headline',
    layout: 'triple-mosaic',
    photoCount: 3,
    isBuiltIn: true,
    style: {
      ...DEFAULT_STYLE,
      accentColor: '#6b21a8',
      backgroundColor: '#6b21a8',
      brandBarBg: '#3b0764',
      brandColor: '#e879f9',
      headlineFontSize: 50,
    },
  },
  {
    id: 'poll-voting',
    name: 'Opinion Poll',
    description: 'Headline question with YES/NO buttons',
    layout: 'poll-vote',
    photoCount: 1,
    isBuiltIn: true,
    style: {
      ...DEFAULT_STYLE,
      accentColor: '#0ea5e9',
      backgroundColor: '#0f172a',
      brandBarBg: '#020617',
      brandColor: '#38bdf8',
      headlineFontSize: 56,
    },
  },
  {
    id: 'versus-debate',
    name: 'VS Debate',
    description: '2 competitors with a VS badge in middle',
    layout: 'versus-clash',
    photoCount: 2,
    isBuiltIn: true,
    style: {
      ...DEFAULT_STYLE,
      backgroundColor: '#111827',
      accentColor: '#ef4444',
      brandBarBg: '#030712',
      headlineFontSize: 60,
    },
  },
  {
    id: 'quote-spotlight',
    name: 'Quote Spotlight',
    description: 'Prominent quote marks with author side photo',
    layout: 'quote-focus',
    photoCount: 1,
    isBuiltIn: true,
    style: {
      ...DEFAULT_STYLE,
      backgroundColor: '#f8fafc',
      headlineColor: '#0f172a',
      subheadlineColor: '#475569',
      brandBarBg: '#0f172a',
      accentColor: '#fbbf24',
      headlineFontSize: 52,
    },
  },
  {
    id: 'breaking-ribbon',
    name: 'Breaking News',
    description: 'Alert-style with breaking ribbon over image',
    layout: 'breaking-alert',
    photoCount: 1,
    isBuiltIn: true,
    style: {
      ...DEFAULT_STYLE,
      backgroundColor: '#dc2626',
      accentColor: '#fef08a',
      headlineFontSize: 64,
      brandBarBg: '#7f1d1d',
      brandColor: '#faca15',
    },
  },
  {
    id: 'stat-fact',
    name: 'Factoid/Stat',
    description: 'Massive stat number focus',
    layout: 'stat-highlight',
    photoCount: 1,
    isBuiltIn: true,
    style: {
      ...DEFAULT_STYLE,
      backgroundColor: '#166534',
      accentColor: '#86efac',
      brandBarBg: '#14532d',
      brandColor: '#bbf7d0',
      headlineFontSize: 36,
      subheadlineFontSize: 120, // huge for numbers
    },
  },
  {
    id: 'editorial-gold',
    name: 'Editorial Gold',
    description: 'High-end serif typography, gold accents, and portrait focus',
    layout: 'portrait-editorial',
    photoCount: 1,
    isBuiltIn: true,
    style: {
      ...DEFAULT_STYLE,
      backgroundColor: '#fdfcf0',
      headlineColor: '#1a1a1a',
      subheadlineColor: '#5c5432',
      accentColor: '#d4af37',
      brandBarBg: '#1a1a1a',
      brandColor: '#d4af37',
      fontFamily: 'display',
      headlineFontSize: 68,
      padding: 60,
    },
  },
  {
    id: 'impact-carbon',
    name: 'Impact Carbon',
    description: 'Aggressive dark mode with massive vertical focus',
    layout: 'impact-hero',
    photoCount: 1,
    isBuiltIn: true,
    style: {
      ...DEFAULT_STYLE,
      backgroundColor: '#0a0a0a',
      headlineColor: '#ffffff',
      subheadlineColor: '#ef4444',
      accentColor: '#ef4444',
      brandBarBg: '#000000',
      brandColor: '#ffffff',
      fontFamily: 'sans',
      headlineFontSize: 90,
      headlineFontWeight: 900,
    },
  },
  {
    id: 'news-reel',
    name: 'News Reel',
    description: 'Mobile-first look with glassy overlays and rounded photos',
    layout: 'news-reel',
    photoCount: 1,
    isBuiltIn: true,
    style: {
      ...DEFAULT_STYLE,
      backgroundColor: '#0f172a',
      accentColor: '#38bdf8',
      headlineFontSize: 54,
      borderRadius: 16,
      padding: 30,
    },
  },
  {
    id: 'minimal-split',
    name: 'Minimal Split',
    description: 'Symmetrical 50/50 vertical layout with clean divide',
    layout: 'modern-duo',
    photoCount: 2,
    isBuiltIn: true,
    style: {
      ...DEFAULT_STYLE,
      backgroundColor: '#ffffff',
      headlineColor: '#000000',
      subheadlineColor: '#666666',
      accentColor: '#000000',
      brandBarBg: '#000000',
      brandColor: '#ffffff',
      accentBarHeight: 4,
    },
  },
]
