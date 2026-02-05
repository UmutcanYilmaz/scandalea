"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SCANDALEA_PRODUCTS } from "@/constants/scandaleaData";

gsap.registerPlugin(ScrollTrigger);

export const PrismGallery = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const panels = panelsRef.current;

        panels.forEach((panel: HTMLDivElement | null, i: number) => {
            if (!panel) return;
            const product = SCANDALEA_PRODUCTS[i];
            const bgValue = product.gradient || product.color;

            // Change background color/gradient when this panel enters center view
            ScrollTrigger.create({
                trigger: panel,
                start: "top center",
                end: "bottom center",
                onToggle: (self: ScrollTrigger) => {
                    if (self.isActive) {
                        gsap.to("body", {
                            backgroundImage: bgValue.includes("gradient") ? bgValue : "none",
                            backgroundColor: bgValue.includes("gradient") ? "#000" : bgValue,
                            duration: 1.0,
                            overwrite: "auto"
                        });
                    }
                }
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach((t: ScrollTrigger) => t.kill());
            // Reset body color logic if needed on unmount
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full">
            {SCANDALEA_PRODUCTS.map((product, index) => (
                <div
                    key={product.id}
                    ref={(el: HTMLDivElement | null) => { panelsRef.current[index] = el; }}
                    className="h-screen w-full flex flex-col md:flex-row snap-start snap-always overflow-hidden border-b border-white/5"
                >
                    {/* Story / Left */}
                    <div className="w-full md:w-1/4 flex flex-col items-center justify-center p-8 bg-black/20 backdrop-blur-sm z-10">
                        <div className="text-white text-center md:text-left">
                            <h2 className="text-6xl md:text-8xl font-serif mb-4 opacity-50 text-white/10 font-bold select-none absolute top-4 left-4 md:static">
                                {(index + 1).toString().padStart(2, '0')}
                            </h2>
                            <p className="text-sm md:text-base tracking-[0.2em] font-light text-scandalea-gold mb-2">{product.vibe.toUpperCase()}</p>
                            <h3 className="text-2xl md:text-3xl font-serif mb-2">{product.name}</h3>
                            <p className="text-xs md:text-sm uppercase tracking-widest font-light text-gray-400 mb-6">{product.tagline}</p>
                            <p className="text-sm text-gray-300 italic max-w-xs">{product.description}</p>
                        </div>
                    </div>

                    {/* Image / Center */}
                    <div className="w-full md:w-1/2 relative h-[50vh] md:h-full group order-first md:order-none">
                        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-14 transition-transform duration-700 hover:scale-105">
                            <div className="relative w-full h-full max-w-lg drop-shadow-2xl">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain"
                                    priority={index < 2}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notes / Right */}
                    <div className="w-full md:w-1/4 flex items-center justify-center p-8 bg-black/20 backdrop-blur-sm z-10">
                        <div className="text-center md:text-right w-full">
                            <h4 className="text-lg font-serif text-white mb-6 border-b border-white/20 pb-2 inline-block">OLFACTORY NOTES</h4>

                            <div className="space-y-6 text-sm text-gray-200">
                                <div>
                                    <span className="text-xs text-scandalea-gold uppercase tracking-wider block mb-1">Top</span>
                                    <span>{product.notes.top}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-scandalea-gold uppercase tracking-wider block mb-1">Heart</span>
                                    <span>{product.notes.heart}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-scandalea-gold uppercase tracking-wider block mb-1">Base</span>
                                    <span>{product.notes.base}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
