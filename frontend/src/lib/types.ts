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
  blur: number   // blur intensity in px
}

export type CustomLayer = {
  id: string
  src: string
  x: number
  y: number
  width: number
  height: number
  opacity: number
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
  sponsorBgColor?: string
  sponsorHeight?: number
  brandItemStyles?: Record<string, BrandItemStyle>
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
  customLayers: CustomLayer[]
  watermarkX?: number // 0-100
  watermarkY?: number // 0-100
  watermarkRotation?: number // 0-360
  watermarkSize?: number // in cqw

  // Sponsorship
  showSponsor?: boolean
  sponsorType?: 'image' | 'text'
  sponsorText?: string
  sponsorLabelText?: string
  sponsorImage?: string
  sponsorScale?: number
  sponsorScaleX?: number
  sponsorScaleY?: number
  sponsorImageFit?: 'cover' | 'contain' | 'free'
  sponsorX?: number
  sponsorY?: number
  sponsorOrder?: 'brand-first' | 'sponsor-first'
  sponsorBgColor?: string
  sponsorHeight?: number // in cqw or px
  showSponsorQrCode?: boolean
  sponsorQrCodeData?: string
  sponsorQrScale?: number
  sponsorQrX?: number
  sponsorQrY?: number
  activeProperty?: string // e.g. 'headline', 'photo-0', 'sponsor', 'brand'
  
  // Brand Bar Extended
  showSource?: boolean
  qrCodeData?: string
  showQrCode?: boolean
  facebook?: string
  twitter?: string
  instagram?: string
  brandType?: 'text' | 'image'
  brandImage?: string
  brandScale?: number
  brandX?: number
  brandY?: number
  brandImageFit?: 'cover' | 'contain' | 'free'

  // Per-item styling overrides
  brandItemStyles?: Record<string, BrandItemStyle>

  // Date Component
  showDate?: boolean
  dateText?: string
  dateX?: number
  dateY?: number
}

export interface BrandItemStyle {
  visible?: boolean
  showIcon?: boolean // whether to show the icon (for text-only items like logo)
  icon?: string // icon name
  color?: string
  backgroundColor?: string
  fontSize?: number // in cqw
  fontFamily?: string
  fontWeight?: number | string
  borderRadius?: number // in cqw
  showBorder?: boolean
  borderWidth?: number // in px
  borderColor?: string
  textTransform?: string
  letterSpacing?: string
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
  sponsorBgColor: '#111111',
  sponsorHeight: 4,
  brandItemStyles: {
    "website": { "visible": true, "backgroundColor": "rgba(255,255,255,0.08)", "color": "rgba(255,255,255,0.9)", "fontSize": 1.2, "borderRadius": 0.4 },
    "facebook": { "visible": true, "backgroundColor": "rgba(59,89,152,0.15)", "color": "#ffffff", "fontSize": 1.1, "borderRadius": 0.4, "borderColor": "rgba(59,89,152,0.3)" },
    "twitter": { "visible": true, "backgroundColor": "rgba(0,0,0,0.2)", "color": "#ffffff", "fontSize": 1.1, "borderRadius": 0.4 },
    "instagram": { "visible": true, "backgroundColor": "rgba(225,48,108,0.1)", "color": "#ffffff", "fontSize": 1.1, "borderRadius": 0.4 }
  }
}

export const DEFAULT_CARD_DATA: CardData = {
  headline: 'রাজধানীতে তীব্র যানজট, ভোগান্তিতে নগরবাসী',
  subheadline: 'অফিসগামী মানুষ ও স্কুল শিক্ষার্থীরা সবচেয়ে বেশি বিপাকে পড়েছেন',
  brandName: 'NewsCards',
  handle: '@newscards',
  website: 'newscards.xyz',
  adText: 'বিজ্ঞাপন',
  watermarkText: 'newscards.xyz',
  source: 'NewsCards',
  pollOptions: ['হ্যাঁ', 'না'],
  photos: [
    { id: 'p1', src: 'https://images.unsplash.com/photo-1610996849887-88283832e8f1?q=80&w=1200&auto=format&fit=crop', objectPosition: 'center', objectFit: 'cover', scale: 1 },
    { id: 'p2', src: 'https://images.unsplash.com/photo-1596700673434-c71b7b7524bb?q=80&w=1200&auto=format&fit=crop', objectPosition: 'center', objectFit: 'cover', scale: 1 },
  ],
  blurRegions: [],
  customLayers: [],
  watermarkX: 5,
  watermarkY: 92,
  watermarkRotation: 0,
  watermarkSize: 1.5,
  showSponsor: false,
  sponsorType: 'image',
  sponsorText: '',
  sponsorLabelText: 'Sponsored by',
  sponsorImage: '',
  sponsorScale: 1.0,
  sponsorScaleX: 1.0,
  sponsorScaleY: 1.0,
  sponsorOrder: 'brand-first',
  sponsorBgColor: '#111111',
  sponsorHeight: 4,
}

import templatesData from './templates.json'

export const BUILT_IN_TEMPLATES: Template[] = templatesData as Template[]
