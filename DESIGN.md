# Design System: High-End Editorial Guidelines

## 1. Overview & Creative North Star
**The Creative North Star: "The Architectural Monolith"**

This design system is not a collection of components; it is an exercise in restraint, precision, and masculine elegance. We move away from the "app-like" density of traditional e-commerce and toward a high-end editorial experience. 

The aesthetic is driven by **Architectural Minimalisism**. We treat the screen like a physical gallery space. Layouts should favor intentional asymmetry—placing a single high-resolution image off-center to create a "pathway" for the eye—and high-contrast typography scales that demand attention. By breaking the rigid 12-column grid with overlapping elements (e.g., a heading partially overhanging a product image), we create a sense of bespoke craftsmanship rather than templated automation.

---

## 2. Colors & Surface Philosophy

The palette is rooted in deep obsidian and charcoal tones, punctuated by a desaturated gold that feels like aged brass rather than bright foil.

### The "No-Line" Rule
Traditional 1px solid borders for sectioning are strictly prohibited. They clutter the visual field. Instead, define boundaries through **Tonal Shifts**:
*   A `surface-container-low` section sitting directly on a `surface` background.
*   The transition between `#0A0A0A` and `#111111` provides all the structural definition required for a sophisticated eye.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, premium materials. Use the `surface-container` tiers to create depth:
*   **Base:** `surface` (#131313) for the primary canvas.
*   **Sectioning:** `surface-container-low` (#1C1B1B) for large content blocks.
*   **Interactive Elements:** `surface-container-high` (#2A2A2A) for cards and modals.
*   **The Depth Principle:** An inner container must always be a slightly higher or lower tier than its parent to provide "soft" definition.

### The "Glass & Gold" Rule
To add soul to the dark interface, use **Glassmorphism** for floating elements (e.g., sticky headers or hovering quick-buy menus). 
*   **Formula:** `surface` color at 70% opacity + `backdrop-blur: 20px`.
*   **Signature Textures:** Use subtle linear gradients on CTAs, transitioning from `primary` (#E8C265) to `primary_container` (#B8963E) at a 45-degree angle. This mimics the way light hits brushed metal.

---

## 3. Typography: The Editorial Voice

We pair the authoritative, sharp serifs of Noto Serif (as a proxy for the architectural Cormorant) with the technical precision of Inter.

*   **Display & Headline (Noto Serif):** Use for brand moments, product titles, and editorial quotes. These should be set with tight letter-spacing (-0.02em) to feel cohesive and "heavy."
*   **Body & Labels (Inter):** Use for descriptions and utility. Inter provides the modern, clean "tech" counterpoint to the traditional serif.
*   **Hierarchy as Identity:** A `display-lg` heading followed immediately by a `label-md` sub-header creates an "Editorial Contrast" that signals luxury. Never use medium-sized fonts for everything; lean into the extremes of the scale.

---

## 4. Elevation & Depth

In a masculine, dark-mode system, traditional drop shadows are often too "muddy." We use light, not shadow, to define space.

*   **Tonal Layering:** Depth is achieved by "stacking" the `surface-container` tiers. A `surface-container-highest` card on a `surface-dim` background creates a natural lift.
*   **Ambient Shadows:** If a floating element (like a modal) requires a shadow, it must be tinted. Use a desaturated version of `on-surface` at 4% opacity with a blur radius of 40px+. This mimics an ambient glow rather than a harsh shadow.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke, use a **Ghost Border**. Apply `outline-variant` (#4D4637) at 20% opacity. Forbid 100% opaque borders except for the signature "Thin Gold Rule" used sparingly to separate high-level editorial sections.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#E8C265) with `on_primary` (#3E2E00) text. **Radius: 0px.** The sharp corner is non-negotiable—it reflects the architectural theme.
*   **Secondary:** Ghost style. `outline` (#99907E) at 40% opacity border with `primary` text.
*   **Tertiary:** All-caps `label-md` text with a 1px gold underline that expands on hover.

### Input Fields
*   **Background:** `surface_container_highest` (#353534).
*   **Style:** No full borders. Use a bottom-border only (1px) in `outline_variant`. On focus, this border transitions to `primary` (Gold).
*   **Typography:** Labels must be `label-sm` and always visible (no floating labels that disappear).

### Cards & Lists
*   **The "No-Divider" Rule:** Forbid the use of horizontal lines between list items. Use **Vertical White Space** (Spacing Scale 6 or 8) to create separation. 
*   **Product Cards:** Use `surface_container_lowest` for the image container to create a "recessed" look, placing the product inside the interface rather than on top of it.

### Specialized Component: The Gold Rule
A 1px horizontal or vertical line using the `primary_container` (#B8963E) at 40% opacity. Use this only to separate major editorial chapters or to anchor a floating navigation element. It should feel like a gold thread in a bespoke suit.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace the Void:** Use the spacing scale (16, 20, 24) to create vast amounts of whitespace. Luxury is the "waste" of space.
*   **Monochromatic Base:** Keep 90% of the UI in the `surface` and `on_surface` range. Reserve gold for "Path to Purchase" moments only.
*   **Architectural Alignment:** Align text to the far left or right of images to create interesting asymmetrical tension.

### Don't:
*   **No Rounded Corners:** `0px` is the standard across the entire system. Roundness conveys "friendly" and "approachable"; we want "sophisticated" and "exclusive."
*   **No Pure White:** Never use `#FFFFFF`. Use `on_surface` (#E5E2E1) or the "White" (#F2EDE8) token to keep the palette warm and expensive.
*   **No Generic Icons:** Avoid thick, bubbly icon sets. Use ultra-thin (1pt) stroke icons that match the `outline` color.

### Accessibility Note:
While we use a dark palette, ensure all "Body" text maintains a contrast ratio against `surface` containers that meets WCAG AA standards. Use the `primary_fixed` variants for interactive states to ensure visibility for all users.