// STEP 12A verification: opens SHINE OS, opens Projects, and measures the
// workbench composition instead of trusting the CSS by eye.
//
// Checks: every plate resolves to a loaded image with its intrinsic ratio
// intact, the hierarchy is actually asymmetric, nothing overflows, keyboard
// focus reaches every plate and link, the composition is inert until touched,
// and the same content survives a narrow window. Screenshots are written for
// the record.
import { chromium } from 'playwright'

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1510, height: 980 } })

const failures = []
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failures.push(name)
}

const openProjects = async () => {
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' })
  await page.getByLabel("Enter Shine's computer").waitFor({ state: 'attached', timeout: 45000 })
  await page.evaluate(() => document.querySelector("[aria-label=\"Enter Shine's computer\"]").click())
  await page.getByRole('button', { name: 'Projects', exact: true }).first().click({ force: true })
  await page.locator('[role="dialog"][aria-label="Projects"]').waitFor({ state: 'visible', timeout: 15000 })
  await page.waitForTimeout(800)
}

const setWindow = async (width, height) => {
  await page.evaluate(
    ([w, h]) => {
      const el = document.querySelector('.desktop-window[role="dialog"]')
      el.style.width = `${w}px`
      el.style.height = `${h}px`
    },
    [width, height]
  )
  await page.waitForTimeout(300)
}

const scrollSheet = (win, top) =>
  win.locator('.projects-sheet').evaluate((el, t) => el.scrollTo({ top: t, behavior: 'auto' }), top)

await openProjects()
const win = page.locator('[role="dialog"][aria-label="Projects"]')

// ---------------------------------------------------------------- plates
const readPlates = () =>
  win.locator('.project').evaluateAll((nodes) =>
    nodes.map((n) => {
      const img = n.querySelector('.project__image')
      const button = n.querySelector('.project__plate')
      const box = button.getBoundingClientRect()
      const rendered = img ? img.getBoundingClientRect() : null
      return {
        id: n.id,
        title: n.querySelector('.project__title').textContent.trim(),
        tier: n.dataset.tier,
        treatment: n.dataset.treatment,
        hasImage: Boolean(img),
        natural: img ? { w: img.naturalWidth, h: img.naturalHeight } : null,
        rendered: rendered ? { w: rendered.width, h: rendered.height } : null,
        plate: { w: Math.round(box.width), h: Math.round(box.height) },
        hasSlot: Boolean(n.querySelector('.project__slot')),
        titleSize: parseFloat(getComputedStyle(n.querySelector('.project__title')).fontSize),
        altLength: img ? img.alt.length : 0,
      }
    })
  )

// Scroll the whole sheet once so lazy captures below the fold are decoded
// before they are measured — otherwise a correctly lazy image reads as broken.
await scrollSheet(win, 99999)
await page.waitForTimeout(1500)
const unloaded = await win
  .locator('.project__image')
  .evaluateAll((els) => els.filter((e) => e.complete && e.naturalWidth > 0).length)
check('every capture decoded once scrolled into view', unloaded === 5, `${unloaded}/5`)
await scrollSheet(win, 0)
await page.waitForTimeout(400)

const plates = await readPlates()
console.log('\n--- plates @ 880px window ---')
for (const p of plates) {
  console.log(
    `${p.tier.padEnd(10)} ${p.title.padEnd(15)} plate ${String(p.plate.w).padStart(4)}x${String(p.plate.h).padStart(4)}` +
      (p.hasImage
        ? `  img ${p.natural.w}x${p.natural.h} -> ${Math.round(p.rendered.w)}x${Math.round(p.rendered.h)}  alt:${p.altLength}c`
        : `  EMPTY SLOT (${p.hasSlot})`)
  )
}

check('six projects render', plates.length === 6, `${plates.length}`)

let ratioOk = true
let ratioDetail = ''
for (const p of plates.filter((x) => x.hasImage)) {
  const drift = Math.abs(p.natural.w / p.natural.h - p.rendered.w / p.rendered.h) / (p.natural.w / p.natural.h)
  if (drift > 0.01) {
    ratioOk = false
    ratioDetail += `${p.title} drift=${drift.toFixed(4)} `
  }
}
check('no plate distorts its image', ratioOk, ratioDetail)

const widths = plates.map((p) => p.plate.w)
const atlas = plates.find((p) => p.id === 'project-atlas')
check('Atlas carries the most weight', atlas.plate.w === Math.max(...widths), `atlas=${atlas.plate.w}`)
check('Atlas title is the largest', atlas.titleSize === Math.max(...plates.map((p) => p.titleSize)), `${atlas.titleSize}px`)
check('plates are not all the same width', new Set(widths).size >= 5, `${new Set(widths).size} distinct widths: ${widths.join('/')}`)

