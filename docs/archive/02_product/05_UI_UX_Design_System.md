# 05 — UI/UX Design System

> **Project:** OptiPlay — Gamified Operations Research Platform
> **Document:** 05 of 11 · UI/UX Design System ("The Vibe")
> **Cross-references:** [08 Wireframes](./08_Wireframes_and_Screen_Flow.md) · [06 User Journey](./06_User_Personas_and_Journey.md)

---

## 1. Design Philosophy

OptiPlay's visual identity is **dark glassmorphic** — a premium, modern aesthetic that combines deep dark backgrounds, translucent frosted-glass surfaces, and vibrant neon accents. Every interactive element must provide immediate visual feedback. The platform should feel like a high-end game, not an academic tool.

## 2. Color Palette

### Backgrounds
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#020617` | Page background (slate-950) |
| `--bg-gradient` | `radial-gradient(ellipse at top, #0f172a, #020617)` | Full-page gradient |

### Surfaces (Glass Cards)
| Token | Value | Usage |
|-------|-------|-------|
| `--surface-glass` | `rgba(255, 255, 255, 0.05)` | Card/panel backgrounds |
| `--surface-glass-hover` | `rgba(255, 255, 255, 0.08)` | Hovered cards |
| `--surface-border` | `rgba(255, 255, 255, 0.10)` | Subtle card borders |
| `--surface-blur` | `blur(12px)` | `backdrop-filter` value |

### Accents
| Token | Value | Usage |
|-------|-------|-------|
| `--accent-primary` | `#8b5cf6` | Buttons, highlights, interactive focus (Violet) |
| `--accent-primary-glow` | `rgba(139, 92, 246, 0.3)` | Box-shadow glow on hover |
| `--accent-success` | `#10b981` | Optimal state, victory, confirmations (Emerald) |
| `--accent-danger` | `#ef4444` | Overweight warning, error states (Rose) |
| `--accent-info` | `#3b82f6` | Hint toast, informational highlights (Blue) |

### Text
| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `#f8fafc` | Headings, high-emphasis text |
| `--text-secondary` | `#cbd5e1` | Body text, descriptions |
| `--text-muted` | `#64748b` | Captions, disabled states |

## 3. Typography

**Font Family:** `'Inter', sans-serif` (loaded via Google Fonts)

| Element | Size | Weight | Letter Spacing | Additional |
|---------|------|--------|----------------|------------|
| `H1` | `3rem` (48px) | 800 (Extra Bold) | `-0.02em` | — |
| `H2` | `2rem` (32px) | 600 (Semi Bold) | `-0.01em` | `text-shadow: 0 0 30px rgba(139, 92, 246, 0.15)` |
| `H3` | `1.25rem` (20px) | 600 | `0` | — |
| `Body` | `1rem` (16px) | 400 | `0` | `line-height: 1.6` |
| `Caption` | `0.875rem` (14px) | 400 | `0.01em` | Color: `--text-muted` |

## 4. Spacing & Layout

| Token | Value |
|-------|-------|
| `--space-xs` | `4px` |
| `--space-sm` | `8px` |
| `--space-md` | `16px` |
| `--space-lg` | `24px` |
| `--space-xl` | `32px` |
| `--space-2xl` | `48px` |
| `--radius-sm` | `8px` |
| `--radius-md` | `12px` |
| `--radius-lg` | `16px` |

## 5. Micro-Animations

| Interaction | Animation | CSS |
|-------------|-----------|-----|
| **Card hover** | Scale + glow | `transform: scale(1.02); box-shadow: 0 0 20px var(--accent-primary-glow); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);` |
| **Button hover** | Brighten + lift | `filter: brightness(1.1); transform: translateY(-1px);` |
| **Item pickup (drag)** | Lift + shadow | `transform: scale(1.05); box-shadow: 0 12px 24px rgba(0,0,0,0.4); opacity: 0.9;` |
| **Item drop (into bag)** | Bounce snap | `@keyframes snapBounce { 0% { scale(0.95) } 50% { scale(1.03) } 100% { scale(1) } }` — 200ms |
| **Capacity exceeded** | Red flash + bounce back | Item returns to origin; Bag zone border flashes `--accent-danger` for 300ms |
| **Hint toast appear** | Slide up + fade in | `transform: translateY(10px) → translateY(0); opacity: 0 → 1;` — 300ms ease-out |
| **Victory confetti** | Canvas confetti burst | 3-second burst, then fade. Colors: `--accent-primary`, `--accent-success`, `#fbbf24` (gold) |
| **Page transition** | Fade | `opacity: 0 → 1;` — 200ms on route change |

## 6. Item Card Visual Proportionality

Item cards in the game have their **width scaled proportionally to weight**:
```
cardWidth = BASE_WIDTH + (item.weight / maxWeight) * SCALE_FACTOR
```
- `BASE_WIDTH`: 80px (minimum card width for readability)
- `SCALE_FACTOR`: 120px (range of additional width)
- A 7-lb item (Computer) is visually ~2.3× wider than a 2-lb item (Camera).
- Each card displays: item name, dollar value, weight in lbs, and an emoji icon.

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout Adjustment |
|------------|-------|-------------------|
| Desktop | ≥ 1024px | Inventory (left) + Bag (right) side-by-side |
| Tablet | 768–1023px | Inventory (top) + Bag (bottom) stacked |
| Mobile | < 768px | Single column, compact cards |
