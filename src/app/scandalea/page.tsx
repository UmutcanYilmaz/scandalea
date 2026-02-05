import { Navbar } from "@/components/scandalea/Navbar";
import { Hero } from "@/components/scandalea/Hero";
import { PrismGallery } from "@/components/scandalea/PrismGallery";

export default function ScandaleaPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-scandalea-gold selection:text-black">
            <Navbar />
            <Hero />
            <PrismGallery />
        </main>
    );
}
