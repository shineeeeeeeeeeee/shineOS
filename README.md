# is-not-cool

A retro-futuristic portfolio website featuring a cinematic CRT computer transition from a floating cloud world into an interactive desktop environment.

## Overview

This project explores the intersection of retro computing aesthetics and modern web technologies. Users begin in a dreamlike floating-island world with parallax clouds, then click the CRT monitor to trigger a cinematic camera transition "into" the computer, revealing a fully functional macOS-inspired desktop environment.

## Features

- **Cinematic CRT Transition** — Smooth 1200ms camera animation targeting the CRT screen polygon, with scanline and bloom effects
- **Floating Cloud World** — Multi-layer parallax clouds, atmospheric sky, and floating island with interactive computer
- **Retro Desktop Environment** — macOS-inspired menu bar, desktop icons with double-click, draggable/resizable windows
- **Window Management** — Focus stacking, minimize/maximize/close, keyboard accessible
- **Accessibility First** — Semantic HTML, full keyboard navigation, `prefers-reduced-motion` support, focus-visible outlines
- **Responsive Design** — Breakpoints from 4K down to mobile (<480px)

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **CSS Custom Properties** for theming and design tokens
- **SVG** for resolution-independent icons and CRT effects
- **Zero external UI libraries** — all components built from scratch

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── computer/          # Desktop environment (Desktop, SystemBar, DesktopIcon, DesktopWindow, CRTEffects)
│   └── world/             # Cloud world (CloudWorld, CloudLayer, FloatingPlatform, ComputerHero)
├── data/                  # Configuration (world.ts, computer.ts, artDirection.ts)
├── pages/                 # Route-level components (World.tsx)
└── main.tsx               # App entry point
```

## Design Philosophy

- **Retro CRT + Dreamlike Cloud World + Cinematic Portfolio**
- No modern glassmorphism, neon glows, or cheesy glitch effects
- Tactile, restrained interactions that feel like using a real vintage computer
- Every animation serves the narrative of "entering the machine"

## Accessibility

- `prefers-reduced-motion: reduce` disables parallax, transitions, and animations
- All interactive elements have visible focus states
- Full keyboard operability (Tab, Enter, Space, Escape)
- Semantic ARIA roles throughout

## License

MIT