const leetcode = plates.find((p) => p.id === 'project-leetcode-dsa')
const shadowTag = plates.find((p) => p.id === 'project-shadow-tag')
check('LeetcodeDSA has no fabricated plate', leetcode.hasSlot && !leetcode.hasImage)
check('archive cells are the same size', leetcode.plate.w === shadowTag.plate.w, `${leetcode.plate.w} vs ${shadowTag.plate.w}`)

check(
  'reading order holds the hierarchy',
  plates.map((p) => p.id).join(',') ===
    'project-atlas,project-kindness-map,project-rn-wallet,project-fullstack-chat,project-shadow-tag,project-leetcode-dsa'
)

check('alt text is descriptive', plates.filter((p) => p.hasImage).every((p) => p.altLength > 60))

const overflowAt = () =>
  win.locator('.projects-sheet').evaluate((el) => el.scrollWidth - el.clientWidth)
check('no horizontal overflow at the default width', (await overflowAt()) <= 1, `${await overflowAt()}`)

// Nothing moves on its own.
const still = await win.locator('.project__image').first().evaluate((el) => el.getBoundingClientRect().top)
await page.waitForTimeout(1400)
const stillAfter = await win.locator('.project__image').first().evaluate((el) => el.getBoundingClientRect().top)
check('layout is inert without interaction', still === stillAfter, `${still} -> ${stillAfter}`)

// ---------------------------------------------------------------- focus
// Focus is driven by real Tab presses: programmatic .focus() after a mouse
// click does not engage :focus-visible, which would test nothing.
await page.locator('.projects-masthead__nav-link').first().focus()
await page.keyboard.press('Shift+Tab')
const tabbed = []
// Elements are identified by a unique probe attribute rather than by class,
// because several tab stops share a class (three band links, five Repository
// links) and a class-keyed set would collapse them into a single entry.
await page.evaluate(() => {
  document.querySelectorAll('.projects-app a, .projects-app button, .projects-sheet').forEach((el, i) => {
    el.dataset.probeId = `p${i}`
  })
})
for (let i = 0; i < 40; i += 1) {
  await page.keyboard.press('Tab')
  const info = await page.evaluate(() => {
    const el = document.activeElement
    if (!el || el === document.body || !el.dataset.probeId) return null
    const cs = getComputedStyle(el)
    return {
      probe: el.dataset.probeId,
      tag: el.tagName,
      cls: typeof el.className === 'string' ? el.className : '',
      id: el.closest('.project') ? el.closest('.project').id : null,
      label: el.getAttribute('aria-label') || el.textContent.trim().slice(0, 24),
      outline: `${cs.outlineStyle}/${cs.outlineWidth}/${cs.outlineColor}`,
      inside: Boolean(el.closest('.projects-app')),
    }
  })
  if (!info) break
  if (tabbed.some((t) => t.probe === info.probe)) break
  tabbed.push(info)
}

const plateCount = await win.locator('.project__plate').count()
const linkCount = await win.locator('.project__link').count()
const navCount = await win.locator('.projects-masthead__nav-link').count()
const platesReached = new Set(tabbed.filter((t) => t.cls.includes('project__plate')).map((t) => t.id)).size
const linksReached = tabbed.filter((t) => t.cls.includes('project__link')).length
const defaultOutline = tabbed.filter((t) => !t.outline.startsWith('solid/2px'))

check('every plate is keyboard reachable', platesReached === plateCount, `${platesReached}/${plateCount}`)
check('every link is keyboard reachable', linksReached === linkCount, `${linksReached}/${linkCount}`)
check('band links are keyboard reachable', tabbed.filter((t) => t.cls.includes('projects-masthead__nav-link')).length >= navCount, `${navCount}`)
check('no browser-default focus outlines', defaultOutline.length === 0, defaultOutline.map((t) => `${t.cls}:${t.outline}`).join(' '))
check('SHINE OS ring is the accent colour', tabbed.every((t) => t.outline.includes('rgb(224, 122, 95)')), tabbed[0]?.outline)

await scrollSheet(win, 99999)
await page.waitForTimeout(400)
const lastRing = await page.evaluate(() => {
  const links = document.querySelectorAll('.projects-app .project__link')
  const el = links[links.length - 1]
  el.focus()
  const cs = getComputedStyle(el)
  return `${cs.outlineStyle}/${cs.outlineWidth}/${cs.outlineColor}`
})
check('focus ring holds at the bottom of the sheet', lastRing.startsWith('solid/2px'), lastRing)
await scrollSheet(win, 0)
await page.waitForTimeout(300)

