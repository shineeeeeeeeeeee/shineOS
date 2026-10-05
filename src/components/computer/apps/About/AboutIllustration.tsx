import React, { useEffect, useRef, useState } from 'react'
import './AboutIllustration.css'

/**
 * Approved illustration frames, in sequence order.
 *
 * Declared once at module scope so the animation only has to change the index —
 * it never has to add, remove or duplicate image elements. The artwork itself is
 * immutable: these files are used exactly as supplied.
 */
export const ABOUT_ILLUSTRATION_FRAMES = [
  '/assets/about/shine-about-01.png',
  '/assets/about/shine-about-02.png',
  '/assets/about/shine-about-03.png',
] as const

/** Natural description of the artwork, kept away from any file name. */
export const ABOUT_ILLUSTRATION_ALT =
  'An illustrated portrait of Shine surrounded by things from her everyday world.'

/** Frame index of the resting / master artwork. */
const REST_FRAME = 0

/**
 * How long the drawing rests before it first moves after the window opens.
 *
 * This is a lead-in, not part of the loop. It is deliberately kept separate
 * from the loop's own rest so the two never merge into one long stillness at
 * the seam.
 */
const ABOUT_ILLUSTRATION_LEAD_IN = 1600

/**
 * The breathing order.
 *
 * One pass is  rest → 02 → 03 → 02 → rest.  The holds are deliberately slow and
 * deliberately uneven: the rest is the longest of them, so the loop never falls
 * into an even, mechanical rhythm that would read as a GIF. A pass is ~5.9s and
 * the movement between frames is small enough that it is easy to miss unless you
 * are already looking at the drawing.
 *
 * Note that the loop deliberately does NOT contain a `rest → rest` pair. The
 * closing rest and the next pass's opening rest are the same single period of
 * stillness; listing frame 0 twice in a row would add the two together and leave
 * the drawing parked for over three seconds, which reads as "frozen", not
 * "resting".
 */
const ABOUT_ILLUSTRATION_SEQUENCE: ReadonlyArray<{ frame: number; hold: number }> = [
  { frame: 1, hold: 1200 },
  { frame: 2, hold: 1500 },
  { frame: 1, hold: 1200 },
  { frame: 0, hold: 2000 },
]

/**
 * Warms the browser cache for the frames that are not shown first.
 *
 * Without this the first swap would have to fetch and decode a 2.5MB PNG while
 * the drawing is already on screen, which shows up as a blink. `decode()` is
 * awaited (and ignored on failure) so the image is not just downloaded but
 * actually ready to paint the moment the `src` changes.
 */
function preloadFrames(): void {
  if (typeof window === 'undefined' || typeof Image === 'undefined') return

  // Only the frames that are not on screen yet. The master frame is already
  // being fetched by the <img> itself, and decoding it twice would just cost
  // main-thread time during the entrance.
  for (const src of ABOUT_ILLUSTRATION_FRAMES.slice(1)) {
    const image = new Image()
    image.src = src
    if (typeof image.decode === 'function') {
      image.decode().catch(() => {
        // A failed decode simply means the swap will be a touch slower.
      })
    }
  }
}

interface AboutIllustrationProps {
  /** Mirrors the document's reduced-motion state. */
  reducedMotion?: boolean
}

/**
 * The About illustration.
 *
 * A single square image printed straight onto the cream paper: no card, no
 * border, no shadow, no rounded container. The artwork's own background is the
 * document's paper tone, so nothing separates the drawing from the sheet.
 *
 * One image element for the whole life of the component. `src` changes, nothing
 * is stacked, duplicated or cross-faded, so there is never a moment where two
 * versions of Shine are visible at once and no edge can appear between them.
 *
 * Reduced motion is a real off switch, not a visual trick: no timer is armed, no
 * frame is preloaded and the component stays on the master frame. The drawing is
 * still, in the same way the rest of the document is still.
 */
const AboutIllustration: React.FC<AboutIllustrationProps> = ({ reducedMotion = false }) => {
  const [frame, setFrame] = useState(REST_FRAME)
  const stepRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (reducedMotion) return
    preloadFrames()
  }, [reducedMotion])

  useEffect(() => {
    // Reduced motion: park on the master frame and run no timers at all.
    if (reducedMotion) {
      stepRef.current = 0
      setFrame(REST_FRAME)
      return
    }

    let cancelled = false

    const clearTimer = () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    const schedule = (delay: number) => {
      // Never arm the next step while the tab is in the background.
      if (cancelled || document.hidden) return

      timerRef.current = setTimeout(() => {
        if (cancelled) return

        const step = ABOUT_ILLUSTRATION_SEQUENCE[stepRef.current]
        stepRef.current = (stepRef.current + 1) % ABOUT_ILLUSTRATION_SEQUENCE.length
        setFrame(step.frame)
        // Each entry's hold belongs to the frame it just showed, so the 2000ms
        // rest is the rest frame's own time rather than the frame after it.
        schedule(step.hold)
      }, delay)
    }

    const handleVisibilityChange = () => {
      clearTimer()
      if (document.hidden) return
      // Come back to the rest frame, so returning to the tab never lands
      // mid-movement and the stillness is never cut short.
      stepRef.current = 0
      setFrame(REST_FRAME)
      schedule(ABOUT_ILLUSTRATION_LEAD_IN)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    schedule(ABOUT_ILLUSTRATION_LEAD_IN)

    return () => {
      cancelled = true
      clearTimer()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [reducedMotion])

  const frameCount = ABOUT_ILLUSTRATION_FRAMES.length
  const currentSrc = ABOUT_ILLUSTRATION_FRAMES[((frame % frameCount) + frameCount) % frameCount]

  return (
    <div
      className={`about-illustration${reducedMotion ? ' about-illustration--reduced-motion' : ''}`}
    >
      <img
        className="about-illustration__image"
        src={currentSrc}
        alt={ABOUT_ILLUSTRATION_ALT}
        width={1024}
        height={1024}
        loading="eager"
        decoding="async"
        draggable={false}
        // Inert hook: lets the frame cycle be read from the DOM without
        // changing anything about the artwork, its alt text or its layout.
        data-illustration-frame={frame}
      />
    </div>
  )
}

export default AboutIllustration
