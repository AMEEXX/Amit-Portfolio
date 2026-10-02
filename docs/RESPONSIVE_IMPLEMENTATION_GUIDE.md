# Responsive Implementation Guide — Amit Hota Portfolio

> Audience: an implementing engineer / AI agent (e.g. Gemini).
> Goal: the site works on every device and browser (phones, foldables, tablets, laptops, ultrawide; Chrome, Safari/iOS, Firefox, Edge, Samsung Internet) **without changing its look and feel**. Nothing gets cut off, cropped or hidden, and scrolling stays smooth.
>
> Status: everything below is **already implemented** on branch `genspark_ai_developer`. Use this guide to review the changes, port them, or extend them. Every step lists **Problem → Root cause → Fix → How to verify**.

---

## 0. Ground rules (do not break these)

1. **Do not redesign.** Keep the colours, fonts, animations, layout order and copy. Only change sizing, positioning and input handling.
2. **Desktop ≥ 1024px must look the same as before.** Every change is either mobile-first, scoped by a media query, or a clamp that resolves to the old value on desktop.
3. **Never use `overflow-x: hidden` on `html`/`body`.** It breaks `position: sticky` (keyboard stage, starfield). Use `overflow-x: clip`.
4. **Use the right viewport unit:**
   | Unit | Use for | Why |
   |---|---|---|
   | `svh` | Hero height, keyboard stage, the keyboard section's scroll track | Height *with* the mobile URL bar visible, so nothing ever sits behind browser UI |
   | `lvh` | Starfield background canvas | Stays constant while the URL bar hides/shows, so the WebGL canvas never resizes mid-scroll |
   | `dvh` | Modal `max-height` | Follows the live viewport, so the modal always fits |
   | `vh` | Always declare first as a fallback (`height:100vh; height:100svh;`) | Older iOS (<15.4) |
5. **Feature-detect input, not width:** `(hover: none), (pointer: coarse)` means touch. Hover-only interactions must get a tap equivalent.
6. **WebGL is optional.** Every WebGL component needs a try/catch or an error boundary plus a fallback. A missing GPU must never white-screen the app.

### Breakpoints used (Tailwind defaults)
| Name | Range | Typical devices |
|---|---|---|
| xs | < 360 | Galaxy Fold (280), iPhone SE 1st gen (320) |
| phone | 360–639 | iPhone 12–16, Pixel, Galaxy S |
| sm | 640–767 | Large phones in landscape, small tablets |
| md | 768–1023 | iPad mini/Air portrait, Surface Duo |
| lg | 1024–1439 | iPad landscape, 13–14" laptops |
| xl | 1440–1920 | 15–27" monitors |
| 2xl | > 1920 | 1440p / 4K / ultrawide |
| landscape-phone | `max-width:1023px and max-height:520px and orientation:landscape` | Any phone rotated |

---

## 1. Global foundation

### 1.1 Root font-size scale (`src/index.css`, "Adaptive Viewport Typography Grid")
- **Problem:** On a 640px screen the page was 1010px wide. Text jumped in size at 641px and at 1025px.
- **Root cause:** The `html { font-size: X vw }` bands were unbounded. At 640px, 4.44vw gave 28px; at 641px, 0.83vw gave 10px. All `rem`-based Tailwind sizes changed with it.
- **Fix:** Clamp each band so neighbouring bands meet within about 2px:
  ```css
  @media (min-width:1921px){ html{ font-size:clamp(16px,.833vw,21px) } }
  @media (max-width:1440px){ html{ font-size:clamp(14px,1.111vw,16px) } }
  @media (max-width:1024px){ html{ font-size:15px } }
  @media (max-width:640px) { html{ font-size:clamp(14px,4.444vw,17.5px) } }
  ```
  Also add `text-size-adjust:100%` so iOS doesn't inflate text in landscape.
- **Verify:** Measured rem is 14 → 16 → 17.5 → 15 → 15.2 → 21px at widths 280 / 360 / 640 / 820 / 1366 / 2560. No horizontal overflow at any width.

