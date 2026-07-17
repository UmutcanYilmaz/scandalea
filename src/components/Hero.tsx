"use client";

import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ParticleConfig {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
    blur: number;
    trail: boolean;
}

interface StarConfig {
    id: number;
    x: number;
    y: number;
    size: number;
    twinkleSpeed: number;
    delay: number;
    brightness: number;
}

interface DustMoteConfig {
    id: number;
    startX: number;
    startY: number;
    size: number;
    speed: number;
    angle: number;
    opacity: number;
}

interface LightRayConfig {
    id: number;
    angle: number;
    width: number;
    length: number;
    opacity: number;
    delay: number;
    color: string;
}

interface FloatingShapeConfig {
    id: number;
    x: number;
    y: number;
    size: number;
    rotation: number;
    speed: number;
    type: 'diamond' | 'circle' | 'triangle' | 'line' | 'hexagon' | 'cross';
    layer: number;
}

interface OrbConfig {
    id: number;
    x: number;
    y: number;
    size: number;
    pulseSpeed: number;
    delay: number;
    color: string;
}

interface RingConfig {
    id: number;
    size: number;
    thickness: number;
    rotationSpeed: number;
    opacity: number;
    delay: number;
}

interface SparkConfig {
    id: number;
    startAngle: number;
    distance: number;
    size: number;
    speed: number;
    delay: number;
}

// Seeded pseudo-random number generator (mulberry32) for consistent SSR/client values
const createSeededRandom = (seed: number) => {
    return () => {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
};

const useMousePosition = () => {
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
    const [smoothPos, setSmoothPos] = useState({ x: 0.5, y: 0.5 });

    useEffect(() => {
        let animationFrame: number;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            });
        };

        const smoothUpdate = () => {
            setSmoothPos(prev => ({
                x: prev.x + (mousePos.x - prev.x) * 0.08,
                y: prev.y + (mousePos.y - prev.y) * 0.08,
            }));
            animationFrame = requestAnimationFrame(smoothUpdate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        animationFrame = requestAnimationFrame(smoothUpdate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrame);
        };
    }, [mousePos]);

    return smoothPos;
};


const useScrollVelocity = () => {
    const [velocity, setVelocity] = useState(0);
    const lastScrollY = useRef(0);
    const lastTime = useRef(Date.now());

    useEffect(() => {
        const handleScroll = () => {
            const now = Date.now();
            const deltaTime = now - lastTime.current;
            const deltaY = window.scrollY - lastScrollY.current;

            if (deltaTime > 0) {
                const newVelocity = Math.abs(deltaY / deltaTime) * 10;
                setVelocity(prev => prev * 0.8 + newVelocity * 0.2);
            }

            lastScrollY.current = window.scrollY;
            lastTime.current = now;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return Math.min(1, velocity);
};

const generateParticles = (count: number, seed = 12345): ParticleConfig[] => {
    const random = createSeededRandom(seed);
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: random() * 100,
        y: random() * 100,
        size: 0.5 + random() * 3.5,
        duration: 8 + random() * 14,
        delay: random() * 8,
        opacity: 0.1 + random() * 0.5,
        blur: random() > 0.6 ? 1 + random() * 2 : 0,
        trail: random() > 0.7,
    }));
};

const generateStars = (count: number, seed = 54321): StarConfig[] => {
    const random = createSeededRandom(seed);
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: random() * 100,
        y: random() * 70,
        size: 0.3 + random() * 2,
        twinkleSpeed: 1.5 + random() * 4,
        delay: random() * 4,
        brightness: 0.4 + random() * 0.6,
    }));
};

const generateDustMotes = (count: number, seed = 67890): DustMoteConfig[] => {
    const random = createSeededRandom(seed);
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        startX: random() * 100,
        startY: random() * 100,
        size: 0.2 + random() * 1.2,
        speed: 12 + random() * 25,
        angle: random() * 360,
        opacity: 0.08 + random() * 0.25,
    }));
};

const generateLightRays = (count: number, seed = 11111): LightRayConfig[] => {
    const random = createSeededRandom(seed);
    const baseAngle = -90;
    const spread = 70;
    const colors = [
        'rgba(251, 245, 183, 1)',
        'rgba(212, 175, 55, 1)',
        'rgba(255, 223, 128, 1)',
    ];

    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        angle: baseAngle - spread / 2 + (spread / (count - 1)) * i,
        width: 0.8 + random() * 2.5,
        length: 35 + random() * 50,
        opacity: 0.08 + random() * 0.35,
        delay: random() * 2.5,
        color: colors[Math.floor(random() * colors.length)],
    }));
};

const generateFloatingShapes = (count: number, seed = 22222): FloatingShapeConfig[] => {
    const random = createSeededRandom(seed);
    const types: FloatingShapeConfig['type'][] = ['diamond', 'circle', 'triangle', 'line', 'hexagon', 'cross'];
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: 3 + random() * 94,
        y: 3 + random() * 94,
        size: 15 + random() * 80,
        rotation: random() * 360,
        speed: 0.15 + random() * 0.6,
        type: types[Math.floor(random() * types.length)],
        layer: Math.floor(random() * 3),
    }));
};

const generateOrbs = (count: number, seed = 33333): OrbConfig[] => {
    const random = createSeededRandom(seed);
    const colors = [
        'rgba(212, 175, 55, 0.15)',
        'rgba(251, 245, 183, 0.1)',
        'rgba(255, 200, 100, 0.12)',
    ];

    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: 10 + random() * 80,
        y: 10 + random() * 80,
        size: 100 + random() * 300,
        pulseSpeed: 3 + random() * 5,
        delay: random() * 3,
        color: colors[Math.floor(random() * colors.length)],
    }));
};

const generateRings = (count: number, seed = 44444): RingConfig[] => {
    const random = createSeededRandom(seed);
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        size: 200 + i * 100,
        thickness: 1 + random() * 2,
        rotationSpeed: 30 + random() * 60,
        opacity: 0.03 + random() * 0.08,
        delay: i * 0.5,
    }));
};

const generateSparks = (count: number, seed = 55555): SparkConfig[] => {
    const random = createSeededRandom(seed);
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        startAngle: (i / count) * 360,
        distance: 30 + random() * 80,
        size: 1 + random() * 3,
        speed: 0.3 + random() * 0.7,
        delay: random() * 2,
    }));
};

