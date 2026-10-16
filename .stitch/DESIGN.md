# Design System: Immersive Joy & Kinetic Motion

## 1. Overview & Creative North Star: "The Kinetic Installation"
The Creative North Star for this design system is **"The Kinetic Installation."** We are not building a static website; we are orchestrating a digital gallery that feels like a physical 3D installation in a high-end Nigerien cultural space. 

This system rejects the "template" look of modern SaaS. It embraces **Intentional Friction**—using asymmetrical layouts, overlapping `Outfit` typography that feels physically heavy, and WebGL-inspired depth. We break the grid to create a sense of organized chaos, where joy is curated through physics-based interactions and high-contrast tonal layering. The experience should feel like a breathing, reacting entity that responds to the user's presence.

---

## 2. Colors: Tonal Depth over Borders
The palette is a dialogue between the warmth of the Sahel and the depth of the ocean.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. Use `surface-container-low` (#f2f4f6) against `surface` (#f8f9fb) to define space.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Base:** `surface` (#f8f9fb)
*   **Elevated Content:** `surface-container-low` (#f2f4f6)
*   **Interactive Modules:** `surface-container-highest` (#e0e3e5)

### The "Glass & Gradient" Rule
To achieve the "Site of the Year" aesthetic, utilize **Glassmorphism** for navigation and floating controls. Use `surface-container-lowest` (#ffffff) at 40-60% opacity with a `40px` backdrop-blur. 

### Signature Textures
Apply a subtle linear gradient to main CTAs transitioning from `primary` (#a23f00) to `primary_container` (#ff7f3f). This provides a "glow" effect, mimicking the solar intensity of Niger.

---

## 3. Typography: Colossal & Functional
The typographic strategy is built on extreme contrast.

*   **The Display Power:** We use **Outfit** (mapped to `epilogue` tokens) for all `display` and `headline` levels. It must be treated as a physical object. Allow `display-lg` text to overlap other sections or trigger 3D parallax effects on scroll.
*   **The Functional Anchor:** We use **Inter** for all `body` and `title` scales. While the headlines are experimental and "anti-design," the body text must remain impeccably legible to ground the experience.
*   **Labeling:** **Space Grotesk** is used for technical labels, providing a modern, slightly "engineered" feel to the interactive elements.

---

## 4. Elevation & Depth: Tonal Layering
We move away from traditional shadows in favor of **Tonal Layering** and **Physics-based Depth.**

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft "paper-on-table" lift.
*   **Ambient Shadows:** For floating 3D ribbons or glass modules, use extra-diffused shadows: `box-shadow: 0 40px 80px rgba(25, 28, 30, 0.06)`. Avoid pitch-black shadows; use a tint of `on_surface`.
*   **The "Ghost Border" Fallback:** If a boundary is vital for accessibility, use the `outline_variant` (#dfc0b4) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism:** All unconventional navigation menus must use semi-transparent `surface_bright` with a heavy blur to ensure the background "Joy Orange" or "Ocean Blue" bleeds through the interface.

---

## 5. Components: Fluidity & Impact

### Buttons: The Kinetic Trigger
*   **Primary:** High-impact `primary` (#a23f00) with `on_primary` (#ffffff) text. Shape: `DEFAULT` (0.25rem) for a brutalist edge. On hover, use a `3D transform` to lift the button +4px.
*   **Secondary:** `secondary_container` (#b6d4ff) with `on_secondary_container` (#3e5b80). No border.

### Cards & Modules: The No-Divider Rule
Forbid the use of divider lines. Separate content using the **Spacing Scale** (32px, 48px, 64px) or shifts to `surface-container-high`. Cards should feature "Physics-based" placement—slightly tilted or offset from the main axis.

### 3D Ribbons (Signature Component)
Use `tertiary_container` (#3db69f) for interactive 3D ribbons that snake across the layout. These act as section separators and should respond to mouse-move gestures using WebGL shaders.

### Unconventional Navigation
The main menu is not a top bar; it is a floating "Orbital" menu using `surface_container_lowest` glassmorphism, positioned in the bottom-right or center-left, breaking the traditional F-pattern.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** overlap typography. Let `display-lg` crawl over images to create depth.
*   **Do** use asymmetrical margins. A left-hand column might be 20% width while the right is 60%, leaving 20% "dead space" for visual breathing room.
*   **Do** use `primary` (#a23f00) as a "heat map" to guide the user's eye toward calls to action.

### Don't:
*   **Don't** use standard 1px borders. If you feel you need a line, use a wide gap of `background` (#f8f9fb) instead.
*   **Don't** align everything to a center grid. The "Joy" comes from the unexpected.
*   **Don't** use pure black shadows. They kill the immersive "frosted" aesthetic.
*   **Don't** animate with "Linear" easing. Use custom cubic-beziers (`0.23, 1, 0.32, 1`) to give elements a heavy, physical feel.

---

## Director's Closing Note
This system is about **Controlled Energy.** Every element should feel like it was placed with a hand, not a mouse. Use the `primary` orange to spark excitement and the `secondary` blue to provide the "Oceanic" depth required for a high-end experience. If the layout feels too "safe," break a rule.