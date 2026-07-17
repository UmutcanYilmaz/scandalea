/**
 * CONFESSIONS - ENHANCED
 * Horizontal scroll section with:
 * - Light trail effect following scroll
 * - Floating golden particles
 * - Enhanced text animations with stagger
 * - Golden accent decorations
 */

"use client";

import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Seeded pseudo-random number generator for consistent SSR/client values
const createSeededRandom = (seed: number) => {
    return () => {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
};

// Pre-compute particle data for consistent SSR/client rendering
const generateConfessionParticles = () => {
    const random = createSeededRandom(99999);
    return Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        left: random() * 100,
        top: random() * 100,
        size: 1 + random() * 2,
        opacity: 0.1 + random() * 0.2,
        duration: 6 + random() * 4,
        delay: random() * 5,
    }));
};

const CONFESSION_PARTICLES = generateConfessionParticles();

// Floating particles for confessions
const ConfessionParticles = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {CONFESSION_PARTICLES.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        background: `rgba(212, 175, 55, ${particle.opacity})`,
                        animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
};

export const Confessions = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const track = trackRef.current;
            if (!track) return;

            // Horizontal Scroll
            const scrollTween = gsap.to(track, {
                xPercent: -100,
                x: () => window.innerWidth,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=3000",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    onUpdate: (self: ScrollTrigger) => {
                        setScrollProgress(self.progress);
                    },
                }
            });

            // Animate confession items with stagger
            (gsap.utils.toArray(".confession-item") as HTMLElement[]).forEach((item, index) => {
                const textEl = item.querySelector('.confession-text');
                const accentEl = item.querySelector('.confession-accent');
                const numberEl = item.querySelector('.confession-number');

                // Text reveal
                if (textEl) {
                    gsap.fromTo(textEl,
                        {
                            y: 80,
                            opacity: 0,
                            filter: 'blur(8px)',
                        },
                        {
                            y: 0,
                            opacity: 1,
                            filter: 'blur(0px)',
                            duration: 1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: item,
                                containerAnimation: scrollTween,
                                start: "left 80%",
                                end: "left 40%",
                                scrub: 1,
                            }
                        }
                    );
                }

                // Accent line animation
                if (accentEl) {
                    gsap.fromTo(accentEl,
                        { scaleX: 0 },
                        {
                            scaleX: 1,
                            duration: 0.8,
                            ease: 'power2.inOut',
                            scrollTrigger: {
                                trigger: item,
                                containerAnimation: scrollTween,
                                start: "left 60%",
                                toggleActions: "play none none reverse",
                            }
                        }
                    );
                }

                // Number fade in
                if (numberEl) {
                    gsap.fromTo(numberEl,
                        { opacity: 0, scale: 0.8 },
                        {
                            opacity: 0.1,
                            scale: 1,
                            duration: 0.6,
                            scrollTrigger: {
                                trigger: item,
                                containerAnimation: scrollTween,
                                start: "left 70%",
                                toggleActions: "play none none reverse",
                            }
                        }
                    );
                }
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const confessions = [
        { text: "A scent is not a memory.", number: "I" },
        { text: "It is a weapon.", number: "II" },
        { text: "Silence is forbidden.", number: "III" },
        { text: "Whispers are mandatory.", number: "IV" },
        { text: "Enter the <span class='text-scandalea-gold font-serif italic'>Scandal</span>.", number: "V" },
    ];

    return (
        <section ref={sectionRef} className="relative h-screen bg-scandalea-obsidian text-white overflow-hidden">

            {/* Floating Particles */}
            <ConfessionParticles />

            {/* Light trail indicator */}
            <div
                className="absolute top-1/2 left-0 h-px bg-gradient-to-r from-transparent via-scandalea-gold to-transparent z-20 pointer-events-none"
                style={{
                    width: `${scrollProgress * 100}%`,
                    opacity: 0.6,
                    boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
                    transition: 'width 0.1s linear',
                }}
            />

            {/* Horizontal scroll track */}
            <div
                ref={trackRef}
                className="absolute top-0 left-0 h-full flex items-center px-[50vw]"
            >
                {confessions.map((item, i) => (
                    <div
                        key={i}
                        className="confession-item relative w-[80vw] md:w-[60vw] flex-shrink-0 flex flex-col items-center justify-center px-10"
                    >
                        {/* Background number */}
                        <div
                            className="confession-number absolute text-[20rem] md:text-[30rem] font-serif text-white/5 select-none pointer-events-none"
                            style={{
                                opacity: 0,
                            }}
                        >
                            {item.number}
                        </div>

                        {/* Main text */}
                        <h2
                            className="confession-text relative z-10 text-4xl md:text-7xl font-sans font-extralight tracking-tighter uppercase leading-tight text-center"
                            style={{
                                color: '#F1DFA0',
                                textShadow: '0 0 40px rgba(212, 175, 55, 0.3), 0 4px 20px rgba(0, 0, 0, 0.8)',
                            }}
                            dangerouslySetInnerHTML={{ __html: item.text }}
                        />

                        {/* Golden accent line */}
                        <div
                            className="confession-accent mt-8 w-24 h-px origin-left"
                            style={{
                                background: 'linear-gradient(to right, #D4AF37, #AA8218)',
                                boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Progress indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                <span className="text-xs tracking-widest text-scandalea-gold/40 uppercase">
                    The Manifesto
                </span>
                <div className="w-32 h-px bg-white/10 relative overflow-hidden">
                    <div
                        className="absolute inset-y-0 left-0 bg-scandalea-gold/60"
                        style={{ width: `${scrollProgress * 100}%` }}
                    />
                </div>
                <span className="text-xs tracking-widest text-scandalea-gold/40">
                    {Math.round(scrollProgress * 100)}%
                </span>
            </div>

            {/* Side gradient */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-scandalea-obsidian to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-scandalea-obsidian to-transparent z-10 pointer-events-none" />
        </section>
    );
};