// ---------------------------------------------------------------- hover
// Measured against the sheet's scroll box, not the viewport: hovering scrolls
// the plate into view, which moves its viewport rect without the plate moving.
const measurePlate = () =>
  win.locator('#project-atlas .project__plate').evaluate((el) => {
    const img = el.querySelector('.project__image')
    const r = el.getBoundingClientRect()
    const host = el.closest('.projects-sheet').getBoundingClientRect()
    const cs = getComputedStyle(el)
    return {
      relX: Math.round(r.x - host.x),
      relY: Math.round(r.y - host.y),
      w: Math.round(r.width),
      h: Math.round(r.height),
      border: cs.borderTopColor,
      bg: cs.backgroundColor,
      transform: cs.transform,
      opacity: getComputedStyle(img).opacity,
      transition: cs.transitionDuration,
    }
  })

// Scroll the plate into view before measuring: hovering scrolls too, and a
// scroll changes the viewport rect without the plate moving on the sheet.
await win.locator('#project-atlas .project__plate').scrollIntoViewIfNeeded()
await page.waitForTimeout(300)
await page.mouse.move(0, 0)
await page.waitForTimeout(200)
const before = await measurePlate()
await win.locator('#project-atlas .project__plate').hover()
await page.waitForTimeout(280)
const after = await measurePlate()

check(
  'hover does not move, resize or lift the plate',
  before.relX === after.relX && before.relY === after.relY && before.w === after.w && before.h === after.h,
  `${JSON.stringify(before.relX)} -> ${JSON.stringify(after.relX)}`
)
check('hover changes the border', before.border !== after.border, `${before.border} -> ${after.border}`)
check('hover only steps image opacity', Number(after.opacity) > Number(before.opacity), `${before.opacity} -> ${after.opacity}`)
check('no transform or lift on hover', after.transform === 'none', `transform=${after.transform}`)

// ---------------------------------------------------------------- click
await page.mouse.move(0, 0)
await win.locator('#project-atlas .project__plate').click()
await page.waitForTimeout(250)
const activeCount = await win.locator('.project__plate[data-active]').count()
check('click records the active project', activeCount === 1, `${activeCount}`)
check('click stays inside the app', page.url().endsWith('/'), page.url())

// ---------------------------------------------------------------- responsive
const widthsToTest = [1510, 1180, 980, 860, 720, 620, 560, 480, 430, 380]
console.log('\n--- responsive ---')
let responsiveOk = true
for (const w of widthsToTest) {
  await setWindow(w, Math.round(w * 0.7) + 160)
  await scrollSheet(win, 0)
  await page.waitForTimeout(200)

  const report = await win.evaluate((el) => {
    const sheet = el.querySelector('.projects-sheet')
    const nodes = [...el.querySelectorAll('.project')]
    const sheetBox = sheet.getBoundingClientRect()
    const platesEls = nodes.map((n) => n.querySelector('.project__plate').getBoundingClientRect())
    return {
      plateW: platesEls.map((r) => Math.round(r.width)),
      overflow: sheet.scrollWidth - sheet.clientWidth,
      order: nodes.map((n) => n.id.replace('project-', '')),
      pastRight: Math.max(...platesEls.map((r) => r.right)) - sheetBox.right,
      secondary: getComputedStyle(el.querySelector('.projects-band--secondary .projects-band__grid')).gridTemplateColumns,
    }
  })

  const expectedOrder = 'atlas,kindness-map,rn-wallet,fullstack-chat,shadow-tag,leetcode-dsa'
  const ok = report.overflow <= 1 && report.pastRight <= 1 && report.order.join(',') === expectedOrder
  if (!ok) responsiveOk = false
  console.log(
    `${ok ? 'ok  ' : 'BAD '} win ${String(w).padStart(4)}  plates[${report.plateW.join(', ')}]  ` +
      `overflow=${report.overflow}  pastRight=${Math.round(report.pastRight)}  secondary="${report.secondary}"`
  )
}
check('composition holds at every width', responsiveOk)

// Hierarchy must survive the narrow end: Atlas still the widest plate.
await setWindow(380, 620)
const narrowPlates = await readPlates()
const narrowAtlas = narrowPlates.find((p) => p.id === 'project-atlas')
check(
  'hierarchy survives a 380px window',
  narrowAtlas.plate.w === Math.max(...narrowPlates.map((p) => p.plate.w)),
  `atlas=${narrowAtlas.plate.w} of ${narrowPlates.map((p) => p.plate.w).join('/')}`
)

// ---------------------------------------------------------------- shots
await setWindow(880, 620)
await page.waitForTimeout(400)
await win.screenshot({ path: 'tmp-e2e/shots/projects-default.png' })

await scrollSheet(win, 99999)
await page.waitForTimeout(900)
await win.screenshot({ path: 'tmp-e2e/shots/projects-bottom.png' })

