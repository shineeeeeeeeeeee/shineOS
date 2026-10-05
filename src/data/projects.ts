import type {
  Project,
  ProjectAsset,
  ProjectGroup,
  ProjectSheetForm,
  ProjectsContent,
} from '../types/projects'

import atlasHero from '../assets/projects/atlas/hero.png'
import atlasDetail01 from '../assets/projects/atlas/detail-01.png'
import atlasDetail02 from '../assets/projects/atlas/detail-02.png'
import atlasDetail03 from '../assets/projects/atlas/detail-03.png'
import kindnessHero from '../assets/projects/kindness-map/hero.png'
import walletHero from '../assets/projects/rn-wallet/hero.png'
import walletDetail01 from '../assets/projects/rn-wallet/detail-01.png'
import chatHero from '../assets/projects/fullstack-chat/hero.png'
import shadowTagHero from '../assets/projects/shadow-tag/hero.png'

/**
 * Projects — the SHINE OS workbench.
 *
 * Every line below is drawn from the project repository itself: the README, the
 * package manifest, or the file that the capture was taken from. Nothing is
 * estimated, rounded up, or written for effect. Where a repository has no
 * usable visual, the record says so and the shelf draws the live archive
 * artifact instead — never an empty slot.
 *
 * Asset provenance is recorded on every `ProjectAsset.source`, because the
 * difference between a real capture and an invented one is the whole point of
 * this sheet.
 */

const GITHUB = 'https://github.com/shineeeeeeeeeeee'

// ============================================
// Atlas
//
// The local repository ships eight captures in imgs/, all 3360x2100 retina
// screenshots of the marketing and product pages taken within half a minute of
// each other. The graph explorer is the one that shows the actual application
// doing its job, so it carries the sheet.
// ============================================

const atlasAssets: ProjectAsset[] = [
  {
    id: 'atlas-graph-explorer',
    src: atlasHero,
    alt: 'The Atlas knowledge graph explorer: a canvas of connected memory nodes, with a detail panel open for the "Summer Internship" entity listing its organisation, topic, conversation source, timestamp and an 81 percent confidence figure.',
    caption: 'Explore Memory — the live graph, with a node opened',
    width: 1680,
    height: 1050,
    source: 'imgs/ — Explore Memory screen, captured from the running app',
    role: 'hero',
  },
  {
    id: 'atlas-landing',
    src: atlasDetail01,
    alt: 'The Atlas landing page opening: the line "Your conversations already contain your knowledge. Atlas simply connects it." above two entry buttons.',
    caption: 'Landing — the opening statement',
    width: 1440,
    height: 900,
    source: 'imgs/ — landing hero, captured from the running app',
    role: 'detail',
  },
  {
    id: 'atlas-memory-diagram',
    src: atlasDetail02,
    alt: 'A diagram where a sentence resolves into typed graph entities: Shine as a person, Summer Internship as a role, Helio Works as an organisation, Solar Panel Efficiency as a topic and Data Analysis as a method.',
    caption: 'Memory becoming knowledge — extraction into entities',
    width: 1440,
    height: 900,
    source: 'imgs/ — entity diagram, captured from the running app',
    role: 'detail',
  },
  {
    id: 'atlas-architecture',
    src: atlasDetail03,
    alt: 'A seven-stage pipeline diagram running from User through Conversation, Extraction Engine, Knowledge Graph, Graph Reasoner, Context Builder and LLM.',
    caption: 'Architecture — how a memory becomes an answer',
    width: 1440,
    height: 900,
    source: 'imgs/ — architecture pipeline, captured from the running app',
    role: 'detail',
  },
]

// ============================================
// Kindness Map
//
// One real illustration: the storybook landscape the landing page is built on.
// It is the largest single-purpose illustration in the repository and the only
// raster asset at all — everything else is inline SVG drawn in React.
// ============================================

const kindnessAssets: ProjectAsset[] = [
  {
    id: 'kindness-landscape',
    src: kindnessHero,
    alt: 'The illustrated storybook landscape behind Kindness Map: a pale blue sky over soft rolling ground, drawn rather than photographed, with no text or interface in the frame.',
    caption: 'The illustrated world the stories are pinned to',
    width: 1440,
    height: 960,
    source: 'public/bg.png — the app’s own background illustration',
    role: 'hero',
  },
]

