"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Canvas Nebula Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const particles: Particle[] = [];
        const particleCount = 100;

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            opacity: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // #D4AF37 Gold
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Logo Scroll Animation
    useEffect(() => {
        const logo = logoRef.current;

        // We target the navbar slot by ID to synchronize, but here we just animate the hero logo out.
        // The navbar logo logic is handled within the Navbar component effectively by being initially hidden,
        // actually, let's control the navbar logo opacity from here using basic DOM manipulation since they are separate components.
        const navbarSlot = document.getElementById("navbar-logo-slot");

        if (logo) {
            gsap.to(logo, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                },
                opacity: 0,
                scale: 0.2, // Shrink as we scroll down
                y: -100, // Move up
                onUpdate: (self: ScrollTrigger) => {
                    // Show navbar logo when progress is near complete (> 80%)
                    if (navbarSlot) {
                        const progress = self.progress;
                        navbarSlot.style.opacity = progress > 0.8 ? String((progress - 0.8) * 5) : "0";
                    }
                }
            });
        }
    }, []);

    return (
        <div ref={containerRef} className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-60" />

            <div ref={logoRef} className="relative z-10 w-64 h-64 md:w-96 md:h-96">
                <Image
                    src="/parfum/scandalea/scandalea-logo.png"
                    alt="Scandalea Logo"
                    fill
                    className="object-contain"
                    priority
                    style={{ filter: "invert(1) sepia(100%) saturate(10000%) hue-rotate(0deg) brightness(85%) contrast(110%)" }}
                />
            </div>

            <div className="absolute bottom-10 animate-bounce text-scandalea-gold text-2xl cursor-pointer">
                ↓
            </div>
        </div>
    );
};
