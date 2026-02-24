import { Navbar } from "@/components/scandalea/Navbar";
import { Hero } from "@/components/scandalea/Hero";
import { Manifesto } from "@/components/scandalea/Manifesto";
import { Confessions } from "@/components/scandalea/Confessions";
import { CollectionShowcase } from "@/components/scandalea/CollectionShowcase";

export default function ScandaleaPage() {
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
