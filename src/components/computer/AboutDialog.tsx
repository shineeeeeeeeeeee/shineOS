import React from 'react'
import './AboutDialog.css'

interface AboutDialogProps {
  reducedMotion?: boolean
}

const AboutDialog: React.FC<AboutDialogProps> = ({ reducedMotion = false }) => {
  return (
    <div className={`about-dialog ${reducedMotion ? 'about-dialog--reduced-motion' : ''}`}>
      <div className="about-dialog__header">
        <h1 className="about-dialog__title">SHINE OS</h1>
        <p className="about-dialog__tagline">"A tiny operating system for a very real portfolio."</p>
      </div>
      <div className="about-dialog__body">
        <p>
          Welcome to Shine OS — a personal desktop environment built to showcase
          Shine&rsquo;s work in an interactive, hands-on way. Every window, icon,
          and menu is part of a fictional machine that&rsquo;s just as curious
          about you as you are about it.
        </p>
        <p>
          This is a portfolio disguised as a computer. Explore the desktop, open
          the applications, and get to know the work inside.
        </p>
        <div className="about-dialog__meta">
          <span>Version 0.3.0</span>
          <span className="about-dialog__dot" aria-hidden="true">·</span>
          <span>Shine OS Foundation</span>
        </div>
      </div>
    </div>
  )
}

export default AboutDialog
