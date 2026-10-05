// Temporary verification for STEP 11D — living About.
// Walks the full checklist: default size, frame cycle, entrance, one-way reveal,
// illustration integrity, overflow sweep, window interactions, reduced motion.
import { chromium } from 'playwright'

const URL = 'http://localhost:5173/'
const results = []
const check = (name, ok, detail = '') =>
  results.push({ ok, line: `${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}` })

// No Playwright browser bundle is cached in this environment, so the harness
// drives the system Chrome install instead. Same engine, same rendering.
const browser = await chromium.launch({ channel: 'chrome' })

async function session(opts = {}) {
  const page = await browser.newPage({ viewport: { width: 1510, height: 950 } })
  const errors = []
  // Pre-existing dev-mode React warnings from the window chrome and the world
  // scene (stroke-width / stroke-linecap). They are not About's and they are
  // not runtime failures, so they are filtered out rather than reported.
  const PRE_EXISTING = /Invalid DOM property|stroke-width|stroke-linecap/
  page.on('pageerror', (e) => {
    if (!PRE_EXISTING.test(e.message)) errors.push(e.message)
  })
  page.on('console', (m) => {
    if (m.type() === 'error' && !PRE_EXISTING.test(m.text())) errors.push(m.text())
  })
  if (opts.reducedMotion) await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  const enter = page.getByLabel("Enter Shine's computer")
  await enter.waitFor({ state: 'attached', timeout: 45000 })
  await enter.evaluate((el) => el.click())
  const dockAbout = page.getByRole('button', { name: 'About', exact: true }).first()
  await dockAbout.waitFor({ state: 'visible', timeout: 45000 })
  await dockAbout.click({ force: true })
  const win = page.locator('[role="dialog"][aria-label="About"]')
  await win.waitFor({ state: 'visible', timeout: 15000 })
  return { page, win, errors }
}

const setWidth = async (page, px) => {
  await page.evaluate((w) => {
    const el = document.querySelector('.desktop-window')
    if (el) el.style.width = `${w}px`
  }, px)
  await page.waitForTimeout(400)
}

const frameOf = (win) =>
  win.locator('.about-illustration__image').evaluate((el) => el.dataset.illustrationFrame)

// --- 1. Default presentation ----------------------------------------------
{
  const { page, win, errors } = await session()
  await page.waitForTimeout(1200)

  const w = await win.evaluate((el) => Math.round(el.getBoundingClientRect().width))
  check('About opens at the wider default size', w === 860, `${w}px`)

  const hero = await win.locator('.about-hero').evaluate((el) => {
    const t = el.querySelector('.about-hero__text').getBoundingClientRect()
    const f = el.querySelector('.about-hero__figure').getBoundingClientRect()
    return { columns: getComputedStyle(el).gridTemplateColumns, textRight: t.right, figLeft: f.left }
  })
  check('hero uses the two-column composition by default', hero.columns.split(' ').length === 2, hero.columns)
  check('artwork sits beside the text', hero.figLeft > hero.textRight - 2, `text=${Math.round(hero.textRight)} fig=${Math.round(hero.figLeft)}`)

  const paperW = await win.locator('.about-app__paper').evaluate((el) => el.clientWidth)
  check('default size clears the wide container breakpoint', paperW >= 620, `paper=${paperW}px`)

  const imgs = await win.locator('.about-app img').count()
  check('exactly one image is rendered for the illustration', imgs === 1, `count=${imgs}`)

  const alt = await win.locator('.about-illustration__image').getAttribute('alt')
  check('illustration keeps its alt text', !!alt && alt.length > 20, alt)

  check('no console errors on open', errors.length === 0, errors.join(' | '))
  await page.close()
}