### 1.2 `index.html`
- `viewport-fit=cover` lets `env(safe-area-inset-*)` work (iPhone notch / home bar).
- `preconnect` to `res.cloudinary.com` loads the hero image faster.

### 1.3 `package.json` → `browserslist`
Autoprefixer then emits `-webkit-` prefixes for Safari 14+ and Samsung 14+ (`backdrop-filter`, `mask`, etc.).

### 1.4 Global safety net (end of `index.css`)
- `img, video, canvas, svg { max-width:100% }`
- `html, body { overflow-x: clip }`, with an `@supports not (overflow:clip)` fallback to `hidden` on body only.
- Lenis CSS: `.lenis.lenis-smooth { scroll-behavior:auto !important }`, `[data-lenis-prevent] { overscroll-behavior:contain }`, `.lenis-stopped { overflow:hidden }`.

---

## 2. Smooth scrolling on every device (`src/hooks/useLenis.js`)

| Setting | Value | Reason |
|---|---|---|
| `syncTouch` | `false` | Phones keep native momentum scrolling (iOS rubber-band, Android fling). Hijacking touch causes lag and breaks the URL-bar collapse. |
| `smoothWheel` | `!reducedMotion` | Mouse/trackpad still gets the 1.2s eased glide. |
| `ScrollTrigger.config({ ignoreMobileResize:true })` | — | The URL bar firing `resize` no longer recalculates every scrub, so the keyboard animation doesn't jump. |
| `ScrollTrigger.refresh()` on `load`, `document.fonts.ready`, `orientationchange` (+350ms) | — | Trigger positions stay correct after rotation and font swaps. |
| `gsap.ticker.remove(raf)` | — | Previously removed the wrong function reference, which leaked a ticker on HMR/unmount. |
| `window.__lenis` | — | Lets the modal call `lenis.stop()` / `start()`. |

Scrollable overlays (`.navbar-mobile-sheet`, `.modal-backdrop`, flipped project cards) carry `data-lenis-prevent` so their inner scroll works.

---

## 3. Hero section & centre image

### 3.1 How the centre image is rendered
Two images with **identical framing** (16:9, subject centred):
- **Base:** `<img id="heroBaseImg">`, the silhouette, rendered with `object-fit:cover; object-position:50% 50%`.
- **Reveal:** the colour portrait, drawn into `<canvas>` by `LiquidRevealCanvas` with the *same* cover math: `scale = max(cw/iw, ch/ih)`, centred.

Both use the same fit and the same centre, so the reveal lines up 1:1 at any aspect ratio. **Never** give them different `object-position` values or crops.

Per aspect ratio:
| Viewport | What cover does | Result |
|---|---|---|
| 16:9 desktop | Fits exactly | Full shoulders |
| 21:9 ultrawide | Scales to width, crops top/bottom slightly | Face stays centred |
| Portrait phone (9:19.5) | Scales to height, crops the sides | Head and shoulders centred; text moves to the bottom (see 3.3) |
| Landscape phone | About 16:9 again | Like desktop |

### 3.2 Image weight (`Hero.jsx`)
- **Problem:** Phones downloaded an 8K PNG (2.7 MB) plus a 7 MB PNG.
- **Fix:** Cloudinary transform `f_auto,q_auto,w_<n>` serves AVIF/WebP.
  - Base `<img>` gets a `srcSet` with widths 640–3840 and `sizes="(orientation: portrait) 190vh, 100vw"`. In portrait, cover needs height × 16/9 ≈ 1.9 × vh of width.
  - The reveal canvas URL comes from `pickRevealWidth() = max(innerWidth, innerHeight·16/9) × min(dpr,2)`, rounded up to the next width.
  - `fetchpriority="high"` because it's the LCP image.
  - Cloudinary returns `access-control-allow-origin:*`, so canvas `drawImage` stays untainted.
- **Result:** About 40 KB at 1920w instead of 7 MB.

