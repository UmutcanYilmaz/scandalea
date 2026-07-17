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

        panels.forEach((panel, i) => {
            if (!panel) return;

            const q = gsap.utils.selector(panel);
            const img = q(".product-image");
            const text = q(".product-text");
            const number = q(".index-number");

            // Entrance animation for each sticky card
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: panel,
                    start: "top center", // Activate when top of card hits center
                    end: "bottom center",
                    toggleActions: "play reverse play reverse"
                }
            });

            tl.fromTo(img,
                { scale: 0.8, opacity: 0, rotation: 5 },
                { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: "power3.out" }
            )
                .fromTo(text,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power2.out" },
                    "-=0.5"
                )
                .fromTo(number,
                    { opacity: 0, x: -50 },
                    { opacity: 0.2, x: 0, duration: 1 },
                    "-=0.8"
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
                    className="h-screen sticky top-0 flex items-center justify-center overflow-hidden border-t border-white/5 shadow-2xl"
                    style={{
                        background: `radial-gradient(circle at 50% 50%, ${product.color}15 0%, #050505 80%)`,
                        zIndex: index + 1
                    }}
                >
                    {/* Background Index Number */}
                    <div className="absolute top-10 left-10 text-[20vw] font-serif text-white opacity-0 index-number leading-none select-none pointer-events-none">
                        0{index + 1}
                    </div>

                    <div className="w-full max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-between relative z-10">

                        {/* Left: Text */}
                        <div className="w-full md:w-1/3 text-center md:text-left space-y-6 select-none">
                            <h2 className="text-6xl md:text-8xl font-serif text-white leading-none tracking-tighter mix-blend-difference product-text">
                                {product.name}
                            </h2>
                            <p className="text-2xl italic text-scandalea-gold font-serif product-text">"{product.tagline}"</p>

                            <div className="hidden md:block w-16 h-px bg-white/20 my-6 product-text" />

                            <p className="text-sm text-gray-400 max-w-sm leading-relaxed product-text">
                                {product.description}
                            </p>
                        </div>

                        {/* Center: Image */}
                        <div className="relative w-[60vw] h-[50vh] md:w-[30vw] md:h-[70vh] flex-shrink-0 my-8 md:my-0 product-image">
                            <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent blur-2xl transform scale-75" />
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 60vw, 30vw"
                                className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                                priority={index < 2}
                            />
                        </div>

                        {/* Right: Notes */}
                        <div className="w-full md:w-1/3 text-center md:text-right space-y-8 select-none">
                            <div className="product-text">
                                <h4 className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-2">Top Notes</h4>
                                <p className="text-xl text-white font-serif">{product.notes.top}</p>
                            </div>
                            <div className="product-text">
                                <h4 className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-2">Heart Notes</h4>
                                <p className="text-xl text-white font-serif">{product.notes.heart}</p>
                            </div>
                            <div className="product-text">
                                <h4 className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-2">Base Notes</h4>
                                <p className="text-xl text-white font-serif">{product.notes.base}</p>
                            </div>

                            <div className="product-text pt-8">
                                <button className="px-8 py-3 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500 uppercase tracking-widest text-xs group">
                                    <span className="group-hover:mr-2 transition-all">Acquire</span>
                                    <span className="opacity-0 group-hover:opacity-100 transition-all">→</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </section>
            ))}
        </div>
    );
};

