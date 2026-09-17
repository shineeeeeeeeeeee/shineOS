import React, { useState, useCallback, useRef, useEffect } from 'react'
import { computerRegions, SHOW_CRT_HITBOX_DEBUG, type CrtCurvature, type NormalizedPoint } from '../../data/computer'
import './ComputerScreenTarget.css'

interface ComputerScreenTargetProps {
  onEnter?: () => void
}

/**
 * Builds an SVG path for the curved CRT glass shape.
 * Uses gentle cubic Bezier curves between the four corner points
 * to approximate the organic CRT glass silhouette.
 *
 * Curvature is controlled by computerRegions.crtCurvature.
 */
function buildCrtPath(
  topLeft: NormalizedPoint,
  topRight: NormalizedPoint,
  bottomRight: NormalizedPoint,
  bottomLeft: NormalizedPoint,
  curvature: CrtCurvature
): string {
  // Scale to 0-100 viewBox coordinates
  const tl = { x: topLeft.x * 100, y: topLeft.y * 100 }
  const tr = { x: topRight.x * 100, y: topRight.y * 100 }
  const br = { x: bottomRight.x * 100, y: bottomRight.y * 100 }
  const bl = { x: bottomLeft.x * 100, y: bottomLeft.y * 100 }

  // Edge midpoints with curvature offsets
  const topMid = {
    x: (tl.x + tr.x) / 2,
    y: (tl.y + tr.y) / 2 - curvature.topBow * 1.5,
  }
  const rightMid = {
    x: (tr.x + br.x) / 2 + curvature.rightConvex * 0.8,
    y: (tr.y + br.y) / 2,
  }
  const bottomMid = {
    x: (br.x + bl.x) / 2,
    y: (br.y + bl.y) / 2 + curvature.bottomBow * 1.5,
  }
  const leftMid = {
    x: (bl.x + tl.x) / 2 - curvature.leftConvex * 0.8,
    y: (bl.y + tl.y) / 2,
  }

  // Smooth path with cubic Bezier curves
  return [
    `M ${tl.x} ${tl.y}`,
    // Top edge (TL -> TR)
    `C ${topMid.x} ${tl.y - curvature.topBow * 0.6}, ${topMid.x} ${tr.y - curvature.topBow * 0.6}, ${tr.x} ${tr.y}`,
    // Right edge (TR -> BR)
    `C ${tr.x + curvature.rightConvex * 0.5} ${rightMid.y}, ${br.x + curvature.rightConvex * 0.5} ${rightMid.y}, ${br.x} ${br.y}`,
    // Bottom edge (BR -> BL)
    `C ${bottomMid.x} ${br.y + curvature.bottomBow * 0.6}, ${bottomMid.x} ${bl.y + curvature.bottomBow * 0.6}, ${bl.x} ${bl.y}`,
    // Left edge (BL -> TL)
    `C ${bl.x - curvature.leftConvex * 0.5} ${leftMid.y}, ${tl.x - curvature.leftConvex * 0.5} ${leftMid.y}, ${tl.x} ${tl.y}`,
    'Z',
  ].join(' ')
}

const ComputerScreenTarget: React.FC<ComputerScreenTargetProps> = ({ onEnter }) => {
  const [isActivating, setIsActivating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const polygon = computerRegions.screenPolygon
  const curvature = computerRegions.crtCurvature
  const crtPath = buildCrtPath(
    polygon.topLeft,
    polygon.topRight,
    polygon.bottomRight,
    polygon.bottomLeft,
    curvature
  )

  // Read transition progress from parent container's CSS custom property
  useEffect(() => {
    const container = containerRef.current?.closest('.cloud-world')
    if (!container) return

    const updateProgress = () => {
      const progress = parseFloat(getComputedStyle(container).getPropertyValue('--camera-progress') || '0')
      setTransitionProgress(progress)
    }

    // Initial read
    updateProgress()

    // Poll for progress updates during transition
    const interval = setInterval(updateProgress, 16) // ~60fps
    return () => clearInterval(interval)
  }, [])

  const handleClick = useCallback(() => {
    if (isActivating) return
    setIsActivating(true)
    onEnter?.()
    // Keep activating state for the power-on flash duration
    setTimeout(() => setIsActivating(false), 500)
  }, [isActivating, onEnter])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClick()
      }
    },
    [handleClick]
  )

  // Determine visual state: transition progress takes precedence during entry
  const isTransitioning = transitionProgress > 0
  const effectiveProgress = isTransitioning ? transitionProgress : (isActivating ? 1 : isHovered || isFocused ? 0.3 : 0)

  const stateClass = isActivating
    ? 'crt-hitbox__overlay--activating'
    : isHovered || isFocused
    ? 'crt-hitbox__overlay--awake'
    : ''

  return (
    <div
      ref={containerRef}
      className={`crt-hitbox ${SHOW_CRT_HITBOX_DEBUG ? 'crt-hitbox--debug' : ''} ${isTransitioning ? 'crt-hitbox--transitioning' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--crt-effect-progress': effectiveProgress.toString(),
      } as React.CSSProperties}
    >
      <button
        type="button"
        className="crt-hitbox__button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label="Enter Shine's computer"
      />
      <svg
        className={`crt-hitbox__overlay ${stateClass}`}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="crt-glass-clip" clipPathUnits="objectBoundingBox">
            <path
              d={crtPath}
              transform="scale(0.01)"
              fillRule="evenodd"
            />
          </clipPath>
          {/* Scanline pattern */}
          <pattern id="scanline-pattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="4" y2="0" stroke="rgba(140,200,200,0.3)" stroke-width="1" />
          </pattern>
          {/* Bloom radial gradient */}
          <radialGradient id="crt-bloom-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(140,200,220,0.18)" />
            <stop offset="70%" stopColor="rgba(140,200,220,0)" />
          </radialGradient>
        </defs>
        <g clipPath="url(#crt-glass-clip)">
          {/* Base subtle illumination */}
          <rect x="0" y="0" width="100" height="100" className="crt-hitbox__illumination" />
          {/* Scanline pattern */}
          <rect x="0" y="0" width="100" height="100" className="crt-hitbox__scanlines" />
          {/* Glass reflection highlight */}
          <ellipse cx="35" cy="25" rx="20" ry="8" className="crt-hitbox__reflection" />
          {/* Transition bloom effect */}
          <ellipse cx="50" cy="50" rx="45" ry="45" className="crt-hitbox__bloom" />
        </g>
      </svg>
    </div>
  )
}

export default ComputerScreenTarget