### 3.3 Layout per device (`index.css`, hero block)
- `.hero` is `display:flex; flex-direction:column; min-height:100vh; min-height:100svh`. It is exactly one visible screen on every device, and the status bar is always the last visible row.
- **Desktop ≥1024:** The original 12-column grid, centred vertically with `align-content:center`. The watermark is `min(11rem, 9.4vw)` with `nowrap`, so "AMIT HOTA" stays on one line.
- **Portrait phone/tablet <1024:**
  - The content is bottom-aligned (`justify-content:flex-end`), so the headline sits over the dark suit and the face stays clear.
  - The watermark is full-width (`16.5vw`, no offset) in its own band between the CTAs and the floating brand. Content padding reserves `17vw` for it, so it never collides with the headline.
  - A subtle bottom gradient (`.hero-vignette`) keeps the text readable.
- **Landscape phone (`max-height:520px`):**
  - The headline is height-driven: `clamp(1.6rem, 9.5svh, 3rem)`.
  - CTAs are compact, the floating brand is hidden, and the watermark is 8.5vw just above the status bar.
  - Everything fits in about 380px.
- **`--hero-status-h`:** A ResizeObserver measures the real status-bar height and sets this CSS variable. The floating brand and content padding use it, so nothing overlaps at any font size.
- **Status bar:** `nowrap`, 0.625rem on phones, `env(safe-area-inset-bottom)` padding for the iPhone home bar.
- **Cursor dot:** `display:none` under `(hover:none),(pointer:coarse)`. Previously it stuck on the face after a tap.

### 3.4 Liquid reveal on touch (`LiquidRevealCanvas.jsx`)
- The brush radius is `clamp(70px, 22% of min(w,h), 143px)`: proportional on phones, 143px on desktop as before.
- A `pointerdown` handler for touch/pen paints on tap. Touch browsers cancel `pointermove` once a scroll starts.
- Listeners are `passive:true` and never block scrolling.

### 3.5 Verified hero metrics (top / bottom / width in px)
| Viewport | Hero | H1 | CTAs | Status bar |
|---|---|---|---|---|
| 280×653 | 0–653 | 274–369 | 394–494 | 614–653 ✅ |
| 390×844 | 0–844 | 266–430 | 461–582 | 796–844 ✅ |
| 768×1024 | 0–1024 | 440–623 | 649–697 | 969–1024 ✅ |
| 844×390 (landscape) | 0–390 | 69–189 | 215–254 | 335–390 ✅ |
| 1280×720 | 0–720 | 226–399 | 424–469 | 667–720 ✅ |
| 1920×1080 | 0–1080 | 390–585 | 613–663 | 1021–1080 ✅ |

---

## 4. Spline 3D keyboard (`src/components/keyboard-showcase.tsx`)

### 4.1 Problems found
1. On phones the keyboard filled the screen as a cropped grey slab. On a 390×844 phone the settled keyboard was about 3× too wide.
2. The stage used `100vh`. On iOS that is the *large* viewport, so the keyboard was partly behind the toolbar, and its size jumped as the URL bar animated.
3. Spline calls `preventDefault()` on `touchmove` in some conditions, so swiping on the keyboard could freeze page scroll.
4. Hover-only: touch users could never see skill descriptions.
5. No WebGL (old GPU, privacy mode, too many contexts) threw `Error creating WebGL context`, and the root ErrorBoundary replaced the **whole site** with a red error screen.
6. With `prefers-reduced-motion` the whole section returned `null`, so the skills were gone completely.

### 4.2 Why the keyboard appears huge on phones
Spline's perspective camera keeps a fixed vertical field of view. A 3D object's on-screen size is therefore proportional to the canvas **height**, not its width. A portrait phone is tall and narrow, so a scale tuned for 16:9 overflows horizontally.

