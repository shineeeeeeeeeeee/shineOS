import { chromium } from 'playwright'

const URL = 'http://localhost:5173/'

const aboutDockButton = (page) => page.getByRole('button', { name: 'About', exact: true }).first()

async function openAbout(page) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  const enter = page.getByLabel("Enter Shine's computer")
  await enter.waitFor({ state: 'attached', timeout: 45000 })
  await enter.evaluate((el) => el.click())
  const aboutButton = aboutDockButton(page)
  await aboutButton.waitFor({ state: 'visible', timeout: 60000 })
  await aboutButton.click({ force: true })
  const win = page.locator('[role="dialog"][aria-label="About"]')
  await win.waitFor({ state: 'visible', timeout: 15000 })
  await page.waitForTimeout(400)
  return win
}

const setWindowWidth = async (page, w) => {
  await page.evaluate((v) => {
    const el = document.querySelector('.desktop-window')
    if (el) el.style.width = v + 'px'
  }, w)
  await page.waitForTimeout(350)
}

const measure = (page) =>
  page.evaluate(() => {
    const paper = document.querySelector('.about-app__paper')
    const doc = document.querySelector('.about-doc')
    const img = document.querySelector('.about-illustration__image')
    const heroText = document.querySelector('.about-hero__text')
    const heroFig = document.querySelector('.about-hero__figure')
    const sections = [...document.querySelectorAll('.about-split > .about-section')]
    const topics = [...document.querySelectorAll('.about-topics__item')]
    const footerRows = [...document.querySelectorAll('.about-footer__row')]
    const r = (el) => (el ? el.getBoundingClientRect() : null)
    const s = getComputedStyle(doc)
    const docContent = doc.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight)

    const cols = (rects) => new Set(rects.map((b) => Math.round(b.x))).size
    const rows = (rects) => new Set(rects.map((b) => Math.round(b.y))).size

    const animated = []
    const hooks = document.querySelectorAll('[data-motion]')
    hooks.forEach((el) => {
      const cs = getComputedStyle(el)
      if (cs.animationName !== 'none' || cs.transitionDuration !== '0s') {
        animated.push(el.getAttribute('data-motion'))
      }
    })

    return {
      paperWidth: paper.clientWidth,
      docClientWidth: doc.clientWidth,
      docContent,
      fill: +(docContent / paper.clientWidth).toFixed(3),
      docMaxWidth: s.maxWidth,
      docMargin: s.marginLeft + ' / ' + s.marginRight,
      overflowX: paper.scrollWidth - paper.clientWidth,
      scrollable: paper.scrollHeight > paper.clientHeight,
      docHeight: Math.round(doc.getBoundingClientRect().height),
      paperHeight: paper.clientHeight,
      img: (() => { const b = r(img); return b ? { w: Math.round(b.width), h: Math.round(b.height), x: Math.round(b.x), y: Math.round(b.y) } : null })(),
      imgShare: +(img.getBoundingClientRect().width / docContent).toFixed(3),
      heroSideBySide: r(heroFig).x >= r(heroText).x + r(heroText).width - 4,
      heroTextW: Math.round(r(heroText).width),
      heroFigW: Math.round(r(heroFig).width),
      splitSideBySide: sections.length === 2 && r(sections[1]).x >= r(sections[0]).x + r(sections[0]).width - 4,
      topicCols: cols(topics.map(r)),
      topicRows: rows(topics.map(r)),
      footerCols: cols(footerRows.map(r)),
      motionHookCount: hooks.length,
      animatedElements: animated,
      keyframeRules: (() => {
        let n = 0
        for (const sheet of Array.from(document.styleSheets)) {
          let rules
          try { rules = sheet.cssRules } catch { continue }
          for (const rule of Array.from(rules)) {
            if (rule.type === CSSRule.KEYFRAMES_RULE) n++
          }
        }
        return n
      })(),
    }
  })

const results = []
const check = (name, pass, detail) => results.push({ name, pass, detail })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1512, height: 900 } })

const consoleErrors = []
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message))

