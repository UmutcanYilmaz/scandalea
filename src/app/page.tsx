"use client";

import React, { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(containerRef.current, {
                opacity: 0,
                duration: 1.5,
                ease: "power2.out"
            });

            gsap.from(".entrance-element", {
                y: 30,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                delay: 0.5,
                ease: "power3.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="h-screen w-full flex flex-col items-center justify-center bg-black text-white space-y-8 overflow-hidden relative">
            {/* Background Texture/Halo */}
            <div className="absolute inset-0 bg-radial-gradient from-scandalea-gold/10 via-black to-black opacity-40 pointer-events-none" />

            <h1 className="entrance-element text-5xl md:text-7xl font-serif tracking-tight">The Collection.</h1>
            <p className="entrance-element text-sm tracking-[0.3em] text-neutral-400">RESTRICTED ACCESS</p>

            <Link
                href="/scandalea"
                className="entrance-element group relative px-10 py-4 border border-white/20 hover:border-scandalea-gold transition-colors duration-500 overflow-hidden"
            >
                <span className="relative z-10 uppercase tracking-widest text-xs group-hover:text-scandalea-gold transition-colors">Enter Scandalea</span>
                <div className="absolute inset-0 bg-white/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out"></div>
            </Link>
        </div>
    );
}