### 4.3 Fix: aspect-aware fit scale
```ts
function fitScale(stage, isMobile) {
  const base = isMobile ? 0.34 : 0.28;         // original artistic scale (upper bound)
  const K = isMobile ? 2.45 : 2.1;             // measured: widthPx ≈ K · canvasH · scale
  const ratio = stage.w < 360 ? 0.7 : stage.w < 640 ? 0.86 : 0.74;  // share of width to fill
  return clamp(0.06, (ratio * stage.w) / (K * stage.h), base);
}
```
- On desktop/landscape the fit value is larger than `base`, so `base` wins and **the desktop look is unchanged**.
- On portrait screens the scale shrinks so the keyboard fills 70–86% of the width. It is centred horizontally because `position.x = 0`.
- `useStageSize` (ResizeObserver) ignores height changes under 24px. URL-bar show/hide doesn't rebuild the timeline; rotation does.
- The GSAP timeline is rebuilt when `stage.w`/`stage.h` change, with `invalidateOnRefresh:true`. Cleanup kills only its own ScrollTrigger (the old code iterated `getAll()` against a ref that was already detached).

### 4.4 Placement & scrolling (always centred, never cropped)
```
<section.kbd-section>   height: 300svh (260svh on phones)  ← scroll track
  <div.kbd-label>        absolute, top 4rem                 ← title, scrolls away
  <div.kbd-stage>        position: sticky; top:0; height:100svh; overflow:hidden
     <Spline canvas>     100% × 100%, touch-action: pan-y
```
- The stage is exactly the visible viewport (`svh`), so the keyboard is centred in what the user actually sees, on every device.
- Scroll timeline: 0–55% rise and spin, 55–72% settle, 72–100% hold so the user can interact. `scrub` is 0.35 on touch (tighter, follows the finger) and 0.6 on desktop.
- Phones use a shorter track (260svh) so the user doesn't swipe too long.

### 4.5 Touch scrolling through the canvas
- `touch-action: pan-y` on the stage and the canvas: the browser always handles vertical pans natively.
- A capture-phase `touchmove` listener on the wrapper calls `stopPropagation()` for single-finger moves, so Spline's non-passive handler never sees them and can't `preventDefault`. Taps still reach Spline (`pointerdown`/`mouseDown`).
- Spline's `mouseDown` event selects a key on tap. The eyebrow copy switches to "tap a key to explore" on touch devices.
- Pixel ratio is capped at 1.5 on touch (2 on desktop) to save GPU and battery on 3× phones.

### 4.6 Resilience
- `hasWebGL()` pre-check, plus `<SceneBoundary>` (an error boundary). Either failure renders `<SkillsGridFallback>`, a responsive `auto-fill minmax(6.5rem,1fr)` grid of the same skills.
- Reduced motion: the keyboard renders in its settled pose with no scrub, and the section collapses to normal height (`.kbd-section--static`).

### 4.7 Verified
The settled keyboard is centred and fully visible at 280×653, 390×844, 768×1024 and 1280×720 (screenshots in the PR).

---

## 5. Starfield background (`src/components/effects/StarfieldScene.jsx`)

- **Problem:** The WebGL canvas was sized to the *whole* `.starfield-zone` (7,500–10,000px tall). At DPR 3 that is a 1170×30000 framebuffer, plus 3 post-processing composers. That is past `MAX_RENDERBUFFER_SIZE` on most phones, which causes black or blank sections and GPU crashes. It crashed the test browser.
- **Fix:**
  - The canvas sits inside `.starfield-track` (absolute, `inset:0`) and is `position:sticky; top:0; height:100lvh`. It is always exactly one viewport, and the zone still scrolls past it.
  - The renderer, camera aspect and bloom passes are sized from the **canvas**, not the zone.
  - DPR is capped (1.5 on touch, 2 on desktop). Particles drop to 4.5k on touch (7.5k on desktop). `antialias` is off on touch.
  - An IntersectionObserver plus `document.hidden` skip rendering when the zone is off-screen.
  - `new WebGLRenderer` is wrapped in try/catch, so no WebGL means no starfield instead of a crash.
  - Cleanup is now actually wired up. The async IIFE previously returned it to nowhere, which leaked the GPU context on every HMR/unmount.
