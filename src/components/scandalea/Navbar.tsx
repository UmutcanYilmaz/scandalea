"use client";

import React, { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export const Navbar = () => {
    const linksRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const links = linksRef.current?.querySelectorAll("a");
            links?.forEach((link) => {
                link.addEventListener("mouseenter", () => {
                    gsap.to(link, { scale: 1.1, color: "#D4AF37", duration: 0.3, ease: "power2.out" });
                });
                link.addEventListener("mouseleave", () => {
                    gsap.to(link, { scale: 1, color: "white", duration: 0.3, ease: "power2.out" });
                });
            });
        }, linksRef);
        return () => ctx.revert();
    }, []);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center transition-all duration-300 bg-black/5 backdrop-blur-xl backdrop-saturate-150 border-b border-white/5">
            {/* Left Area - Branding */}
            <Link href="/scandalea" className="flex items-center gap-6 group">
                <span
                    className="text-lg md:text-xl lg:text-2xl uppercase font-light tracking-[0.2em] text-white group-hover:text-scandalea-gold transition-colors duration-500"
                    style={{
                        fontFamily: 'Georgia, "Times New Roman", serif',
                        textShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
                    }}
                >
                    SCANDALÉA
                </span>
            </Link>

            {/* Right Area - Links */}
            <div ref={linksRef} className="hidden md:flex gap-10 text-xs uppercase tracking-[0.25em] text-white font-light font-sans">
                <Link href="#collection" className="relative">Collection</Link>
                <Link href="#story" className="relative">Story</Link>
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden text-white cursor-pointer hover:text-scandalea-gold transition-colors">
                <div className="space-y-1.5">
                    <span className="block w-8 h-px bg-current"></span>
                    <span className="block w-5 h-px bg-current ml-auto"></span>
                </div>
            </div>
        </nav>
    );
};