const PersistentBrandLogo: React.FC<{
    scrollProgress: number;
    isLoaded: boolean;
    goldIntensity: number;
}> = ({ scrollProgress, isLoaded, goldIntensity }) => {
    const logoRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const ring1Ref = useRef<HTMLDivElement>(null);
    const ring2Ref = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const leftLineRef = useRef<HTMLDivElement>(null);
    const rightLineRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);

    // Use GSAP to animate the logo based on scroll — no React state re-renders
    useEffect(() => {
        if (!logoRef.current) return;

        const el = logoRef.current;
        const phase3Start = 0.46;
        const phase3Peak = 0.65;
        const inPhaseThree = scrollProgress >= phase3Start && scrollProgress <= 0.82;
        const centerProgress = inPhaseThree
            ? Math.min(1, (scrollProgress - phase3Start) / (phase3Peak - phase3Start))
            : 0;

        const startY = 8;
        const endY = 50;
        const currentY = inPhaseThree ? startY + (endY - startY) * Math.pow(centerProgress, 0.5) : startY;

        const baseScale = 0.4;
        const maxScale = 1.2;
        const currentScale = inPhaseThree
            ? baseScale + (maxScale - baseScale) * centerProgress
            : baseScale + scrollProgress * 0.15;

        const glowIntensityVal = 0.3 + goldIntensity * 0.7;
        const opacityVal = isLoaded ? (0.85 + goldIntensity * 0.15) : 0;
        const hideForMainTitle = scrollProgress > 0.52 && scrollProgress < 0.78;

        // Use GSAP.set for immediate, non-triggering updates (no layout thrash)
        gsap.set(el, {
            left: '50%',
            top: `${currentY}%`,
            xPercent: -50,
            yPercent: -50,
            scale: currentScale,
            opacity: hideForMainTitle ? 0 : opacityVal,
            overwrite: 'auto',
        });

        // Update glow orb
        if (glowRef.current) {
            const glowSize = 200 + glowIntensityVal * 150;
            gsap.set(glowRef.current, {
                width: glowSize,
                height: glowSize,
            });
        }

        // Update rings
        if (ring1Ref.current) {
            const ringSize = 160 + glowIntensityVal * 80;
            gsap.set(ring1Ref.current, {
                width: ringSize,
                height: ringSize,
                borderColor: `rgba(212, 175, 55, ${0.08 + glowIntensityVal * 0.12})`,
            });
        }
        if (ring2Ref.current) {
            const ringSize = 200 + glowIntensityVal * 100;
            gsap.set(ring2Ref.current, {
                width: ringSize,
                height: ringSize,
                borderColor: `rgba(251, 245, 183, ${0.04 + glowIntensityVal * 0.08})`,
            });
        }

        // Update text letter spacing
        const letterSpacing = 0.15 + centerProgress * 0.12;
        if (textRef.current) {
            gsap.set(textRef.current, {
                letterSpacing: `${letterSpacing}em`,
                textShadow: `
                    0 0 ${30 + glowIntensityVal * 50}px rgba(212, 175, 55, ${0.5 + glowIntensityVal * 0.3}),
                    0 0 ${60 + glowIntensityVal * 80}px rgba(212, 175, 55, ${0.25 + glowIntensityVal * 0.2}),
                    0 0 ${100 + glowIntensityVal * 120}px rgba(251, 245, 183, ${0.15 + glowIntensityVal * 0.1}),
                    0 2px 30px rgba(0, 0, 0, 0.7)
                `,
            });
        }

        // Update decorative lines
        const lineWidth = 40 + glowIntensityVal * 60;
        if (leftLineRef.current) {
            gsap.set(leftLineRef.current, {
                width: lineWidth,
                background: `linear-gradient(to left, rgba(212, 175, 55, ${0.4 + glowIntensityVal * 0.3}), transparent)`,
            });
        }
        if (rightLineRef.current) {
            gsap.set(rightLineRef.current, {
                width: lineWidth,
                background: `linear-gradient(to right, rgba(212, 175, 55, ${0.4 + glowIntensityVal * 0.3}), transparent)`,
            });
        }

        // Update accent dot
        if (dotRef.current) {
            gsap.set(dotRef.current, {
                background: `rgba(212, 175, 55, ${0.6 + glowIntensityVal * 0.4})`,
                boxShadow: `0 0 12px rgba(212, 175, 55, ${glowIntensityVal * 0.6})`,
            });
        }
    }, [scrollProgress, isLoaded, goldIntensity]);

    return (
        <div
            ref={logoRef}
            className="fixed z-50 pointer-events-none will-change-transform"
            style={{ opacity: 0 }}
        >
            <div className="relative flex flex-col items-center">
                {/* Outer glow orb */}
                <div
                    ref={glowRef}
                    className="absolute rounded-full"
                    style={{
                        width: 200,
                        height: 200,
                        background: `radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, rgba(251, 245, 183, 0.02) 40%, transparent 70%)`,
                        animation: 'pulse 5s ease-in-out infinite',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                />

                {/* Spinning ring 1 */}
                <div
                    ref={ring1Ref}
                    className="absolute rounded-full border"
                    style={{
                        width: 160,
                        height: 160,
                        borderColor: 'rgba(212, 175, 55, 0.08)',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: 'spin 25s linear infinite',
                    }}
                />

                {/* Spinning ring 2 - counter rotation */}
                <div
                    ref={ring2Ref}
                    className="absolute rounded-full border"
                    style={{
                        width: 200,
                        height: 200,
                        borderColor: 'rgba(251, 245, 183, 0.04)',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: 'spin 35s linear infinite reverse',
                    }}
                />

                {/* Decorative lines on sides */}
                <div
                    ref={leftLineRef}
                    className="absolute h-px"
                    style={{
                        width: 40,
                        right: '100%',
                        top: '50%',
                        marginRight: '20px',
                        background: 'linear-gradient(to left, rgba(212, 175, 55, 0.4), transparent)',
                    }}
                />
                <div
                    ref={rightLineRef}
                    className="absolute h-px"
                    style={{
                        width: 40,
                        left: '100%',
                        top: '50%',
                        marginLeft: '20px',
                        background: 'linear-gradient(to right, rgba(212, 175, 55, 0.4), transparent)',
                    }}
                />

                {/* Brand name - SCANDALÉA */}
                <span
                    ref={textRef}
                    className="text-lg md:text-xl lg:text-2xl xl:text-3xl uppercase font-light relative z-10 whitespace-nowrap"
                    style={{
                        fontFamily: 'Georgia, "Times New Roman", serif',
                        color: '#F5E6BC',
                        letterSpacing: '0.15em',
                    }}
                >
                    SCANDALÉA
                </span>

                {/* Accent dot below */}
                <div
                    ref={dotRef}
                    className="absolute rounded-full"
                    style={{
                        width: '4px',
                        height: '4px',
                        background: 'rgba(212, 175, 55, 0.6)',
                        boxShadow: '0 0 12px rgba(212, 175, 55, 0.2)',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: '12px',
                        animation: 'pulse 3s ease-in-out infinite',
                    }}
                />
            </div>
        </div>
    );
};

const AmbientParticleField: React.FC<{
    goldIntensity: number;
    particleCount?: number;
    scrollVelocity: number;
}> = ({ goldIntensity, particleCount = 30, scrollVelocity }) => {
    const particles = useMemo(() => generateParticles(particleCount), [particleCount]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((particle) => {
                const r = Math.round(120 + goldIntensity * 135);
                const g = Math.round(120 + goldIntensity * 55);
                const b = Math.round(120 - goldIntensity * 65);
                const baseOpacity = particle.opacity * (0.25 + goldIntensity * 0.75);
                const velocityBoost = 1 + scrollVelocity * 0.5;

                return (
                    <div key={particle.id} className="absolute" style={{ left: `${particle.x}%`, top: `${particle.y}%` }}>
                        {particle.trail && goldIntensity > 0.3 && (
                            <div
                                className="absolute rounded-full"
                                style={{
                                    width: `${particle.size * 0.6}px`,
                                    height: `${particle.size * 3}px`,
                                    background: `linear-gradient(to bottom, rgba(${r}, ${g}, ${b}, ${baseOpacity * 0.5}) 0%, transparent 100%)`,
                                    transform: 'translateY(-100%)',
                                    filter: 'blur(2px)',
                                }}
                            />
                        )}

                        <div
                            className="rounded-full"
                            style={{
                                width: `${particle.size}px`,
                                height: `${particle.size}px`,
                                backgroundColor: `rgba(${r}, ${g}, ${b}, ${baseOpacity})`,
                                boxShadow: goldIntensity > 0.3
                                    ? `0 0 ${particle.size * 5}px rgba(212, 175, 55, ${goldIntensity * 0.5})`
                                    : 'none',
                                filter: particle.blur > 0 ? `blur(${particle.blur}px)` : 'none',
                                animation: `float ${particle.duration / velocityBoost}s ease-in-out ${particle.delay}s infinite`,
                                transition: 'background-color 2s ease, box-shadow 2s ease',
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
};

const EnhancedStarField: React.FC<{
    opacity: number;
    mousePos: { x: number; y: number };
}> = ({ opacity, mousePos }) => {
    const stars = useMemo(() => generateStars(25), []);

    if (opacity <= 0) return null;

    return (
        <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ opacity }}
        >
            {stars.map((star) => {
                const parallaxX = (mousePos.x - 0.5) * star.size * 3;
                const parallaxY = (mousePos.y - 0.5) * star.size * 3;

                return (
                    <div
                        key={star.id}
                        className="absolute rounded-full"
                        style={{
                            left: `calc(${star.x}% + ${parallaxX}px)`,
                            top: `calc(${star.y}% + ${parallaxY}px)`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            backgroundColor: `rgba(255, 255, 255, ${star.brightness})`,
                            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.brightness * 0.5})`,
                            animation: `twinkle ${star.twinkleSpeed}s ease-in-out ${star.delay}s infinite`,
                        }}
                    />
                );
            })}

            <div
                className="absolute top-1/4 left-1/3 w-px h-20"
                style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    animation: 'shootingStar 8s linear 2s infinite',
                }}
            />

            <div
                className="absolute top-1/3 right-1/4 w-px h-16"
                style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    animation: 'shootingStar 12s linear 6s infinite',
                }}
            />
        </div>
    );
};

const FloatingOrbs: React.FC<{ goldIntensity: number }> = ({ goldIntensity }) => {
    const orbs = useMemo(() => generateOrbs(5), []);

    if (goldIntensity < 0.2) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {orbs.map((orb) => (
                <div
                    key={orb.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${orb.x}%`,
                        top: `${orb.y}%`,
                        width: `${orb.size}px`,
                        height: `${orb.size}px`,
                        background: `radial-gradient(circle, ${orb.color.replace('0.15', String(0.15 * goldIntensity))} 0%, transparent 70%)`,
                        filter: 'blur(40px)',
                        animation: `pulse ${orb.pulseSpeed}s ease-in-out ${orb.delay}s infinite`,
                        opacity: goldIntensity,
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            ))}
        </div>
    );
};

const ConcentricRings: React.FC<{
    progress: number;
    goldIntensity: number;
}> = ({ progress, goldIntensity }) => {
    const rings = useMemo(() => generateRings(4), []);

    if (goldIntensity < 0.4) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
            {rings.map((ring) => (
                <div
                    key={ring.id}
                    className="absolute rounded-full border"
                    style={{
                        width: `${ring.size * (0.5 + progress * 0.5)}px`,
                        height: `${ring.size * (0.5 + progress * 0.5)}px`,
                        borderWidth: `${ring.thickness}px`,
                        borderColor: `rgba(212, 175, 55, ${ring.opacity * goldIntensity})`,
                        animation: `spin ${ring.rotationSpeed}s linear ${ring.delay}s infinite`,
                        opacity: goldIntensity * 0.6,
                    }}
                />
            ))}
        </div>
    );
};

const DustMotesLayer: React.FC<{ goldIntensity: number }> = ({ goldIntensity }) => {
    const dustMotes = useMemo(() => generateDustMotes(20), []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {dustMotes.map((mote) => {
                const color = goldIntensity > 0.4
                    ? `rgba(251, 245, 183, ${mote.opacity * goldIntensity})`
                    : `rgba(180, 180, 180, ${mote.opacity * 0.4})`;

                return (
                    <div
                        key={mote.id}
                        className="absolute rounded-full"
                        style={{
                            left: `${mote.startX}%`,
                            top: `${mote.startY}%`,
                            width: `${mote.size}px`,
                            height: `${mote.size}px`,
                            backgroundColor: color,
                            animation: `drift ${mote.speed}s linear ${-mote.speed * 0.5}s infinite`,
                        }}
                    />
                );
            })}
        </div>
    );
};

const RisingLightRays: React.FC<{
    intensity: number;
    scrollProgress: number;
}> = ({ intensity, scrollProgress }) => {
    const rays = useMemo(() => generateLightRays(6), []);

    if (intensity <= 0.08) return null;

    const spreadMultiplier = 1 + scrollProgress * 0.3;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[95%]">
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2"
                    style={{
                        width: '1000px',
                        height: '600px',
                        background: `radial-gradient(ellipse at bottom center, rgba(212, 175, 55, ${intensity * 0.18}) 0%, rgba(251, 245, 183, ${intensity * 0.08}) 30%, transparent 70%)`,
                    }}
                />

                {rays.map((ray) => (
                    <div
                        key={ray.id}
                        className="absolute bottom-0 left-1/2 origin-bottom"
                        style={{
                            width: `${ray.width}px`,
                            height: `${ray.length}%`,
                            background: `linear-gradient(to top, ${ray.color.replace('1)', `${ray.opacity * intensity})`)} 0%, transparent 100%)`,
                            transform: `translateX(-50%) rotate(${ray.angle * spreadMultiplier}deg)`,
                            filter: 'blur(1.5px)',
                            animation: `rayPulse ${3.5 + ray.delay}s ease-in-out ${ray.delay}s infinite`,
                        }}
                    />
                ))}

                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2"
                    style={{
                        width: '5px',
                        height: `${intensity * 60}%`,
                        background: `linear-gradient(to top, rgba(251, 245, 183, ${intensity * 0.9}) 0%, rgba(212, 175, 55, ${intensity * 0.5}) 50%, transparent 100%)`,
                        boxShadow: `0 0 40px rgba(251, 245, 183, ${intensity * 0.6}), 0 0 80px rgba(212, 175, 55, ${intensity * 0.3})`,
                    }}
                />

                <div
                    className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-40 h-40 rounded-full"
                    style={{
                        background: `radial-gradient(circle, rgba(251, 245, 183, ${intensity * 0.4}) 0%, transparent 70%)`,
                        animation: 'pulse 3s ease-in-out infinite',
                    }}
                />
            </div>
        </div>
    );
};

const FloatingGeometry: React.FC<{
    scrollProgress: number;
    goldIntensity: number;
    mousePos: { x: number; y: number };
}> = ({ scrollProgress, goldIntensity, mousePos }) => {
    const shapes = useMemo(() => generateFloatingShapes(6), []);

    const renderShape = (shape: FloatingShapeConfig) => {
        const color = `rgba(212, 175, 55, ${0.04 + goldIntensity * 0.12})`;
        const layerMultiplier = 1 + shape.layer * 0.3;
        const parallaxOffset = scrollProgress * shape.speed * -400 * layerMultiplier;
        const mouseOffset = {
            x: (mousePos.x - 0.5) * 30 * layerMultiplier,
            y: (mousePos.y - 0.5) * 30 * layerMultiplier,
        };

        const baseStyle: React.CSSProperties = {
            position: 'absolute',
            left: `calc(${shape.x}% + ${mouseOffset.x}px)`,
            top: `calc(${shape.y}% + ${mouseOffset.y}px)`,
            transform: `translateY(${parallaxOffset}px) rotate(${shape.rotation + scrollProgress * 45}deg)`,
            transition: 'opacity 1s ease',
            opacity: 0.25 + goldIntensity * 0.35,
        };

        switch (shape.type) {
            case 'diamond':
                return (
                    <div
                        key={shape.id}
                        style={{
                            ...baseStyle,
                            width: `${shape.size}px`,
                            height: `${shape.size}px`,
                            border: `1px solid ${color}`,
                            transform: `${baseStyle.transform} rotate(45deg)`,
                        }}
                    />
                );
            case 'circle':
                return (
                    <div
                        key={shape.id}
                        style={{
                            ...baseStyle,
                            width: `${shape.size}px`,
                            height: `${shape.size}px`,
                            border: `1px solid ${color}`,
                            borderRadius: '50%',
                        }}
                    />
                );
            case 'triangle':
                return (
                    <div
                        key={shape.id}
                        style={{
                            ...baseStyle,
                            width: 0,
                            height: 0,
                            borderLeft: `${shape.size / 2}px solid transparent`,
                            borderRight: `${shape.size / 2}px solid transparent`,
                            borderBottom: `${shape.size}px solid ${color}`,
                            background: 'transparent',
                        }}
                    />
                );
            case 'line':
                return (
                    <div
                        key={shape.id}
                        style={{
                            ...baseStyle,
                            width: `${shape.size * 2.5}px`,
                            height: '1px',
                            backgroundColor: color,
                        }}
                    />
                );
            case 'hexagon':
                return (
                    <div
                        key={shape.id}
                        style={{
                            ...baseStyle,
                            width: `${shape.size}px`,
                            height: `${shape.size * 0.866}px`,
                            backgroundColor: 'transparent',
                            border: `1px solid ${color}`,
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        }}
                    />
                );
            case 'cross':
                return (
                    <div key={shape.id} style={baseStyle}>
                        <div style={{ width: `${shape.size}px`, height: '1px', backgroundColor: color, position: 'absolute', top: '50%', left: 0 }} />
                        <div style={{ width: '1px', height: `${shape.size}px`, backgroundColor: color, position: 'absolute', top: 0, left: '50%' }} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {shapes.map(renderShape)}
        </div>
    );
};

const ElegantFrame: React.FC<{
    progress: number;
    goldIntensity: number;
}> = ({ progress, goldIntensity }) => {
    const cornerSize = 22 + progress * 12;
    const borderOpacity = 0.08 + goldIntensity * 0.3;
    const lineWidth = (progress - 0.2) * 300;

    return (
        <div className="absolute inset-5 md:inset-8 lg:inset-10 pointer-events-none z-10">
            <div
                className="absolute top-0 left-0 border-l border-t"
                style={{
                    width: `${cornerSize}px`,
                    height: `${cornerSize}px`,
                    borderColor: `rgba(212, 175, 55, ${borderOpacity})`,
                    transition: 'all 0.6s ease',
                }}
            />

            <div
                className="absolute top-0 right-0 border-r border-t"
                style={{
                    width: `${cornerSize}px`,
                    height: `${cornerSize}px`,
                    borderColor: `rgba(212, 175, 55, ${borderOpacity})`,
                    transition: 'all 0.6s ease',
                }}
            />

            <div
                className="absolute bottom-0 left-0 border-l border-b"
                style={{
                    width: `${cornerSize}px`,
                    height: `${cornerSize}px`,
                    borderColor: `rgba(212, 175, 55, ${borderOpacity})`,
                    transition: 'all 0.6s ease',
                }}
            />

            <div
                className="absolute bottom-0 right-0 border-r border-b"
                style={{
                    width: `${cornerSize}px`,
                    height: `${cornerSize}px`,
                    borderColor: `rgba(212, 175, 55, ${borderOpacity})`,
                    transition: 'all 0.6s ease',
                }}
            />

            {progress > 0.2 && (
                <>
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 h-px"
                        style={{
                            width: `${Math.max(0, lineWidth)}px`,
                            background: `linear-gradient(to right, transparent, rgba(212, 175, 55, ${borderOpacity}), transparent)`,
                            transition: 'width 0.3s ease',
                        }}
                    />
                    <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px"
                        style={{
                            width: `${Math.max(0, lineWidth)}px`,
                            background: `linear-gradient(to right, transparent, rgba(212, 175, 55, ${borderOpacity}), transparent)`,
                            transition: 'width 0.3s ease',
                        }}
                    />
                </>
            )}

            {progress > 0.4 && (
                <>
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-px"
                        style={{
                            height: `${Math.max(0, (progress - 0.4) * 200)}px`,
                            background: `linear-gradient(to bottom, transparent, rgba(212, 175, 55, ${borderOpacity * 0.7}), transparent)`,
                        }}
                    />
                    <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-px"
                        style={{
                            height: `${Math.max(0, (progress - 0.4) * 200)}px`,
                            background: `linear-gradient(to bottom, transparent, rgba(212, 175, 55, ${borderOpacity * 0.7}), transparent)`,
                        }}
                    />
                </>
            )}
        </div>
    );
};

const GoldenCrack: React.FC<{
    progress: number;
    scrollVelocity: number;
}> = ({ progress, scrollVelocity }) => {
    const sparks = useMemo(() => generateSparks(8), []);

    if (progress <= 0) return null;

    const crackHeight = Math.min(75, progress * 110);
    const glowIntensity = Math.min(1, progress * 1.6);
    const branchProgress = Math.max(0, (progress - 0.25) * 1.6);
    const velocityGlow = 1 + scrollVelocity * 0.5;

    const branches = [
        { angle: -50, length: 18, delay: 0 },
        { angle: 50, length: 18, delay: 0.02 },
        { angle: -35, length: 22, delay: 0.04 },
        { angle: 35, length: 22, delay: 0.04 },
        { angle: -65, length: 12, delay: 0.08 },
        { angle: 65, length: 12, delay: 0.08 },
        { angle: -20, length: 25, delay: 0.1 },
        { angle: 20, length: 25, delay: 0.1 },
        { angle: -75, length: 10, delay: 0.12 },
        { angle: 75, length: 10, delay: 0.12 },
    ];

    return (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden">
            <div
                className="absolute rounded-full"
                style={{
                    width: `${glowIntensity * 700 * velocityGlow}px`,
                    height: `${glowIntensity * 700 * velocityGlow}px`,
                    background: `radial-gradient(circle, rgba(212, 175, 55, ${glowIntensity * 0.14}) 0%, transparent 70%)`,
                    animation: 'pulse 4s ease-in-out infinite',
                }}
            />

            <div
                className="absolute"
                style={{
                    width: '2px',
                    height: `${crackHeight}%`,
                    background: `linear-gradient(to bottom,
                        transparent 0%,
                        rgba(251, 245, 183, 0.35) 12%,
                        rgba(255, 220, 100, 0.45) 30%,
                        rgba(212, 175, 55, 0.5) 50%,
                        rgba(255, 220, 100, 0.45) 70%,
                        rgba(251, 245, 183, 0.35) 88%,
                        transparent 100%
                    )`,
                    boxShadow: `
                        0 0 15px rgba(212, 175, 55, ${glowIntensity * 0.4 * velocityGlow}),
                        0 0 30px rgba(212, 175, 55, ${glowIntensity * 0.25 * velocityGlow}),
                        0 0 50px rgba(212, 175, 55, ${glowIntensity * 0.15 * velocityGlow})
                    `,
                    mixBlendMode: 'soft-light',
                }}
            />

            {branchProgress > 0 && branches.map((branch, index) => {
                const branchOpacity = Math.max(0, branchProgress - branch.delay) * 0.4; // Reduced from 1.0 to 0.4

                return (
                    <div
                        key={index}
                        className="absolute origin-bottom"
                        style={{
                            width: '1px',
                            height: `${branch.length * branchOpacity}%`,
                            background: `linear-gradient(to top, rgba(212, 175, 55, ${branchOpacity * 0.5}) 0%, rgba(251, 245, 183, ${branchOpacity * 0.25}) 60%, transparent 100%)`,
                            transform: `rotate(${branch.angle}deg)`,
                            boxShadow: `0 0 8px rgba(212, 175, 55, ${branchOpacity * 0.3})`,
                            mixBlendMode: 'soft-light',
                        }}
                    />
                );
            })}

            {progress > 0.45 && sparks.map((spark) => {
                const sparkProgress = Math.max(0, (progress - 0.45) * 2);
                const currentDistance = spark.distance * sparkProgress;
                const x = Math.cos(spark.startAngle * Math.PI / 180) * currentDistance;
                const y = Math.sin(spark.startAngle * Math.PI / 180) * currentDistance;

                return (
                    <div
                        key={spark.id}
                        className="absolute rounded-full"
                        style={{
                            width: `${spark.size}px`,
                            height: `${spark.size}px`,
                            backgroundColor: 'rgba(251, 245, 183, 0.9)',
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 6px rgba(251, 245, 183, 0.8)',
                            animation: `sparkle ${spark.speed}s ease-out ${spark.delay}s infinite`,
                            opacity: 0.85,
                        }}
                    />
                );
            })}
        </div>
    );
};

const AuroraWaves: React.FC<{
    goldIntensity: number;
    scrollProgress: number;
}> = ({ goldIntensity, scrollProgress }) => {
    if (goldIntensity < 0.3) return null;

    const waveOpacity = Math.min(0.15, (goldIntensity - 0.3) * 0.5);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                    height: '70%',
                    background: `
                        linear-gradient(
                            180deg,
                            transparent 0%,
                            rgba(212, 175, 55, ${waveOpacity * 0.3}) 30%,
                            rgba(139, 109, 35, ${waveOpacity * 0.2}) 50%,
                            rgba(212, 175, 55, ${waveOpacity * 0.4}) 70%,
                            rgba(255, 220, 120, ${waveOpacity * 0.2}) 85%,
                            transparent 100%
                        )
                    `,
                    transform: `translateY(${scrollProgress * 30}%) scaleY(${1 + scrollProgress * 0.2})`,
                    animation: 'aurora 8s ease-in-out infinite',
                    opacity: goldIntensity * 0.7,
                }}
            />
            <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                    height: '50%',
                    background: `
                        linear-gradient(
                            180deg,
                            transparent 0%,
                            rgba(251, 245, 183, ${waveOpacity * 0.15}) 40%,
                            rgba(212, 175, 55, ${waveOpacity * 0.25}) 60%,
                            rgba(180, 140, 40, ${waveOpacity * 0.2}) 80%,
                            transparent 100%
                        )
                    `,
                    transform: `translateY(${scrollProgress * 20}%)`,
                    animation: 'aurora 12s ease-in-out 2s infinite reverse',
                    opacity: goldIntensity * 0.5,
                }}
            />
            <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                    height: '35%',
                    background: `
                        radial-gradient(
                            ellipse 80% 50% at 50% 100%,
                            rgba(255, 200, 80, ${waveOpacity * 0.3}) 0%,
                            rgba(212, 175, 55, ${waveOpacity * 0.15}) 40%,
                            transparent 70%
                        )
                    `,
                    animation: 'pulse 6s ease-in-out infinite',
                    opacity: goldIntensity * 0.6,
                }}
            />
        </div>
    );
};

