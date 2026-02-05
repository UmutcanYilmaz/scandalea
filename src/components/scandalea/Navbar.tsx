"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black/10 backdrop-blur-md border-b border-white/5 transition-all duration-300">
            <div className="flex items-center gap-4">
                {/* Logo Slot - Initially hidden, target for Hero animation */}
                <div id="navbar-logo-slot" className="relative w-10 h-10 opacity-0 overflow-hidden">
                    <Image
                        src="/parfum/scandalea/scandalea-logo.png"
                        alt="Scandalea Mini Logo"
                        fill
                        className="object-contain filter sepia(1) brightness-50 contrast-100 hue-rotate(5deg) saturate-[3]"
                        style={{ filter: "invert(1) sepia(100%) saturate(10000%) hue-rotate(0deg) brightness(85%) contrast(110%)" }} // Attempting Gold filter
                    />
                </div>
                <span className="text-xl font-serif text-scandalea-gold tracking-widest uppercase">Scandalea</span>
            </div>

            <div className="flex gap-8 text-sm uppercase tracking-widest text-gray-300">
                <a href="#" className="hover:text-scandalea-gold transition-colors">Collection</a>
                <a href="#" className="hover:text-scandalea-gold transition-colors">Philosophy</a>
                <a href="#" className="hover:text-scandalea-gold transition-colors">Contact</a>
            </div>
        </nav>
    );
};