await scrollSheet(win, 0)
await setWindow(430, 720)
await page.waitForTimeout(500)
await win.screenshot({ path: 'tmp-e2e/shots/projects-narrow.png' })

// ---------------------------------------------------------------- reduced motion
const reduced = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1510, height: 980 } })
const rPage = await reduced.newPage()
await rPage.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' })
await rPage.getByLabel("Enter Shine's computer").waitFor({ state: 'attached', timeout: 45000 })
await rPage.evaluate(() => document.querySelector("[aria-label=\"Enter Shine's computer\"]").click())
await rPage.getByRole('button', { name: 'Projects', exact: true }).first().click({ force: true })
await rPage.locator('[role="dialog"][aria-label="Projects"]').waitFor({ state: 'visible', timeout: 15000 })
await rPage.waitForTimeout(700)

const reducedState = await rPage.evaluate(() => {
  const plate = document.querySelector('.project__plate')
  const img = plate.querySelector('.project__image')
  const animations = document.getAnimations().filter((a) => a.playState === 'running').length
  return {
    plateTransition: getComputedStyle(plate).transitionDuration,
    imgTransition: getComputedStyle(img).transitionDuration,
    running: animations,
  }
})
console.log('\nreduced motion:', JSON.stringify(reducedState))
// index.css collapses every transition to 0.01ms under this preference, which
// computes as 1e-05s. The requirement is no perceptible transition, not a
// literal zero.
const plateMs = parseFloat(reducedState.plateTransition) * 1000
const imgMs = parseFloat(reducedState.imgTransition) * 1000
check(
  'no perceptible transitions under prefers-reduced-motion',
  plateMs < 1 && imgMs < 1,
  `plate=${reducedState.plateTransition} img=${reducedState.imgTransition}`
)
check('no running animations under reduced motion', reducedState.running === 0, `${reducedState.running}`)

const rPlates = await rPage.locator('.project').evaluateAll((nodes) =>
  nodes.map((n) => Math.round(n.querySelector('.project__plate').getBoundingClientRect().width))
)
const rAtlas = await rPage.evaluate(() => {
  const n = document.querySelector('#project-atlas .project__plate')
  return Math.round(n.getBoundingClientRect().width)
})
check('hierarchy identical under reduced motion', rAtlas === Math.max(...rPlates), `${rPlates.join('/')}`)
await rPage.locator('[role="dialog"][aria-label="Projects"]').screenshot({ path: 'tmp-e2e/shots/projects-reduced-motion.png' })
await reduced.close()

// ---------------------------------------------------------------- regressions
await setWindow(880, 620)
await page.evaluate(() => {
  const close = document.querySelector('.desktop-window[role="dialog"] .desktop-window__control--close')
  close?.click()
})
await page.waitForTimeout(300)

const aboutBtn = page.getByRole('button', { name: 'About', exact: true }).first()
await aboutBtn.click({ force: true })
const aboutWin = page.locator('[role="dialog"][aria-label="About"]')
await aboutWin.waitFor({ state: 'visible', timeout: 15000 })
await page.waitForTimeout(1600)
const aboutRevealed = await aboutWin.locator('[data-motion][data-revealed]').count()
const aboutBlocks = await aboutWin.locator('[data-motion]').count()
// About reveals on scroll, so only the blocks inside the first viewport have
// been marked here. What this needs to prove is that the mechanism still runs.
check(
  'About still opens and reveals on view',
  aboutRevealed > 0 && aboutBlocks > 0,
  `${aboutRevealed} of ${aboutBlocks} revealed in view`
)
await aboutWin.screenshot({ path: 'tmp-e2e/shots/projects-regression-about.png' })

await page.evaluate(() => {
  document.querySelectorAll('.desktop-window[role="dialog"] .desktop-window__control--close').forEach((c) => c.click())
})
await page.waitForTimeout(300)
const dockOk = await page.evaluate(() => {
  const dock = document.querySelector('.dock')
  return Boolean(dock && dock.getBoundingClientRect().height > 0 && dock.children.length > 0)
})
check('dock intact', dockOk)

// Projects reopens cleanly after About has been used.
await page.getByRole('button', { name: 'Projects', exact: true }).first().click({ force: true })
await page.locator('[role="dialog"][aria-label="Projects"]').waitFor({ state: 'visible', timeout: 15000 })
await page.waitForTimeout(600)
check('Projects reopens after About', (await win.locator('.project').count()) === 6)
await page.locator('[role="dialog"][aria-label="Projects"]').screenshot({ path: 'tmp-e2e/shots/projects-reopen.png' })

console.log(`\n${failures.length === 0 ? 'ALL CHECKS PASSED' : `FAILURES (${failures.length}): ${failures.join(' | ')}`}`)
await browser.close()
process.exit(failures.length === 0 ? 0 : 1)