// --- 2. Illustration frame cycle -------------------------------------------
{
  const { page, win, errors } = await session()

  // Sample the frame index for two full passes (~15.5s) and compress the samples
  // into the order the frames were actually shown in, with how long each was held.
  const samples = await win.evaluate(async () => {
    const img = document.querySelector('.about-illustration__image')
    const out = []
    const start = performance.now()
    while (performance.now() - start < 15600) {
      out.push([Math.round(performance.now() - start), Number(img.dataset.illustrationFrame)])
      await new Promise((r) => setTimeout(r, 60))
    }
    return out
  })

  const steps = []
  for (const [t, f] of samples) {
    const last = steps[steps.length - 1]
    if (last && last.frame === f) continue
    steps.push({ frame: f, at: t, until: t })
    if (steps.length > 1) steps[steps.length - 2].until = t
  }
  const order = steps.map((s) => s.frame)
  const holds = steps.map((s) => s.until - s.at)
  console.log(`  frame order: ${order.join(' → ')}`)
  console.log(`  frame holds: ${holds.join('ms, ')}ms`)

  // Sampling runs at 60ms, so each hold is measured to about that accuracy.
  const near = (value, target, tolerance = 300) => Math.abs(value - target) <= tolerance

  check('cycle runs 01 → 02 → 03 → 02 → 01', order.slice(0, 5).join(',') === '0,1,2,1,0', order.join(','))
  // Two full passes inside the sampling window: the order must be the same cycle twice.
  check('cycle loops', order.slice(0, 9).join(',') === '0,1,2,1,0,1,2,1,0', order.join(','))
  check('cycle is deliberately uneven', new Set(holds.slice(1, 5)).size === 4, holds.slice(1, 5).join('/'))

  // Each frame is held for its own time, and the rest belongs to the master frame.
  check('01 rests ~1.6s before it first moves', near(holds[0], 1600), `${holds[0]}ms`)
  check('02 is held ~1.2s', near(holds[1], 1200), `${holds[1]}ms`)
  check('03 is held ~1.5s', near(holds[2], 1500), `${holds[2]}ms`)
  check('02 is held ~1.2s on the way back', near(holds[3], 1200), `${holds[3]}ms`)
  check('01 rests ~2.0s, the longest hold', near(holds[4], 2000), `${holds[4]}ms`)
  check('the loop repeats its timing', near(holds[8], 2000) && near(holds[5], 1200), `${holds[5]}/${holds[8]}`)

  const srcs = await win.locator('.about-illustration__image').evaluate((el) => ({
    src: el.currentSrc || el.src,
    complete: el.complete,
    natural: [el.naturalWidth, el.naturalHeight],
  }))
  check('a frame is fully decoded at all times', srcs.complete, srcs.src.split('/').pop())
  check('frames are the approved assets', /shine-about-0[123]\.png$/.test(srcs.src), srcs.src.split('/').pop())

  check('no console errors during the cycle', errors.length === 0, errors.join(' | '))
  await page.close()
}

// --- 3. Artwork integrity ---------------------------------------------------
{
  const { page, win } = await session()
  await page.waitForTimeout(1000)

  const geo = await win.locator('.about-illustration__image').evaluate((el) => {
    const r = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    return {
      w: r.width,
      h: r.height,
      ratio: r.width / r.height,
      naturalRatio: el.naturalWidth / el.naturalHeight,
      objectFit: s.objectFit,
      filter: s.filter,
      transform: s.transform,
      borderRadius: s.borderRadius,
      boxShadow: s.boxShadow,
      upscaled: r.width > el.naturalWidth,
    }
  })

  check('artwork keeps a 1:1 aspect ratio on screen', Math.abs(geo.ratio - 1) < 0.02, `ratio=${geo.ratio.toFixed(4)}`)
  check('artwork is never cropped or stretched', geo.objectFit === 'contain', geo.objectFit)
  check('artwork is never upscaled', !geo.upscaled, `${Math.round(geo.w)}px`)
  check('no filter alters the artwork', geo.filter === 'none', geo.filter)
  check('artwork is not transformed', geo.transform === 'none', geo.transform)
  check('artwork carries no chrome', geo.borderRadius === '0px' && geo.boxShadow === 'none', `${geo.borderRadius} / ${geo.boxShadow}`)

  // The box must not move while the frames change.
  const before = await win.locator('.about-illustration__image').boundingBox()
  await page.waitForTimeout(3200)
  const after = await win.locator('.about-illustration__image').boundingBox()
  check(
    'the frame swap causes no reflow or jump',
    Math.abs(before.x - after.x) < 0.5 && Math.abs(before.y - after.y) < 0.5 && Math.abs(before.width - after.width) < 0.5,
    `dx=${(after.x - before.x).toFixed(2)} dy=${(after.y - before.y).toFixed(2)}`,
  )

  await page.close()
}

