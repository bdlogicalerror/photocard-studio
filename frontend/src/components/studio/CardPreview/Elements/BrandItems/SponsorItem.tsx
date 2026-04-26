'use client'
import React from 'react'
import { CardData, BrandItemStyle } from '@/lib/types'
import { UniversalBadge } from '../UniversalBadge'

interface SponsorItemProps {
  id: string
  label: string
  defaultIcon?: string
  dataKey: keyof CardData
  style?: Partial<BrandItemStyle>
  focusTarget?: string
}

export function SponsorItem(props: SponsorItemProps) {
  return <UniversalBadge {...props} />
}