// ============================================
// RN Wallet
//
// The repository ships four real device captures in screenshots/. Two are
// authentication forms and carry almost no information about the app, so the
// balance screen leads and the transaction form supports it.
// ============================================

const walletAssets: ProjectAsset[] = [
  {
    id: 'wallet-balance',
    src: walletHero,
    alt: 'The wallet home screen showing a total balance of $8,600, income of +$7,800, expenses of −$800, and a recent transactions list.',
    caption: 'Balance — the summary screen',
    width: 900,
    height: 1951,
    source: 'screenshots/balance.png — real device capture',
    role: 'hero',
  },
  {
    id: 'wallet-transaction',
    src: walletDetail01,
    alt: 'The new transaction screen with an expense/income toggle, an amount field and a category grid.',
    caption: 'New transaction — expense and income entry',
    width: 900,
    height: 1951,
    source: 'screenshots/new.png — real device capture',
    role: 'detail',
  },
]

// ============================================
// Fullstack Chat
//
// The README embeds one capture of the running deployment. That file is the
// only image of the actual interface anywhere in the repository.
// ============================================

const chatAssets: ProjectAsset[] = [
  {
    id: 'chat-inbox',
    src: chatHero,
    alt: 'The Chatty messaging interface: a contacts sidebar listing online and offline users, and an empty conversation pane reading "Welcome to Chatty! Select a conversation from the sidebar to start chatting".',
    caption: 'Chatty — the inbox',
    width: 1600,
    height: 900,
    source: 'README capture of the running deployment',
    role: 'hero',
  },
]

// ============================================
// Shadow Tag
//
// The repository contains no images at all — it is a Pygame game with an
// audio folder. The README does carry a screen recording, and every sampled
// frame of it is the editor with shadow_tag.py open rather than the game
// running. A single still is used below, kept small and labelled as what it
// actually is: a capture of the source, not of the game.
// ============================================

const shadowTagAssets: ProjectAsset[] = [
  {
    id: 'shadow-tag-source',
    src: shadowTagHero,
    alt: 'A screen capture of the code editor with the Pygame source of shadow_tag.py open, showing the game constants and the light orb implementation.',
    caption: 'Source — shadow_tag.py in the editor',
    width: 900,
    height: 511,
    source: 'README screen recording, first sampled frame',
    role: 'hero',
  },
]

// ============================================
// Leetcode DSA
//
// 131 solution folders and not one image in the repository, so there is nothing
// real to put on the shelf and nothing to photograph. The plate is therefore not
// artwork at all: it is the live archive artifact, which draws its own contents
// from the repository manifest in data/leetcodeArchive.ts.
//
// A correction to the earlier audit of this project. The repository was reported
// as holding "132 solution folders". 132 is the number of top-level *entries* —
// 131 folders plus the root README.md. The artifact prints 131, because 131 is
// what can actually be established as a folder count.
// ============================================

