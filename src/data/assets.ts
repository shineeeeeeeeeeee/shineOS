/**
 * Asset Manifest
 *
 * Central registry of production assets.
 * Add new assets here as they are finalized.
 */

export interface AssetDefinition {
  src: string
  type: 'image' | 'svg' | 'audio' | 'font'
  role: string
  description: string
  intrinsicWidth?: number
  intrinsicHeight?: number
}

export const assets = {
  computer: {
    src: '/assets/working/computer/computer-master.png',
    type: 'image' as const,
    role: 'hero-computer',
    description:
      'Final hero computer artwork. Vintage cream/beige chunky all-in-one with stickers, screen glow, and soft shadows. Used as the primary interactive object in the cloud world.',
    intrinsicWidth: 1312,
    intrinsicHeight: 1199,
  } satisfies AssetDefinition,
} as const

export type AssetKey = keyof typeof assets
