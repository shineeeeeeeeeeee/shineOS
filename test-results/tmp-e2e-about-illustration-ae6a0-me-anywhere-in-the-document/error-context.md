# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tmp-e2e/about-illustration-run.test.mjs >> About illustration integration >> no card chrome anywhere in the document
- Location: tmp-e2e/about-illustration-run.test.mjs:167:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 10

- Array []
+ Array [
+   "about-doc__eyebrow-mark",
+   "about-section__rule",
+   "about-section__rule",
+   "about-rows__dot",
+   "about-rows__dot",
+   "about-rows__dot",
+   "about-section__rule",
+   "about-section__rule",
+ ]
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic:
    - generic [ref=e2]:
      - img "Soft teal-blue sky with gentle clouds"
      - img "Floating platform" [ref=e3]
      - generic [ref=e4]:
        - img "Enter Shine's computer"
        - button "Enter Shine's computer" [ref=e6] [cursor=pointer]
    - generic [ref=e7]:
      - menubar [ref=e9]:
        - group "Application menus" [ref=e15]:
          - button "SHINE" [ref=e17] [cursor=pointer]
          - button "File" [ref=e19] [cursor=pointer]
          - button "View" [ref=e21] [cursor=pointer]
          - button "Go" [ref=e23] [cursor=pointer]
          - button "Window" [ref=e25] [cursor=pointer]
          - button "Help" [ref=e27] [cursor=pointer]
        - time [ref=e40]: 06:10 PM
      - dialog "About" [ref=e41]:
        - generic [ref=e42]:
          - generic [ref=e43]:
            - button "Close window" [ref=e44] [cursor=pointer]
            - button "Minimize window" [ref=e47] [cursor=pointer]
            - button "Maximize window" [ref=e49] [cursor=pointer]
          - generic [ref=e52]: About
        - article "About Shine — scrollable document" [ref=e55]:
          - generic [ref=e56]:
            - generic [ref=e57]:
              - generic [ref=e59]:
                - paragraph [ref=e60]: About this machine
                - heading "Hi, I'm Shine." [level=1] [ref=e62]
                - paragraph [ref=e63]: I build things because I genuinely like building things. Most of them never leave my desk, and most of them were made at an hour nobody should really be awake at.
                - paragraph [ref=e64]: Not a résumé. This is roughly what I'd tell you if it was late and neither of us was doing anything else.
              - img "An illustrated portrait of Shine surrounded by things from her everyday world." [ref=e67]
            - generic [ref=e68]:
              - region [ref=e69]:
                - heading "About" [level=2] [ref=e72]
                - paragraph [ref=e73]: Most days look something like this.
                - generic [ref=e74]:
                  - paragraph [ref=e75]: Code for a few hours. Fall asleep halfway through a film. Wake up hungry, make Buldak, and go back to the thing I was building before I remembered I was tired. On a free day it is usually just that on repeat, and I am not going to pretend it is less satisfying than it sounds.
                  - paragraph [ref=e76]: I read things so I can get better at things. I take apart programs until they look like something I could actually hold in my hands, and I do the same to keyboards, mice, cables and other electronics that had no business being as satisfying as they are. I like taking things apart far more than I like writing the list of things I have taken apart.
                  - paragraph [ref=e77]: I'm quiet the first time I meet someone. It isn't a performance, I'm just genuinely still sorting things out. Give me a bit of time and people usually end up a little surprised. I change my mind about small things constantly. I notice much more than I say, and I think about most of it long after it stopped mattering.
              - region [ref=e78]:
                - heading "Currently" [level=2] [ref=e81]
                - paragraph [ref=e82]: The state of things, roughly.
                - generic [ref=e84]:
                  - generic [ref=e85]:
                    - term [ref=e86]: At the desk
                    - definition [ref=e88]: Building this machine — windows, a dock, a Files app, and this page.
                  - generic [ref=e89]:
                    - term [ref=e90]: In the stomach
                    - definition [ref=e92]: Buldak, washed down with milk and chocos, because judgement is a tomorrow problem.
                  - generic [ref=e93]:
                    - term [ref=e94]: Lately
                    - definition [ref=e96]: Late nights and short plans. I come alive properly once everyone else has gone to sleep.
            - region [ref=e97]:
              - heading "A few things about me" [level=2] [ref=e100]
              - paragraph [ref=e101]: Not a list, really. Just the things that keep turning up.
              - list [ref=e103]:
                - listitem [ref=e104]:
                  - paragraph [ref=e105]:
                    - generic [aria-hidden] [ref=e106]: ✳
                    - text: Chess
                  - paragraph [ref=e107]: I keep playing on the days when losing tells me more about myself than the game does.
                - listitem [ref=e108]:
                  - paragraph [ref=e109]:
                    - generic [aria-hidden] [ref=e110]: ✳
                    - text: Ramen
                  - paragraph [ref=e111]: Buldak is less a meal and more a personality trait. I make it hotter than is sensible and complain the whole way through.
                - listitem [ref=e112]:
                  - paragraph [ref=e113]:
                    - generic [aria-hidden] [ref=e114]: ✳
                    - text: Harry Potter
                  - paragraph [ref=e115]: I will happily go back to the beginning of the same magical world again instead of choosing something sensible and new.
                - listitem [ref=e116]:
                  - paragraph [ref=e117]:
                    - generic [aria-hidden] [ref=e118]: ✳
                    - text: Keyboards
                  - paragraph [ref=e119]: I do not need another keyboard. I have said this before. It has never once stopped me.
                - listitem [ref=e120]:
                  - paragraph [ref=e121]:
                    - generic [aria-hidden] [ref=e122]: ✳
                    - text: Night hours
                  - paragraph [ref=e123]: The best plans are the ones nobody made, and they only show up after one in the morning.
                - listitem [ref=e124]:
                  - paragraph [ref=e125]:
                    - generic [aria-hidden] [ref=e126]: ✳
                    - text: Small things
                  - paragraph [ref=e127]: LEGO, Hot Wheels, books, skincare, a gadget with no practical purpose. I am drawn to small objects that are simply exactly themselves.
            - region [ref=e128]:
              - heading "One more thing" [level=2] [ref=e131]
              - paragraph [ref=e134]: I've honestly started a new life, and I'm hanging in there. It's been hard. But looking back at where I was, I think I can do it.
            - generic [ref=e135]:
              - paragraph [ref=e136]:
                - generic [aria-hidden] [ref=e137]: ◼
                - text: End of document.
              - generic [ref=e138]:
                - generic [ref=e139]:
                  - term [ref=e140]: Document
                  - definition [ref=e141]: About — Shine OS
                - generic [ref=e142]:
                  - term [ref=e143]: Version
                  - definition [ref=e144]: 0.3.0
                - generic [ref=e145]:
                  - term [ref=e146]: Built with
                  - definition [ref=e147]: React, TypeScript and Vite
                - generic [ref=e148]:
                  - term [ref=e149]: Libraries
                  - definition [ref=e150]: None — every component written from scratch
        - slider "Resize window" [ref=e151]
      - navigation "Application dock" [ref=e152]:
        - generic [aria-hidden]:
          - generic: About
        - generic [ref=e153]:
          - button "About" [active] [pressed] [ref=e155] [cursor=pointer]
          - button "Projects" [ref=e162] [cursor=pointer]
          - button "Experience" [ref=e170] [cursor=pointer]
          - button "Skills" [ref=e175] [cursor=pointer]
          - button "Resume" [ref=e180] [cursor=pointer]
          - button "Contact" [ref=e186] [cursor=pointer]
          - button "Files" [ref=e192] [cursor=pointer]
          - button "Shine Browser" [ref=e198] [cursor=pointer]
          - button "Settings" [ref=e204] [cursor=pointer]
        - separator [ref=e209]
        - button "Trash" [ref=e211] [cursor=pointer]
