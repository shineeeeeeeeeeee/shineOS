import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useWindowManager } from './WindowManager'
import { getApplicationById, applications } from '../../data/applications'
import PlaceholderWindow from './PlaceholderWindow'
import './Dock.css'

export interface DockApp {
  id: string
  name: string
  icon: React.ReactNode
}

interface DockProps {
  reducedMotion?: boolean
}

function getDockIcon(id: string): React.ReactNode {
  switch (id) {
    case 'files':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      )
    case 'browser':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      )
    case 'projects':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      )
    case 'about':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
        </svg>
      )
    case 'experience':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      )
    case 'skills':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      )
    case 'resume':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
      )
    case 'contact':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
        </svg>
      )
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 14.68 15a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      )
    default:
      return null
  }
}

const DOCK_APPS: DockApp[] = applications.map((app) => ({
  id: app.id,
  name: app.name,
  icon: getDockIcon(app.id),
}))

// Centralized Dock configuration. Everything visual is derived from these.
const DOCK_CONFIG = {
  baseIconSize: 48,
  maxScale: 1.65,
  influenceRadius: 150,
  spacing: 8,
  lift: 6,
  springStiffness: 180,
  springDamping: 22,
}

const Dock: React.FC<DockProps> = ({ reducedMotion = false }) => {
  const { windows, openWindow, focusWindow } = useWindowManager()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const dockRef = useRef<HTMLDivElement>(null)
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const rafRef = useRef<number | null>(null)
  // Mirrors `hoveredId` for the animation loop, so the label can be repositioned
  // every frame without a React render.
  const hoveredIdRef = useRef<string | null>(null)
  // Single label element for the whole Dock, parked above the magnified icons.
  const labelRef = useRef<HTMLSpanElement>(null)

  const rawPointerXRef = useRef<number | null>(null)
  const pointerAnchorXRef = useRef<number | null>(null)
  const pointerInDockRef = useRef(false)
  const springs = useRef<
    Record<string, { scale: number; v: number; lift: number; vl: number }>
  >({})
  const baseCenters = useRef<Record<string, number>>({})
  const baseWidths = useRef<Record<string, number>>({})
  // Untransformed (layout) box of every Dock item, in Dock-local coordinates.
  // Used only to describe the occupied icon region for the capsule.
  const itemBoxes = useRef<
    Record<string, { left: number; top: number; width: number; height: number }>
  >({})
  // Last committed composition per item. Shared by the icon transforms and the
  // capsule so both always describe the exact same geometry.
  const composition = useRef<
    Record<string, { shift: number; scale: number; lift: number }>
  >({})
  const dockMetrics = useRef({
    padLeft: 0,
    padTop: 0,
    padRight: 0,
    padBottom: 0,
    borderLeft: 0,
    borderTop: 0,
  })
  // Resting (un-magnified) capsule box. The capsule is a fixed-height strip:
  // only its horizontal extent is allowed to respond to the magnified composition.
  const restingBackground = useRef({ y: 0, height: 0 })
  // Dock's border-box top in viewport space, used to keep the label on screen.
  const dockViewportTop = useRef(0)
  // Label height, sampled once per hover change (never per frame) so the
  // viewport clamp below can keep the whole label inside the screen.
  const labelHeight = useRef(0)
  const lastMeasure = useRef(0)

  // All registered applications are pinned, in registry order. Single source of truth.
  const pinnedApps = DOCK_APPS

  const minimizedWindows = windows
    .filter((w) => w.isMinimized)
    .map((w) => {
      const app = getApplicationById(w.id)
      return {
        id: w.id,
        title: w.title,
        icon: app ? getDockIcon(app.id) : undefined,
        name: app?.name || w.title,
      }
    })
    .sort((a, b) => a.id.localeCompare(b.id))

  const handleDockClick = useCallback((appId: string) => {
    const open = windows.find((w) => w.id === appId)
    if (open) {
      if (open.isMinimized) {
        openWindow({
          id: open.id,
          title: open.title,
          content: open.content,
          x: open.previousPosition?.x || 100,
          y: open.previousPosition?.y || 100,
          width: open.previousPosition?.width || open.width,
          height: open.previousPosition?.height || open.height,
          isMinimized: false,
          isMaximized: open.isMaximized,
          previousPosition: open.previousPosition,
        })
        focusWindow(appId)
      } else {
        focusWindow(appId)
      }
    } else {
      const app = getApplicationById(appId)
      openWindow({
        id: appId,
        title: app?.name || appId,
        content: <PlaceholderWindow title={app?.name || appId} />,
        x: 150,
        y: 150,
        width: app?.defaultWidth || 480,
        height: app?.defaultHeight || 360,
        isMinimized: false,
        isMaximized: false,
      })
    }
  }, [windows, openWindow, focusWindow])

  /**
   * Writes the capsule box as CSS variables. The capsule is a fixed-height
   * horizontal strip: its Y and height come from the resting (un-magnified)
   * layout measured once per layout pass, and only X and width follow the
   * magnified/displaced icon composition. Pure geometry — no second animation
   * system, no React state.
   */
  const applyDockBackground = useCallback(() => {
    const dockEl = dockRef.current
    if (!dockEl) return

    const boxes = itemBoxes.current
    const ids = Object.keys(boxes)
    if (ids.length === 0) return

    let left = Infinity
    let right = -Infinity

    for (const id of ids) {
      const box = boxes[id]
      const c = composition.current[id] ?? { shift: 0, scale: 1, lift: 0 }
      const centerX = box.left + box.width / 2 + c.shift
      const halfWidth = (box.width * c.scale) / 2

      if (centerX - halfWidth < left) left = centerX - halfWidth
      if (centerX + halfWidth > right) right = centerX + halfWidth
    }

    const metrics = dockMetrics.current
    const resting = restingBackground.current

    let x = left - metrics.padLeft - metrics.borderLeft
    let width = right + metrics.padRight - (left - metrics.padLeft)

    // Never let the strip grow past the viewport on narrow screens.
    const maxWidth = window.innerWidth - 16
    if (width > maxWidth && maxWidth > 0) {
      const center = x + width / 2
      width = maxWidth
      x = center - width / 2
    }

    dockEl.style.setProperty('--dock-bg-x', `${x.toFixed(2)}px`)
    dockEl.style.setProperty('--dock-bg-w', `${width.toFixed(2)}px`)
    dockEl.style.setProperty('--dock-bg-y', `${resting.y.toFixed(2)}px`)
    dockEl.style.setProperty('--dock-bg-h', `${resting.height.toFixed(2)}px`)
  }, [])

  /**
   * Moves the hover label. It rides the same loop as the icons: X follows the
   * hovered icon's displaced center, Y is derived from the topmost point of the
   * current composition so the label can never sit on top of a magnified glyph.
   */
  const applyDockLabel = useCallback(() => {
    const dockEl = dockRef.current
    if (!dockEl) return

    const metrics = dockMetrics.current
    const hovered = hoveredIdRef.current
    if (hovered) {
      const box = itemBoxes.current[hovered]
      // Falls back to the resting composition, which is the exact state under
      // reduced motion where the loop is not running.
      const c = composition.current[hovered] ?? { shift: 0, scale: 1, lift: 0 }
      if (box) {
        const centerX = box.left + box.width / 2 + c.shift
        const x = centerX - metrics.padLeft - metrics.borderLeft
        dockEl.style.setProperty('--dock-label-x', `${x.toFixed(2)}px`)
      }
    }

    let top = Infinity
    for (const id of Object.keys(itemBoxes.current)) {
      const box = itemBoxes.current[id]
      const c = composition.current[id] ?? { shift: 0, scale: 1, lift: 0 }
      const itemBottom = box.top + box.height - c.lift
      const itemTop = itemBottom - box.height * c.scale
      if (itemTop < top) top = itemTop
    }
    if (!isFinite(top)) return

    // Small constant gap between the label and the topmost icon of the frame.
    // Y is the label's bottom edge, so the body always clears the glyph.
    const gap = 10
    const y = top - gap - metrics.padTop - metrics.borderTop
    const minY = 6 + labelHeight.current - dockViewportTop.current
    dockEl.style.setProperty('--dock-label-y', `${Math.max(y, minY).toFixed(2)}px`)
  }, [])

  const measureSlots = useCallback(() => {
    const dockEl = dockRef.current
    if (!dockEl) return
    const dockRect = dockEl.getBoundingClientRect()
    const allIds = [
      ...pinnedApps.map((a) => a.id),
      ...minimizedWindows.map((w) => w.id),
      'trash',
    ]
    const measuredIds: string[] = []

    baseCenters.current = {}
    baseWidths.current = {}

    for (const id of allIds) {
      const slotEl = slotRefs.current[id]
      if (!slotEl) continue
      const r = slotEl.getBoundingClientRect()
      const center = r.left - dockRect.left + r.width / 2
      baseCenters.current[id] = center
      baseWidths.current[id] = r.width
      measuredIds.push(id)
    }

    // A center-to-center pitch is the stable normal slot footprint: width + gap.
    for (let index = 0; index < measuredIds.length - 1; index += 1) {
      const id = measuredIds[index]
      const nextId = measuredIds[index + 1]
      const pitch = baseCenters.current[nextId] - baseCenters.current[id]
      if (pitch > 0) baseWidths.current[id] = pitch
    }

    // Dock padding/border define the capsule padding around the icon region.
    const styles = window.getComputedStyle(dockEl)
    const px = (value: string) => parseFloat(value) || 0
    dockMetrics.current = {
      padLeft: px(styles.paddingLeft),
      padTop: px(styles.paddingTop),
      padRight: px(styles.paddingRight),
      padBottom: px(styles.paddingBottom),
      borderLeft: px(styles.borderLeftWidth),
      borderTop: px(styles.borderTopWidth),
    }

    // Items carry the magnification transform, so their rects are un-scaled
    // back to their layout box using the composition currently applied.
    const boxes: Record<
      string,
      { left: number; top: number; width: number; height: number }
    > = {}
    for (const id of measuredIds) {
      const itemEl = itemRefs.current[id]
      if (!itemEl) continue
      const r = itemEl.getBoundingClientRect()
      const c = composition.current[id] ?? { shift: 0, scale: 1, lift: 0 }
      const scale = Math.abs(c.scale) > 0.001 ? c.scale : 1
      const width = r.width / scale
      const height = r.height / scale
      const itemBottom = r.bottom + c.lift
      const left = r.left - c.shift - dockRect.left
      boxes[id] = {
        left,
        top: itemBottom - height - dockRect.top,
        width,
        height,
      }
    }
    itemBoxes.current = boxes

    // Resting capsule box: measured from the un-magnified layout boxes only.
    // Height and vertical position stay frozen here; hover only moves X/width.
    let restTop = Infinity
    let restBottom = -Infinity
    for (const id of measuredIds) {
      const box = itemBoxes.current[id]
      if (!box) continue
      if (box.top < restTop) restTop = box.top
      if (box.top + box.height > restBottom) restBottom = box.top + box.height
    }
    if (isFinite(restTop) && isFinite(restBottom)) {
      restingBackground.current = {
        y: restTop - dockMetrics.current.padTop - dockMetrics.current.borderTop,
        height:
          restBottom -
          restTop +
          dockMetrics.current.padTop +
          dockMetrics.current.padBottom,
      }
    }
    dockViewportTop.current = dockRect.top

    applyDockBackground()
    applyDockLabel()
    lastMeasure.current = performance.now()
  }, [pinnedApps, minimizedWindows, applyDockBackground, applyDockLabel])

  const startRaf = useCallback(() => {
    if (rafRef.current) return

    const loop = () => {
      const dockEl = dockRef.current
      if (!dockEl) {
        rafRef.current = null
        return
      }

      const now = performance.now()
      if (now - lastMeasure.current > 250) measureSlots()

      const pointerX = rawPointerXRef.current
      const dt = 0.016
      const { maxScale, influenceRadius, lift, springStiffness, springDamping } = DOCK_CONFIG
      const active = pointerInDockRef.current && !reducedMotion
      const allIds = [
        ...pinnedApps.map((a) => a.id),
        ...minimizedWindows.map((w) => w.id),
        'trash',
      ]
      const targetScales: Record<string, number> = {}
      const targetLifts: Record<string, number> = {}
      const renderedScales: Record<string, number> = {}
      const extraWidths: Record<string, number> = {}

      // Compute target scales from pointer distance using raised-cosine falloff.
      for (const id of allIds) {
        const slotEl = slotRefs.current[id]
        if (!slotEl) continue
        const center = baseCenters.current[id]
        if (center === undefined) continue

        let targetScale = 1
        let targetLift = 0
        if (active && pointerX !== null) {
          const distance = Math.abs(pointerX - center)
          const normalizedDistance = Math.min(distance / influenceRadius, 1)
          const influence = 0.5 + 0.5 * Math.cos(normalizedDistance * Math.PI)
          targetScale = 1 + influence * (maxScale - 1)
          targetLift = (targetScale - 1) * lift
        }

        const s = springs.current[id] ?? { scale: 1, v: 0, lift: 0, vl: 0 }
        const force = (targetScale - s.scale) * springStiffness
        s.v += force * dt
        s.v *= Math.exp(-springDamping * dt)
        s.scale += s.v * dt

        const lforce = (targetLift - s.lift) * springStiffness
        s.vl += lforce * dt
        s.vl *= Math.exp(-springDamping * dt)
        s.lift += s.vl * dt

        springs.current[id] = s
        targetScales[id] = targetScale
        targetLifts[id] = targetLift
        renderedScales[id] = s.scale
        extraWidths[id] = Math.max(0, (baseWidths.current[id] ?? 0) * (s.scale - 1))
      }

      const orderedIds = allIds.filter(
        (id) =>
          baseCenters.current[id] !== undefined &&
          baseWidths.current[id] !== undefined,
      )
      // Share each adjacent pair's rendered extra width so neighboring slots make room.
      const cumulativeShifts: Record<string, number> = {}
      let accumulatedExtraWidth = 0

      for (let index = 0; index < orderedIds.length; index += 1) {
        const id = orderedIds[index]
        if (index === 0) {
          cumulativeShifts[id] = 0
          continue
        }

        const previousId = orderedIds[index - 1]
        accumulatedExtraWidth +=
          ((extraWidths[previousId] ?? 0) + (extraWidths[id] ?? 0)) / 2
        cumulativeShifts[id] = accumulatedExtraWidth
      }

      const pointerAnchorX = pointerAnchorXRef.current
      let anchorShift = 0
      // Interpolate the anchor between stable centers so the field follows the cursor continuously.
      if (pointerAnchorX !== null && orderedIds.length > 0) {
        let leftIndex = 0
        for (let index = 0; index < orderedIds.length - 1; index += 1) {
          const center = baseCenters.current[orderedIds[index]] ?? 0
          const nextCenter = baseCenters.current[orderedIds[index + 1]] ?? center
          if (pointerAnchorX <= nextCenter) {
            leftIndex = index
            break
          }
          leftIndex = index + 1
        }

        const rightIndex = Math.min(leftIndex + 1, orderedIds.length - 1)
        const leftId = orderedIds[leftIndex]
        const rightId = orderedIds[rightIndex]
        const leftCenter = baseCenters.current[leftId] ?? 0
        const rightCenter = baseCenters.current[rightId] ?? leftCenter
        const anchorT =
          rightCenter > leftCenter
            ? Math.max(
                0,
                Math.min(
                  1,
                  (pointerAnchorX - leftCenter) / (rightCenter - leftCenter),
                ),
              )
            : 0
        const leftShift = cumulativeShifts[leftId] ?? 0
        const rightShift = cumulativeShifts[rightId] ?? leftShift
        anchorShift = leftShift + (rightShift - leftShift) * anchorT
      }

      const neighborShifts: Record<string, number> = {}
      for (const id of allIds) {
        neighborShifts[id] = (cumulativeShifts[id] ?? 0) - anchorShift
      }

      let anyMoving = false
      for (const id of allIds) {
        const slotEl = slotRefs.current[id]
        if (!slotEl) continue

        const renderedScale = renderedScales[id] ?? 1
        const targetScale = targetScales[id] ?? 1
        const targetLift = targetLifts[id] ?? 0
        const s = springs.current[id] ?? { scale: 1, v: 0, lift: 0, vl: 0 }

        slotEl.style.setProperty('--dock-scale', renderedScale.toFixed(4))
        slotEl.style.setProperty('--dock-lift', s.lift.toFixed(4))
        slotEl.style.setProperty('--dock-shift', (neighborShifts[id] ?? 0).toFixed(4))
        composition.current[id] = {
          shift: neighborShifts[id] ?? 0,
          scale: renderedScale,
          lift: s.lift,
        }

        if (
          Math.abs(renderedScale - targetScale) > 0.005 ||
          Math.abs(s.v) > 0.001 ||
          Math.abs(s.lift - targetLift) > 0.005 ||
          Math.abs(s.vl) > 0.001
        ) {
          anyMoving = true
        }
      }

      applyDockBackground()
      applyDockLabel()

      if (active || anyMoving) {
        rafRef.current = requestAnimationFrame(loop)
      } else {
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(loop)
  }, [
    pinnedApps,
    minimizedWindows,
    reducedMotion,
    applyDockBackground,
    applyDockLabel,
  ])

  const handleHover = useCallback(
    (id: string | null) => {
      hoveredIdRef.current = id
      setHoveredId(id)
      // Sampled once per hover change, not per frame.
      if (labelRef.current) labelHeight.current = labelRef.current.offsetHeight
      // The loop keeps tracking once it is running; this covers the first hover
      // and the reduced-motion case where no loop is active at all.
      applyDockLabel()
    },
    [applyDockLabel],
  )

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dockRef.current) return
    const rect = dockRef.current.getBoundingClientRect()
    const pointerX = e.clientX - rect.left
    rawPointerXRef.current = pointerX
    pointerAnchorXRef.current = pointerX
    pointerInDockRef.current = true
    startRaf()
  }, [startRaf])

  const handlePointerLeave = useCallback(() => {
    rawPointerXRef.current = null
    pointerInDockRef.current = false
  }, [])

  useEffect(() => {
    measureSlots()
  }, [measureSlots])

  useEffect(() => {
    const handleResize = () => {
      measureSlots()
      startRaf()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [measureSlots, startRaf])

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const isAppMinimized = useCallback((appId: string) => {
    return windows.some((w) => w.id === appId && w.isMinimized)
  }, [windows])

  const isAppActive = useCallback((appId: string) => {
    const appWindows = windows.filter((w) => w.id === appId)
    if (appWindows.length === 0) return false
    const maxZ = Math.max(...appWindows.map((w) => w.zIndex), 0)
    return appWindows.some((w) => w.zIndex === maxZ && !w.isMinimized)
  }, [windows])

  const getDockLabel = useCallback(
    (id: string | null): string => {
      if (!id) return ''
      if (id === 'trash') return 'Trash'
      const app = getApplicationById(id)
      if (app) return app.name
      const minimized = minimizedWindows.find((w) => w.id === id)
      return minimized ? minimized.name : ''
    },
    [minimizedWindows],
  )

  return (
    <nav
      ref={dockRef}
      className={`dock ${reducedMotion ? 'dock--reduced-motion' : ''}`}
      role="navigation"
      aria-label="Application dock"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <span className="dock__background" aria-hidden="true" />
      {/*
        One label for the whole Dock. It is positioned entirely from the
        existing animation loop (--dock-label-x / --dock-label-y) so it slides
        with the hover target and always clears the magnified icon, while the
        visible/hidden state stays a cheap class toggle.
      */}
      <span
        ref={labelRef}
        className={`dock__label ${hoveredId ? 'dock__label--visible' : ''}`}
        aria-hidden="true"
      >
        <span className="dock__label-text">{getDockLabel(hoveredId)}</span>
      </span>
      <div className="dock__section dock__section--pinned">
        {pinnedApps.map((app) => {
          const open = windows.find((w) => w.id === app.id)
          const active = isAppActive(app.id)
          const minimized = isAppMinimized(app.id)
          const hasOpenWindow = open && !minimized

          return (
            <div
              key={app.id}
              ref={(el) => { slotRefs.current[app.id] = el }}
              className="dock__slot"
            >
              <button
                ref={(el) => { itemRefs.current[app.id] = el }}
                type="button"
                className={`dock__item ${active ? 'dock__item--active' : ''} ${minimized ? 'dock__item--minimized' : ''} ${hoveredId === app.id ? 'dock__item--hovered' : ''} ${reducedMotion ? 'dock__item--reduced-motion' : ''}`}
                onClick={() => handleDockClick(app.id)}
                onMouseEnter={() => handleHover(app.id)}
                onMouseLeave={() => handleHover(null)}
                aria-label={app.name}
                aria-pressed={active}
                tabIndex={0}
                style={{
                  transform: `translateX(calc(var(--dock-shift, 0) * 1px)) scale(var(--dock-scale, 1)) translateY(calc(var(--dock-lift, 0) * -1px))`,
                } as React.CSSProperties}
              >
                <span className="dock__item-icon" aria-hidden="true">
                  {app.icon}
                </span>
                {hasOpenWindow && <span className="dock__item-indicator" aria-hidden="true" />}
              </button>
            </div>
          )
        })}
      </div>
      {minimizedWindows.length > 0 && (
        <>
          <div className="dock__divider dock__divider--section" role="separator" />
          <div className="dock__section dock__section--minimized">
            {minimizedWindows.map((w) => (
              <div
                key={w.id}
                ref={(el) => { slotRefs.current[w.id] = el }}
                className="dock__slot dock__slot--minimized"
              >
                <button
                  ref={(el) => { itemRefs.current[w.id] = el }}
                  type="button"
                  className={`dock__item dock__item--minimized ${hoveredId === w.id ? 'dock__item--hovered' : ''} ${reducedMotion ? 'dock__item--reduced-motion' : ''}`}
                  onClick={() => handleDockClick(w.id)}
                  onMouseEnter={() => handleHover(w.id)}
                  onMouseLeave={() => handleHover(null)}
                  aria-label={w.title || w.name}
                  tabIndex={0}
                  style={{
                    transform: `translateX(calc(var(--dock-shift, 0) * 1px)) scale(var(--dock-scale, 1)) translateY(calc(var(--dock-lift, 0) * -1px))`,
                  } as React.CSSProperties}
                >
                  <span className="dock__item-icon" aria-hidden="true">
                    {w.icon}
                  </span>
                  <span className="dock__item-indicator dock__item-indicator--minimized" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="dock__divider dock__divider--section" role="separator" />
      <div
        ref={(el) => { slotRefs.current['trash'] = el }}
        className="dock__slot dock__slot--trash"
      >
        <button
          ref={(el) => { itemRefs.current['trash'] = el }}
          type="button"
          className="dock__item dock__item--trash"
          onClick={() => {}}
          onMouseEnter={() => handleHover('trash')}
          onMouseLeave={() => handleHover(null)}
          aria-label="Trash"
          tabIndex={0}
          style={{
            transform: `translateX(calc(var(--dock-shift, 0) * 1px)) scale(var(--dock-scale, 1)) translateY(calc(var(--dock-lift, 0) * -1px))`,
          } as React.CSSProperties}
        >
          <span className="dock__item-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-2 14H7L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </span>
        </button>
      </div>
    </nav>
  )
}

export default Dock
