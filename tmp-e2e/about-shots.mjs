// Visual confirmation for STEP 11D: the wide default, the entrance mid-flight,
// the settled document, a narrow reflow, and keyboard focus styling.
import { chromium } from 'playwright'

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1510, height: 950 } })
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' })
await page.getByLabel("Enter Shine's computer").waitFor({ state: 'attached', timeout: 45000 })
await page.evaluate(() => document.querySelector("[aria-label=\"Enter Shine's computer\"]").click())
await page.getByRole('button', { name: 'About', exact: true }).first().click({ force: true })
const win = page.locator('[role="dialog"][aria-label="About"]')
await win.waitFor({ state: 'visible', timeout: 15000 })

// Mid-entrance: catch the document while it is still settling.
await page.waitForTimeout(320)
await win.screenshot({ path: 'tmp-e2e/shots/11d-entrance.png' })

// Settled, at the new default width.
await page.waitForTimeout(1800)
await win.screenshot({ path: 'tmp-e2e/shots/11d-default.png' })

// Keyboard focus on the scroll container — SHINE OS focus ring must still apply.
await win.locator('.about-app__paper').evaluate((el) => el.focus())
await page.keyboard.press('ArrowDown')
const focusRing = await win.locator('.about-app__paper').evaluate((el) => {
  const s = getComputedStyle(el)
  return { outlineWidth: s.outlineWidth, outlineStyle: s.outlineStyle, outlineColor: s.outlineColor }
})
console.log('scroll container focus ring:', JSON.stringify(focusRing))
await win.screenshot({ path: 'tmp-e2e/shots/11d-focus.png' })

// Narrow reflow.
await page.evaluate(() => (document.querySelector('.desktop-window').style.width = '380px'))
await page.waitForTimeout(600)
await win.screenshot({ path: 'tmp-e2e/shots/11d-narrow.png' })

// Bottom of the document.
await page.evaluate(() => (document.querySelector('.desktop-window').style.width = '860px'))
await page.waitForTimeout(600)
await win.locator('.about-app__paper').evaluate((el) => el.scrollTo({ top: el.scrollHeight, behavior: 'auto' }))
await page.waitForTimeout(1400)
await win.screenshot({ path: 'tmp-e2e/shots/11d-bottom.png' })

console.log('screenshots written')
await browser.close()