const PulsingNebula: React.FC<{
    goldIntensity: number;
    mousePos: { x: number; y: number };
}> = ({ goldIntensity, mousePos }) => {
    if (goldIntensity < 0.25) return null;

    const nebulaOpacity = (goldIntensity - 0.25) * 0.4;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
                className="absolute rounded-full"
                style={{
                    left: `${30 + mousePos.x * 10}%`,
                    top: `${20 + mousePos.y * 15}%`,
                    width: '500px',
                    height: '350px',
                    background: `
                        radial-gradient(
                            ellipse at center,
                            rgba(212, 175, 55, ${nebulaOpacity * 0.25}) 0%,
                            rgba(180, 140, 50, ${nebulaOpacity * 0.15}) 35%,
                            rgba(139, 109, 35, ${nebulaOpacity * 0.08}) 55%,
                            transparent 70%
                        )
                    `,
                    filter: 'blur(50px)',
                    transform: 'translate(-50%, -50%)',
                    animation: 'nebulaPulse 10s ease-in-out infinite',
                }}
            />
            <div
                className="absolute rounded-full"
                style={{
                    left: `${65 - mousePos.x * 8}%`,
                    top: `${55 + mousePos.y * 10}%`,
                    width: '400px',
                    height: '280px',
                    background: `
                        radial-gradient(
                            ellipse at center,
                            rgba(251, 245, 183, ${nebulaOpacity * 0.2}) 0%,
                            rgba(212, 175, 55, ${nebulaOpacity * 0.12}) 40%,
                            transparent 65%
                        )
                    `,
                    filter: 'blur(60px)',
                    transform: 'translate(-50%, -50%)',
                    animation: 'nebulaPulse 14s ease-in-out 3s infinite reverse',
                }}
            />
            <div
                className="absolute rounded-full"
                style={{
                    left: `${50 + (mousePos.x - 0.5) * 20}%`,
                    top: `${75 - mousePos.y * 10}%`,
                    width: '350px',
                    height: '250px',
                    background: `
                        radial-gradient(
                            ellipse at center,
                            rgba(255, 220, 120, ${nebulaOpacity * 0.18}) 0%,
                            rgba(200, 160, 60, ${nebulaOpacity * 0.1}) 45%,
                            transparent 70%
                        )
                    `,
                    filter: 'blur(45px)',
                    transform: 'translate(-50%, -50%)',
                    animation: 'nebulaPulse 8s ease-in-out 5s infinite',
                }}
            />
        </div>
    );
};

