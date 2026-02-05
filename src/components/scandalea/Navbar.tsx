"use client";

import React from "react";
import Image from "next/image";

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-8 py-5 flex justify-between items-center bg-black/10 backdrop-blur-md border-b border-white/5 transition-all duration-300">
            {/* Left Area - Logo Slot / Branding */}
            <div className="flex items-center gap-6">
                {/* 
                   THE SLOT: 
                   This is the destination for the Hero Logo animation.
                   It must have an ID for GSAP to calculate coordinates.
                   Opacity 0 because the visual logo traveling here comes from the Hero component.
                   We reveal this one only when the transition is complete.
                */}
                <div id="navbar-logo-slot" className="relative w-32 h-12 opacity-0">
                    <Image
                        src="/parfum/scandalea/scandalea-logo.png"
                        alt="Scandalea Mini Logo"
                        fill
                        className="object-contain"
                        style={{
                            filter: "brightness(0) invert(1) sepia(1) saturate(10000%) hue-rotate(45deg)" // Gold
                        }}
                    />
                </div>
            </div>

            {/* Right Area - Links */}
            <div className="hidden md:flex gap-8 text-sm uppercase tracking-[0.2em] text-white font-light">
                <a href="#collection" className="hover:text-scandalea-gold transition-colors duration-300">Collection</a>
                <a href="#story" className="hover:text-scandalea-gold transition-colors duration-300">Story</a>
                <a href="#cart" className="hover:text-scandalea-gold transition-colors duration-300">Cart (0)</a>
            </div>

            {/* Mobile Menu Icon (Simple) */}
            <div className="md:hidden text-white cursor-pointer">
                <span className="block w-6 h-px bg-white mb-1"></span>
                <span className="block w-6 h-px bg-white"></span>
            </div>
        </nav>
    );
};
