/**
 * Art Direction Tokens
 *
 * Structured constants derived from ART_BIBLE.md.
 * These are available for use in components, asset generation prompts,
 * and future tooling.
 */

export const artDirection = {
  style: 'cozy-retro-computing' as const,
  rendering: 'hand-illustrated-2d' as const,
  tone: ['whimsical', 'nostalgic', 'tactile', 'warm', 'slightly-quirky'] as const,

  palette: {
    sky: '#9ec5d4',
    skyDeep: '#7ba7b8',
    cloud: '#f7f5f0',
    cloudShadow: '#e8e4dc',
    computerBody: '#e8e0d4',
    computerBodyDark: '#d4ccc0',
    accent: '#e07a5f',
    accentHover: '#c96a52',
    plant: '#8fbc8f',
    plantDark: '#6b9b6b',
    wood: '#c4a882',
    woodDark: '#a08a6c',
    mug: '#f5f0e8',
    text: '#2d2a26',
    muted: '#8a8580',
    windowBg: '#faf9f6',
    windowBorder: '#d4cfc7',
  } as const,

  lighting: {
    type: 'soft-diffused-overhead' as const,
    shadowColor: 'rgba(45, 42, 38, 0.08)',
    shadowBlur: 'soft',
    highlightIntensity: 'gentle' as const,
  } as const,

  line: {
    color: '#5c5650',
    weightRange: '1px – 3px',
    quality: 'hand-drawn-variable' as const,
  } as const,

  texture: {
    overlay: 'subtle-paper' as const,
    intensity: 'low' as const,
  } as const,

  shape: {
    language: 'organic-rounded' as const,
    cornerStyle: 'soft' as const,
    asymmetry: 'welcome-in-decorative-elements' as const,
  } as const,

  computer: {
    form: 'chunky-all-in-one' as const,
    bodyColor: 'cream-beige' as const,
    bezel: 'thick' as const,
    stickers: 'tasteful-quirky' as const,
    screenGlow: 'soft-warm' as const,
  } as const,

  cloud: {
    form: 'pillowy-illustrated' as const,
    layering: 'depth-through-opacity' as const,
    edgeStyle: 'soft' as const,
  } as const,

  props: {
    plants: 'simple-illustrated' as const,
    mug: 'chunky-ceramic' as const,
    books: 'cream-covered' as const,
    lamp: 'friendly-desk' as const,
    cable: 'single-trailing' as const,
  } as const,

  character: {
    style: 'simple-rounded-expressive' as const,
    movement: 'bouncy-playful' as const,
  } as const,

  ui: {
    relationship: 'emerges-from-world' as const,
    windowChrome: 'warm-gray-soft-shadow' as const,
    iconStyle: 'hand-drawn-inspired' as const,
  } as const,

  game: {
    style: 'hand-crafted-paper-or-pocket' as const,
    paletteConstraint: 'warm-limited' as const,
  } as const,

  mustPreserve: [
    'warm-cream-beige-teal foundation',
    'hand-illustrated slightly imperfect line quality',
    'soft diffused lighting with warm shadows',
    'subtle paper/canvas texture overlay',
    'chunky friendly proportions for major objects',
    'organic pillowy shapes for clouds and nature',
    'quirky personal details (stickers, small props)',
    'cozy nostalgic whimsical emotional tone',
    'consistent visual hierarchy',
  ] as const,

  mustAvoid: [
    'pure black lines or pure white backgrounds',
    'harsh gradients neon colors or clinical palettes',
    'photorealistic textures or 3D rendering',
    'generic SaaS or landing-page illustration style',
    'flat lifeless vector art without texture',
    'overly detailed or cluttered compositions',
    'sharp aggressive or cold visual tones',
    'copying existing game or software visual identities',
    'inconsistent line weights or color temperatures',
    'excessive rounded corners on everything',
  ] as const,
} as const

export type ArtDirection = typeof artDirection