const AtmosphericFog: React.FC<{
    scrollProgress: number;
    goldIntensity: number;
}> = ({ scrollProgress, goldIntensity }) => {
    const fogOpacity = Math.min(0.08, scrollProgress * 0.1);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
                className="absolute top-0 left-0 right-0"
                style={{
                    height: '40%',
                    background: `
                        linear-gradient(
                            to bottom,
                            rgba(0, 0, 0, ${fogOpacity * 2}) 0%,
                            rgba(25, 20, 15, ${fogOpacity}) 50%,
                            transparent 100%
                        )
                    `,
                }}
            />
            <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                    height: '30%',
                    background: `
                        linear-gradient(
                            to top,
                            rgba(35, 28, 18, ${fogOpacity * 1.5 * goldIntensity}) 0%,
                            rgba(20, 15, 10, ${fogOpacity * goldIntensity}) 40%,
                            transparent 100%
                        )
                    `,
                }}
            />
            <div
                className="absolute top-1/4 left-0 right-0 h-1/2"
                style={{
                    background: `
                        radial-gradient(
                            ellipse 100% 30% at 50% 50%,
                            rgba(212, 175, 55, ${fogOpacity * goldIntensity * 0.3}) 0%,
                            transparent 50%
                        )
                    `,
                    filter: 'blur(30px)',
                }}
            />
        </div>
    );
};