- **Verify:** The canvas backing store equals the viewport (`390x844`, `1920x1080`, etc.).

---

## 6. Section-by-section

| Section | Problem | Fix |
|---|---|---|
| **Navbar** | Mobile sheet taller than a landscape phone; page scrolled behind it | `max-height: calc(100svh - 6rem)`, inner scroll, `data-lenis-prevent`; closes on Escape and when resized to ≥1024; safe-area insets; condensed pill 54 → 56rem so the 7 links + 2 buttons never clip at 1025px |
| **About** | 14rem empty block above the text on phones | `.about-globe { min-height:0 }` |
| **Where I've worked** | Hover-only, so touch users never saw the content; fixed `h-[42rem]`; logos scaled 2.8× overflowed their cards; 1-column until 1024px | `useCanHover()` means tap toggles on touch (with a "Tap to view details" hint); the `data-active` attribute drives CSS reveals; keyboard accessible (`role=button`, Enter/Space); `min-h` 34/38/42rem; logos trimmed of transparent padding (`*-trim.png`) and sized `min(85%,22rem)` / `min(62%,15rem)`; 2 columns from 768px (`md:flex-row`) |
| **CreateBand** | 4-up row at 640px squeezed "Develop"/"Deploy" | Row from 768px; font `min(2.25rem, 3.4vw)` |
| **Things I've Built** | 1-column cards stretched to 600px+ on large phones and small tablets; card back clipped long text | 2 columns from 640px; max 26rem wide when single-column; the back face scrolls internally (`overflow-y:auto`, `data-lenis-prevent`), `p-4` on phones |
| **Tracing beam** | Ate 24px of each side on 280px screens | `px-3 sm:px-6`, beam offset `-left-3` on xs |
| **Stats** | "1900" / "1800" at 3rem overflowed half-width columns on small phones | Each stat is a container (`container-type:inline-size`); number is `min(3–4.5rem, 38cqi)` + `nowrap`; tighter gaps under 640px |
| **Footer** | Watermark at 13rem wrapped to 2 lines on phones; Experience/Skills links pointed at non-existent ids and bypassed Lenis | `min(13rem,16.5vw)` + `nowrap`; links go to `#work-experience` / `#skills` via `window.scrollToId`; safe-area bottom padding |
| **Request modal** | `overflow:hidden` cut the form off in phone landscape; page scrolled behind it; iOS zoomed in on input focus | Panel `max-height: calc(100dvh - 2rem)` + `overflow-y:auto`; backdrop scrolls too; Lenis `stop()` + `html{overflow:hidden}` while open; inputs `font-size:max(16px,…)` on touch; `role=dialog aria-modal` |
| **xs (<360px)** | Tight gutters | `.shell`/hero `padding-inline:1rem`, CTA `min-width:0` |

---

## 7. Cross-browser checklist

| Concern | Handling |
|---|---|
| Safari < 15.4 (no `svh/lvh/dvh`) | Every declaration has a `vh` fallback line first |
| Safari `backdrop-filter` | `-webkit-` prefix (autoprefixer + explicit on modal) |
| `overflow: clip` (Safari < 16) | `@supports not` fallback to `hidden` on body |
| Container query units `cqi` (Chrome < 105, Safari < 16) | Previous line `min(3rem,10vw)` acts as a fallback |
| `fetchpriority` | Ignored where unsupported (harmless) |
| Firefox Android URL bar | `ignoreMobileResize` + `lvh` canvas |
| Samsung Internet "force dark" | Site is already dark; `theme-color` set |
| No WebGL / GPU blocklisted | Starfield try/catch; keyboard falls back to the skills grid; the app never crashes |
| `prefers-reduced-motion` | Lenis duration 0, static keyboard, existing CSS kill-switch |

---

## 8. QA matrix (run before every release)

