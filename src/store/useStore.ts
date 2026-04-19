// src/store/useStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import {
  Template, CardData, TemplateStyle, PhotoSlot,
  BUILT_IN_TEMPLATES, DEFAULT_CARD_DATA, DEFAULT_STYLE
} from '@/lib/types'

type Store = {
  templates: Template[]
  activeTemplateId: string
  cardData: CardData

  setActiveTemplate: (id: string) => void
  updateCardData: (patch: Partial<CardData>) => void
  updatePhoto: (idx: number, patch: Partial<PhotoSlot>) => void
  updateStyle: (patch: Partial<TemplateStyle>) => void
  addTemplate: (t: Omit<Template, 'id'>) => void
  duplicateTemplate: (id: string) => void
  deleteTemplate: (id: string) => void
  renameTemplate: (id: string, name: string) => void
  resetCardData: () => void
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      templates: BUILT_IN_TEMPLATES,
      activeTemplateId: BUILT_IN_TEMPLATES[0].id,
      cardData: { ...DEFAULT_CARD_DATA, photos: DEFAULT_CARD_DATA.photos.map(p => ({ ...p })) },

      setActiveTemplate: (id) => set({ activeTemplateId: id }),

      updateCardData: (patch) =>
        set(s => ({ cardData: { ...s.cardData, ...patch } })),

      updatePhoto: (idx, patch) =>
        set(s => {
          const photos = [...s.cardData.photos]
          photos[idx] = { ...photos[idx], ...patch }
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
        set({ cardData: { ...DEFAULT_CARD_DATA, photos: DEFAULT_CARD_DATA.photos.map(p => ({ ...p })) } }),
    }),
    {
      name: 'photocard-studio-v1',
      merge: (persistedState: any, currentState: Store) => {
        // Ensure new BUILT_IN_TEMPLATES are always included, preserving custom user templates
        const parsed = persistedState as Store
        const customTemplates = (parsed?.templates || []).filter((t: Template) => !t.isBuiltIn)
        return {
          ...currentState,
          ...parsed,
          templates: [...BUILT_IN_TEMPLATES, ...customTemplates],
        }
      }
    }
  )
)

export const useActiveTemplate = () => {
  const { templates, activeTemplateId } = useStore()
  return templates.find(t => t.id === activeTemplateId) ?? templates[0]
}
