// Temporary verification for STEP 11C.
// Covers the explicit checklist: overflow, interactions, scrolling,
// minimize/restore, resize, reduced motion — plus the new closing band.
import { chromium } from 'playwright'

const URL = 'http://localhost:5173/'
const results = []
const check = (name, ok, detail = '') =>
  results.push({ ok, line: `${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}` })

const browser = await chromium.launch()

async function session(opts = {}) {
  const page = await browser.newPage({ viewport: { width: 1240, height: 900 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
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
  await page.waitForTimeout(400)
  return { page, win, errors }
}

const setWidth = async (page, px) => {
  await page.evaluate((w) => {
    const el = document.querySelector('.desktop-window')
    if (el) el.style.width = `${w}px`
  }, px)
  await page.waitForTimeout(350)
}

// --- 1. Overflow across the full responsive range -----------------------
{
  const { page, win, errors } = await session()
  for (const w of [300, 340, 430, 520, 620, 820, 1100, 1240, 1510]) {
    await setWidth(page, w)
    const m = await win.locator('.about-app__paper').evaluate((el) => ({
      overflowX: el.scrollWidth - el.clientWidth,
      docWidth: el.querySelector('.about-doc').scrollWidth,
      clientWidth: el.clientWidth,
    }))
    check(`no horizontal overflow @ ${w}px`, m.overflowX <= 1, `overflowX=${m.overflowX}`)
  }
  check('no page errors during resize sweep', errors.length === 0, errors.join('|'))
  await page.close()
}

// --- 2. Resize while open keeps bands intact -----------------------------
{
  const { page, win } = await session()
  await setWidth(page, 1240)
  const wide = await win.locator('.about-doc').evaluate((el) => el.scrollWidth)
  await setWidth(page, 430)
  const narrow = await win.locator('.about-doc').evaluate((el) => el.scrollWidth)
  check('resize reflows the document', narrow < wide, `${wide}px -> ${narrow}px`)

  // --- 3. Scrolling ---
  const paper = win.locator('.about-app__paper')
  await paper.evaluate((el) => el.scrollTo({ top: el.scrollHeight, behavior: 'auto' }))
  await page.waitForTimeout(400)
  const scrolled = await paper.evaluate((el) => el.scrollTop)
  check('scrolling reaches the bottom', scrolled > 200, `scrollTop=${Math.round(scrolled)}`)
  const bottomVisible = await win.locator('[data-motion-id="closing"]').isVisible()
  check('closing band reachable by scrolling', bottomVisible, '')
  const footerVisible = await win.locator('.about-footer').isVisible()
  check('footer reachable by scrolling', footerVisible, '')
  await page.close()
}

// --- 4. Minimize / restore ----------------------------------------------
{
  const { page, win } = await session()
  const before = await win.locator('.about-app__paper').evaluate((el) => el.scrollTop)
  await win.getByLabel('Minimize window').click()
  await page.waitForTimeout(600)
  check('minimize hides the window', (await page.locator('[role="dialog"][aria-label="About"]').count()) === 0 || !(await page.locator('[role="dialog"][aria-label="About"]').isVisible()), '')
  await page.getByRole('button', { name: 'About', exact: true }).first().click({ force: true })
  await page.waitForTimeout(600)
  const win2 = page.locator('[role="dialog"][aria-label="About"]')
  check('restore from dock works', await win2.isVisible(), '')
  const after = await win2.locator('.about-app__paper').evaluate((el) => el.scrollTop)
  check('restore preserves scroll position', Math.abs(after - before) < 5, `${before} -> ${after}`)
  await page.close()
}

// --- 5. Maximize / restore (resize via window chrome) --------------------
{
  const { page, win, errors } = await session()
  await win.getByLabel('Maximize window').click()
  await page.waitForTimeout(600)
  const maxW = await win.locator('.about-app__paper').evaluate((el) => el.clientWidth)
  const maxOverflow = await win.locator('.about-app__paper').evaluate(
    (el) => el.scrollWidth - el.clientWidth,
  )
  check('maximize widens the window', maxW > 900, `${maxW}px`)
  check('maximize introduces no overflow', maxOverflow <= 1, `overflowX=${maxOverflow}`)
  await win.getByLabel('Restore window').click()
  await page.waitForTimeout(600)
  check('restore from maximize works', await page.locator('[role="dialog"][aria-label="About"]').isVisible(), '')
  check('no page errors during maximize cycle', errors.length === 0, errors.join('|'))
  await page.close()
}

// --- 6. Reduced motion ---------------------------------------------------
{
  const { page, win, errors } = await session({ reducedMotion: true })
  const styles = await win.locator('.about-app').evaluate((el) => {
    const s = getComputedStyle(el)
    const paper = getComputedStyle(el.querySelector('.about-app__paper'))
    const animated = [...el.querySelectorAll('*')].filter(
      (n) => getComputedStyle(n).animationName !== 'none',
    ).length
    return {
      reducedClass: el.classList.contains('about-app--reduced-motion'),
      paperScroll: paper.scrollBehavior,
      animated,
    }
  })
  check('reduced-motion class applied', styles.reducedClass, '')
  check('smooth scrolling disabled under reduced motion', styles.paperScroll === 'auto', styles.paperScroll)
  check('nothing animated under reduced motion', styles.animated === 0, `animated=${styles.animated}`)
  check('copy still renders under reduced motion', (await win.locator('.about-doc').innerText()).includes("I've honestly started a new life"), '')
  check('no page errors under reduced motion', errors.length === 0, errors.join('|'))
  await page.close()
}

// --- 7. New closing band geometry ---------------------------------------
{
  const { page, win } = await session()
  await setWidth(page, 1240)
  const g = await win.locator('[data-motion-id="closing"]').evaluate((el) => {
    const r = el.getBoundingClientRect()
    const label = el.querySelector('.about-section__label')
    return {
      w: Math.round(r.width),
      label: label ? label.textContent.trim() : null,
      hasLead: !!el.querySelector('.about-section__lead'),
      rule: !!el.querySelector('.about-section__rule'),
    }
  })
  check('closing band has a label', !!g.label, g.label)
  check('closing band has no oversized lead', !g.hasLead, 'deliberate: quiet aside')
  check('closing band uses the standard section rule', g.rule, '')
  await page.close()
}

await browser.close()

for (const r of results) console.log(r.line)
const failed = results.filter((r) => !r.ok).length
console.log(`\n${results.length - failed}/${results.length} checks passed`)
process.exit(failed ? 1 : 0)