Chrome DevTools device mode, then **real** iOS Safari and Android Chrome (URL-bar behaviour can't be emulated).

| # | Viewport | Check |
|---|---|---|
| 1 | 280×653 Fold | No horizontal scroll; keyboard fully visible; stats on one line |
| 2 | 375×667 SE | Hero status bar visible without scrolling; modal fits |
| 3 | 390×844 iPhone 14 | Tap a work card to open it; swipe over the keyboard scrolls the page; tap a key shows the tooltip |
| 4 | 844×390 landscape | Hero fits in one screen; nav sheet scrolls; modal scrolls internally |
| 5 | 768×1024 iPad | 2-column work cards and projects; keyboard centred |
| 6 | 1024×1366 / 1366×1024 iPad Pro | Desktop nav from 1024px; no clipped nav items |
| 7 | 1280×720 / 1440×900 laptop | Identical to the original design |
| 8 | 1920×1080 / 2560×1440 | Root font ≤ 21px; watermark on one line |
| 9 | Rotate phone mid-page | Keyboard re-fits after about 350ms; no jump |
| 10 | Disable WebGL (`chrome://flags` or Safari dev menu) | Skills grid fallback; rest of the site works |
| 11 | Reduced motion on | Keyboard static; no smooth-scroll lag |

Automated check (Playwright) used during this work: load each viewport, click past the boot loader, assert `document.scrollingElement.scrollWidth === clientWidth`, assert no element's right edge is beyond the viewport, and assert every `.stat-number` has `scrollWidth <= clientWidth`. All 6 swept widths passed with zero JS errors.

---

## 9. Files changed

| File | Change |
|---|---|
| `index.html` | `viewport-fit=cover`, Cloudinary preconnect |
| `package.json` | `browserslist` |
| `src/index.css` | Root scale, hero layouts, navbar, about, create-band, stats, footer, modal, starfield sticky, keyboard section, work-card states, xs tweaks, global safety net, Lenis CSS |
| `src/hooks/useLenis.js` | Touch-native scrolling, mobile-resize handling, refresh hooks, ticker leak fix, `window.__lenis` |
| `src/components/Hero.jsx` | Responsive Cloudinary `srcSet`, reveal width picker, `--hero-status-h` |
| `src/components/effects/LiquidRevealCanvas.jsx` | Proportional brush, tap-to-reveal |
| `src/components/effects/StarfieldScene.jsx` | Viewport-sized sticky canvas, DPR cap, visibility pause, WebGL guard, real cleanup |
| `src/components/keyboard-showcase.tsx` | Aspect-fit scale, svh sticky stage, touch scroll pass-through, tap to select, fallback grid, error boundary, reduced-motion static mode |
| `src/components/WorkExperience.jsx` | Tap to reveal, a11y, fluid heights, trimmed logos, md 2-column |
| `src/components/Portfolio.jsx` | sm 2-column, single-column max width, scrollable card back |
| `src/components/Navbar.jsx` | Escape / resize close, `data-lenis-prevent` |
| `src/components/RequestModal.jsx` | Scroll lock, dialog a11y |
| `src/components/Footer.jsx` | Correct anchors, Lenis scrolling |
| `src/App.jsx`, `ui/tracing-beam.jsx` | Narrow-screen gutters |
| `public/dell-logo-trim.png`, `public/ideaforge-logo-trim.png` | Logos with transparent padding cropped |

## 10. Known limits / next steps
- `npm run build` needs more than 1 GB RAM because of the Spline runtime. Build on a machine or CI runner with at least 2 GB (`NODE_OPTIONS=--max-old-space-size=4096`).
- The `fitScale` constants (K = 2.45 / 2.1) are calibrated for the current `skills-keyboard.spline`. If the scene's camera changes, re-measure: render at the settled pose, measure pixel width W at canvas height H, then K = W / (H × scale).
- Consider replacing the boot terminal's fixed `2rem` padding with `env(safe-area-inset-*)` for notch devices in landscape.