// --- 4. Text entrance -------------------------------------------------------
{
  const { page, win, errors } = await session()

  const trace = await win.evaluate(async () => {
    const pick = (sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const s = getComputedStyle(el)
      const m = new DOMMatrixReadOnly(s.transform)
      return { opacity: Number(s.opacity), y: Math.round(m.m42 * 100) / 100, revealed: el.dataset.revealed }
    }
    const out = []
    const start = performance.now()
    while (performance.now() - start < 1500) {
      out.push({
        t: Math.round(performance.now() - start),
        eyebrow: pick('[data-motion="hero-eyebrow"]'),
        greeting: pick('[data-motion="hero-greeting"]'),
        intro: pick('[data-motion="hero-intro"]'),
        signoff: pick('[data-motion="hero-signoff"]'),
        figure: pick('[data-motion="hero-illustration"]'),
      })
      await new Promise((r) => setTimeout(r, 50))
    }
    return out
  })

  const seen = (key) => trace.filter((s) => s[key] && s[key].opacity < 0.99)
  const maxY = (key) => Math.max(0, ...trace.map((s) => (s[key] ? Math.abs(s[key].y) : 0)))
  const firstSeen = (key) => {
    const i = trace.findIndex((s) => s[key] && s[key].opacity > 0.5)
    return i < 0 ? null : trace[i].t
  }

  for (const key of ['eyebrow', 'greeting', 'intro', 'signoff', 'figure']) {
    check(`hero ${key} fades in rather than appearing`, seen(key).length > 0, `${seen(key).length} partial frames`)
  }
  check('entrance travel stays within 6–12px', Math.max(...['eyebrow', 'greeting', 'intro', 'signoff', 'figure'].map(maxY)) <= 12, `maxY=${Math.max(...['eyebrow', 'greeting', 'intro', 'signoff', 'figure'].map(maxY))}px`)

  const orderOk =
    firstSeen('eyebrow') !== null &&
    firstSeen('greeting') !== null &&
    firstSeen('intro') !== null &&
    firstSeen('signoff') !== null &&
    firstSeen('eyebrow') <= firstSeen('greeting') &&
    firstSeen('greeting') <= firstSeen('intro') &&
    firstSeen('intro') <= firstSeen('signoff')
  check(
    'hero settles in reading order (label → greeting → intro → sign-off)',
    orderOk,
    `eyebrow=${firstSeen('eyebrow')}ms greeting=${firstSeen('greeting')}ms intro=${firstSeen('intro')}ms signoff=${firstSeen('signoff')}ms`,
  )
  check(
    'the drawing enters with the text, a touch slower',
    firstSeen('figure') !== null && firstSeen('figure') >= firstSeen('eyebrow') - 30,
    `figure=${firstSeen('figure')}ms`,
  )

  // After the entrance: everything at rest, nothing still running.
  await page.waitForTimeout(1600)
  const settled = await win.evaluate(() => {
    const app = document.querySelector('.about-app')
    const running = []
    let faded = 0
    // Blocks that have not been revealed yet are *meant* to still be invisible —
    // they are waiting to be read. Only revealed blocks must be fully opaque.
    for (const el of app.querySelectorAll('[data-motion]')) {
      if (el.hasAttribute('data-revealed') && Number(getComputedStyle(el).opacity) < 0.999) faded++
      for (const a of el.getAnimations()) {
        if (a.playState === 'running') running.push(el.dataset.motion)
      }
    }
    return { faded, running: [...new Set(running)] }
  })
  check('every revealed block is fully opaque after the entrance', settled.faded === 0, `faded=${settled.faded}`)
  check('no motion continues after the entrance', settled.running.length === 0, settled.running.join(','))

  check('no console errors during the entrance', errors.length === 0, errors.join(' | '))
  await page.close()
}

