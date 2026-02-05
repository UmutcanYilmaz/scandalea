# SCANDALEA DESIGN SYSTEM & BLUEPRINT

## 1. Brand Identity
* **Vibe:** "Loud Luxury", Radiant, Fluid, Gold & Burgundy.
* **Typography:** Headings: `Playfair Display` (Serif). Body: `Inter` (Sans).
* **Colors:**
    * Gold: `#D4AF37`
    * Burgundy: `#800020`
    * Crimson: `#D70040`
    * Nude: `#E6BEA5`
    * Bone: `#F0F0F0`

## 2. Asset Mapping
* Ascension -> `/public/parfum/scandalea/ascension.jpeg`
* Gourmet -> `/public/parfum/scandalea/gourmet.jpeg`
* Misfit -> `/public/parfum/scandalea/misfit.jpeg`
* Red Handed -> `/public/parfum/scandalea/redhanded.jpeg`
* Violet & Moss -> `/public/parfum/scandalea/violet&moss.jpeg`
* Logo Asset -> `/public/parfum/scandalea/scandalea-logo.png`

## 3. Component Architecture
* **Navbar:** Fixed, Glassmorphism. Contains the persistent Logo placeholder.
* **Hero:**
    * **Visual:** HTML5 Canvas "Golden Nebula" (Particle System).
    * **Interaction:** Logo starts HUGE in center, scales down and moves to Navbar on scroll (GSAP Flip/ScrollTrigger).
* **PrismGallery:**
    * **Layout:** Full-screen vertical scroll snap.
    * **Design:** Split screen (Story Left, Image Center, Notes Right). Large floating bottle images.

## 4. File Structure
* `src/app/scandalea/page.tsx` (Route)
* `src/constants/scandaleaData.ts` (Data)
* `src/components/scandalea/` (Components)