export const projects: Project[] = [
  {
    id: 'atlas',
    title: 'Atlas',
    category: 'AI · Knowledge Graph',
    tier: 'lead',
    featured: true,
    summary:
      'An AI memory operating system that turns conversations into a knowledge graph you can navigate, question and trace back to source.',
    technologies: ['Next.js', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Groq', 'Zustand'],
    githubUrl: `${GITHUB}/Atlas`,
    hero: atlasAssets[0],
    assets: atlasAssets,
    treatment: 'plate-wide',
    sheetForm: 'document',
    note: 'Every answer carries the path back to the conversation that earned it.',
    // The premise is the project's own landing line, recorded verbatim on the
    // landing capture: the knowledge is already in the conversation; it is the
    // addressing of it that is missing.
    why: 'The knowledge is already written down in the conversation — what is missing is any way to point at it. Atlas was built so that anything said once can be found again, and so an answer can show which sentence it came from.',
    // The stages are the pipeline drawn on the project's own architecture plate.
    how: [
      'A conversation is stored, then run through an extraction engine that pulls typed entities out of it — people, roles, organisations, topics, methods.',
      'Those entities become a knowledge graph in PostgreSQL, with the source message kept on every edge.',
      'A graph reasoner walks the graph for the question, a context builder assembles the result, and an LLM answers from that context alone.',
      'The model is behind a provider interface: Groq by default, with Ollama, OpenAI and Gemini implemented against the same contract.',
    ],
  },
  {
    id: 'kindness-map',
    title: 'Kindness Map',
    category: 'Map · Illustrated Web',
    tier: 'supporting',
    featured: true,
    summary:
      'A living map of real-world good deeds, with no followers, likes or comments — only stories, linked by proximity, theme and time.',
    technologies: ['Next.js', 'Leaflet', 'Supabase', 'Tailwind', 'Framer Motion'],
    githubUrl: `${GITHUB}/KindnessMap`,
    hero: kindnessAssets[0],
    assets: kindnessAssets,
    treatment: 'plate-wide',
    sheetForm: 'document',
    note: 'Stories that happened nearby become branches of the same graph.',
    // Grounded in the project's own stated omission: no followers, likes or
    // comments. The reason follows directly from what was deliberately left out.
    why: 'Most maps of good deeds turn into a leaderboard the moment you add a like button. This one leaves out followers, likes and comments, so a story has only its place on the map and the people who were near it.',
    how: [
      'Stories are pinned to real coordinates on a Leaflet map and stored in Supabase.',
      'Proximity, theme and time are what connect them — nearby stories become neighbours, and together they form one graph rather than a feed.',
      'The world around the map is drawn rather than photographed: one background illustration, with everything else rendered as inline SVG in React.',
    ],
  },
  {
    id: 'rn-wallet',
    title: 'RN Wallet',
    category: 'Mobile · Finance',
    tier: 'secondary',
    featured: false,
    summary:
      'A cross-platform income and expense tracker built with Expo and React Native, authenticated with Clerk and backed by an Express API.',
    technologies: ['React Native', 'Expo', 'Clerk', 'Express', 'TypeScript'],
    githubUrl: `${GITHUB}/RN-wallet-mobile`,
    hero: walletAssets[0],
    assets: walletAssets,
    treatment: 'plate-tall',
    sheetForm: 'document',
    note: 'One balance screen, one entry screen — the two the app is actually for.',
    why: 'A running record of money in and money out, kept on the phone rather than in a notes app. Signing in was the part worth getting right early, so authentication is Clerk rather than something rolled by hand.',
    how: [
      'Two screens carry the app: a balance summary with a recent-transactions list, and a new-transaction form with an expense/income toggle, an amount field and a category grid.',
      'Clerk handles sign-in; the Express API behind it owns the records.',
      'Built with Expo and React Native in TypeScript, so the same source runs on both platforms.',
    ],
  },
  {
    id: 'fullstack-chat',
    title: 'Fullstack Chat',
    category: 'Real-time · MERN',
    tier: 'secondary',
    featured: false,
    summary:
      'A real-time messaging application with Socket.io, JWT authentication, online-user status and Zustand state on the client.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Zustand', 'Tailwind'],
    githubUrl: `${GITHUB}/fullstack-chat-app`,
    liveUrl: 'https://fullstack-chat-app-tlqb.onrender.com',
    hero: chatAssets[0],
    assets: chatAssets,
    treatment: 'plate-wide',
    sheetForm: 'document',
    note: 'Shipped and deployed, rather than left half-finished on a laptop.',
    why: 'Built to be finished and left running somewhere, not to sit on a laptop as a demo. It is deployed and the address is on this sheet because it still answers.',
    how: [
      'Socket.io carries messages between clients and the Express server in both directions.',
      'JWT authentication gates the connection, and online/offline presence is tracked per user.',
      'MongoDB stores the conversations; Zustand holds the client state so the message list and the presence list stay in one place.',
    ],
  },
  {
    id: 'shadow-tag',
    title: 'Shadow Tag',
    category: 'Game · Pygame',
    tier: 'archive',
    featured: false,
    summary:
      'A 2D game about a shrinking pool of light and the things that avoid it, written in Pygame with a full sound design.',
    technologies: ['Python', 'Pygame'],
    githubUrl: `${GITHUB}/shadow-tag`,
    hero: shadowTagAssets[0],
    assets: shadowTagAssets,
    treatment: 'plate-contact',
    sheetForm: 'document',
    note: 'No gameplay capture exists yet — only this one, of the source.',
    why: 'The whole game is one script and a folder of sounds. It was built as something that opens and runs, with no build step, no asset pipeline and no framework standing between the code and the window.',
    how: [
      'A Pygame window with a light orb at its centre, and a pool of light that shrinks over the course of a round.',
      'Everything in it moves to avoid that light.',
      'The audio is a separate folder beside the source, so the sound design ships with the game rather than being baked into it.',
    ],
    // The one visual in this repository is a capture of the source file. It is
    // printed verbatim wherever the image appears, so the sheet can never imply
    // that this is a screenshot of the game running.
    assetDisclaimer:
      'This is not gameplay. The repository holds no images at all — the only frame available comes from the screen recording in the README, and it shows the editor with shadow_tag.py open.',
  },
  {
    id: 'leetcode-dsa',
    title: 'Leetcode DSA',
    category: 'Notebook · Algorithms',
    tier: 'archive',
    featured: false,
    summary:
      'A running archive of algorithm solutions — one numbered folder per problem, each holding the solution and a short write-up.',
    technologies: ['Java', 'Python'],
    githubUrl: `${GITHUB}/LeetcodeDSA`,
    assets: [],
    treatment: 'plate-archive',
    sheetForm: 'archive',
    note: '131 solution folders and no image anywhere in the repository, so the plate is drawn from the archive itself.',
    why: 'Not an application, and not meant to read like one. It is a standing record of problem solving: the point is the accumulated folder of solutions and the write-ups that came with them, not a product to demonstrate.',
    how: [
      'One folder per LeetCode problem, named `<problem-number>-<problem-slug>`, so the repository reads in problem order once sorted.',
      'A Java solution in each folder that has one; two folders carry a Python version alongside the Java.',
      'A README.md write-up in every folder. Thirty of them add a second Notes.md with the working.',
    ],
  },
]

