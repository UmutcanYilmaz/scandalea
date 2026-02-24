/**
 * MANIFESTO - REDESIGNED
 * Immersive scroll-triggered manifesto section with:
 * - Color-washed gradient backgrounds shifting per manifesto line
 * - Pulsing radial glow behind text
 * - Enhanced typography with character stagger reveals
 * - Noise texture overlay for depth
 * - Golden accent elements
 */

"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

const MANIFESTO_LINES = [
    {
        text: "We burn without warning.",
        image: "/parfum/scandalea/redhanded.jpeg",
        subtext: "Intensity is our birthright.",
        gradientFrom: "rgba(180, 80, 20, 0.35)",
        gradientVia: "rgba(120, 40, 10, 0.2)",
        accentColor: "rgba(255, 140, 50, 0.8)",
        glowColor: "rgba(255, 120, 30, 0.15)",
    },
    {
        text: "We do not water down.",
        image: "/parfum/scandalea/violet&moss.jpeg",
        subtext: "Full strength. Full presence.",
        gradientFrom: "rgba(40, 80, 50, 0.35)",
        gradientVia: "rgba(20, 50, 30, 0.2)",
        accentColor: "rgba(120, 200, 120, 0.7)",
        glowColor: "rgba(80, 160, 80, 0.12)",
    },
    {
        text: "Scandaléa is for those who reign.",
        image: "/parfum/scandalea/misfit.jpeg",
        subtext: "Not flames that destroy, but light that transforms.",
        gradientFrom: "rgba(100, 30, 80, 0.35)",
        gradientVia: "rgba(60, 15, 50, 0.2)",
        accentColor: "rgba(200, 100, 180, 0.7)",
        glowColor: "rgba(160, 60, 140, 0.12)",
    },
    {
        text: "Ascend.",
        image: "/parfum/scandalea/ascension.jpeg",
        subtext: "Into your own Golden Age.",
        gradientFrom: "rgba(160, 130, 30, 0.4)",
        gradientVia: "rgba(100, 80, 15, 0.25)",
        accentColor: "rgba(212, 175, 55, 0.9)",
        glowColor: "rgba(212, 175, 55, 0.2)",
    }
];

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
const generateParticleData = () => {
    const random = createSeededRandom(88888);
    return Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: random() * 100,
        top: random() * 100,
        width: 1 + random() * 4,
        height: 1 + random() * 4,
        opacity: 0.15 + random() * 0.35,
        duration: 4 + random() * 6,
        delay: random() * 5,
        driftX: -30 + random() * 60,
        driftY: -40 + random() * 20,
    }));
};

const PARTICLE_DATA = generateParticleData();

// Floating particles with enhanced golden glow
const FloatingParticles = ({ activeColor }: { activeColor: string }) => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {PARTICLE_DATA.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                        width: `${particle.width}px`,
                        height: `${particle.height}px`,
                        background: `radial-gradient(circle, ${activeColor} 0%, transparent 70%)`,
                        boxShadow: `0 0 ${particle.width * 3}px ${activeColor}`,
                        animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                        transition: 'background 1.5s ease, box-shadow 1.5s ease',
                    }}
                />
            ))}
        </div>
    );
};

