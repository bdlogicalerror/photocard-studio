import React from 'react'
import { CardData, BrandItemStyle } from '@/lib/types'
import { UniversalBadge } from '../UniversalBadge'
import { useStore } from '@/store/useStore'

interface DateItemProps {
  id: string
  label: string
  defaultIcon?: string
  dataKey: keyof CardData
  style?: Partial<BrandItemStyle>
  focusTarget?: string
  popupPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export function DateItem(props: DateItemProps) {
  const { cardData, updateCardData } = useStore()

  // Ensure the date is populated on mount if it's empty
  React.useEffect(() => {
    if (!cardData[props.dataKey]) {
      updateCardData({
        [props.dataKey]: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
      })
    }
  }, [cardData[props.dataKey], props.dataKey, updateCardData])

  const handleOpen = () => {
    const currentValue = cardData[props.dataKey] as string
    if (!currentValue || currentValue.trim() === '') {
      updateCardData({
        [props.dataKey]: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
      })
    }
  }

  return <UniversalBadge {...props} onSettingsOpen={handleOpen} />
}
