# Design System, Typography & Styling Theory — Amit Hota Portfolio

> **Usage:** You can share this document with an AI (or designer) to analyze, critique, or revamp typography, color harmony, visual hierarchy, and spatial layout across the entire portfolio.

---

## 1. Core Source Files Map

| Configuration Target | File Location | Purpose |
|---|---|---|
| **Global CSS Variables & Tokens** | `src/index.css` | Core CSS variables, typography clamp rules, component classes, media queries, and reset. |
| **Tailwind Tokens & Extensions** | `tailwind.config.js` | Custom color aliases, font family definitions, content paths. |
| **Font Imports & Metadata** | `index.html` | Google Fonts `<link>` tags, `theme-color`, and viewport configurations. |
| **Interactive UI Components** | `src/components/ui/` | Buttons, badges, tracing beam, 3D cards, and glassmorphic elements. |

---

## 2. Typography System

### A. Font Families & Imports
Imported in `index.html` via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Onest:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

| Role | Font Family | Weights Used | Application Areas |
|---|---|---|---|
| **Primary Sans-Serif** | `'Onest', sans-serif` | `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold) | Body text, headings, buttons, navigation, titles, card descriptions. |
| **Monospace / Code / Terminal** | `'JetBrains Mono', monospace` | `400`, `500`, `600` | Boot terminal, code snippets, encrypted text effects, badges, tech tags. |

### B. Fluid Root Scaling Strategy
The site uses an adaptive fluid root scale in `src/index.css` clamped between **14px and 21px**:
```css
/* Fluid clamp prevents oversized desktop text and microscopic mobile text */
html {
  font-size: clamp(14px, 0.8333vw + 4px, 21px);
  -webkit-font-smoothing: antialiased;
}
```

### C. Type Scale Hierarchy
- **Hero Display H1:** `clamp(2.5rem, 5.5vw, 5.25rem)` — Bold, tracking tight (`-0.03em`), line-height `1.08`.
- **Section H2 (Word Reveal / Headers):** `clamp(2rem, 3.8vw, 3.75rem)` — SemiBold (`font-weight: 600`), line-height `1.15`.
- **Card Titles & Subheadings:** `1.25rem – 1.75rem` — Medium (`font-weight: 500`).
- **Body / Descriptive Text:** `1rem – 1.125rem` (`16px – 18px`), line-height `1.65`, letter-spacing `-0.01em`.
- **Micro-labels / Eyebrows / Badges:** `0.75rem – 0.875rem` (`12px – 14px`), uppercase / tracking wide (`letter-spacing: 0.08em`).
- **Watermark Display Text:** `min(13rem, 16.5vw)` — Large background watermark behind hero.

---

## 3. Color Palette & Lighting Theory

The visual theory follows an **OLED Dark Luxury / Cybernetic Depth** aesthetic with high-contrast electric accents and layered dark surfaces.

### A. Primary Color Variables
```css
:root {
  /* Core Accents */
  --accent: #62a2d8;        /* Soft Electric Cyan / Sky */
  --accent-safe: #3d7ab0;   /* Deep Cerulean Blue (focus rings, accessible text) */
  --accent-soft: #acbde0;   /* Muted Lavender Blue (secondary text) */
  --accent-deep: #2c165f;   /* Cosmic Violet (gradient anchor) */
  --accent-indigo: #455792; /* Slate Indigo (border & hover highlights) */

  /* Dark Canvas Base */
  --ink-deep: #05060f;      /* True Deep Space Navy/Black (#05060f) */
}
```

### B. Lighting & Glow Accents
- **Scroll Tracing Beam Gradient:** `#18CCFC` (Electric Cyan) → `#6344F5` (Cyber Purple) → `#AE48FF` (Neon Magenta).
- **Interactive Top Node:** `#38bdf8` (Sky Blue) with `#0284c7` border.
- **Glassmorphic Hover Halos:** `rgba(98, 162, 216, 0.15)` to `rgba(99, 68, 245, 0.25)`.
- **Text Hierarchy:**
  - **High-Emph Headline:** `#ffffff` (`rgb(255, 255, 255)`)
  - **Muted Body / Secondary:** `rgba(255, 255, 255, 0.65)` – `rgba(255, 255, 255, 0.45)`
  - **Dimmed Metadata:** `rgba(255, 255, 255, 0.28)`

---

## 4. Layout Architecture & Spatial Philosophy

### A. Viewport Unit Hierarchy
To ensure cross-device consistency on mobile browsers with collapsible URL address bars:
1. `svh` (Small Viewport Height): Used for **Hero Section** (`min-h: 100svh`) and **Keyboard sticky stage** so content is never hidden behind mobile browser address bars.
2. `lvh` (Large Viewport Height): Used for the **WebGL Starfield Canvas** so resizing URL bars do not trigger expensive WebGL texture reconstructions.
3. `dvh` (Dynamic Viewport Height): Used for **Modals & Dialogs** (`max-h: calc(100dvh - 2rem)`) to dynamically adjust to keyboards.

### B. Container Shell
- `.shell`: `max-width: 80rem` (`1280px`), horizontal auto-margins, responsive padding:
  - Mobile: `1rem` (`16px`)
  - Small Tablet: `1.5rem` (`24px`)
  - Desktop: `2rem` (`32px`)

### C. Surface & Border Styling
- **Pill Badges & Navigation:** `border-radius: 9999px`, `backdrop-filter: blur(16px)`, `border: 1px solid rgba(255, 255, 255, 0.1)`.
- **Cards & Showcase Tiles:** `border-radius: 1.25rem – 1.75rem` (`rounded-2xl` / `rounded-3xl`), subtle `border: 1px solid rgba(255, 255, 255, 0.08)`.
- **Gradients:** Multi-layer radial & conic gradients for button highlights (`mix-blend-mode: difference` / `plus-lighter`).

---

## 5. Prompt for AI Revamp / Redesign

> **Copy & paste the prompt below to any AI model for font or design recommendations:**

```text
You are an expert design engineer specialized in modern luxury dark-mode web design, typography pairings, and micro-interactions.

Here is the design specification of my portfolio:
- Current Primary Font: 'Onest' (Clean geometric sans-serif)
- Current Monospace Font: 'JetBrains Mono'
- Background: Deep OLED Space Black (#05060f)
- Accent Theme: Electric Cyan (#18CCFC, #62a2d8) transitioning into Deep Cosmic Purple (#6344F5, #2c165f)
- Style: Cybernetic, sleek, software engineer / systems builder aesthetic with WebGL canvas interactions and glassmorphic pill cards.

Please review this design system and propose:
1. Typographic Refinements: Suggest 3 modern font pairing alternatives (e.g. Satoshi, Cabinet Grotesk, Syne, Inter Display, Plus Jakarta Sans, Geist Sans, Instrument Sans) with exact Google/CDN links, line-height, letter-spacing, and weight hierarchy for Headings vs Body vs Monospace.
2. Color & Contrast Tuning: Specific hex/HSL enhancements to improve readability, glow contrast, and accessible WCAG AAA ratios on dark backgrounds.
3. Spacing & Micro-Interaction Details: Subtle tweaks to border radius, shadows, glassmorphism blur values, and hover states that elevate the look to an award-winning (Awwwards/FWA-level) portfolio.
```
