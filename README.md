# Scandalea — Luxury Fragrances Portal

An elegant, high-performance web application showcasing the luxury fragrance collection of **Scandalea**. The platform serves as a visual and narrative presentation of distinct fragrances, integrating advanced frontend animations and WebGL-based hardware-accelerated interactive backdrops.

> [!WARNING]
> **DISCONTINUED PROJECT & DEMO PURPOSE NOTICE**
> This repository is officially discontinued and exists solely for demonstration, portfolio showcase, and E2E validation.
> - **Demo Scope**: The platform is entirely static in terms of user transaction flows (e.g. checkout and carts do not have a live processing backend).
> - **No Active Maintenance**: This code is archived and will receive no further updates, security patches, or feature expansions.

---

## 🌟 Key Features

### 1. Interactive WebGL Particle Vortex
* **Dynamic Backdrop**: Powered by React Three Fiber and Three.js (`MemoryCore.tsx` and `Scene.tsx`), rendering 2,000 instanced dodecahedrons floating in a 3D coordinate space.
* **Coordinate Interaction**: Swirling motion vectors adjust dynamically based on user scroll progress and real-time mouse mouse position coordinates.

### 2. High-Fidelity Motion Systems
* **GSAP ScrollTrigger**: Scroll-driven timelines drive narrative visual reveals (Manifesto, Confessions sections) with hardware-accelerated transformations.
* **Lenis Smooth Scroll**: Integration of smooth virtual scrolling context globally to eliminate browser-native scroll jitter during GSAP pinned scrolls.

### 3. Dynamic Static Generation
* **App Router ISR**: Product detail pages are compiled using static exports mapping `generateStaticParams` to pre-render individual fragrance paths during compile time.

---

## 📁 Repository Directory Structure

```text
├── .antigravity/         # Antigravity project tracking logs
├── public/               # Static assets (high-resolution product images)
└── src/
    ├── app/              # Next.js App Router routing layout
    │   ├── product/      # Product detail pages hierarchy [slug]/page.tsx
    │   ├── globals.css   # Main CSS & styling rules
    │   ├── layout.tsx    # Root layout & global WebGL scene provider
    │   └── page.tsx      # Main homepage entry point
    ├── components/       # Custom React components
    │   ├── canvas/       # Three.js canvas & R3F particle scene
    │   ├── hero/         # Specific WebGL animations & shaders
    │   ├── Navbar.tsx    # Responsive navigation bar
    │   ├── Hero.tsx      # Main hero header section
    │   ├── Manifesto.tsx # Scent narrative card layout
    │   └── ...
    ├── constants/        # Static data constants (scandaleaData.ts)
    ├── lib/              # Client utilities
    ├── shaders/          # Custom glsl materials
    └── types/            # Typescript declarations
```

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
* **Runtime**: [React 18](https://react.dev/)
* **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
* **WebGL Engine**: [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction) & [Three.js](https://threejs.org/)
* **Animation Library**: [GSAP](https://gsap.com/) (GreenSock) & [Lenis](https://lenis.darkroom.engineering/)

---

## ⚙️ Environment Configuration & Installation

### 1. Install Dependencies
Ensure you have `pnpm` or `npm` installed:
```bash
pnpm install
```

### 2. Run Local Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application locally.

### 3. Build & Compile Production Target
To run Typescript validation compile actions and optimize static bundles:
```bash
pnpm build
```
