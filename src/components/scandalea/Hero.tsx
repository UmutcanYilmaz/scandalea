"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    // 1. Canvas Layer (Liquid Light)
    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            alpha: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.alpha = Math.random() * 0.5 + 0.2;
            }

            update(mouse: { x: number; y: number }) {
                // Liquid Interaction: Flow AWAY from cursor
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 150;

                if (distance < maxDist) {
                    const forceDirX = dx / distance;
                    const forceDirY = dy / distance;
                    const force = (maxDist - distance) / maxDist;
                    const repulsion = force * 5;

                    this.x -= forceDirX * repulsion;
                    this.y -= forceDirY * repulsion;
                }

                // Standard movement
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around screen
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`; // #D4AF37 Gold
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const particles: Particle[] = [];
        for (let i = 0; i < 150; i++) {
            particles.push(new Particle());
        }

        const mouse = { x: -9999, y: -9999 };

        const handleMove = (e: MouseEvent | TouchEvent) => {
            let clientX, clientY;
            if ('touches' in e) {
                if (e.touches.length > 0) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else return;
            } else {
                clientX = (e as MouseEvent).clientX;
                clientY = (e as MouseEvent).clientY;
            }
            mouse.x = clientX;
            mouse.y = clientY;
        };

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("touchmove", handleMove, { passive: false });

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p) => {
                p.update(mouse);
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

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("touchmove", handleMove);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // 2. Logo Layer Transition (Manual "Flip" Logic)
    useLayoutEffect(() => {
        const heroLogo = logoRef.current;
        const navbarSlot = document.getElementById("navbar-logo-slot");

        if (!heroLogo || !navbarSlot) return;

        // Get initial and final states
        const heroState = heroLogo.getBoundingClientRect();
        const navState = navbarSlot.getBoundingClientRect();

        // Calculate scale and position deltas
        // We want the hero logo (40vw) to shrink into the navbar slot (which is small, 40px)
        // Note: Since heroLogo is centered using flex, we can let GSAP handle the movement relative to viewport or specific deltas.
        // However, robust "Flip" usually involves reparenting or strict transforms.
        // Here we will simply animate opacity/scale/y to simulate it as requested: "Animate scale, y, and opacity"
        // But to match coordinates precisely:

        const scaleX = navState.width / heroState.width;
        const scaleY = navState.height / heroState.height;
        const scale = Math.min(scaleX, scaleY); // Uniform scale to fit

        const deltaX = navState.left + (navState.width / 2) - (heroState.left + (heroState.width / 2));
        const deltaY = navState.top + (navState.height / 2) - (heroState.top + (heroState.height / 2));

        gsap.to(heroLogo, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1, // Smooth scrubbing
                onUpdate: (self: any) => {
                    // Sync navbar logo opacity (inverse of hero logo)
                    // When hero logo is almost there (progress > 0.8), fade in navbar logo
                    if (self.progress > 0.9) {
                        navbarSlot.style.opacity = String((self.progress - 0.9) * 10);
                    } else {
                        navbarSlot.style.opacity = "0";
                    }
                }
            },
            x: deltaX,
            y: deltaY,
            scale: scale,
            opacity: 0, // Fade out as it reaches the navbar (since navbar has its own logo fading in)
            ease: "none"
        });

    }, []);

    return (
        <div ref={containerRef} className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">
            {/* 1. Canvas Layer */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            {/* 2. Logo Layer */}
            <div
                ref={logoRef}
                id="hero-logo"
                className="relative z-10 w-[40vw] h-[40vw] md:w-[30vw] md:h-[30vw]"
            >
                <Image
                    src="/parfum/scandalea/scandalea-logo.png"
                    alt="Scandalea Logo"
                    fill
                    className="object-contain"
                    priority
                    style={{
                        filter: "brightness(0) invert(1) sepia(1) saturate(10000%) hue-rotate(45deg)"
                    }}
                />
            </div>

            <div className="absolute bottom-10 animate-bounce text-scandalea-gold text-2xl cursor-pointer">
                ↓
            </div>
        </div>
    );
};
