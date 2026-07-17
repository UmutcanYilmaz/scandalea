/**
 * GOLDEN AGE TIMELINE
 * GSAP master timeline for the "Grey World to Golden Age" reveal sequence.
 * Orchestrates all animations in the hero section.
 */

"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface GoldenAgeTimelineProps {
    onGreyScaleChange: (value: number) => void;
    onCrackProgressChange: (value: number) => void;
    onBottleVisibleChange: (visible: boolean) => void;
    onShowCracksChange: (show: boolean) => void;
    onTextRevealChange: (progress: number) => void;
    containerRef: React.RefObject<HTMLDivElement>;
    isSceneReady: boolean;
}

export const GoldenAgeTimeline: React.FC<GoldenAgeTimelineProps> = ({
    onGreyScaleChange,
    onCrackProgressChange,
    onBottleVisibleChange,
    onShowCracksChange,
    onTextRevealChange,
    containerRef,
    isSceneReady,
}) => {
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const hasStarted = useRef(false);

    // Animation state refs
    const state = useRef({
        greyScale: 1.0,
        crackProgress: 0,
        bottleOpacity: 0,
        textReveal: 0,
    });

    // Create the master timeline
    useGSAP(() => {
        if (!isSceneReady || !containerRef.current || hasStarted.current) return;

        hasStarted.current = true;

        // Create master timeline
        const tl = gsap.timeline({
            paused: true,
            onUpdate: () => {
                // Sync state with animations
            },
        });

        // Store reference
        timelineRef.current = tl;

        // ============================================
        // PHASE 1: GREY WORLD (0 - 1s)
        // The world starts in monochrome, heavy and still
        // ============================================

        // Initial state - already grey, just hold
        tl.set({}, { duration: 0.5 });

        // ============================================
        // PHASE 2: CRACK PHASE (1 - 2.5s)
        // Kintsugi golden cracks spread across the screen
        // ============================================

        // Show cracks
        tl.call(() => onShowCracksChange(true), [], 0.5);

        // Animate crack progress
        tl.to(state.current, {
            crackProgress: 1,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => {
                onCrackProgressChange(state.current.crackProgress);
            },
        }, 0.5);

        // ============================================
        // PHASE 3: REVEAL PHASE (2 - 3.5s)
        // Color bleeds through cracks, grey fades to gold
        // ============================================

        // Transition from grey to color
        tl.to(state.current, {
            greyScale: 0,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => {
                onGreyScaleChange(state.current.greyScale);
            },
        }, 1.5);

        // Show bottle as color appears
        tl.call(() => onBottleVisibleChange(true), [], 2);

        // Bottle fade in
        tl.to(state.current, {
            bottleOpacity: 1,
            duration: 1.2,
            ease: 'power3.out',
        }, 2);

        // Hide cracks after they've served their purpose
        tl.call(() => onShowCracksChange(false), [], 3);

        // ============================================
        // PHASE 4: TEXT PHASE (3 - 5s)
        // "SCANDALÉA" rises from the liquid gold
        // ============================================

        tl.to(state.current, {
            textReveal: 1,
            duration: 1.5,
            ease: 'power3.out',
            onUpdate: () => {
                onTextRevealChange(state.current.textReveal);
            },
        }, 3);

        // ============================================
        // PHASE 5: SETTLED (5s+)
        // Everything in place, mouse reactivity active
        // ============================================

        // Final flourish - subtle pulse
        tl.to({}, {
            duration: 0.5,
        });

        // Play the timeline
        tl.play();

        // Cleanup
        return () => {
            tl.kill();
        };

    }, { scope: containerRef, dependencies: [isSceneReady] });

    return null; // This component only manages animations
};

// Text reveal component with dripping effect
interface DrippingTextProps {
    text: string;
    revealProgress: number;
    className?: string;
}

export const DrippingText: React.FC<DrippingTextProps> = ({
    text,
    revealProgress,
    className = '',
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const charsRef = useRef<HTMLSpanElement[]>([]);

    useGSAP(() => {
        if (!containerRef.current || revealProgress === 0) return;

        const chars = charsRef.current;

        chars.forEach((char, i) => {
            if (!char) return;

            const delay = i * 0.08;
            const charProgress = Math.max(0, Math.min(1, (revealProgress - delay / 2) * 2));

            // Rise from below
            const yOffset = (1 - charProgress) * 50;

            // Opacity
            const opacity = charProgress;

            // Drip effect (character stretches as it rises)
            const scaleY = 1 + (1 - charProgress) * 0.3;
            const skewY = (1 - charProgress) * 5;

            // Filter for golden glow
            const blur = (1 - charProgress) * 3;
            const brightness = 1 + charProgress * 0.5;

            gsap.set(char, {
                y: yOffset,
                opacity,
                scaleY,
                skewY,
                filter: `blur(${blur}px) brightness(${brightness})`,
                transformOrigin: 'center bottom',
            });
        });

    }, { scope: containerRef, dependencies: [revealProgress] });

    return (
        <div ref={containerRef} className={`overflow-hidden ${className}`}>
            <div className="flex justify-center items-end">
                {text.split('').map((char, i) => (
                    <span
                        key={i}
                        ref={el => { if (el) charsRef.current[i] = el; }}
                        className="inline-block font-serif text-transparent bg-clip-text bg-gradient-to-b from-scandalea-gold-light via-scandalea-gold to-scandalea-gold-dark"
                        style={{
                            textShadow: '0 0 60px rgba(212, 175, 55, 0.5)',
                            opacity: 0,
                        }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </div>

            {/* Drip trails */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {text.split('').map((char, i) => {
                    if (char === ' ') return null;
                    const dripProgress = Math.max(0, revealProgress - 0.3 - i * 0.05);
                    if (dripProgress <= 0) return null;

                    return (
                        <div
                            key={`drip-${i}`}
                            className="absolute"
                            style={{
                                left: `${(i / text.length) * 100 + 50 / text.length}%`,
                                top: '100%',
                                width: '2px',
                                height: `${dripProgress * 30}px`,
                                background: 'linear-gradient(to bottom, #D4AF37, transparent)',
                                opacity: 1 - dripProgress,
                                transform: 'translateX(-50%)',
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

// Subtitle reveal with stagger
interface SubtitleRevealProps {
    visible: boolean;
    className?: string;
}

export const SubtitleReveal: React.FC<SubtitleRevealProps> = ({
    visible,
    className = '',
}) => {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!ref.current) return;

        if (visible) {
            gsap.fromTo(ref.current.children,
                {
                    opacity: 0,
                    y: 20,
                    filter: 'blur(5px)',
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power2.out',
                }
            );
        }
    }, { scope: ref, dependencies: [visible] });

    if (!visible) return null;

    return (
        <div ref={ref} className={`flex flex-col items-center gap-2 ${className}`}>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-scandalea-gold to-transparent" />
            <p className="text-xs tracking-[0.5em] uppercase text-scandalea-gold/60 font-light">
                The Golden Age
            </p>
        </div>
    );
};

export default GoldenAgeTimeline;
