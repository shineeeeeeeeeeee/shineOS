/**
 * World Configuration
 *
 * Centralized data for the cloud world composition.
 * Defines asset paths, cloud instances, responsive rules, and parallax depths.
 */

export interface CloudInstance {
  id: string
  src: string
  alt: string
  x: string // CSS left value
  y: string // CSS top value
  width: string // CSS width value
  opacity: number
  flip?: boolean
  zIndex: number
}

export interface WorldLayer {
  name: string
  parallaxFactor: number
  clouds: CloudInstance[]
}

export interface WorldConfig {
  sky: {
    src: string
    alt: string
  }
  layers: WorldLayer[]
  platform: {
    src: string
    alt: string
    x: string
    y: string
    width: string
    zIndex: number
  }
  computer: {
    src: string
    alt: string
    x: string
    y: string
    width: string
    zIndex: number
  }
  parallax: {
    maxOffset: number // px, maximum translation from center
    smoothing: number // 0-1, lower = smoother/slower
  }
  responsive: {
    computerMaxWidth: string // clamp() value
    platformWidth: string
  }
}

export const worldConfig: WorldConfig = {
  sky: {
    src: '/assets/working/world/sky/sky-master.png',
    alt: 'Soft teal-blue sky with gentle clouds',
  },
  layers: [
    {
      name: 'back',
      parallaxFactor: 0.008,
      clouds: [
        {
          id: 'back-1',
          src: '/assets/working/world/clouds/back/cloud-back-master.png',
          alt: 'Distant cloud',
          x: '5%',
          y: '8%',
          width: '45%',
          opacity: 0.55,
          zIndex: 1,
        },
        {
          id: 'back-2',
          src: '/assets/working/world/clouds/back/cloud-back-master.png',
          alt: 'Distant cloud',
          x: '55%',
          y: '5%',
          width: '50%',
          opacity: 0.5,
          flip: true,
          zIndex: 1,
        },
        {
          id: 'back-3',
          src: '/assets/working/world/clouds/back/cloud-back-master.png',
          alt: 'Distant cloud',
          x: '25%',
          y: '18%',
          width: '35%',
          opacity: 0.45,
          zIndex: 1,
        },
      ],
    },
    {
      name: 'mid',
      parallaxFactor: 0.018,
      clouds: [
        {
          id: 'mid-1',
          src: '/assets/working/world/clouds/mid/cloud-mid-master.png',
          alt: 'Midground cloud',
          x: '-5%',
          y: '35%',
          width: '40%',
          opacity: 0.7,
          zIndex: 3,
        },
        {
          id: 'mid-2',
          src: '/assets/working/world/clouds/mid/cloud-mid-master.png',
          alt: 'Midground cloud',
          x: '60%',
          y: '30%',
          width: '45%',
          opacity: 0.65,
          flip: true,
          zIndex: 3,
        },
        {
          id: 'mid-3',
          src: '/assets/working/world/clouds/mid/cloud-mid-master.png',
          alt: 'Midground cloud',
          x: '30%',
          y: '55%',
          width: '38%',
          opacity: 0.6,
          zIndex: 3,
        },
      ],
    },
    {
      name: 'front',
      parallaxFactor: 0.035,
      clouds: [
        {
          id: 'front-1',
          src: '/assets/working/world/clouds/front/cloud-front-master.png',
          alt: 'Foreground cloud',
          x: '-8%',
          y: '70%',
          width: '35%',
          opacity: 0.85,
          zIndex: 6,
        },
        {
          id: 'front-2',
          src: '/assets/working/world/clouds/front/cloud-front-master.png',
          alt: 'Foreground cloud',
          x: '70%',
          y: '65%',
          width: '40%',
          opacity: 0.8,
          flip: true,
          zIndex: 6,
        },
        {
          id: 'front-3',
          src: '/assets/working/world/clouds/front/cloud-front-master.png',
          alt: 'Foreground cloud',
          x: '40%',
          y: '85%',
          width: '30%',
          opacity: 0.75,
          zIndex: 6,
        },
      ],
    },
  ],
  platform: {
    src: '/assets/working/world/platform/platform-master.png',
    alt: 'Floating platform',
    x: '50%',
    y: '62%',
    width: '49%',
    zIndex: 4,
  },
  computer: {
    src: '/assets/working/computer/computer-master.png',
    alt: 'Enter Shine\'s computer',
    x: '50%',
    y: '42%',
    width: '27%',
    zIndex: 5,
  },
  parallax: {
    maxOffset: 24,
    smoothing: 0.08,
  },
  responsive: {
    computerMaxWidth: 'clamp(240px, 27vw, 380px)',
    platformWidth: 'clamp(300px, 49vw, 700px)',
  },
}