// --- 5. One-way scroll reveal ----------------------------------------------
{
  const { page, win } = await session()
  await page.waitForTimeout(1400)

  const initial = await win.evaluate(() => {
    const app = document.querySelector('.about-app')
    return {
      revealed: app.querySelectorAll('[data-revealed]').length,
      footerRevealed: app.querySelector('.about-footer').hasAttribute('data-revealed'),
    }
  })
  check('below-the-fold bands wait for the reader', !initial.footerRevealed, `revealed=${initial.revealed}`)

  const paper = win.locator('.about-app__paper')
  await paper.evaluate((el) => el.scrollTo({ top: el.scrollHeight, behavior: 'auto' }))
  await page.waitForTimeout(1400)

  const atBottom = await win.evaluate(() => {
    const app = document.querySelector('.about-app')
    const hidden = [...app.querySelectorAll('[data-motion][data-revealed]')].filter(
      (el) => Number(getComputedStyle(el).opacity) < 0.999,
    ).length
    return {
      revealed: app.querySelectorAll('[data-revealed]').length,
      hidden,
      closing: !!app.querySelector('[data-motion-id="closing"]'),
      footer: !!app.querySelector('.about-footer'),
    }
  })
  check('scrolling reveals the rest of the document', atBottom.revealed > initial.revealed, `${initial.revealed} → ${atBottom.revealed}`)
  check('revealed content stays visible at the bottom', atBottom.hidden === 0, `hidden=${atBottom.hidden}`)

  const scrollTop = await paper.evaluate((el) => el.scrollTop)
  check('scrolling reaches the closing section and footer', scrollTop > 150, `scrollTop=${Math.round(scrollTop)}`)

  // Scroll back: nothing may replay, nothing may re-hide.
  await paper.evaluate((el) => el.scrollTo({ top: 0, behavior: 'auto' }))
  await page.waitForTimeout(900)
  const backAtTop = await win.evaluate(() => {
    const app = document.querySelector('.about-app')
    return {
      revealed: app.querySelectorAll('[data-revealed]').length,
      running: [...app.querySelectorAll('[data-motion]')].filter((el) =>
        el.getAnimations().some((a) => a.playState === 'running'),
      ).length,
      faded: [...app.querySelectorAll('[data-motion]')].filter(
        (el) => Number(getComputedStyle(el).opacity) < 0.999,
      ).length,
    }
  })
  check('scrolling back does not un-reveal anything', backAtTop.revealed === atBottom.revealed, `${atBottom.revealed} → ${backAtTop.revealed}`)
  check('scrolling back does not replay the animation', backAtTop.running === 0, `running=${backAtTop.running}`)
  check('nothing is hidden after scrolling back', backAtTop.faded === 0, `faded=${backAtTop.faded}`)

  await page.close()
}

// --- 6. Overflow sweep + resize round trip ---------------------------------
{
  const { page, win, errors } = await session()
  for (const w of [300, 340, 430, 520, 620, 820, 1100, 1240, 1510]) {
    await setWidth(page, w)
    const m = await win.locator('.about-app__paper').evaluate((el) => el.scrollWidth - el.clientWidth)
    check(`no horizontal overflow @ ${w}px`, m <= 1, `overflowX=${m}`)
  }

  await setWidth(page, 1240)
  const wide = await win.locator('.about-doc').evaluate((el) => el.scrollWidth)
  const wideRevealed = await win.locator('.about-app').evaluate((el) => el.querySelectorAll('[data-revealed]').length)
  await setWidth(page, 430)
  const narrow = await win.locator('.about-doc').evaluate((el) => el.scrollWidth)
  const narrowCols = await win.locator('.about-hero').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length)
  await setWidth(page, 1240)
  const backWide = await win.locator('.about-doc').evaluate((el) => el.scrollWidth)
  const backRevealed = await win.locator('.about-app').evaluate((el) => el.querySelectorAll('[data-revealed]').length)
  const backFaded = await win.locator('.about-app').evaluate(
    (el) =>
      [...el.querySelectorAll('[data-motion][data-revealed]')].filter(
        (n) => Number(getComputedStyle(n).opacity) < 0.999,
      ).length,
  )

  check('narrow viewport still reflows to one column', narrowCols === 1, `columns=${narrowCols}`)
  check('wide → narrow → wide reflows correctly', narrow < wide && backWide === wide, `${wide} → ${narrow} → ${backWide}`)
  check('resizing never re-hides revealed content', backFaded === 0 && backRevealed >= wideRevealed, `faded=${backFaded} revealed=${wideRevealed}→${backRevealed}`)
  check('no page errors during the resize round trip', errors.length === 0, errors.join(' | '))
  await page.close()
}