const EnhancedCornerDecorations: React.FC<{
    progress: number;
    goldIntensity: number;
}> = ({ progress, goldIntensity }) => {
    if (progress < 0.1) return null;

    const decorOpacity = Math.min(1, (progress - 0.1) * 2) * goldIntensity;
    const decorSize = 40 + progress * 30;

    return (
        <div className="absolute inset-8 md:inset-12 pointer-events-none z-10">
            <div className="absolute top-0 left-0" style={{ opacity: decorOpacity }}>
                <div
                    className="absolute top-0 left-0 border-l-2 border-t-2"
                    style={{
                        width: `${decorSize}px`,
                        height: `${decorSize}px`,
                        borderColor: `rgba(212, 175, 55, 0.3)`,
                        borderTopLeftRadius: '4px',
                    }}
                />
                <div
                    className="absolute top-2 left-2 w-2 h-2 rounded-full"
                    style={{
                        background: `rgba(212, 175, 55, ${0.4 + goldIntensity * 0.3})`,
                        boxShadow: `0 0 8px rgba(212, 175, 55, ${goldIntensity * 0.5})`,
                    }}
                />
            </div>
            <div className="absolute top-0 right-0" style={{ opacity: decorOpacity }}>
                <div
                    className="absolute top-0 right-0 border-r-2 border-t-2"
                    style={{
                        width: `${decorSize}px`,
                        height: `${decorSize}px`,
                        borderColor: `rgba(212, 175, 55, 0.3)`,
                        borderTopRightRadius: '4px',
                    }}
                />
                <div
                    className="absolute top-2 right-2 w-2 h-2 rounded-full"
                    style={{
                        background: `rgba(212, 175, 55, ${0.4 + goldIntensity * 0.3})`,
                        boxShadow: `0 0 8px rgba(212, 175, 55, ${goldIntensity * 0.5})`,
                    }}
                />
            </div>
            <div className="absolute bottom-0 left-0" style={{ opacity: decorOpacity }}>
                <div
                    className="absolute bottom-0 left-0 border-l-2 border-b-2"
                    style={{
                        width: `${decorSize}px`,
                        height: `${decorSize}px`,
                        borderColor: `rgba(212, 175, 55, 0.3)`,
                        borderBottomLeftRadius: '4px',
                    }}
                />
                <div
                    className="absolute bottom-2 left-2 w-2 h-2 rounded-full"
                    style={{
                        background: `rgba(212, 175, 55, ${0.4 + goldIntensity * 0.3})`,
                        boxShadow: `0 0 8px rgba(212, 175, 55, ${goldIntensity * 0.5})`,
                    }}
                />
            </div>
            <div className="absolute bottom-0 right-0" style={{ opacity: decorOpacity }}>
                <div
                    className="absolute bottom-0 right-0 border-r-2 border-b-2"
                    style={{
                        width: `${decorSize}px`,
                        height: `${decorSize}px`,
                        borderColor: `rgba(212, 175, 55, 0.3)`,
                        borderBottomRightRadius: '4px',
                    }}
                />
                <div
                    className="absolute bottom-2 right-2 w-2 h-2 rounded-full"
                    style={{
                        background: `rgba(212, 175, 55, ${0.4 + goldIntensity * 0.3})`,
                        boxShadow: `0 0 8px rgba(212, 175, 55, ${goldIntensity * 0.5})`,
                    }}
                />
            </div>
        </div>
    );
};

const RadiantPulse: React.FC<{
    goldIntensity: number;
    scrollProgress: number;
}> = ({ goldIntensity, scrollProgress }) => {
    if (goldIntensity < 0.4) return null;

    const pulseIntensity = (goldIntensity - 0.4) * 1.5;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
            <div
                className="absolute rounded-full"
                style={{
                    width: `${300 + scrollProgress * 400}px`,
                    height: `${300 + scrollProgress * 400}px`,
                    border: `1px solid rgba(212, 175, 55, ${pulseIntensity * 0.2})`,
                    animation: 'radiantPulse 3s ease-out infinite',
                }}
            />
            <div
                className="absolute rounded-full"
                style={{
                    width: `${200 + scrollProgress * 300}px`,
                    height: `${200 + scrollProgress * 300}px`,
                    border: `1px solid rgba(251, 245, 183, ${pulseIntensity * 0.15})`,
                    animation: 'radiantPulse 3s ease-out 1s infinite',
                }}
            />
            <div
                className="absolute rounded-full"
                style={{
                    width: `${100 + scrollProgress * 200}px`,
                    height: `${100 + scrollProgress * 200}px`,
                    border: `1px solid rgba(255, 220, 120, ${pulseIntensity * 0.12})`,
                    animation: 'radiantPulse 3s ease-out 2s infinite',
                }}
            />
            <div
                className="absolute rounded-full"
                style={{
                    width: `${50 + scrollProgress * 80}px`,
                    height: `${50 + scrollProgress * 80}px`,
                    background: `radial-gradient(circle, rgba(251, 245, 183, ${pulseIntensity * 0.3}) 0%, transparent 70%)`,
                    animation: 'pulse 2s ease-in-out infinite',
                }}
            />
        </div>
    );
};

