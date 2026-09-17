import React from 'react'
import ComputerScreenTarget from './ComputerScreenTarget'
import './ComputerHero.css'

interface ComputerHeroProps {
  src: string
  alt: string
  x: string
  y: string
  width: string
  zIndex: number
  onEnterComputer?: () => void
}

const ComputerHero: React.FC<ComputerHeroProps> = ({
  src,
  alt,
  x,
  y,
  width,
  zIndex,
  onEnterComputer,
}) => {
  return (
    <div
      className="computer-hero"
      style={{
        left: x,
        top: y,
        width,
        zIndex,
      }}
    >
      <img
        src={src}
        alt={alt}
        className="computer-hero__image"
        draggable={false}
      />
      <ComputerScreenTarget onEnter={onEnterComputer} />
    </div>
  )
}

export default ComputerHero
