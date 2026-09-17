import React from 'react'
import './FloatingPlatform.css'

interface FloatingPlatformProps {
  src: string
  alt: string
  x: string
  y: string
  width: string
  zIndex: number
}

const FloatingPlatform: React.FC<FloatingPlatformProps> = ({ src, alt, x, y, width, zIndex }) => {
  return (
    <img
      src={src}
      alt={alt}
      className="floating-platform"
      style={{
        left: x,
        top: y,
        width,
        zIndex,
      }}
      draggable={false}
    />
  )
}

export default FloatingPlatform
