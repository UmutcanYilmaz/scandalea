import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Confessions } from "@/components/Confessions";
import { CollectionShowcase } from "@/components/CollectionShowcase";

/**
 * Root home page serving the primary Scandalea interactive experience.
 * Incorporates high-performance GSAP ScrollTrigger reveals, smooth scroll context,
 * and standard WebGL backdrop canvas injections.
 */
export default function Home() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-scandalea-gold selection:text-black">
            <Navbar />
            <Hero />
            <Manifesto />
            <Confessions />
            <CollectionShowcase />
        </main>
    );
}