```

# Test source

```ts
  90  |     })
  91  | 
  92  |     const paperRgb = paper.match(/\d+/g).map(Number)
  93  |     const delta = [0, 1, 2].map((i) => Math.abs(paperRgb[i] - mean[i]))
  94  |     // Indistinguishable at a glance: no visible rectangular edge.
  95  |     expect(Math.max(...delta)).toBeLessThanOrEqual(3)
  96  |   })
  97  | 
  98  |   test('square aspect ratio preserved, not cropped or stretched', async ({ page }) => {
  99  |     const win = await openAbout(page)
  100 |     const box = await win.locator('.about-illustration__image').boundingBox()
  101 |     expect(box.width).toBeGreaterThan(50)
  102 |     // Square within a 1px tolerance.
  103 |     expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(1)
  104 |   })
  105 | 
  106 |   test('no horizontal overflow at narrow width', async ({ page }) => {
  107 |     const win = await openAbout(page)
  108 |     for (const width of [300, 360, 520, 900]) {
  109 |       await page.evaluate((w) => {
  110 |         const el = document.querySelector('.desktop-window')
  111 |         if (el) el.style.width = w + 'px'
  112 |       }, width)
  113 |       await page.waitForTimeout(150)
  114 |       const overflow = await win
  115 |         .locator('.about-app__paper')
  116 |         .evaluate((el) => el.scrollWidth - el.clientWidth)
  117 |       expect(overflow, `overflow at width ${width}`).toBeLessThanOrEqual(1)
  118 |     }
  119 |   })
  120 | 
  121 |   test('artwork scales with the window and takes a real share of the width', async ({ page }) => {
  122 |     const win = await openAbout(page)
  123 |     const img = win.locator('.about-illustration__image')
  124 |     const setWindowWidth = async (w) => {
  125 |       await page.evaluate((v) => {
  126 |         const el = document.querySelector('.desktop-window')
  127 |         if (el) el.style.width = v + 'px'
  128 |       }, w)
  129 |       await page.waitForTimeout(220)
  130 |     }
  131 | 
  132 |     await setWindowWidth(340)
  133 |     const narrow = await img.boundingBox()
  134 |     await setWindowWidth(1000)
  135 |     const wide = await img.boundingBox()
  136 | 
  137 |     // Still scales down proportionally when narrow.
  138 |     expect(narrow.width).toBeLessThan(wide.width)
  139 |     // No longer pinned to a small centred thumbnail in a wider window.
  140 |     expect(wide.width).toBeGreaterThan(340)
  141 |     // A meaningful share of the available content width (roughly 35-45%).
  142 |     const content = await win.locator('.about-doc').evaluate((el) => el.clientWidth)
  143 |     const share = wide.width / content
  144 |     expect(share).toBeGreaterThanOrEqual(0.3)
  145 |     expect(share).toBeLessThanOrEqual(0.55)
  146 |   })
  147 | 
  148 |   test('document fills the window width instead of a narrow centred column', async ({ page }) => {
  149 |     const win = await openAbout(page)
  150 |     for (const width of [340, 700, 1100]) {
  151 |       await page.evaluate((w) => {
  152 |         const el = document.querySelector('.desktop-window')
  153 |         if (el) el.style.width = w + 'px'
  154 |       }, width)
  155 |       await page.waitForTimeout(220)
  156 |       const ratio = await win.locator('.about-doc').evaluate((el) => {
  157 |         const s = getComputedStyle(el)
  158 |         const content =
  159 |           el.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight)
  160 |         return content / el.parentElement.clientWidth
  161 |       })
  162 |       // No max-width + margin:auto column: the page uses nearly the whole window.
  163 |       expect(ratio, `content fill at ${width}px`).toBeGreaterThan(0.82)
  164 |     }
  165 |   })
  166 | 
  167 |   test('no card chrome anywhere in the document', async ({ page }) => {
  168 |     const win = await openAbout(page)
  169 |     await page.evaluate(() => {
  170 |       const el = document.querySelector('.desktop-window')
  171 |       if (el) el.style.width = '1100px'
  172 |     })
  173 |     await page.waitForTimeout(220)
  174 |     // No cards, tiles or panel chrome inside the document. Hairline rules are
  175 |     // allowed and expected; backgrounds, shadows and radii are not.
  176 |     const offenders = await win
  177 |       .locator('.about-doc, .about-doc *')
  178 |       .evaluateAll((els) =>
  179 |         els
  180 |           .filter((el) => {
  181 |             const s = getComputedStyle(el)
  182 |             const hasBg =
  183 |               s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent'
  184 |             const hasRadius = parseFloat(s.borderTopLeftRadius) > 0
  185 |             const hasShadow = s.boxShadow !== 'none'
  186 |             return hasBg || hasRadius || hasShadow
  187 |           })
  188 |           .map((el) => el.className)
  189 |       )
> 190 |     expect(offenders).toEqual([])
      |                       ^ Error: expect(received).toEqual(expected) // deep equality
  191 |   })
  192 | 
  193 |   test('internal scrolling still works', async ({ page }) => {
  194 |     const win = await openAbout(page)
  195 |     const paper = win.locator('.about-app__paper')
  196 |     // The document scrolls internally rather than growing the window.
  197 |     const scrollable = await paper.evaluate((el) => el.scrollHeight > el.clientHeight)
  198 |     expect(scrollable).toBe(true)
  199 | 
  200 |     await paper.hover()
  201 |     await page.mouse.wheel(0, 600)
  202 |     // scroll-behavior is smooth, so wait for the animation to settle.
  203 |     await page.waitForTimeout(800)
  204 |     const scrolled = await paper.evaluate((el) => el.scrollTop)
  205 |     expect(scrolled).toBeGreaterThan(0)
  206 | 
  207 |     // The illustration must still be rendered (not unmounted by scrolling).
  208 |     await expect(win.locator('.about-illustration__image')).toHaveCount(1)
  209 |   })
  210 | 
  211 |   test('minimize then restore preserves the illustration', async ({ page }) => {
  212 |     const win = await openAbout(page)
  213 |     const img = win.locator('.about-illustration__image')
  214 |     await expect(img).toBeVisible()
  215 |     await win.getByLabel('Minimize window').click()
  216 |     await page.waitForTimeout(400)
  217 |     await aboutDockButton(page).click({ force: true })
  218 |     await page.waitForTimeout(500)
  219 |     await expect(img).toHaveAttribute('src', /shine-about-01\.png/)
  220 |     const stillLoaded = await img.evaluate((el) => el.complete && el.naturalWidth > 0)
  221 |     expect(stillLoaded).toBe(true)
  222 |   })
  223 | 
  224 |   test('maximize then restore keeps the illustration', async ({ page }) => {
  225 |     const win = await openAbout(page)
  226 |     const img = win.locator('.about-illustration__image')
  227 |     await win.getByLabel('Maximize window').click()
  228 |     await page.waitForTimeout(300)
  229 |     await expect(img).toBeVisible()
  230 |     await win.getByLabel('Restore window').click()
  231 |     await page.waitForTimeout(300)
  232 |     await expect(img).toHaveAttribute('src', /shine-about-01\.png/)
  233 |   })
  234 | 
  235 |   test('close then reopen keeps the illustration', async ({ page }) => {
  236 |     const win = await openAbout(page)
  237 |     await win.getByLabel('Close window').click()
  238 |     await page.waitForTimeout(400)
  239 |     await aboutDockButton(page).click({ force: true })
  240 |     await page.waitForTimeout(500)
  241 |     const reopened = page.locator('[role="dialog"][aria-label="About"]')
  242 |     await expect(reopened.locator('.about-illustration__image')).toHaveAttribute(
  243 |       'src',
  244 |       /shine-about-01\.png/
  245 |     )
  246 |   })
  247 | 
  248 |   test('reduced motion: no animation on the illustration', async ({ page }) => {
  249 |     await page.emulateMedia({ reducedMotion: 'reduce' })
  250 |     const win = await openAbout(page)
  251 |     const styles = await win.locator('.about-illustration__image').evaluate((el) => {
  252 |       const s = getComputedStyle(el)
  253 |       return { name: s.animationName, dur: s.animationDuration, trans: s.transitionProperty }
  254 |     })
  255 |     expect(styles.name).toBe('none')
  256 |   })
  257 | 
  258 |   test('no console errors during About lifecycle', async ({ page }) => {
  259 |     const errors = []
  260 |     page.on('console', (m) => {
  261 |       if (m.type() === 'error') errors.push(m.text())
  262 |     })
  263 |     page.on('pageerror', (e) => errors.push(e.message))
  264 |     const win = await openAbout(page)
  265 |     await win.getByLabel('Maximize window').click()
  266 |     await page.waitForTimeout(300)
  267 |     await win.getByLabel('Restore window').click()
  268 |     await page.waitForTimeout(300)
  269 |     await win.getByLabel('Close window').click()
  270 |     await page.waitForTimeout(500)
  271 |     // Reopen once more to prove the illustration re-mounts cleanly.
  272 |     await aboutDockButton(page).click({ force: true })
  273 |     await page.waitForTimeout(500)
  274 |     await expect(page.locator('.about-illustration__image')).toBeVisible()
  275 | 
  276 |     // Ignore pre-existing "Invalid DOM property" SVG attribute warnings that
  277 |     // come from DesktopWindow / ComputerScreenTarget code this step never
  278 |     // touches. Anything else must be clean.
  279 |     const aboutErrors = errors.filter(
  280 |       (e) => !(e.includes('Invalid DOM property') && /stroke-(linecap|width)|stroke(Linecap|Width)/.test(e))
  281 |     )
  282 |     expect(aboutErrors).toEqual([])
  283 |   })
  284 | 
  285 |   test('exactly one image element is rendered (no duplication)', async ({ page }) => {
  286 |     const win = await openAbout(page)
  287 |     await expect(win.locator('.about-app__paper img')).toHaveCount(1)
  288 |   })
  289 | })
  290 | 
```