// Geometry probe: measures the DSA artifact and the sheet first-viewport
// composition numerically, since screenshots cannot be eyeballed here.
import { chromium } from 'playwright'

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1510, height: 980 } })

await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' })
await page.getByLabel("Enter Shine's computer").waitFor({ state: 'attached', timeout: 45000 })
await page.evaluate(() => document.querySelector("[aria-label=\"Enter Shine's computer\"]").click())
await page.waitForTimeout(600)
await page.getByRole('button', { name: 'Projects', exact: true }).first().click({ force: true })
await page.waitForTimeout(800)

const open = async (id) => {
  await page.locator(`#project-${id} .project__plate`).dispatchEvent('click')
  await page.waitForTimeout(700)
}
const closeSheet = async (title) => {
  const w = page.locator(`[role="dialog"][aria-label="${title} · Projects"]`)
  if (await w.count()) {
    await w.locator('.desktop-window__control--close').dispatchEvent('click')
    await page.waitForTimeout(400)
  }
}

// ---------------------------------------------------------------- DSA plate
await page.locator('#project-leetcode-dsa').scrollIntoViewIfNeeded()
await page.waitForTimeout(400)

const plate = await page.evaluate(() => {
  const p = document.querySelector('#project-leetcode-dsa .project__plate')
  const a = document.querySelector('#project-leetcode-dsa .dsa')
  const box = (sel) => {
    const el = a.querySelector(sel)
    if (!el) return null
    const r = el.getBoundingClientRect()
    return {
      x: Math.round(r.x), y: Math.round(r.y),
      w: Math.round(r.width), h: Math.round(r.height),
      bottom: Math.round(r.bottom), right: Math.round(r.right),
      text: (el.textContent || '').trim().slice(0, 40),
    }
  }
  const pr = p.getBoundingClientRect()
  const ar = a.getBoundingClientRect()
  const parts = {
    bar: box('.dsa__bar'),
    entry: box('.dsa__entry'),
    count: box('.dsa__entry-count'),
    index: box('.dsa__index'),
    files: box('.dsa__files'),
    foot: box('.dsa__foot'),
  }
  const overflow = Object.entries(parts)
    .filter(([, v]) => v && (v.bottom > ar.bottom + 1 || v.right > ar.right + 1))
    .map(([k]) => k)
  return {
    plate: { w: Math.round(pr.width), h: Math.round(pr.height) },
    artifact: { w: Math.round(ar.width), h: Math.round(ar.height) },
    fontSize: getComputedStyle(a).fontSize,
    fontFamily: getComputedStyle(a).fontFamily.split(',')[0],
    caretAnimation: getComputedStyle(a.querySelector('.dsa__caret')).animationName,
    caretDuration: getComputedStyle(a.querySelector('.dsa__caret')).animationDuration,
    parts,
    overflow,
  }
})

console.log('=== DSA PLATE (the live archive artifact) ===')
console.log('plate', plate.plate, 'artifact', plate.artifact)
console.log('mono font:', plate.fontFamily, plate.fontSize)
console.log('caret animation:', plate.caretAnimation, plate.caretDuration)
console.log('parts, top to bottom:')
Object.entries(plate.parts)
  .sort((a, b) => a[1].y - b[1].y)
  .forEach(([k, v]) => console.log(`  ${k.padEnd(8)} y=${String(v.y).padStart(4)} h=${String(v.h).padStart(3)} w=${String(v.w).padStart(4)}  "${v.text}"`))
console.log('overflowing parts:', plate.overflow.length === 0 ? 'none' : plate.overflow.join(', '))

// The count is a child of the entry line, so only the top-level bands are
// compared for overlap.
const bands = ['bar', 'entry', 'index', 'files', 'foot'].map((k) => plate.parts[k])
const stacked = bands.every((v, i, arr) => i === 0 || arr[i - 1].bottom <= v.y + 2)
console.log('bands stack without overlapping:', stacked)
console.log('artifact fits its plate:', plate.artifact.h <= plate.plate.h && plate.artifact.w <= plate.plate.w)

// ------------------------------------------------- sheet first-viewport map
await open('atlas')
await closeSheet('Atlas').catch(() => {})
await open('leetcode-dsa')
await page.waitForTimeout(400)

const dsaSheet = await page.evaluate(() => {
  const win = [...document.querySelectorAll('.desktop-window[role="dialog"]')].find((n) =>
    n.getAttribute('aria-label') === 'Leetcode DSA · Projects'
  )
  const scroll = win.querySelector('.sheet')
  const rows = []
  const push = (label, sel) => {
    const el = win.querySelector(sel)
    if (!el) return
    const r = el.getBoundingClientRect()
    rows.push({ label, y: Math.round(r.y - scroll.getBoundingClientRect().y), h: Math.round(r.height), w: Math.round(r.width) })
  }
  push('identity', '.sheet__head')
  push('notebook page', '.dsa-sheet__page')
  push('facts', '.dsa-sheet__facts')
  push('what this is', '.sheet__section')
  push('folder index', '.dsa-sheet__index')
  rows.sort((a, b) => a.y - b.y)
  return {
    viewport: Math.round(scroll.getBoundingClientRect().height),
    rows,
    indexColumns: getComputedStyle(win.querySelector('.dsa-sheet__index')).gridTemplateColumns,
  }
})

