import React from 'react'
import './CRTEffects.css'

interface CRTEffectsProps {
  reducedMotion?: boolean
  intensity?: number // 0-1
}

const CRTEffects: React.FC<CRTEffectsProps> = ({ reducedMotion = false, intensity = 1 }) => {
  return (
    <div className={`crt-effects ${reducedMotion ? 'crt-effects--reduced-motion' : ''}`} style={{ '--crt-intensity': intensity } as React.CSSProperties} aria-hidden="true">
      <div className="crt-effects__scanlines" />
      <div className="crt-effects__vignette" />
      <div className="crt-effects__glow" />
      <div className="crt-effects__curvature" />
    </div>
  )
}

export default CRTEffects