// --- 7. Window interactions -------------------------------------------------
{
  const { page, win, errors } = await session()
  const paper = () => win.locator('.about-app__paper')

  // Minimize → restore
  await paper().evaluate((el) => el.scrollTo({ top: 260, behavior: 'auto' }))
  await page.waitForTimeout(300)
  const beforeMin = await paper().evaluate((el) => el.scrollTop)
  await win.getByLabel('Minimize window').click()
  await page.waitForTimeout(600)
  check('minimize hides the window', !(await win.isVisible()), '')
  await page.getByRole('button', { name: 'About', exact: true }).first().click({ force: true })
  await page.waitForTimeout(700)
  const restored = page.locator('[role="dialog"][aria-label="About"]')
  check('restore from the dock works', await restored.isVisible(), '')
  const afterMin = await restored.locator('.about-app__paper').evaluate((el) => el.scrollTop)
  check('minimize → restore preserves scroll position', Math.abs(afterMin - beforeMin) < 5, `${beforeMin} → ${afterMin}`)

  // Maximize → restore
  await restored.getByLabel('Maximize window').click()
  await page.waitForTimeout(600)
  const maxPaper = await restored.locator('.about-app__paper').evaluate((el) => el.clientWidth)
  const maxOverflow = await restored.locator('.about-app__paper').evaluate((el) => el.scrollWidth - el.clientWidth)
  const maxRunning = await restored.locator('.about-app').evaluate(
    (el) => [...el.querySelectorAll('[data-motion]')].filter((n) => n.getAnimations().some((a) => a.playState === 'running')).length,
  )
  check('maximize widens the window', maxPaper > 900, `${maxPaper}px`)
  check('maximize introduces no overflow', maxOverflow <= 1, `overflowX=${maxOverflow}`)
  check('maximize does not restart the entrance', maxRunning === 0, `running=${maxRunning}`)
  await restored.getByLabel('Restore window').click()
  await page.waitForTimeout(600)
  check('restore from maximize works', await page.locator('[role="dialog"][aria-label="About"]').isVisible(), '')

  // Close → reopen
  await restored.getByLabel('Close window').click()
  await page.waitForTimeout(500)
  check('close removes the window', (await page.locator('[role="dialog"][aria-label="About"]').count()) === 0, '')
  await page.getByRole('button', { name: 'About', exact: true }).first().click({ force: true })
  await page.waitForTimeout(1400)
  const reopened = page.locator('[role="dialog"][aria-label="About"]')
  check('close → reopen works', await reopened.isVisible(), '')
  const reopenW = await reopened.evaluate((el) => Math.round(el.getBoundingClientRect().width))
  check('reopened window returns to the wide default', reopenW === 860, `${reopenW}px`)
  const reopenCycle = await frameOf(reopened)
  await page.waitForTimeout(2200)
  check('illustration is alive again after reopen', (await frameOf(reopened)) !== reopenCycle, `${reopenCycle} → ${await frameOf(reopened)}`)

  // Drag
  const box = await reopened.locator('.desktop-window__titlebar').boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 - 60, box.y + box.height / 2 + 40, { steps: 8 })
  await page.mouse.up()
  await page.waitForTimeout(300)
  const dragged = await reopened.evaluate((el) => Math.round(el.getBoundingClientRect().left))
  check('the window still drags with motion enabled', dragged !== 150, `left=${dragged}`)

  check('no page errors during window interactions', errors.length === 0, errors.join(' | '))
  await page.close()
}