export const Manifesto = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useGSAP(() => {
        const lines = gsap.utils.toArray(".manifesto-line") as HTMLElement[];

        lines.forEach((line, i) => {
            ScrollTrigger.create({
                trigger: line,
                start: "center center",
                end: "center center",
                onEnter: () => setActiveIndex(i),
                onEnterBack: () => setActiveIndex(i),
            });

            // Main text reveal — word by word stagger
            const textEl = line.querySelector('.manifesto-text');
            const subtextEl = line.querySelector('.manifesto-subtext');
            const accentLineEl = line.querySelector('.manifesto-accent-line');

            if (textEl) {
                gsap.fromTo(textEl,
                    {
                        opacity: 0,
                        y: 80,
                        filter: 'blur(15px)',
                        scale: 0.9,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        scale: 1,
                        duration: 1.2,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: line,
                            start: 'top 80%',
                            end: 'center center',
                            toggleActions: 'play reverse play reverse',
                        }
                    }
                );
            }

            if (subtextEl) {
                gsap.fromTo(subtextEl,
                    {
                        opacity: 0,
                        y: 40,
                        filter: 'blur(5px)',
                    },
                    {
                        opacity: 0.85,
                        y: 0,
                        filter: 'blur(0px)',
                        duration: 1,
                        delay: 0.3,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: line,
                            start: 'top 70%',
                            toggleActions: 'play reverse play reverse',
                        }
                    }
                );
            }

            if (accentLineEl) {
                gsap.fromTo(accentLineEl,
                    { scaleX: 0, opacity: 0 },
                    {
                        scaleX: 1,
                        opacity: 1,
                        duration: 0.8,
                        delay: 0.5,
                        ease: 'power2.inOut',
                        scrollTrigger: {
                            trigger: line,
                            start: 'top 75%',
                            toggleActions: 'play reverse play reverse',
                        }
                    }
                );
            }
        });
    }, { scope: containerRef });

    const currentLine = MANIFESTO_LINES[activeIndex];

    return (
        <section ref={containerRef} className="relative bg-black text-white">

            {/* Floating Particles */}
            <FloatingParticles activeColor={currentLine.accentColor} />

            {/* Noise texture overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-30 opacity-[0.04]"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
                    backgroundSize: '200px 200px',
                    mixBlendMode: 'overlay',
                }}
            />

            {/* Sticky Background (Cinematic Viewport) */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {MANIFESTO_LINES.map((item, i) => (
                    <div
                        key={i}
                        className={clsx(
                            "absolute inset-0 transition-all duration-1000 ease-in-out",
                            activeIndex === i ? "opacity-60 scale-100" : "opacity-0 scale-105"
                        )}
                    >
                        <Image
                            src={item.image}
                            alt="Mood"
                            fill
                            sizes="100vw"
                            className="object-cover"
                            style={{
                                filter: activeIndex === i ? 'blur(0px) saturate(1.2)' : 'blur(8px)',
                                transition: 'filter 1s ease-out',
                            }}
                        />

                        {/* Color-washed gradient overlay that shifts per line */}
                        <div
                            className="absolute inset-0 transition-all duration-1500"
                            style={{
                                background: activeIndex === i
                                    ? `linear-gradient(160deg, ${item.gradientFrom} 0%, ${item.gradientVia} 40%, rgba(0,0,0,0.7) 100%)`
                                    : 'linear-gradient(160deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%)',
                                transition: 'background 1.5s ease-in-out',
                            }}
                        />

                        {/* Pulsing radial glow behind text */}
                        <div
                            className="absolute inset-0 transition-opacity duration-1000"
                            style={{
                                background: `radial-gradient(ellipse at center, ${item.glowColor} 0%, transparent 60%)`,
                                opacity: activeIndex === i ? 1 : 0,
                                animation: activeIndex === i ? 'pulse 4s ease-in-out infinite' : 'none',
                            }}
                        />

                        {/* Dark vignette for depth */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
                            }}
                        />
                    </div>
                ))}

                {/* Progress indicator - enhanced */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
                    {MANIFESTO_LINES.map((item, i) => (
                        <div
                            key={i}
                            className="relative flex items-center gap-3"
                        >
                            <div
                                className="w-1.5 h-10 rounded-full transition-all duration-700"
                                style={{
                                    background: activeIndex === i
                                        ? `linear-gradient(to bottom, ${item.accentColor}, transparent)`
                                        : 'rgba(255, 255, 255, 0.08)',
                                    boxShadow: activeIndex === i ? `0 0 15px ${item.glowColor}` : 'none',
                                    transform: activeIndex === i ? 'scaleY(1.3)' : 'scaleY(1)',
                                }}
                            />
                            {activeIndex === i && (
                                <div
                                    className="absolute right-6 whitespace-nowrap text-[10px] tracking-[0.3em] uppercase opacity-40 transition-opacity duration-500"
                                    style={{ color: item.accentColor }}
                                >
                                    {String(i + 1).padStart(2, '0')}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Scrollable Text Track */}
            <div className="relative z-10 -mt-[100vh]">
                <div className="py-[50vh]">
                    {MANIFESTO_LINES.map((item, i) => (
                        <div key={i} className="manifesto-line h-[80vh] flex flex-col items-center justify-center px-6">
                            {/* Accent line above */}
                            <div
                                className="manifesto-accent-line mb-8 h-px origin-center"
                                style={{
                                    width: '80px',
                                    background: `linear-gradient(to right, transparent, ${item.accentColor}, transparent)`,
                                    boxShadow: `0 0 20px ${item.glowColor}`,
                                }}
                            />

                            <h2
                                className="manifesto-text text-4xl md:text-7xl lg:text-8xl font-serif text-center max-w-5xl leading-tight"
                                style={{
                                    color: '#F1DFA0',
                                    textShadow: `
                                        0 0 80px ${item.glowColor},
                                        0 0 40px rgba(212, 175, 55, 0.3),
                                        0 4px 30px rgba(0, 0, 0, 0.9)
                                    `,
                                }}
                            >
                                {item.text}
                            </h2>

                            <p
                                className="manifesto-subtext mt-8 text-base md:text-lg tracking-[0.2em] uppercase max-w-xl text-center font-light italic"
                                style={{
                                    fontFamily: 'Georgia, "Times New Roman", serif',
                                    color: item.accentColor,
                                    textShadow: `0 0 30px ${item.glowColor}`,
                                }}
                            >
                                {item.subtext}
                            </p>

                            {/* Accent line below */}
                            <div
                                className="manifesto-accent-line mt-8 h-px origin-center"
                                style={{
                                    width: '40px',
                                    background: `linear-gradient(to right, transparent, ${item.accentColor}, transparent)`,
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
};
