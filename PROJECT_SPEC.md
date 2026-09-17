PROJECT SPECIFICATION — is-not.cool Interactive World

You are the lead frontend engineer, interaction designer, UI engineer, game developer, and technical architect for this project.

We are building a highly polished interactive web experience hosted at:

shine.is-not.cool

This is NOT a traditional portfolio website.

The experience is a whimsical interactive world centered around a computer floating in the clouds.

CORE CONCEPT

When the user visits the website, they enter an illustrated world containing a computer floating among clouds.

The user can interact with the environment.

The primary interaction is clicking the computer.

When the computer is clicked, the camera/view should smoothly transition and zoom into the computer's screen.

The computer screen then becomes the user's entire viewport.

The user is now inside a fictional operating system.

The operating system should feel inspired by classic Macintosh/macOS interfaces, but must have its own original visual identity.

Inside the operating system, users can:

open folders
open files
read documents
view illustrations/images
interact with fictional applications
play multiple small 2D games
discover hidden interactions
discover Easter eggs
interact with desktop objects
explore the environment

The overall experience should feel:

whimsical
cozy
playful
mysterious
nostalgic
polished
handcrafted
slightly humorous
technically impressive

It should feel like entering a tiny digital world rather than browsing a website.

NON-NEGOTIABLE DESIGN PRINCIPLES
1. NO GENERIC AI WEBSITE DESIGN

Do NOT use:

generic SaaS layouts
excessive glassmorphism
generic gradients
generic dashboard components
generic landing-page sections
excessive rounded cards
generic icon libraries as the primary visual language
default Tailwind aesthetics
generic hero sections

The project must have a strong visual identity.

2. ART DIRECTION

The visual language should combine:

hand-illustrated 2D artwork
cozy retro-computing aesthetics
subtle texture
soft lighting
imperfect organic shapes
detailed environmental props
expressive small animations

The illustrations should feel like they belong to the same world.

Do not mix unrelated visual styles.

3. INTERACTION QUALITY

Every interaction must feel intentional.

Use:

smooth transitions
easing
hover states
click feedback
subtle motion
appropriate cursor states
micro-interactions
depth
animation continuity

Avoid:

abrupt transitions
elements teleporting
layout jumps
animation conflicts
accidental clicks
broken hover states
4. PERFORMANCE

The experience must remain performant.

Prefer:

optimized SVG
WebP/AVIF where appropriate
lazy loading
code splitting
efficient animation
transform/opacity animations
limited expensive effects

Do not continuously animate expensive properties unnecessarily.

5. RESPONSIVENESS

The primary experience is desktop-first.

However, the project must gracefully handle smaller screens.

Do NOT simply shrink the desktop UI until it becomes unusable.

If an interaction fundamentally requires a large screen, create a deliberate mobile experience rather than allowing the interface to break.

6. ACCESSIBILITY

Where appropriate:

keyboard navigation
visible focus states
semantic elements
readable contrast
reduced-motion support
accessible labels

The visual experience can be unconventional without being inaccessible.

TECHNOLOGY

Use:

React
TypeScript
Vite
CSS
GSAP for cinematic transitions where appropriate
Phaser for games that benefit from a game engine
HTML Canvas where a game is simple enough that Phaser would be unnecessary

Do not introduce unnecessary dependencies.

Before installing a new dependency, determine whether the functionality can reasonably be implemented using the existing stack.

ARCHITECTURE

Keep the code modular.

Suggested structure:

src/

world/
CloudWorld
Computer
Environment
WorldInteraction

os/
Desktop
Window
MenuBar
Dock
Finder
FileSystem
Wallpaper

apps/
Finder
TextEditor
ImageViewer
Browser
GameLauncher
SystemInfo

games/
CloudHopper
DesktopGarden
CatDelivery

components/
Window
Icon
Button
Tooltip
Modal

assets/
world
os
icons
characters
games
sounds

data/
files
applications
secrets

utils/
animation
audio
device
storage

IMPORTANT DEVELOPMENT RULE

DO NOT build the entire project at once.

We will develop it in clearly defined phases.

Each phase must produce a stable, testable result before moving to the next phase.

Do not invent future functionality inside an earlier phase unless the architecture requires a placeholder.

PHASES

Phase 1:
Project foundation and visual system.

Phase 2:
Cloud world and computer environment.

Phase 3:
Cinematic transition into the computer.

Phase 4:
Operating system desktop.

Phase 5:
Window manager and file system.

Phase 6:
Files, documents, image viewer and personal content.

Phase 7:
Game launcher.

Phase 8:
First polished 2D mini-game.

Phase 9:
Additional mini-games.

Phase 10:
Secrets, Easter eggs and world interactions.

Phase 11:
Audio and advanced micro-interactions.

Phase 12:
Performance, accessibility, responsive behavior and bug elimination.

Phase 13:
Final visual polish and production deployment.

QUALITY BAR

The final project should feel like a small interactive indie game, not a student portfolio.

Before considering a feature complete, verify:

no console errors
no TypeScript errors
no broken assets
no layout shifts
no animation glitches
no accidental overflow
no broken navigation
no inaccessible controls
no inconsistent spacing
no inconsistent visual styles
no duplicated state
no unnecessary re-renders
no broken responsive behavior

If a feature is visually weak, do not consider it complete simply because it technically works.

DEVELOPMENT WORKFLOW

For every phase:

Inspect the existing code.
Understand the current architecture.
Make a small implementation plan.
Implement only the requested phase.
Run the project.
Check the browser console.
Check TypeScript/build errors.
Test interactions.
Check different viewport sizes.
Fix issues before reporting completion.
Do not rewrite working parts unnecessarily.

Do not claim something is working without actually verifying it.

IMPORTANT

The visual identity is as important as the functionality.

If there is a choice between:

A technically simpler implementation that looks generic

and

A slightly more involved implementation that creates the intended handcrafted experience,

prefer the latter, provided it remains maintainable and performant.

This project should feel designed, not assembled.

Do not proceed to future phases automatically.

Wait for the next phase instruction after completing each phase.
