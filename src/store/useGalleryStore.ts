import { create } from 'zustand'

export type GallerySourceState = {
  news: any[]
  currentIndex: number
  hasFetched: boolean
}

export type GalleryCardState = {
  status: 'pending' | 'generating' | 'success' | 'error'
  templateId?: string
  generatedImageUrl: string | null
  filename: string | null
  isSaved: boolean
  isSaving: boolean
  isCopying: boolean
  error: string | null
}

type GalleryStore = {
  prothomAlo: GallerySourceState
  bd24live: GallerySourceState
  cardStates: Record<string, GalleryCardState>

  updateSource: (source: 'prothomAlo' | 'bd24live', patch: Partial<GallerySourceState>) => void
  updateCardState: (uniqueKey: string, patch: Partial<GalleryCardState>) => void
}

const defaultCardState: GalleryCardState = {
  status: 'pending',
  generatedImageUrl: null,
  filename: null,
  isSaved: false,
  isSaving: false,
  isCopying: false,
  error: null
}

export const useGalleryStore = create<GalleryStore>((set) => ({
  prothomAlo: { news: [], currentIndex: 0, hasFetched: false },
  bd24live: { news: [], currentIndex: 0, hasFetched: false },
  cardStates: {},

  updateSource: (source, patch) => 
    set((s) => ({ [source]: { ...s[source], ...patch } })),
    
  updateCardState: (uniqueKey, patch) => 
    set((s) => ({
      cardStates: {
        ...s.cardStates,
        [uniqueKey]: { 
          ...(s.cardStates[uniqueKey] || defaultCardState), 
          ...patch 
        }
      }
    }))
}))
