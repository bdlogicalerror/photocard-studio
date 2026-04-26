export interface PhotoSlot {
  id: string
  src: string | null
  objectPosition?: string
  objectFit?: string
  scale?: number
}

export interface TemplateStyle {
  accentColor?: string
  backgroundColor?: string
  headlineColor?: string
  subheadlineColor?: string
  brandBarBg?: string
  brandColor?: string
  headlineFontSize?: number
  subheadlineFontSize?: number
  headlineFontWeight?: number
  fontFamily?: string
  photoDividerColor?: string
  accentBarHeight?: number
  accentBarPosition?: 'top' | 'bottom'
  overlayOpacity?: number
  borderRadius?: number
  padding?: number
  showBrandBar?: boolean
  showAdBar?: boolean
  adBarBg?: string
  showWatermark?: boolean
  watermarkOpacity?: number
}

export interface PhotocardCreate {
  template_id: string
  headline: string
  subheadline?: string
  brand_name?: string
  photos?: PhotoSlot[]
  style_overrides?: Partial<TemplateStyle>
  base64_image?: string
  variant?: string
}

export interface PhotocardResponse {
  id: string
  image_url: string
  status: string
  filename: string
}
