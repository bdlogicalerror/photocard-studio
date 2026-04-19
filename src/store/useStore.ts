// src/store/useStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import {
  Template, CardData, TemplateStyle, PhotoSlot, BlurRegion,
  BUILT_IN_TEMPLATES, DEFAULT_CARD_DATA, DEFAULT_STYLE
} from '@/lib/types'

type Store = {
  templates: Template[]
  activeTemplateId: string
  cardData: CardData

  setActiveTemplate: (id: string) => void
  updateCardData: (patch: Partial<CardData>) => void
  updatePhoto: (idx: number, patch: Partial<PhotoSlot>) => void
  updatePhotoById: (id: string, patch: Partial<PhotoSlot>) => void
  updateStyle: (patch: Partial<TemplateStyle>) => void
  addTemplate: (t: Omit<Template, 'id'>) => void
  duplicateTemplate: (id: string) => void
  deleteTemplate: (id: string) => void
  renameTemplate: (id: string, name: string) => void
  resetCardData: () => void
  
  addBlurRegion: () => void
  updateBlurRegion: (id: string, patch: Partial<BlurRegion>) => void
  removeBlurRegion: (id: string) => void
  _hasHydrated: boolean
  setHasHydrated: (v: boolean) => void
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      templates: BUILT_IN_TEMPLATES,
      activeTemplateId: BUILT_IN_TEMPLATES[0].id,
      cardData: { ...DEFAULT_CARD_DATA, photos: DEFAULT_CARD_DATA.photos.map(p => ({ ...p })) },
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      setActiveTemplate: (id) => set({ activeTemplateId: id }),

      updateCardData: (patch) =>
        set(s => ({ cardData: { ...s.cardData, ...patch } })),

      updatePhoto: (idx, patch) =>
        set(s => {
          const photos = [...s.cardData.photos]
          photos[idx] = { ...photos[idx], ...patch }
          return { cardData: { ...s.cardData, photos } }
        }),

      updatePhotoById: (id, patch) =>
        set(s => {
          const photos = [...s.cardData.photos]
          const idx = photos.findIndex(p => p.id === id)
          if (idx !== -1) photos[idx] = { ...photos[idx], ...patch }
          return { cardData: { ...s.cardData, photos } }
        }),

      updateStyle: (patch) =>
        set(s => ({
          templates: s.templates.map(t =>
            t.id === s.activeTemplateId
              ? { ...t, style: { ...t.style, ...patch } }
              : t
          ),
        })),

      addTemplate: (t) => {
        const id = uuid()
        set(s => ({ templates: [...s.templates, { ...t, id }], activeTemplateId: id }))
      },

      duplicateTemplate: (id) => {
        const src = get().templates.find(t => t.id === id)
        if (!src) return
        const newId = uuid()
        set(s => ({
          templates: [...s.templates, { ...src, id: newId, name: src.name + ' (copy)', isBuiltIn: false }],
          activeTemplateId: newId,
        }))
      },

      deleteTemplate: (id) => {
        const s = get()
        const remaining = s.templates.filter(t => t.id !== id)
        if (remaining.length === 0) return
        set({
          templates: remaining,
          activeTemplateId: s.activeTemplateId === id ? remaining[0].id : s.activeTemplateId,
        })
      },

      renameTemplate: (id, name) =>
        set(s => ({
          templates: s.templates.map(t => t.id === id ? { ...t, name } : t),
        })),

      resetCardData: () =>
        set({ cardData: { ...DEFAULT_CARD_DATA, photos: DEFAULT_CARD_DATA.photos.map(p => ({ ...p })), blurRegions: [] } }),

      addBlurRegion: () =>
        set(s => {
          const newBlur: BlurRegion = {
            id: uuid(),
            x: 40,
            y: 40,
            width: 20,
            height: 20
          }
          return { cardData: { ...s.cardData, blurRegions: [...(s.cardData.blurRegions || []), newBlur] } }
        }),

      updateBlurRegion: (id, patch) =>
        set(s => ({
          cardData: {
            ...s.cardData,
            blurRegions: (s.cardData.blurRegions || []).map(b => b.id === id ? { ...b, ...patch } : b)
          }
        })),

      removeBlurRegion: (id) =>
        set(s => ({
          cardData: {
            ...s.cardData,
            blurRegions: (s.cardData.blurRegions || []).filter(b => b.id !== id)
          }
        })),
    }),
    {
      name: 'photocard-studio-v1',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      merge: (persistedState: any, currentState: Store) => {
        if (!persistedState) return currentState
        
        const parsed = persistedState as Partial<Store>
        const customTemplates = (parsed.templates || []).filter((t: Template) => !t.isBuiltIn)
        
        // Ensure any new built-in templates are added if they were missing in old localstorage
        const templates = [...BUILT_IN_TEMPLATES]
        
        // Only add custom ones that don't collide by ID
        customTemplates.forEach(ct => {
          if (!templates.find(t => t.id === ct.id)) {
            templates.push(ct)
          }
        })

        return {
          ...currentState,
          ...parsed,
          templates,
          _hasHydrated: true // It's hydrated now
        }
      }
    }
  )
)

export const useActiveTemplate = () => {
  const { templates, activeTemplateId } = useStore()
  return templates.find(t => t.id === activeTemplateId) ?? templates[0]
}
