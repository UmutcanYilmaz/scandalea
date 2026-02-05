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
            const color = SCANDALEA_PRODUCTS[i].color;

            // Change background color when this panel enters center view
            ScrollTrigger.create({
                trigger: panel,
                start: "top center",
                end: "bottom center",
                onToggle: (self: ScrollTrigger) => {
                    if (self.isActive) {
                        gsap.to("body", {
                            backgroundColor: color, // We can animate the body or a fixed background layer with an ID
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
                    className="h-screen w-full flex flex-col md:flex-row snap-start snap-always overflow-hidden"
                >
                    {/* Story / Left */}
                    <div className="w-full md:w-1/4 flex items-center justify-center p-8 bg-black/20 backdrop-blur-sm">
                        <div className="text-white">
                            <h2 className="text-4xl md:text-6xl font-serif mb-4 opacity-0 animate-in slide-in-from-left duration-1000 fill-mode-forwards" style={{ animationDelay: '0.2s' }}>
                                {product.id === "ascension" ? "01" :
                                    product.id === "gourmet" ? "02" :
                                        product.id === "misfit" ? "03" :
                                            product.id === "redhanded" ? "04" : "05"}
                            </h2>
                            <p className="text-xl uppercase tracking-widest font-light">{product.tagline}</p>
                        </div>
                    </div>

                    {/* Image / Center */}
                    <div className="w-full md:w-1/2 relative h-1/2 md:h-full group">
                        <div className="absolute inset-0 flex items-center justify-center p-10 transition-transform duration-700 hover:scale-105">
                            <div className="relative w-full h-full max-w-lg max-h-lg drop-shadow-2xl">
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
                    <div className="w-full md:w-1/4 flex items-center justify-center p-8 bg-black/20 backdrop-blur-sm">
                        <div className="text-right">
                            <h3 className="text-3xl font-serif text-white mb-2">{product.name}</h3>
                            <div className="h-px w-24 bg-white/50 ml-auto mb-4"></div>
                            <p className="text-sm uppercase tracking-wider text-gray-200">{product.notes}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
