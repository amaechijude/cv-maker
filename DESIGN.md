# Design System Strategy: The Editorial Architect

This design system is crafted for a high-end CV editor, moving away from "utility software" toward a "prestige editorial" experience. It treats a user's professional history not as a database entry, but as a published story. The aesthetic relies on the tension between the authoritative weight of classic serif typography and the ethereal lightness of modern digital layering.

---

### 1. Creative North Star: The Digital Curator
The "Digital Curator" principle dictates that every interface element must feel like a deliberate choice on a gallery wall. We avoid the "grid-of-boxes" look typical of SaaS by using **intentional asymmetry** and **tonal depth**. By overlapping high-elevation surfaces and utilizing wide, sweeping margins (16–24 spacing tokens), we create an environment that feels expensive, calm, and precise—qualities a user wants to project in their own career.

---

### 2. Colors & Surface Architecture
The palette is rooted in `primary` (#002045)—an authoritative deep navy—balanced by a spectrum of architectural grays and "paper" whites.

*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Use background shifts to define boundaries. A `surface-container-low` (#f1f4f6) sidebar should sit against a `background` (#f7fafc) main area without a visible stroke.
*   **Surface Hierarchy & Nesting:** Depth is created through a "Paper Stack" logic.
    *   **Base:** `surface` (#f7fafc)
    *   **Sections:** `surface-container-low` (#f1f4f6)
    *   **Interactive Cards:** `surface-container-lowest` (#ffffff)
*   **The Glass & Gradient Rule:** For floating navigation or "Live Preview" panels, use Glassmorphism. Apply `surface` at 80% opacity with a `20px` backdrop blur. For primary CTAs, use a subtle linear gradient from `primary` (#002045) to `primary_container` (#1a365d) at a 135-degree angle to provide a "silk-finish" depth.

---

### 3. Typography: The Editorial Voice
We use a high-contrast pairing to balance tradition with modernity.

*   **Display & Headlines (Newsreader):** This serif provides the "Trust" factor. Use `display-lg` for hero welcomes and `headline-sm` for CV section headers (e.g., "Professional Experience"). Its slightly tall x-height ensures it remains readable even in digital formats.
*   **Body & UI (Manrope):** A clean, geometric sans-serif that handles the "Efficiency" factor. Use `body-md` for all form inputs and descriptions. 
*   **Hierarchy Note:** Always pair a `headline-sm` serif with a `label-md` sans-serif subhead in `on_surface_variant` (#43474e) to create an immediate sense of professional hierarchy.

---

### 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "software-like." This system uses ambient light.

*   **The Layering Principle:** To lift a "Work Experience" card, place a `surface-container-lowest` (#ffffff) element on a `surface-container` (#ebeef0) background. The delta in hex value provides the "lift" without visual noise.
*   **Ambient Shadows:** For "floating" elements like a floating action button or a modal, use a shadow with a 32px blur, 0px spread, and a color of `on_secondary` at 6% opacity. It should look like a soft glow, not a dark smudge.
*   **The Ghost Border:** If a boundary is required for accessibility (e.g., input fields), use `outline_variant` (#c4c6cf) at **15% opacity**. It should be felt, not seen.

---

### 5. Signature Components

*   **The "Manuscript" Button (Primary):**
    *   **Style:** Gradient fill (`primary` to `primary_container`), `md` (0.375rem) rounding.
    *   **Text:** `title-sm` in `on_primary`. 
    *   **State:** On hover, increase the gradient intensity; do not use a border.
*   **The "Soft" Input Field:**
    *   **Style:** `surface-container-highest` (#e0e3e5) background, no border.
    *   **Focus:** Transition to `surface-container-lowest` (#ffffff) with a 2px "Ghost Border" in `primary`.
*   **The CV Preview Card:**
    *   **Architecture:** Use `surface-container-lowest`. Strictly forbid divider lines between "Education" and "Experience." Use `spacing-8` (2rem) of vertical white space to separate these thoughts.
*   **Interactive Chips:**
    *   **Style:** Use `secondary_container` (#d5e0f7) with `on_secondary_container` text. Use `full` (9999px) rounding for a "pill" look that contrasts against the architectural cards.
*   **Progress Stepper:**
    *   Instead of a horizontal bar, use a vertical "Editorial Timeline" using `outline_variant` dots and `headline-sm` serif numbers.

---

### 6. Do’s and Don’ts

**Do:**
*   **Do** use `display-lg` for empty states to make them feel like a magazine cover rather than an error.
*   **Do** use the `24` (6rem) spacing token for top-level page margins to let the design breathe.
*   **Do** utilize `tertiary_container` (#4f2e00) for subtle "Tips" or "Coaching" callouts—it provides a warm, sophisticated contrast to the cool blues.

**Don’t:**
*   **Don’t** use pure black (#000000). Always use `on_background` (#181c1e) for text to maintain a premium, ink-on-paper feel.
*   **Don’t** use `xl` rounding (0.75rem) on everything. Keep it reserved for large containers. Small elements like buttons should stay `md` (0.375rem) to maintain a "precise" and "sharp" professional look.
*   **Don’t** use standard "blue" links. Use `primary` with a 1px underline that is offset by 2px for an editorial feel.