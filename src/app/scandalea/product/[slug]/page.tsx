

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SCANDALEA_PRODUCTS } from "@/constants/scandaleaData";
import { Navbar } from "@/components/scandalea/Navbar";

export default function ProductPage({ params }: { params: { slug: string } }) {
    const product = SCANDALEA_PRODUCTS.find((p) => p.id === params.slug);

    if (!product) {
        return notFound();
    }

    return (
        <main className="min-h-screen bg-black text-white pb-20">
            <Navbar />

            {/* Split Screen Layout */}
            <div className="flex flex-col lg:flex-row min-h-screen">

                {/* Left: Product Image (Fixed on desktop) */}
                <div className="w-full lg:w-1/2 h-[60vh] lg:h-screen lg:fixed lg:top-0 lg:left-0 bg-gradient-to-b from-neutral-900 to-black flex items-center justify-center p-10 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30" style={{ background: product.gradient }} />
                    <div className="relative w-full h-full max-w-md animate-float">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain drop-shadow-[0_0_60px_rgba(255,255,255,0.1)]"
                            priority
                        />
                    </div>
                </div>

                {/* Right: Scrollable Content */}
                <div className="w-full lg:w-1/2 lg:ml-[50%] px-6 py-20 lg:p-32 flex flex-col gap-12 bg-black z-10">

                    {/* Header */}
                    <div className="space-y-4">
                        <span className="text-scandalea-gold text-xs tracking-[0.3em] uppercase">The {product.vibe} Collection</span>
                        <h1 className="text-5xl md:text-7xl font-serif leading-none">{product.name}</h1>
                        <p className="text-xl italic font-serif text-white/60">"{product.tagline}"</p>
                    </div>

                    {/* Price & Cart */}
                    <div className="py-8 border-y border-white/10 flex flex-col gap-6">
                        <div className="flex justify-between items-center text-2xl font-light">
                            <span>50ML / 1.7 FL.OZ</span>
                            <span>€220.00</span>
                        </div>
                        <button className="w-full py-5 bg-white text-black text-sm uppercase tracking-[0.2em] hover:bg-scandalea-gold transition-colors duration-300">
                            Add to Cart
                        </button>
                    </div>

                    {/* Description */}
                    <div className="space-y-6">
                        <h3 className="text-sm uppercase tracking-widest text-neutral-400">The Story</h3>
                        <p className="text-lg leading-relaxed text-gray-300 font-light">
                            {product.description}
                        </p>
                        <p className="text-gray-400 font-light">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </div>

                    {/* Olfactory Notes */}
                    <div className="space-y-8 pt-10">
                        <h3 className="text-sm uppercase tracking-widest text-neutral-400">Olfactory Notes</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <span className="block w-2 h-2 rounded-full bg-scandalea-gold mb-4"></span>
                                <span className="text-xs uppercase text-neutral-500">Top</span>
                                <p className="text-lg font-serif">{product.notes.top}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="block w-2 h-2 rounded-full bg-scandalea-crimson mb-4"></span>
                                <span className="text-xs uppercase text-neutral-500">Heart</span>
                                <p className="text-lg font-serif">{product.notes.heart}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="block w-2 h-2 rounded-full bg-scandalea-obsidian border border-white/20 mb-4"></span>
                                <span className="text-xs uppercase text-neutral-500">Base</span>
                                <p className="text-lg font-serif">{product.notes.base}</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Link */}
                    <div className="pt-20">
                        <Link href="/scandalea#collection" className="text-xs uppercase tracking-widest border-b border-white pb-1 hover:text-scandalea-gold hover:border-scandalea-gold transition-colors">
                            ← Back to Collection
                        </Link>
                    </div>

                </div>
            </div>
        </main>
    );
}

// To use `generateStaticParams` for pre-rendering if user wants static export later.
export async function generateStaticParams() {
    return SCANDALEA_PRODUCTS.map((product) => ({
        slug: product.id,
    }));
}