// ============================================
// Sheet structure
// ============================================

export const projectsContent: ProjectsContent = {
  title: 'Projects',
  subtitle: 'Workbench',
  standfirst:
    'Everything here was built at a desk, usually late. The plates are the work itself — captured from the repositories, not mocked up for this page.',
  groups: [
    {
      id: 'lead',
      label: 'Leads',
      note: 'The two that got the most time.',
      projectIds: ['atlas', 'kindness-map'],
    },
    {
      id: 'secondary',
      label: 'Secondary',
      note: 'Shipped and running.',
      projectIds: ['rn-wallet', 'fullstack-chat'],
    },
    {
      id: 'archive',
      label: 'Archive',
      note: 'Older work, kept because it was worth finishing.',
      projectIds: ['shadow-tag', 'leetcode-dsa'],
    },
  ],
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id)
}

export function getGroupProjects(group: ProjectGroup): Project[] {
  return group.projectIds
    .map(getProjectById)
    .filter((project): project is Project => project !== undefined)
}

/**
 * Projects whose plate is drawn from the repository rather than from a capture.
 *
 * The masthead counts these separately from plated projects, because "5 plated,
 * 1 drawn from the archive" is an honest description of the shelf, whereas
 * calling the archive project uncaptured would be false — it is no longer an
 * empty slot.
 */
export function getArchiveProjects(): Project[] {
  return projects.filter((project) => project.treatment === 'plate-archive')
}

/** Projects that still have no visual of any kind. Currently none. */
export function getUncapturedProjects(): Project[] {
  return projects.filter(
    (project) => project.awaitingVisual === true && project.treatment !== 'plate-archive'
  )
}

/** Sheet variants, keyed by project id. */
export function getProjectSheetForm(projectId: string): ProjectSheetForm {
  return getProjectById(projectId)?.sheetForm ?? 'document'
}