console.log('\n=== DSA SHEET — what lands in the first viewport ===')
console.log('sheet viewport height:', dsaSheet.viewport)
dsaSheet.rows.forEach((r) => {
  const inFold = r.y < dsaSheet.viewport ? '  <- above the fold' : ''
  console.log(`  ${r.label.padEnd(14)} y=${String(r.y).padStart(4)} h=${String(r.h).padStart(4)} w=${String(r.w).padStart(4)}${inFold}`)
})
console.log('folder index columns:', dsaSheet.indexColumns)

await closeSheet('Leetcode DSA')

// ------------------------------------------- atlas first-viewport composition
await open('atlas')
await page.waitForTimeout(400)
const atlasSheet = await page.evaluate(() => {
  const win = [...document.querySelectorAll('.desktop-window[role="dialog"]')].find((n) =>
    n.getAttribute('aria-label') === 'Atlas · Projects'
  )
  const scroll = win.querySelector('.sheet')
  const top = scroll.getBoundingClientRect().top
  const rows = []
  const push = (label, sel) => {
    const el = win.querySelector(sel)
    if (!el) return
    const r = el.getBoundingClientRect()
    rows.push({ label, y: Math.round(r.y - top), h: Math.round(r.height), w: Math.round(r.width) })
  }
  push('eyebrow', '.sheet__eyebrow')
  push('title', '.sheet__title')
  push('summary', '.sheet__summary')
  push('HERO', '.sheet__hero')
  push('links', '.sheet__links')
  push('why', '.sheet__section')
  rows.sort((a, b) => a.y - b.y)
  return {
    viewport: Math.round(scroll.getBoundingClientRect().height),
    rows,
    imageNatural: (() => {
      const i = win.querySelector('.sheet__hero-image')
      return { w: i.naturalWidth, h: i.naturalHeight }
    })(),
  }
})

console.log('\n=== ATLAS SHEET — first-viewport composition ===')
console.log('sheet viewport height:', atlasSheet.viewport)
console.log('hero source pixels:', atlasSheet.imageNatural)
atlasSheet.rows.forEach((r) => {
  const inFold = r.y < atlasSheet.viewport ? '  <- above the fold' : ''
  console.log(`  ${r.label.padEnd(10)} y=${String(r.y).padStart(4)} h=${String(r.h).padStart(4)} w=${String(r.w).padStart(4)}${inFold}`)
})

const hero = atlasSheet.rows.find((r) => r.label === 'HERO')
const textBefore = atlasSheet.rows.filter((r) => ['eyebrow', 'title', 'summary'].includes(r.label))
console.log('\ntext block above the visual:', textBefore.reduce((n, r) => n + r.h, 0), 'px')
console.log('visual height:', hero.h, 'px')
console.log('visual is', (hero.h / textBefore.reduce((n, r) => n + r.h, 0)).toFixed(1), 'x the text block')
console.log('text share of first viewport:', ((textBefore.reduce((n, r) => n + r.h, 0) / atlasSheet.viewport) * 100).toFixed(0) + '%')
console.log('visual share of first viewport:', ((hero.h / atlasSheet.viewport) * 100).toFixed(0) + '%')
console.log('\nWIDE order ->', atlasSheet.rows.map((r) => r.label).join(' -> '))

// ------------------------------------------------------- narrow reading order
// A sheet window narrowed to roughly phone width must read
// visual -> identity -> description -> details.
await page.evaluate(() => {
  const win = [...document.querySelectorAll('.desktop-window[role="dialog"]')].find(
    (n) => n.getAttribute('aria-label') === 'Atlas · Projects'
  )
  win.style.width = '380px'
  win.style.height = '720px'
})
await page.waitForTimeout(600)

const narrow = await page.evaluate(() => {
  const win = [...document.querySelectorAll('.desktop-window[role="dialog"]')].find((n) =>
    n.getAttribute('aria-label') === 'Atlas · Projects'
  )
  const scroll = win.querySelector('.sheet')
  const sr = scroll.getBoundingClientRect()
  const rows = []
  const push = (label, sel) => {
    const el = win.querySelector(sel)
    if (!el) return
    const r = el.getBoundingClientRect()
    rows.push({ label, y: Math.round(r.y - sr.y), h: Math.round(r.height), w: Math.round(r.width) })
  }
  push('VISUAL', '.sheet__hero')
  push('IDENTITY', '.sheet__head')
  push('DESCRIPTION', '.sheet__summary')
  push('links', '.sheet__links')
  rows.sort((a, b) => a.y - b.y)
  const sum = win.querySelector('.sheet__summary').getBoundingClientRect()
  return {
    viewport: Math.round(sr.height),
    docWidth: Math.round(win.querySelector('.sheet__doc').getBoundingClientRect().width),
    rows,
    summaryBottom: Math.round(sum.bottom - sr.y),
  }
})

console.log('\n=== ATLAS SHEET — narrow window (430px) ===')
console.log('window inner width:', narrow.docWidth, ' viewport height:', narrow.viewport)
narrow.rows.forEach((r) => {
  const inFold = r.y < narrow.viewport ? '  <- above the fold' : ''
  console.log(`  ${r.label.padEnd(12)} y=${String(r.y).padStart(4)} h=${String(r.h).padStart(4)} w=${String(r.w).padStart(4)}${inFold}`)
})
console.log('narrow order ->', narrow.rows.map((r) => r.label).join(' -> '))
console.log('summary finishes at y=' + narrow.summaryBottom, narrow.summaryBottom < narrow.viewport ? '(description is also above the fold)' : '(below the fold)')
console.log('hero is uncropped at narrow:', narrow.rows[0].label === 'VISUAL' && narrow.rows[0].h > 0)
console.log('hero width == document measure (no stretch):', narrow.rows[0].w <= narrow.docWidth)

await browser.close()