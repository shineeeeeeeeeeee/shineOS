/**
 * Computer Semantic Regions & CRT Geometry
 *
 * Defines normalized coordinate regions and configuration for the
 * computer asset. Coordinates are in 0–1 range (relative to intrinsic
 * image dimensions) so they can be scaled to any display size.
 *
 * Image: public/assets/working/computer/computer-master.png
 * Intrinsic size: 1312 × 1199
 */

export interface NormalizedPoint {
  x: number
  y: number
}

export interface NormalizedRect {
  x: number
  y: number
  width: number
  height: number
}

export interface ScreenPolygon {
  topLeft: NormalizedPoint
  topRight: NormalizedPoint
  bottomRight: NormalizedPoint
  bottomLeft: NormalizedPoint
}

export interface CrtCurvature {
  /** Bow intensity for top edge (0-1). Higher = more curved. */
  topBow: number
  /** Bow intensity for bottom edge (0-1). */
  bottomBow: number
  /** Convex curve for left edge (0-1). */
  leftConvex: number
  /** Convex curve for right edge (0-1). */
  rightConvex: number
  /** Corner radius approximation (0-1). */
  cornerRadius: number
}

export interface ComputerRegions {
  overall: NormalizedRect
  monitor: NormalizedRect
  screen: NormalizedRect
  screenPolygon: ScreenPolygon
  crtCurvature: CrtCurvature
}

/**
 * Screen bounds for the cinematic zoom target and interaction.
 *
 * The screenPolygon defines the actual dark CRT glass area as a
 * four-point quadrilateral that follows the perspective tilt of the screen.
 * The crtCurvature controls how the SVG path curves between corners
 * to approximate the organic CRT glass silhouette.
 *
 * Coordinates are slightly inset from the visible glass edges to ensure
 * the cream bezel is never clickable.
 */
export const computerRegions: ComputerRegions = {
  overall: {
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  },
  monitor: {
    x: 0.12,
    y: 0.06,
    width: 0.76,
    height: 0.58,
    // height: 0.58,
  },
  screen: {
    x: 0.18,
    y: 0.12,
    width: 0.64,
    height: 0.46,
  },
  screenPolygon: {
    topLeft: { x: 0.30, y: 0.10 },
    topRight: { x: 0.63, y: 0.12 },
    bottomRight: { x: 0.62, y: 0.44 },
    bottomLeft: { x: 0.28, y: 0.40 },
  },

  crtCurvature: {
    topBow: 0.6,
    bottomBow: 0.6,
    leftConvex: 0.3,
    rightConvex: 0.3,
    cornerRadius: 0.8,
  },
}

/**
 * Development-only debug constant.
 * When true, shows a red overlay visualizing the CRT hitbox.
 * SET TO false FOR PRODUCTION.
 */
export const SHOW_CRT_HITBOX_DEBUG = false

export const computerMeta = {
  intrinsicWidth: 1312,
  intrinsicHeight: 1199,
  assetPath: '/assets/working/computer/computer-master.png',
  role: 'hero-computer',
} as const


// rgba(140, 200, 200, 0.12)
// rgba(160, 220, 220, 0.25)