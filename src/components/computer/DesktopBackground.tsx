import React from 'react'
import './DesktopBackground.css'

interface DesktopBackgroundProps {
  reducedMotion?: boolean
}

const DesktopBackground: React.FC<DesktopBackgroundProps> = ({ reducedMotion = false }) => {
  return (
    <div className={`desktop-background ${reducedMotion ? 'desktop-background--reduced-motion' : ''}`}>
      <div className="desktop-background__vignette" />
      <div className="desktop-background__scanlines" />
      <div className="desktop-background__noise" />
    </div>
  )
}

export default DesktopBackground