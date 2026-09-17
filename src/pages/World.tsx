import React, { useState, useCallback } from 'react'
import CloudWorld from '../components/world/CloudWorld'
import Desktop from '../components/computer/Desktop'
import { worldConfig } from '../data/world'
import './World.css'

type SceneState = 'world' | 'entering-computer' | 'computer'

const World: React.FC = () => {
  const [sceneState, setSceneState] = useState<SceneState>('world')
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  const handleEnterComputer = useCallback(() => {
    setSceneState('entering-computer')
  }, [])

  const handleTransitionComplete = useCallback(() => {
    setSceneState('computer')
  }, [])

  // Listen for reduced motion changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <>
      <CloudWorld
        config={worldConfig}
        sceneState={sceneState}
        onEnterComputer={handleEnterComputer}
        onTransitionComplete={handleTransitionComplete}
        reducedMotion={reducedMotion}
      />
      {sceneState === 'computer' && (
        <Desktop reducedMotion={reducedMotion} />
      )}
    </>
  )
}

export default World