try {
  const win = await openAbout(page)
  check('About opens from the Dock', true, '')

  for (const [label, w] of [['WIDE', 1240], ['MEDIUM', 820], ['NARROW', 430]]) {
    await setWindowWidth(page, w)
    const m = await measure(page)
    console.log(`\n--- ${label} (window ${w}px) ---`)
    console.log(JSON.stringify(m, null, 2))
    await win.screenshot({ path: `tmp-e2e/shots/about-${label.toLowerCase()}.png` })
    check(`${label}: no horizontal overflow`, m.overflowX <= 1, `overflowX=${m.overflowX}`)
    check(`${label}: page fills window width`, m.fill >= 0.82, `fill=${m.fill}`)
    check(`${label}: no max-width column`, m.docMaxWidth === 'none', `max-width=${m.docMaxWidth}`)
    check(`${label}: illustration square`, Math.abs(m.img.w - m.img.h) <= 1, `${m.img.w}x${m.img.h}`)
    check(`${label}: internal scrolling works`, m.scrollable, '')
  }

  // Breakdown of the responsive structure.
  await setWindowWidth(page, 1240)
  const wide = await measure(page)
  check('WIDE: hero is two columns', wide.heroSideBySide, '')
  check('WIDE: ABOUT | CURRENTLY side by side', wide.splitSideBySide, '')
  check('WIDE: topics in three columns', wide.topicCols === 3 && wide.topicRows === 2, `cols=${wide.topicCols} rows=${wide.topicRows}`)
  check('WIDE: artwork is 35-45% of content width', wide.imgShare >= 0.35 && wide.imgShare <= 0.45, `share=${wide.imgShare}`)
  check('WIDE: footer metadata in two columns', wide.footerCols === 2, `cols=${wide.footerCols}`)

  await setWindowWidth(page, 820)
  const med = await measure(page)
  check('MEDIUM: hero is two columns', med.heroSideBySide, '')
  check('MEDIUM: ABOUT | CURRENTLY side by side', med.splitSideBySide, '')
  check('MEDIUM: topics in two columns', med.topicCols === 2, `cols=${med.topicCols}`)
  check('MEDIUM: artwork is 35-45% of content width', med.imgShare >= 0.35 && med.imgShare <= 0.45, `share=${med.imgShare}`)

  await setWindowWidth(page, 430)
  const nar = await measure(page)
  check('NARROW: hero collapses to one column', !nar.heroSideBySide, '')
  check('NARROW: ABOUT / CURRENTLY stack', !nar.splitSideBySide, '')
  check('NARROW: topics in one column', nar.topicCols === 1, `cols=${nar.topicCols}`)
  check('NARROW: artwork stays within content width', nar.img.w <= nar.docContent + 1, `${nar.img.w} <= ${nar.docContent.toFixed(2)}`)

  // Motion check: nothing animates yet.
  const still = await measure(page)
  check('No element is animated (motion not implemented)', still.animatedElements.length === 0, JSON.stringify(still.animatedElements))
  check('Motion hooks are present for the next step', still.motionHookCount >= 15, `hooks=${still.motionHookCount}`)

  // Window lifecycle.
  await setWindowWidth(page, 900)
  const paper = win.locator('.about-app__paper')
  await paper.hover()
  await page.mouse.wheel(0, 600)
  await page.waitForTimeout(800)
  const scrolled = await paper.evaluate((el) => el.scrollTop)
  check('Scrolling works', scrolled > 0, `scrollTop=${scrolled}`)

  await win.getByLabel('Minimize window').click()
  await page.waitForTimeout(500)
  const minimized = await page.locator('[role="dialog"][aria-label="About"]').isHidden()
  check('Minimize works', minimized, '')
  await aboutDockButton(page).click({ force: true })
  await page.waitForTimeout(600)
  check('Restore from dock works', await win.isVisible(), '')

  await win.getByLabel('Maximize window').click()
  await page.waitForTimeout(500)
  const maxMetrics = await measure(page)
  check('Maximize works', await win.isVisible(), `window=${maxMetrics.paperWidth}px imgShare=${maxMetrics.imgShare}`)
  check('Maximized: still no horizontal overflow', maxMetrics.overflowX <= 1, `overflowX=${maxMetrics.overflowX}`)
  await win.getByLabel('Restore window').click()
  await page.waitForTimeout(500)
  check('Restore from maximize works', await win.isVisible(), '')

  await win.getByLabel('Close window').click()
  await page.waitForTimeout(600)
  check('Close works', await page.locator('[role="dialog"][aria-label="About"]').count() === 0, '')
  await aboutDockButton(page).click({ force: true })
  await page.waitForTimeout(700)
  const reopened = page.locator('[role="dialog"][aria-label="About"]')
  check('Reopen works', await reopened.isVisible(), '')
  check('Illustration still intact after lifecycle', (await reopened.locator('.about-illustration__image').count()) === 1, '')

  // Files -> About.
  await page.evaluate(() => {
    const el = document.querySelector('.desktop-window')
    if (el) el.style.width = ''
  })
  await page.waitForTimeout(300)
  const filesBtn = page.getByRole('button', { name: 'Files', exact: true }).first()
  if (await filesBtn.count()) {
    await filesBtn.click({ force: true })
    await page.waitForTimeout(700)
    const files = page.locator('[role="dialog"][aria-label="Files"]')
    if (await files.count()) {
      const aboutRow = files.getByText('About', { exact: true }).first()
      if (await aboutRow.count()) {
        await aboutRow.dblclick({ force: true }).catch(async () => aboutRow.click({ force: true }))
        await page.waitForTimeout(800)
      }
      check('Files -> About still works', (await page.locator('[role="dialog"][aria-label="About"]').count()) > 0, '')
    }
  }

  // Reduced motion infrastructure.
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForTimeout(300)
  const rm = await reopened.locator('.about-illustration__image').evaluate((el) => {
    const s = getComputedStyle(el)
    return { name: s.animationName }
  })
  check('Reduced-motion infrastructure intact', rm.name === 'none', JSON.stringify(rm))

  const filtered = consoleErrors.filter(
    (e) => !(e.includes('Invalid DOM property') && /stroke-(linecap|width)|stroke(Linecap|Width)/.test(e))
  )
  check('No console errors', filtered.length === 0, filtered.join(' | '))
} catch (err) {
  check('Script completed without throwing', false, String(err))
} finally {
  await browser.close()
}

let failed = 0
for (const r of results) {
  if (!r.pass) failed++
  console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? '  (' + r.detail + ')' : ''}`)
}
console.log(`\n${results.length - failed}/${results.length} checks passed`)
process.exit(failed === 0 ? 0 : 1)