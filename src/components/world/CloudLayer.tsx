import React from 'react'
import type { CloudInstance } from '../../data/world'
import './CloudLayer.css'

interface CloudLayerProps {
  clouds: CloudInstance[]
  parallaxFactor: number
  parallaxX: number
  parallaxY: number
}

const CloudLayer: React.FC<CloudLayerProps> = ({ clouds, parallaxFactor, parallaxX, parallaxY }) => {
  return (
    <div className="cloud-layer" aria-hidden="true">
      {clouds.map((cloud) => {
        const offsetX = parallaxX * parallaxFactor
        const offsetY = parallaxY * parallaxFactor
        return (
          <img
            key={cloud.id}
            src={cloud.src}
            alt={cloud.alt}
            className="cloud-layer__cloud"
            style={{
              left: cloud.x,
              top: cloud.y,
              width: cloud.width,
              opacity: cloud.opacity,
              transform: `translate3d(${offsetX}px, ${offsetY}px, 0) ${cloud.flip ? 'scaleX(-1)' : ''}`,
              zIndex: cloud.zIndex,
            }}
            draggable={false}
          />
        )
      })}
    </div>
  )
}

export default CloudLayer