const MysticSymbols: React.FC<{
    scrollProgress: number;
    goldIntensity: number;
}> = ({ scrollProgress, goldIntensity }) => {
    if (scrollProgress < 0.3 || goldIntensity < 0.35) return null;

    const symbolOpacity = Math.min(0.15, (scrollProgress - 0.3) * 0.3) * goldIntensity;

    const symbols = [
        { x: 15, y: 25, rotation: 30, scale: 1 },
        { x: 85, y: 30, rotation: -20, scale: 0.8 },
        { x: 10, y: 70, rotation: 45, scale: 0.9 },
        { x: 90, y: 65, rotation: -35, scale: 1.1 },
    ];

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {symbols.map((symbol, index) => (
                <div
                    key={index}
                    className="absolute"
                    style={{
                        left: `${symbol.x}%`,
                        top: `${symbol.y}%`,
                        opacity: symbolOpacity,
                        transform: `rotate(${symbol.rotation + scrollProgress * 20}deg) scale(${symbol.scale})`,
                        transition: 'transform 0.5s ease',
                    }}
                >
                    <div
                        className="w-12 h-12 md:w-16 md:h-16"
                        style={{
                            border: `1px solid rgba(212, 175, 55, 0.3)`,
                            borderRadius: '2px',
                            transform: 'rotate(45deg)',
                        }}
                    />
                    <div
                        className="absolute top-1/2 left-1/2 w-6 h-6 md:w-8 md:h-8"
                        style={{
                            border: `1px solid rgba(251, 245, 183, 0.25)`,
                            borderRadius: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                    <div
                        className="absolute top-1/2 left-1/2 w-1 h-1"
                        style={{
                            background: 'rgba(212, 175, 55, 0.5)',
                            borderRadius: '50%',
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 8px rgba(212, 175, 55, 0.4)',
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

const FloatingTextElements: React.FC<{
    scrollProgress: number;
    goldIntensity: number;
}> = ({ scrollProgress, goldIntensity }) => {
    if (scrollProgress < 0.2) return null;

    const textOpacity = Math.min(0.1, (scrollProgress - 0.2) * 0.15);

    const elements = [
        { text: 'AURUM', x: 8, y: 20, size: 'text-xs' },
        { text: 'LUXURIA', x: 92, y: 35, size: 'text-[10px]' },
        { text: 'REGNUM', x: 5, y: 75, size: 'text-[10px]' },
        { text: 'CORONA', x: 95, y: 80, size: 'text-xs' },
    ];

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {elements.map((el, index) => (
                <span
                    key={index}
                    className={`absolute ${el.size} tracking-[0.5em] uppercase font-light`}
                    style={{
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        color: `rgba(212, 175, 55, ${textOpacity * goldIntensity * 3})`,
                        transform: `translateY(${(1 - scrollProgress) * 20}px) rotate(${index % 2 === 0 ? 90 : -90}deg)`,
                        writingMode: 'vertical-lr',
                        opacity: textOpacity * goldIntensity * 2,
                        transition: 'all 0.5s ease',
                    }}
                >
                    {el.text}
                </span>
            ))}
        </div>
    );
};

const LightStreaks: React.FC<{
    goldIntensity: number;
    scrollProgress: number;
}> = ({ goldIntensity, scrollProgress }) => {
    if (goldIntensity < 0.5) return null;

    const streakOpacity = (goldIntensity - 0.5) * 0.4;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
                className="absolute top-0 left-1/4 w-px origin-top"
                style={{
                    height: `${scrollProgress * 60}%`,
                    background: `linear-gradient(to bottom, rgba(212, 175, 55, ${streakOpacity}) 0%, transparent 100%)`,
                    transform: `rotate(-25deg)`,
                }}
            />
            <div
                className="absolute top-0 right-1/4 w-px origin-top"
                style={{
                    height: `${scrollProgress * 55}%`,
                    background: `linear-gradient(to bottom, rgba(251, 245, 183, ${streakOpacity * 0.8}) 0%, transparent 100%)`,
                    transform: 'rotate(25deg)',
                }}
            />
            <div
                className="absolute top-0 left-1/3 w-px origin-top"
                style={{
                    height: `${scrollProgress * 45}%`,
                    background: `linear-gradient(to bottom, rgba(255, 220, 120, ${streakOpacity * 0.6}) 0%, transparent 100%)`,
                    transform: 'rotate(-15deg)',
                }}
            />
            <div
                className="absolute top-0 right-1/3 w-px origin-top"
                style={{
                    height: `${scrollProgress * 50}%`,
                    background: `linear-gradient(to bottom, rgba(200, 160, 60, ${streakOpacity * 0.7}) 0%, transparent 100%)`,
                    transform: 'rotate(18deg)',
                }}
            />
        </div>
    );
};

const ParallaxDots: React.FC<{
    scrollProgress: number;
    mousePos: { x: number; y: number };
}> = ({ scrollProgress, mousePos }) => {
    const dots = useMemo(() => {
        const random = createSeededRandom(77777);
        return Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: random() * 100,
            y: random() * 100,
            size: 1 + random() * 2,
            speed: 0.3 + random() * 0.7,
            layer: Math.floor(random() * 3),
        }));
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {dots.map((dot) => {
                const parallaxX = (mousePos.x - 0.5) * 20 * (dot.layer + 1);
                const parallaxY = scrollProgress * -100 * dot.speed;

                return (
                    <div
                        key={dot.id}
                        className="absolute rounded-full"
                        style={{
                            left: `calc(${dot.x}% + ${parallaxX}px)`,
                            top: `calc(${dot.y}% + ${parallaxY}px)`,
                            width: `${dot.size}px`,
                            height: `${dot.size}px`,
                            background: `rgba(212, 175, 55, ${0.1 + scrollProgress * 0.15})`,
                            boxShadow: scrollProgress > 0.3
                                ? `0 0 ${dot.size * 3}px rgba(212, 175, 55, ${scrollProgress * 0.2})`
                                : 'none',
                        }}
                    />
                );
            })}
        </div>
    );
};

const CelestialGlow: React.FC<{
    goldIntensity: number;
    scrollProgress: number;
}> = ({ goldIntensity, scrollProgress }) => {
    if (goldIntensity < 0.35) return null;

    const glowSize = 400 + scrollProgress * 300;
    const glowOpacity = (goldIntensity - 0.35) * 0.5;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
            <div
                className="absolute rounded-full"
                style={{
                    width: `${glowSize}px`,
                    height: `${glowSize}px`,
                    background: `
                        radial-gradient(
                            circle,
                            rgba(251, 245, 183, ${glowOpacity * 0.3}) 0%,
                            rgba(212, 175, 55, ${glowOpacity * 0.2}) 25%,
                            rgba(180, 140, 50, ${glowOpacity * 0.1}) 50%,
                            transparent 70%
                        )
                    `,
                    animation: 'celestialPulse 5s ease-in-out infinite',
                }}
            />
            <div
                className="absolute rounded-full"
                style={{
                    width: `${glowSize * 0.6}px`,
                    height: `${glowSize * 0.6}px`,
                    background: `
                        radial-gradient(
                            circle,
                            rgba(255, 220, 120, ${glowOpacity * 0.4}) 0%,
                            rgba(212, 175, 55, ${glowOpacity * 0.2}) 40%,
                            transparent 70%
                        )
                    `,
                    animation: 'celestialPulse 4s ease-in-out 1s infinite reverse',
                }}
            />
        </div>
    );
};

const ScrollProgressIndicator: React.FC<{
    progress: number;
    showArrow: boolean;
}> = ({ progress, showArrow }) => {
    return (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2">
            <span
                className="text-[8px] md:text-[9px] tracking-[0.5em] uppercase transition-opacity duration-500"
                style={{
                    color: 'rgba(212, 175, 55, 0.35)',
                    opacity: progress < 0.92 ? 1 : 0,
                }}
            >
                Scroll
            </span>

            <div
                className="relative overflow-hidden transition-opacity duration-500"
                style={{
                    width: '1px',
                    height: '50px',
                    background: 'rgba(212, 175, 55, 0.12)',
                    opacity: progress < 0.92 ? 1 : 0,
                }}
            >
                <div
                    className="absolute top-0 left-0 w-full"
                    style={{
                        height: `${progress * 100}%`,
                        background: 'linear-gradient(to bottom, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.7))',
                        transition: 'height 0.1s linear',
                        boxShadow: '0 0 8px rgba(212, 175, 55, 0.5)',
                    }}
                />
            </div>

            {showArrow && (
                <div
                    className="w-2 h-2 border-b border-r border-scandalea-gold/30 rotate-45 animate-bounce transition-opacity duration-500"
                    style={{
                        animationDuration: '2s',
                        opacity: progress < 0.1 ? 1 : 0,
                    }}
                />
            )}
        </div>
    );
};

const PhaseIndicator: React.FC<{
    currentPhase: number;
    totalPhases: number;
    goldIntensity: number;
}> = ({ currentPhase, totalPhases, goldIntensity }) => {
    return (
        <div className="absolute top-6 md:top-8 left-6 md:left-8 z-40 flex items-center gap-2">
            {Array.from({ length: totalPhases }).map((_, i) => {
                const phase = i + 1;
                const isActive = currentPhase === phase;
                const isPast = currentPhase > phase;

                return (
                    <div key={i} className="relative">
                        <div
                            className="w-1.5 h-1.5 rounded-full transition-all duration-600"
                            style={{
                                background: isPast || isActive
                                    ? `linear-gradient(135deg, #FBF5B7 0%, #D4AF37 100%)`
                                    : `rgba(255, 255, 255, ${0.08 + goldIntensity * 0.08})`,
                                boxShadow: isActive ? `0 0 14px rgba(212, 175, 55, ${0.6 + goldIntensity * 0.3})` : 'none',
                                transform: isActive ? 'scale(1.5)' : 'scale(1)',
                            }}
                        />

                        {isActive && (
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: 'rgba(212, 175, 55, 0.25)',
                                    animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                                    transform: 'scale(2)',
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const Vignette: React.FC<{
    mousePos: { x: number; y: number };
    intensity: number;
    goldIntensity: number;
}> = ({ mousePos, intensity, goldIntensity }) => {
    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                background: `
                    radial-gradient(
                        ellipse 120% 100% at ${mousePos.x * 100}% ${mousePos.y * 100}%,
                        transparent 25%,
                        rgba(0, 0, 0, ${0.2 + intensity * 0.12}) 60%,
                        rgba(0, 0, 0, ${0.4 + intensity * 0.15}) 100%
                    )
                `,
                transition: 'background 0.3s ease',
            }}
        />
    );
};

const DynamicBackground: React.FC<{
    goldIntensity: number;
    mousePos: { x: number; y: number };
    scrollVelocity: number;
}> = ({ goldIntensity, mousePos, scrollVelocity }) => {
    const velocityBrightness = 1 + scrollVelocity * 0.15;

    const baseR = (5 + goldIntensity * 20) * velocityBrightness;
    const baseG = (5 + goldIntensity * 12) * velocityBrightness;
    const baseB = (5 + goldIntensity * 4) * velocityBrightness;

    const gradientR = (12 + goldIntensity * 18) * velocityBrightness;
    const gradientG = (10 + goldIntensity * 10) * velocityBrightness;
    const gradientB = (6 + goldIntensity * 3) * velocityBrightness;

    return (
        <div
            className="absolute inset-0"
            style={{
                background: `
                    radial-gradient(
                        ellipse 150% 100% at ${mousePos.x * 100}% ${mousePos.y * 100}%,
                        rgb(${Math.round(gradientR)}, ${Math.round(gradientG)}, ${Math.round(gradientB)}) 0%,
                        rgb(${Math.round(baseR)}, ${Math.round(baseG)}, ${Math.round(baseB)}) 45%,
                        rgb(5, 5, 5) 100%
                    )
                `,
                transition: 'background 0.4s ease',
            }}
        />
    );
};

const NoiseOverlay: React.FC = () => {
    return (
        <div
            className="absolute inset-0 pointer-events-none z-50 opacity-[0.012]"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
        />
    );
};

const GradientMesh: React.FC<{
    goldIntensity: number;
    scrollProgress: number;
}> = ({ goldIntensity, scrollProgress }) => {
    if (goldIntensity < 0.25) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
                className="absolute rounded-full"
                style={{
                    left: `${20 + scrollProgress * 10}%`,
                    top: `${25 + scrollProgress * 15}%`,
                    width: '450px',
                    height: '450px',
                    background: `radial-gradient(circle, rgba(212, 175, 55, ${goldIntensity * 0.035}) 0%, transparent 70%)`,
                    filter: 'blur(70px)',
                    transform: 'translate(-50%, -50%)',
                }}
            />
            <div
                className="absolute rounded-full"
                style={{
                    left: `${75 - scrollProgress * 10}%`,
                    top: `${70 - scrollProgress * 15}%`,
                    width: '380px',
                    height: '380px',
                    background: `radial-gradient(circle, rgba(251, 245, 183, ${goldIntensity * 0.025}) 0%, transparent 70%)`,
                    filter: 'blur(90px)',
                    transform: 'translate(-50%, -50%)',
                }}
            />
            <div
                className="absolute rounded-full"
                style={{
                    left: '50%',
                    top: `${50 + scrollProgress * 20}%`,
                    width: '300px',
                    height: '300px',
                    background: `radial-gradient(circle, rgba(255, 200, 100, ${goldIntensity * 0.02}) 0%, transparent 70%)`,
                    filter: 'blur(60px)',
                    transform: 'translate(-50%, -50%)',
                }}
            />
        </div>
    );
};

const HorizontalDivider: React.FC<{
    opacity: number;
    position: 'top' | 'center' | 'bottom';
    width?: number;
}> = ({ opacity, position, width = 200 }) => {
    if (opacity <= 0) return null;

    const positionClass = position === 'top' ? 'top-1/4' : position === 'bottom' ? 'bottom-1/4' : 'top-1/2';

    return (
        <div
            className={`absolute left-0 right-0 flex justify-center ${positionClass}`}
            style={{ opacity }}
        >
            <div
                className="h-px"
                style={{
                    width: `${width}px`,
                    background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.18), transparent)',
                }}
            />
        </div>
    );
};


const PhaseOneContent: React.FC<{
    opacity: number;
    scrollProgress: number;
}> = ({ opacity, scrollProgress }) => {
    if (opacity <= 0) return null;

    const textY = scrollProgress * -30;

    return (
        <div
            className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-4 md:px-8 lg:px-12"
            style={{
                opacity,
                transform: `translateY(${(1 - opacity) * -50 + textY}px)`,
                transition: 'opacity 0.5s ease',
            }}
        >
            <div className="text-center max-w-3xl xl:max-w-4xl">
                <h2
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-light leading-relaxed md:leading-relaxed lg:leading-relaxed"
                    style={{
                        color: 'rgba(220, 200, 170, 0.92)',
                        fontFamily: 'Georgia, "Times New Roman", serif',
                        textShadow: '0 3px 50px rgba(0, 0, 0, 0.75)',
                        letterSpacing: '0.025em',
                    }}
                >
                    <span className="block mb-2 md:mb-3 italic">
                        "They called her audacious.
                    </span>
                    <span className="block">
                        She called it sovereignty."
                    </span>
                </h2>
            </div>

            <div className="mt-12 md:mt-16 flex items-center gap-4 md:gap-6">
                <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent to-amber-700/25" />
                <span className="text-[8px] md:text-[9px] tracking-[0.5em] uppercase text-amber-700/35">
                    Scroll to unveil
                </span>
                <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent to-amber-700/25" />
            </div>
        </div>
    );
};

const PhaseTwoContent: React.FC<{
    opacity: number;
    goldIntensity: number;
}> = ({ opacity, goldIntensity }) => {
    if (opacity <= 0) return null;

    return (
        <div
            className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-4 md:px-8 lg:px-12"
            style={{
                opacity,
                transform: `scale(${0.93 + opacity * 0.07})`,
            }}
        >
            <div className="text-center max-w-2xl xl:max-w-3xl">
                <p
                    className="text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-light leading-relaxed"
                    style={{
                        color: '#E8D5A3',
                        textShadow: `
                            0 0 70px rgba(212, 175, 55, ${0.3 + goldIntensity * 0.15}),
                            0 0 120px rgba(212, 175, 55, ${0.15 + goldIntensity * 0.1}),
                            0 5px 35px rgba(0, 0, 0, 0.85)
                        `,
                        letterSpacing: '0.035em',
                    }}
                >
                    Where others see scandal,
                    <br />
                    <span
                        className="font-normal"
                        style={{
                            color: '#D4AF37',
                            textShadow: `0 0 40px rgba(212, 175, 55, ${0.4 + goldIntensity * 0.2})`,
                        }}
                    >
                        she wears a crown.
                    </span>
                </p>
            </div>
        </div>
    );
};

const PhaseThreeContent: React.FC<{
    opacity: number;
    goldIntensity: number;
    scrollProgress: number;
}> = ({ opacity, goldIntensity, scrollProgress }) => {
    if (opacity <= 0) return null;

    const preTitleOpacity = opacity > 0.2 ? (opacity - 0.2) * 1.8 : 0;
    const taglineOpacity = opacity > 0.4 ? (opacity - 0.4) * 2 : 0;
    const textScale = 0.8 + opacity * 0.25;

    // Enhanced animation based on scroll
    const floatOffset = Math.sin(scrollProgress * Math.PI * 2) * 8;
    const breatheScale = 1 + Math.sin(scrollProgress * Math.PI * 4) * 0.02;

    return (
        <div
            className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-4 md:px-8 lg:px-12"
            style={{ opacity }}
        >
            <div
                className="text-center"
                style={{
                    transform: `scale(${textScale * breatheScale}) translateY(${floatOffset}px)`,
                    transition: 'transform 0.3s ease-out',
                }}
            >
                {/* Pre-title decorative element */}
                <div
                    className="flex items-center justify-center gap-4 md:gap-6 mb-6 md:mb-8 lg:mb-12"
                    style={{ opacity: preTitleOpacity }}
                >
                    <div
                        className="h-px"
                        style={{
                            width: `${60 + goldIntensity * 40}px`,
                            background: `linear-gradient(to right, transparent, rgba(212, 175, 55, ${0.3 + goldIntensity * 0.3}))`,
                        }}
                    />
                    <div
                        className="w-2 h-2 rotate-45"
                        style={{
                            background: `linear-gradient(135deg, rgba(212, 175, 55, ${0.5 + goldIntensity * 0.3}), rgba(251, 245, 183, ${0.3 + goldIntensity * 0.2}))`,
                            boxShadow: `0 0 15px rgba(212, 175, 55, ${goldIntensity * 0.5})`,
                            animation: 'pulse 2s ease-in-out infinite',
                        }}
                    />
                    <span
                        className="text-[8px] md:text-[10px] lg:text-xs tracking-[0.6em] uppercase font-light"
                        style={{
                            color: `rgba(212, 175, 55, ${0.4 + goldIntensity * 0.25})`,
                            textShadow: `0 0 20px rgba(212, 175, 55, ${goldIntensity * 0.3})`,
                        }}
                    >
                        Aurea Aetas
                    </span>
                    <div
                        className="w-2 h-2 rotate-45"
                        style={{
                            background: `linear-gradient(135deg, rgba(251, 245, 183, ${0.3 + goldIntensity * 0.2}), rgba(212, 175, 55, ${0.5 + goldIntensity * 0.3}))`,
                            boxShadow: `0 0 15px rgba(212, 175, 55, ${goldIntensity * 0.5})`,
                            animation: 'pulse 2s ease-in-out infinite 0.5s',
                        }}
                    />
                    <div
                        className="h-px"
                        style={{
                            width: `${60 + goldIntensity * 40}px`,
                            background: `linear-gradient(to left, transparent, rgba(212, 175, 55, ${0.3 + goldIntensity * 0.3}))`,
                        }}
                    />
                </div>

                {/* Main brand title - SCANDALÉA - Spectacular reveal */}
                <h1
                    className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] tracking-[0.08em] md:tracking-[0.12em] uppercase"
                    style={{
                        fontFamily: 'Georgia, "Times New Roman", serif',
                        color: '#F5E6BC',
                        textShadow: `
                            0 0 60px rgba(212, 175, 55, ${0.4 + goldIntensity * 0.35}),
                            0 0 120px rgba(212, 175, 55, ${0.25 + goldIntensity * 0.25}),
                            0 0 180px rgba(212, 175, 55, ${0.15 + goldIntensity * 0.2}),
                            0 0 250px rgba(251, 245, 183, ${0.1 + goldIntensity * 0.15}),
                            0 0 350px rgba(212, 175, 55, ${0.05 + goldIntensity * 0.1}),
                            0 8px 60px rgba(0, 0, 0, 0.95)
                        `,
                        transform: `translateY(${(1 - opacity) * 80}px) scale(${0.95 + opacity * 0.05})`,
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        animation: 'textGlow 4s ease-in-out infinite',
                    }}
                >
                    Scandaléa
                </h1>

                {/* Decorative underline */}
                <div
                    className="mx-auto mt-6 md:mt-8"
                    style={{
                        width: `${100 + goldIntensity * 150}px`,
                        height: '2px',
                        background: `linear-gradient(to right, transparent, rgba(212, 175, 55, ${0.5 + goldIntensity * 0.3}), rgba(251, 245, 183, ${0.6 + goldIntensity * 0.3}), rgba(212, 175, 55, ${0.5 + goldIntensity * 0.3}), transparent)`,
                        boxShadow: `0 0 20px rgba(212, 175, 55, ${goldIntensity * 0.4})`,
                        opacity: preTitleOpacity,
                    }}
                />

                {/* Tagline with enhanced styling */}
                <p
                    className="mt-8 md:mt-12 lg:mt-16 text-[10px] md:text-xs lg:text-sm tracking-[0.5em] md:tracking-[0.6em] uppercase font-light"
                    style={{
                        color: `rgba(212, 175, 55, ${0.45 + goldIntensity * 0.2})`,
                        textShadow: `0 0 30px rgba(212, 175, 55, ${goldIntensity * 0.25})`,
                        opacity: taglineOpacity,
                        letterSpacing: `${0.5 + goldIntensity * 0.15}em`,
                    }}
                >
                    Wear Your Golden Age
                </p>
            </div>
        </div>
    );
};

const PhaseFourContent: React.FC<{
    opacity: number;
    goldIntensity: number;
}> = ({ opacity, goldIntensity }) => {
    if (opacity <= 0) return null;

    return (
        <div
            className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-4 md:px-8 lg:px-12"
            style={{ opacity }}
        >
            <div className="text-center">
                <p
                    className="text-sm md:text-base lg:text-lg xl:text-xl font-light"
                    style={{
                        color: `rgba(212, 175, 55, ${0.5 + goldIntensity * 0.15})`,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        textShadow: `0 0 30px rgba(212, 175, 55, ${goldIntensity * 0.3})`,
                    }}
                >
                    The collection awaits
                </p>

                <div className="mt-8 md:mt-10 flex flex-col items-center gap-3">
                    <div
                        className="w-px h-10 md:h-14"
                        style={{
                            background: `linear-gradient(to bottom, rgba(212, 175, 55, ${0.4 + goldIntensity * 0.2}) 0%, transparent 100%)`,
                        }}
                    />
                    <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                            background: `rgba(212, 175, 55, ${0.35 + goldIntensity * 0.15})`,
                            animationDuration: '1.5s',
                            boxShadow: `0 0 10px rgba(212, 175, 55, ${goldIntensity * 0.4})`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const SEOContent: React.FC = () => {
    return (
        <div className="sr-only" aria-hidden="false">
            <h1>Scandaléa - Luxury Fragrance Collection</h1>
            <p>
                Discover Scandaléa, the premium fragrance brand that celebrates audacity and sovereignty.
                Our Golden Age collection features exquisite perfumes crafted for those who refuse to dim their light.
                Experience luxury scents that transform scandal into a crown.
            </p>
            <ul>
                <li>Premium Turkish Fragrance Brand</li>
                <li>Luxury Perfume Collection</li>
                <li>Golden Age Scents</li>
                <li>Artisanal Perfumery</li>
                <li>Exclusive Fragrance Experience</li>
            </ul>
        </div>
    );
};

export const Hero: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const mousePos = useMousePosition();
    const scrollVelocity = useScrollVelocity();

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 80);
        return () => clearTimeout(timer);
    }, []);

    useGSAP(() => {
        if (!sectionRef.current) return;

        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.4,
            onUpdate: (self) => setScrollProgress(self.progress),
        });
    }, { scope: sectionRef });

    const totalPhases = 4;

    const phase1End = 0.26;
    const phase2Start = 0.22;
    const phase2End = 0.50;
    const phase3Start = 0.46;
    const phase3End = 0.82;
    const phase4Start = 0.78;

    const calculatePhaseOpacity = (
        progress: number,
        start: number,
        peak: number,
        end: number
    ): number => {
        if (progress < start) return 0;
        if (progress < peak) return (progress - start) / (peak - start);
        if (progress < end) return 1 - (progress - peak) / (end - peak);
        return 0;
    };

    const phase1Opacity = isLoaded
        ? (scrollProgress < 0.03
            ? 1
            : scrollProgress < phase1End
                ? Math.max(0, 1 - (scrollProgress - 0.03) / (phase1End - 0.03) * 1.4)
                : 0)
        : 0;
    const phase2Opacity = calculatePhaseOpacity(scrollProgress, phase2Start, 0.36, phase2End);
    const phase3Opacity = calculatePhaseOpacity(scrollProgress, phase3Start, 0.65, phase3End);
    const phase4Opacity = scrollProgress > phase4Start ? Math.min(1, (scrollProgress - phase4Start) * 5) : 0;

    const currentPhase =
        scrollProgress < 0.22 ? 1 :
            scrollProgress < 0.46 ? 2 :
                scrollProgress < 0.78 ? 3 : 4;

    const goldIntensity = Math.min(1, Math.max(0, (scrollProgress - 0.12) * 1.35));
    const crackProgress = Math.max(0, Math.min(1, (scrollProgress - 0.18) * 1.7));
    const starOpacity = Math.max(0, 1 - scrollProgress * 2.8);

    return (
        <section
            ref={sectionRef}
            className="relative w-full"
            style={{ height: '650vh' }}
            aria-label="Hero section introducing Scandaléa luxury fragrance brand"
        >
            <SEOContent />

            <PersistentBrandLogo scrollProgress={scrollProgress} isLoaded={isLoaded} goldIntensity={goldIntensity} />

            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <DynamicBackground goldIntensity={goldIntensity} mousePos={mousePos} scrollVelocity={scrollVelocity} />

                <NoiseOverlay />

                <GradientMesh goldIntensity={goldIntensity} scrollProgress={scrollProgress} />

                <EnhancedStarField opacity={starOpacity} mousePos={mousePos} />

                <FloatingOrbs goldIntensity={goldIntensity} />

                <ConcentricRings progress={scrollProgress} goldIntensity={goldIntensity} />

                <AmbientParticleField goldIntensity={goldIntensity} particleCount={35} scrollVelocity={scrollVelocity} />

                <DustMotesLayer goldIntensity={goldIntensity} />

                <FloatingGeometry scrollProgress={scrollProgress} goldIntensity={goldIntensity} mousePos={mousePos} />

                <RisingLightRays intensity={goldIntensity} scrollProgress={scrollProgress} />

                <GoldenCrack progress={crackProgress} scrollVelocity={scrollVelocity} />

                <AuroraWaves goldIntensity={goldIntensity} scrollProgress={scrollProgress} />

                <PulsingNebula goldIntensity={goldIntensity} mousePos={mousePos} />

                <AtmosphericFog scrollProgress={scrollProgress} goldIntensity={goldIntensity} />

                <EnhancedCornerDecorations progress={scrollProgress} goldIntensity={goldIntensity} />

                <RadiantPulse goldIntensity={goldIntensity} scrollProgress={scrollProgress} />

                <MysticSymbols scrollProgress={scrollProgress} goldIntensity={goldIntensity} />

                <FloatingTextElements scrollProgress={scrollProgress} goldIntensity={goldIntensity} />

                <LightStreaks goldIntensity={goldIntensity} scrollProgress={scrollProgress} />

                <ParallaxDots scrollProgress={scrollProgress} mousePos={mousePos} />

                <CelestialGlow goldIntensity={goldIntensity} scrollProgress={scrollProgress} />

                <ElegantFrame progress={scrollProgress} goldIntensity={goldIntensity} />

                <Vignette mousePos={mousePos} intensity={scrollProgress} goldIntensity={goldIntensity} />

                <HorizontalDivider opacity={phase2Opacity * 0.45} position="top" width={180} />
                <HorizontalDivider opacity={phase3Opacity * 0.4} position="bottom" width={220} />
                {/* Removed vertical dividers to prevent splitting text */}

                <PhaseOneContent opacity={phase1Opacity} scrollProgress={scrollProgress} />
                <PhaseTwoContent opacity={phase2Opacity} goldIntensity={goldIntensity} />
                <PhaseThreeContent opacity={phase3Opacity} goldIntensity={goldIntensity} scrollProgress={scrollProgress} />
                <PhaseFourContent opacity={phase4Opacity} goldIntensity={goldIntensity} />

                <ScrollProgressIndicator progress={scrollProgress} showArrow={scrollProgress < 0.08} />

                <PhaseIndicator currentPhase={currentPhase} totalPhases={totalPhases} goldIntensity={goldIntensity} />
            </div>
        </section>
    );
};

export default Hero;
