"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SCANDALEA_PRODUCTS } from "@/constants/scandaleaData";

gsap.registerPlugin(ScrollTrigger);

export const PrismGallery = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const panelsRef = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const panels = panelsRef.current;

        panels.forEach((panel) => {
            if (!panel) return;

            // Animation for elements within the card when it comes into view
            const q = gsap.utils.selector(panel);
            const img = q(".product-image");
            const text = q(".product-text");

            gsap.fromTo(img,
                { scale: 0.8, opacity: 0.8 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: panel,
                        start: "top center+=100",
                        toggleActions: "play reverse play reverse"
                    }
                }
            );

            gsap.fromTo(text,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: panel,
                        start: "top center+=100",
                        toggleActions: "play reverse play reverse"
                    }
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        }
    }, []);

    return (
        <div ref={containerRef} className="relative w-full bg-black">
            {SCANDALEA_PRODUCTS.map((product, index) => (
                <section
                    key={product.id}
                    ref={(el) => { panelsRef.current[index] = el; }}
                    className="h-screen sticky top-0 flex items-center justify-center overflow-hidden border-t border-white/10"
                    style={{
                        background: `radial-gradient(circle at center, ${product.color}20 0%, #000000 90%)`,
                        zIndex: index + 1 // Ensure stacking order
                    }}
                >
                    {/* Content Container - Split Screen */}
                    <div className="w-full max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-between">

                        {/* Left: Text & Story */}
                        <div className="w-full md:w-1/3 text-center md:text-left space-y-6 z-10 product-text">
                            <h2 className="text-6xl md:text-8xl font-serif text-white leading-none">
                                {product.name.split(' ').map((word, i) => (
                                    <span key={i} className="block">{word}</span>
                                ))}
                            </h2>
                            <p className="text-xl italic text-white/70 font-serif">"{product.tagline}"</p>
                            <div className="w-12 h-px bg-scandalea-gold my-4 mx-auto md:mx-0"></div>
                            <p className="text-sm md:text-base text-gray-400 max-w-sm mx-auto md:mx-0 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Center: Image */}
                        <div className="relative w-[300px] h-[400px] md:w-[50vh] md:h-[70vh] flex-shrink-0 z-20 my-8 md:my-0 product-image">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                priority={index < 2}
                            />
                        </div>

                        {/* Right: Notes */}
                        <div className="w-full md:w-1/3 text-center md:text-right space-y-8 z-10 product-text">
                            <div>
                                <h4 className="text-xs uppercase tracking-[0.3em] text-scandalea-gold mb-2">Top Notes</h4>
                                <p className="text-lg text-white font-light">{product.notes.top}</p>
                            </div>
                            <div>
                                <h4 className="text-xs uppercase tracking-[0.3em] text-scandalea-gold mb-2">Heart Notes</h4>
                                <p className="text-lg text-white font-light">{product.notes.heart}</p>
                            </div>
                            <div>
                                <h4 className="text-xs uppercase tracking-[0.3em] text-scandalea-gold mb-2">Base Notes</h4>
                                <p className="text-lg text-white font-light">{product.notes.base}</p>
                            </div>
                        </div>

                    </div>
                </section>
            ))}

            {/* Spacer for last item to be fully scrollable if needed, though sticky handles it well usually. 
                With sticky cards, the container height is controlled by content flow. 
            */}
        </div>
    );
};