// --- 8. Files → About -------------------------------------------------------
{
  const { page, errors } = await session()
  await page.getByLabel('Close window').click()
  await page.waitForTimeout(400)

  await page.getByRole('button', { name: 'Files', exact: true }).first().click({ force: true })
  const filesWin = page.locator('[role="dialog"][aria-label="Files"]')
  await filesWin.waitFor({ state: 'visible', timeout: 15000 })
  await page.waitForTimeout(500)

  const aboutItem = filesWin.locator('.files-item', { hasText: 'About' }).first()
  await aboutItem.dblclick()
  await page.waitForTimeout(1400)

  const win = page.locator('[role="dialog"][aria-label="About"]')
  check('Files → About opens the About application window', await win.isVisible(), '')
  const fromFiles = await win.evaluate((el) => Math.round(el.getBoundingClientRect().width))
  check('About from Files uses the same wide default', fromFiles === 860, `${fromFiles}px`)
  // innerText reflects `text-transform`, so section labels arrive uppercased.
  const copy = (await win.locator('.about-doc').innerText()).toLowerCase()
  check(
    'About from Files renders the full document',
    copy.includes("hi, i'm shine.") && copy.includes('one more thing'),
    '',
  )
  const framesLive = await win.evaluate(async () => {
    const img = document.querySelector('.about-illustration__image')
    const first = img.dataset.illustrationFrame
    await new Promise((r) => setTimeout(r, 2000))
    return { first, second: img.dataset.illustrationFrame }
  })
  check('About from Files still breathes', framesLive.first !== framesLive.second, `${framesLive.first} → ${framesLive.second}`)
  check('no page errors opening About from Files', errors.length === 0, errors.join(' | '))
  await page.close()
}

// --- 9. Reduced motion ------------------------------------------------------
{
  const { page, win, errors } = await session({ reducedMotion: true })

  const state = await win.evaluate(() => {
    const app = document.querySelector('.about-app')
    return {
      reduced: app.classList.contains('about-app--reduced-motion'),
      motion: app.classList.contains('about-app--motion'),
      revealed: app.querySelectorAll('[data-revealed]').length,
      animated: [...app.querySelectorAll('*')].filter((n) => getComputedStyle(n).animationName !== 'none').length,
      faded: [...app.querySelectorAll('[data-motion]')].filter((n) => Number(getComputedStyle(n).opacity) < 0.999).length,
      scroll: getComputedStyle(app.querySelector('.about-app__paper')).scrollBehavior,
    }
  })
  check('reduced-motion class is applied', state.reduced, '')
  check('the motion class is never applied', !state.motion, '')
  check('no entrance animation is marked', state.revealed === 0, `revealed=${state.revealed}`)
  check('nothing is animated under reduced motion', state.animated === 0, `animated=${state.animated}`)
  check('no text is left faded under reduced motion', state.faded === 0, `faded=${state.faded}`)
  check('smooth scrolling disabled under reduced motion', state.scroll === 'auto', state.scroll)

  // The drawing must never leave the master frame, and no timer may be running.
  const cycle = await win.evaluate(async () => {
    const img = document.querySelector('.about-illustration__image')
    const seen = new Set()
    const start = performance.now()
    while (performance.now() - start < 9000) {
      seen.add(img.dataset.illustrationFrame)
      await new Promise((r) => setTimeout(r, 60))
    }
    return [...seen]
  })
  check('only the master frame is ever shown', cycle.length === 1 && cycle[0] === '0', `frames seen: ${cycle.join(',') || 'none'}`)

  const loaded = await win.evaluate(() =>
    performance.getEntriesByType('resource').filter((r) => /shine-about-0[23]\.png$/.test(r.name)).length,
  )
  check('no extra frames are fetched under reduced motion', loaded === 0, `requests=${loaded}`)

  const copy = await win.locator('.about-doc').innerText()
  check('the full document still renders under reduced motion', copy.includes("I've honestly started a new life"), '')
  check('no page errors under reduced motion', errors.length === 0, errors.join(' | '))
  await page.close()
}

await browser.close()

for (const r of results) console.log(r.line)
const failed = results.filter((r) => !r.ok).length
console.log(`\n${results.length - failed}/${results.length} checks passed`)
process.exit(failed ? 1 : 0)
