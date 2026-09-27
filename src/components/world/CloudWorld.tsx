import React, { useRef, useEffect, useCallback, useState, useLayoutEffect } from 'react'
import type { WorldConfig } from '../../data/world'
import { computerRegions } from '../../data/computer'
import CloudLayer from './CloudLayer'
import FloatingPlatform from './FloatingPlatform'
import ComputerHero from './ComputerHero'
import './CloudWorld.css'

type SceneState = 'world' | 'entering-computer' | 'computer' | 'exiting-computer'

interface CloudWorldProps {
  config: WorldConfig
  sceneState: SceneState
  onEnterComputer: () => void
  onTransitionComplete: () => void
  onExitComplete?: () => void
  reducedMotion: boolean
}

const CloudWorld: React.FC<CloudWorldProps> = ({ config, sceneState, onEnterComputer, onTransitionComplete, onExitComplete, reducedMotion }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const [crtScreenCenter, setCrtScreenCenter] = useState({ x: 50, y: 50 })
  const [crtScreenSize, setCrtScreenSize] = useState({ width: 0, height: 0 })
  const transitionStartRef = useRef<number | null>(null)
  const transitionRafRef = useRef<number | null>(null)
  const [isExiting, setIsExiting] = useState(false)
  void isExiting // used in exit transition effect

  // Cinematic transition duration (ms)
  const TRANSITION_DURATION = 1200
  // Easing: ease-in with slight acceleration (smoothstep)
  const easeInCinematic = (t: number): number => t * t * (3 - 2 * t)
  // Easing for exit: ease-out with slight deceleration
  const easeOutCinematic = (t: number): number => 1 - (1 - t) * (1 - t) * (3 - 2 * (1 - t))

  // Trigger transition when sceneState changes to 'entering-computer'
  useEffect(() => {
    if (sceneState !== 'entering-computer') return

    const container = containerRef.current
    if (!container) return

    const startTime = performance.now()
    transitionStartRef.current = startTime

    const animateTransition = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / TRANSITION_DURATION, 1)
      const easedProgress = easeInCinematic(progress)

      // Compute camera transform: scale and translate so CRT screen fills viewport
      const targetScaleX = crtScreenSize.width > 0 ? 100 / crtScreenSize.width : 1
      const targetScaleY = crtScreenSize.height > 0 ? 100 / crtScreenSize.height : 1
      const targetScale = Math.max(targetScaleX, targetScaleY) * 1.05

      const currentScale = 1 + (targetScale - 1) * easedProgress
      const translateX = (50 - crtScreenCenter.x) * easedProgress
      const translateY = (50 - crtScreenCenter.y) * easedProgress

      container.style.transform = `translate(${translateX}%, ${translateY}%) scale(${currentScale})`
      container.style.transformOrigin = `${crtScreenCenter.x}% ${crtScreenCenter.y}%`
      container.style.setProperty('--camera-progress', easedProgress.toString())
      container.style.setProperty('--camera-progress-raw', progress.toString())

      if (progress < 1) {
        transitionRafRef.current = requestAnimationFrame(animateTransition)
      } else {
        container.style.transform = `translate(${50 - crtScreenCenter.x}%, ${50 - crtScreenCenter.y}%) scale(${targetScale})`
        container.style.transformOrigin = `${crtScreenCenter.x}% ${crtScreenCenter.y}%`
        onTransitionComplete()
        transitionStartRef.current = null
        transitionRafRef.current = null
      }
    }

    if (reducedMotion) {
      const targetScaleX = crtScreenSize.width > 0 ? 100 / crtScreenSize.width : 1
      const targetScaleY = crtScreenSize.height > 0 ? 100 / crtScreenSize.height : 1
      const targetScale = Math.max(targetScaleX, targetScaleY) * 1.05
      container.style.transform = `translate(${50 - crtScreenCenter.x}%, ${50 - crtScreenCenter.y}%) scale(${targetScale})`
      container.style.transformOrigin = `${crtScreenCenter.x}% ${crtScreenCenter.y}%`
      container.style.setProperty('--camera-progress', '1')
      container.style.setProperty('--camera-progress-raw', '1')
      onTransitionComplete()
      transitionStartRef.current = null
    } else {
      transitionRafRef.current = requestAnimationFrame(animateTransition)
    }

    return () => {
      if (transitionRafRef.current) {
        cancelAnimationFrame(transitionRafRef.current)
        transitionRafRef.current = null
      }
    }
  }, [sceneState, reducedMotion, crtScreenCenter, crtScreenSize, onTransitionComplete])

  // Trigger exit transition when sceneState changes to 'exiting-computer'
  useEffect(() => {
    if (sceneState !== 'exiting-computer') return

    const container = containerRef.current
    if (!container) return

    setIsExiting(true)
    const startTime = performance.now()
    transitionStartRef.current = startTime

    const animateExitTransition = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / TRANSITION_DURATION, 1)
      const easedProgress = easeOutCinematic(progress)

      // Reverse camera transform: scale back to 1, translate back to 0
      const targetScaleX = crtScreenSize.width > 0 ? 100 / crtScreenSize.width : 1
      const targetScaleY = crtScreenSize.height > 0 ? 100 / crtScreenSize.height : 1
      const targetScale = Math.max(targetScaleX, targetScaleY) * 1.05

      const currentScale = targetScale + (1 - targetScale) * easedProgress
      const translateX = (50 - crtScreenCenter.x) * (1 - easedProgress)
      const translateY = (50 - crtScreenCenter.y) * (1 - easedProgress)

      container.style.transform = `translate(${translateX}%, ${translateY}%) scale(${currentScale})`
      container.style.transformOrigin = `${crtScreenCenter.x}% ${crtScreenCenter.y}%`
      container.style.setProperty('--camera-progress', (1 - easedProgress).toString())
      container.style.setProperty('--camera-progress-raw', (1 - progress).toString())

      if (progress < 1) {
        transitionRafRef.current = requestAnimationFrame(animateExitTransition)
      } else {
        // Reset transform completely
        container.style.transform = 'none'
        container.style.transformOrigin = 'center center'
        container.style.setProperty('--camera-progress', '0')
        container.style.setProperty('--camera-progress-raw', '0')
        setIsExiting(false)
        onExitComplete?.()
        transitionStartRef.current = null
        transitionRafRef.current = null
      }
    }

    if (reducedMotion) {
      container.style.transform = 'none'
      container.style.transformOrigin = 'center center'
      container.style.setProperty('--camera-progress', '0')
      container.style.setProperty('--camera-progress-raw', '0')
      setIsExiting(false)
      onExitComplete?.()
      transitionStartRef.current = null
    } else {
      transitionRafRef.current = requestAnimationFrame(animateExitTransition)
    }

    return () => {
      if (transitionRafRef.current) {
        cancelAnimationFrame(transitionRafRef.current)
        transitionRafRef.current = null
      }
    }
  }, [sceneState, reducedMotion, crtScreenCenter, crtScreenSize, onExitComplete])

  // Calculate CRT screen metrics
  const calculateCrtScreenMetrics = useCallback(() => {
    const container = containerRef.current
    if (!container) return { center: { x: 50, y: 50 }, size: { width: 0, height: 0 } }

    const rect = container.getBoundingClientRect()
    const computerEl = container.querySelector('.computer-hero')
    const computerRect = computerEl?.getBoundingClientRect()
    if (!computerRect) return { center: { x: 50, y: 50 }, size: { width: 0, height: 0 } }

    const polygon = computerRegions.screenPolygon
    const centerX = (polygon.topLeft.x + polygon.topRight.x + polygon.bottomRight.x + polygon.bottomLeft.x) / 4
    const centerY = (polygon.topLeft.y + polygon.topRight.y + polygon.bottomRight.y + polygon.bottomLeft.y) / 4

    const screenLeft = Math.min(polygon.topLeft.x, polygon.bottomLeft.x)
    const screenRight = Math.max(polygon.topRight.x, polygon.bottomRight.x)
    const screenTop = Math.min(polygon.topLeft.y, polygon.topRight.y)
    const screenBottom = Math.max(polygon.bottomLeft.y, polygon.bottomRight.y)
    const screenWidthNorm = screenRight - screenLeft
    const screenHeightNorm = screenBottom - screenTop

    const viewportCenterX = ((computerRect.left - rect.left) / rect.width + (computerRect.width / rect.width) * centerX) * 100
    const viewportCenterY = ((computerRect.top - rect.top) / rect.height + (computerRect.height / rect.height) * centerY) * 100
    const viewportWidth = (computerRect.width / rect.width) * screenWidthNorm * 100
    const viewportHeight = (computerRect.height / rect.height) * screenHeightNorm * 100

    return {
      center: { x: viewportCenterX, y: viewportCenterY },
      size: { width: viewportWidth, height: viewportHeight },
    }
  }, [])

  useLayoutEffect(() => {
    const updateMetrics = () => {
      const metrics = calculateCrtScreenMetrics()
      setCrtScreenCenter(metrics.center)
      setCrtScreenSize(metrics.size)
    }
    updateMetrics()
    window.addEventListener('resize', updateMetrics)
    return () => window.removeEventListener('resize', updateMetrics)
  }, [calculateCrtScreenMetrics])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    mouseRef.current = {
      x: (e.clientX - rect.left - centerX) / centerX,
      y: (e.clientY - rect.top - centerY) / centerY,
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!containerRef.current || e.touches.length === 0) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    mouseRef.current = {
      x: (e.touches[0].clientX - rect.left - centerX) / centerX,
      y: (e.touches[0].clientY - rect.top - centerY) / centerY,
    }
  }, [])

  // Parallax animation loop (only in 'world' state)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const maxOffset = config.parallax.maxOffset
    const smoothing = config.parallax.smoothing

    const animate = () => {
      if (sceneState !== 'world') return

      const targetX = mouseRef.current.x * maxOffset
      const targetY = mouseRef.current.y * maxOffset

      currentRef.current.x += (targetX - currentRef.current.x) * smoothing
      currentRef.current.y += (targetY - currentRef.current.y) * smoothing

      setParallax({
        x: currentRef.current.x,
        y: currentRef.current.y,
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        currentRef.current = { x: 0, y: 0 }
        setParallax({ x: 0, y: 0 })
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
      }
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!reducedMotion && sceneState === 'world') {
      rafRef.current = requestAnimationFrame(animate)
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('touchmove', handleTouchMove, { passive: true })
    }

    motionQuery.addEventListener('change', handleMotionChange)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('touchmove', handleTouchMove)
      motionQuery.removeEventListener('change', handleMotionChange)
    }
  }, [config.parallax.maxOffset, config.parallax.smoothing, reducedMotion, handleMouseMove, handleTouchMove, sceneState])

  // Interaction hint visibility: show in world state, fade during transition
  const showHint = sceneState === 'world'

  // Render world scene
  const renderWorld = () => (
    <>
      <img
        src={config.sky.src}
        alt={config.sky.alt}
        className="cloud-world__sky"
        draggable={false}
      />
      {config.layers.map((layer) => (
        <CloudLayer
          key={layer.name}
          clouds={layer.clouds}
          parallaxFactor={layer.parallaxFactor}
          parallaxX={parallax.x}
          parallaxY={parallax.y}
        />
      ))}
      <FloatingPlatform
        src={config.platform.src}
        alt={config.platform.alt}
        x={config.platform.x}
        y={config.platform.y}
        width={config.platform.width}
        zIndex={config.platform.zIndex}
      />
      <ComputerHero
        src={config.computer.src}
        alt={config.computer.alt}
        x={config.computer.x}
        y={config.computer.y}
        width={config.computer.width}
        zIndex={config.computer.zIndex}
        onEnterComputer={onEnterComputer}
      />
      {showHint && (
        <div
          className="cloud-world__hint"
          aria-hidden="true"
          style={{
            left: `calc(${config.computer.x} + ${config.computer.width} * 0.85)`,
            top: `calc(${config.computer.y} - ${config.computer.width} * 0.15)`,
            transform: 'translateX(-50%)',
          } as React.CSSProperties}
        >
          psst... the screen works.
        </div>
      )}
    </>
  )

  return (
    <div
      className={`cloud-world ${sceneState !== 'world' ? 'cloud-world--transitioning' : ''} ${sceneState === 'exiting-computer' ? 'cloud-world--exiting' : ''}`}
      ref={containerRef}
      style={{
        '--crt-screen-center-x': `${crtScreenCenter.x}%`,
        '--crt-screen-center-y': `${crtScreenCenter.y}%`,
      } as React.CSSProperties}
    >
      {renderWorld()}
    </div>
  )
}

export default CloudWorld
