import React, { useState, useCallback } from 'react'
import CloudWorld from '../components/world/CloudWorld'
import Desktop from '../components/computer/Desktop'
import { worldConfig } from '../data/world'
import './World.css'

type SceneState = 'world' | 'entering-computer' | 'computer' | 'exiting-computer'

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

  const handleExitComputer = useCallback(() => {
    setSceneState('exiting-computer')
  }, [])

  const handleExitComplete = useCallback(() => {
    setSceneState('world')
  }, [])

  // Listen for reduced motion changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Handle Escape key to exit computer
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sceneState === 'computer') {
        handleExitComputer()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sceneState, handleExitComputer])

  return (
    <>
      <CloudWorld
        config={worldConfig}
        sceneState={sceneState}
        onEnterComputer={handleEnterComputer}
        onTransitionComplete={handleTransitionComplete}
        onExitComplete={handleExitComplete}
        reducedMotion={reducedMotion}
      />
      {(sceneState === 'computer' || sceneState === 'exiting-computer') && (
        <Desktop
          reducedMotion={reducedMotion}
          onExit={handleExitComputer}
        />
      )}
    </>
  )
}

export default World
