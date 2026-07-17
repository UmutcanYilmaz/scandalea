"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
// import { ScrambleTextPlugin } from "gsap/all";
import clsx from "clsx";

// Register GSAP Plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

// -----------------------------------------------------------------------------
// [DATA] THE ARCHIVE OF LOST MEMORIES (LORE V2)
// -----------------------------------------------------------------------------
// Replacing "Sin" with "Memory", "Time", "Loss", "Desire".
// This data feeds the procedural narrative engine.
const ARCHIVE_DATA = {
    LOCATIONS: [
        "The Velvet Room", "Sector 7", "The Midnight Garden", "Paris, 1999",
        "The Void Station", "Memory Core", "The Glass House", "Sub-level 4",
        "The Opera", "The Crash Site", "The Hotel Corridor", "The Edge of Forever"
    ],
    OBJECTS: [
        "A faded letter", "Broken glass", "Red lipstick", "A gold chain",
        "The smell of rain", "Cold smoke", "A silent phone", "The key",
        "A torn photograph", "White silk", "Black ink", "The last breath"
    ],
    FEELINGS: [
        "Nostalgia", "Regret", "Euphoria", "Vertigo", "Hysteria", "Silence",
        "Ache", "Hunger", "Thirst", "Weightlessness", "Panic", "Peace"
    ],
    CODES: [
        "ERR_MEMORY_LEAK", "PROTOCOL_DELTA", "SEQ_BREACH", "OVERRIDE_AUTH",
        "DECRYPTING...", "RECONSTRUCTING...", "LOST_PACKET", "SIGNAL_LOST",
        "VOID_ENTRY", "TIME_DILATION", "KINETIC_FAILURE", "SYSTEM_PURGE"
    ],
    PHRASE_FRAGMENTS: [
        "It was never yours.", "You promised to forget.", "Time is a flat circle.",
        "We are trapped here.", "The scent remains.", "Look behind you.",
        "Close your eyes.", "Don't let go.", "It burns like cold fire.",
        "Silence is the loudest scream.", "Shadows weigh more than light.",
        "Breathe in the ghost.", "Exhale the past.", "Rewritng history.",
        "Deleting the sorrow."
    ]
};

// Seeded pseudo-random number generator for consistent SSR/client values
const createSeededRandom = (seed: number) => {
    return () => {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
};

// Create a shared seeded random instance for consistent values
const seededRandom = createSeededRandom(111111);
const random = (min: number, max: number) => seededRandom() * (max - min) + min;
const randomInt = (min: number, max: number) => Math.floor(random(min, max));
function randomItem<T>(arr: T[]): T {
    return arr[randomInt(0, arr.length)];
}

// Generates a "Memory Log" entry
const generateMemoryLog = () => {
    const timestamp = `${randomInt(0, 23)}:${randomInt(0, 59)}:${randomInt(0, 59)}`;
    const location = randomItem(ARCHIVE_DATA.LOCATIONS);
    const code = randomItem(ARCHIVE_DATA.CODES);
    return `[${timestamp}] // ${code} // LOC: ${location}`;
};

// Generates a poetic fragment
const generateFragment = () => {
    const obj = randomItem(ARCHIVE_DATA.OBJECTS);
    const feel = randomItem(ARCHIVE_DATA.FEELINGS);
    const phrase = randomItem(ARCHIVE_DATA.PHRASE_FRAGMENTS);
    return `${phrase} The ${obj.toLowerCase()} triggers ${feel.toLowerCase()}.`;
};

// -----------------------------------------------------------------------------
// [SUB-COMPONENT] BIOMETRIC RETICLE
// -----------------------------------------------------------------------------
const BiometricReticle = () => {
    const reticleRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.to(".reticle-ring", {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: "linear"
        });
        gsap.to(".reticle-scan", {
            height: "100%",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });
    }, []);

    return (
        <div ref={reticleRef} className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none opacity-0 biometric-stage">
            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
                {/* Outer Ring */}
                <div className="reticle-ring absolute inset-0 border border-white/10 rounded-full border-dashed" />
                {/* Inner Ring */}
                <div className="reticle-ring absolute inset-[10%] border border-scandalea-gold/20 rounded-full" style={{ animationDirection: "reverse" }} />
                {/* Scanning Line */}
                <div className="absolute inset-x-0 h-[2px] bg-scandalea-gold/50 reticle-scan shadow-[0_0_20px_rgba(212,175,55,0.5)]" />
                {/* Data Points */}
                <div className="absolute top-0 left-0 text-[10px] font-mono text-white/40">
                    SCANNING_SUBJECT...
                </div>
                <div className="absolute bottom-0 right-0 text-[10px] font-mono text-white/40">
                    MATCH_PROBABILITY: 99.9%
                </div>
            </div>
        </div>
    );
};

// -----------------------------------------------------------------------------
// [SUB-COMPONENT] MEMORY FRAGMENT CLOUD
// -----------------------------------------------------------------------------
const MemoryCloud = () => {
    const fragments = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        text: randomItem(ARCHIVE_DATA.PHRASE_FRAGMENTS),
        x: random(10, 90),
        y: random(10, 90),
        scale: random(0.5, 1.2)
    })), []);

    return (
        <div className="absolute inset-0 z-10 memory-stage opacity-0">
            {fragments.map((f, i) => (
                <div
                    key={f.id}
                    className="memory-fragment absolute max-w-xs text-center font-serif text-white/30"
                    style={{
                        left: `${f.x}%`,
                        top: `${f.y}%`,
                        fontSize: `${f.scale}rem`
                    }}
                >
                    {f.text}
                </div>
            ))}
        </div>
    );
};

// -----------------------------------------------------------------------------
// [MAIN COMPONENT] THE ALCHEMY OF MEMORY
// -----------------------------------------------------------------------------
export const AttentionHook = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const logRef = useRef<HTMLDivElement>(null);

    // Stages
    const stageScanRef = useRef<HTMLDivElement>(null);
    const stageDriftRef = useRef<HTMLDivElement>(null);
    const stageExtractRef = useRef<HTMLDivElement>(null);
    const stageTruthRef = useRef<HTMLDivElement>(null);

    // Procedural Logs
    const [logs, setLogs] = useState<string[]>([]);

    // Generate logs over time
    useEffect(() => {
        const interval = setInterval(() => {
            setLogs(prev => [...prev.slice(-10), generateMemoryLog()]);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    // -------------------------------------------------------------------------
    // MASTER TIMELINE
    // -------------------------------------------------------------------------
    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=5000",
                pin: true,
                scrub: 1.5, // Heavier feeling
            }
        });

        // STEP 1: INITIALIZATION
        // The screen goes dark, interface loads
        tl.to(".interface-layer", { opacity: 1, duration: 0.5 });

        // STEP 2: THE SCAN (0% - 25%)
        // Biometric Reticle appears
        tl.to(".biometric-stage", { opacity: 1, scale: 1, duration: 1 });
        tl.to(".biometric-stage", { rotation: 90, scale: 1.5, duration: 2 });
        tl.to(".biometric-stage", { opacity: 0, scale: 3, filter: "blur(20px)", duration: 1 }); // Zoom thru

        // STEP 3: THE DRIFT (25% - 50%)
        // Floating through memory fragments
        tl.to(".memory-stage", { opacity: 1, duration: 1 }, "<");
        tl.fromTo(".memory-fragment",
            { y: 100, opacity: 0 },
            { y: -100, opacity: 1, stagger: 0.1, duration: 3, ease: "power1.inOut" }
        );
        tl.to(".memory-stage", { filter: "blur(10px)", opacity: 0, duration: 1 });

        // STEP 4: EXTRACTION (50% - 75%)
        // Intense data processing
        tl.to(".extract-stage", { opacity: 1, duration: 0.5 });
        tl.to(".extract-bar-inner", { width: "100%", duration: 2, ease: "power2.inOut" });
        tl.to(".extract-text", { text: "EXTRACTION COMPLETE", duration: 0.5 });
        tl.to(".extract-stage", { scale: 0.01, opacity: 0, duration: 1, ease: "expo.in" });

        // STEP 5: THE TRUTH (75% - 100%)
        // Final reveal
        tl.to(".truth-stage", { opacity: 1, duration: 0.5 });
        tl.fromTo(".final-title",
            { scale: 2, letterSpacing: "2em", filter: "blur(30px)", opacity: 0 },
            { scale: 1, letterSpacing: "0em", filter: "blur(0px)", opacity: 1, duration: 2, ease: "expo.out" }
        );

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative w-full h-screen bg-black overflow-hidden font-mono text-white/80 selection:bg-scandalea-gold selection:text-black">

            {/* AMBIENT NOISE */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none z-0" />

            {/* CONTAINER */}
            <div ref={containerRef} className="relative w-full h-full z-10 flex items-center justify-center">

                {/* --- UI LAYER: PERIPHERAL DATA --- */}
                <div className="interface-layer absolute inset-0 pointer-events-none opacity-0 p-8 flex justify-between">
                    <div className="flex flex-col gap-2 text-[10px] text-white/30 w-64">
                        <div className="border-b border-white/10 pb-2 mb-2">MEMORY_LOG_V.9.0</div>
                        {logs.map((log, i) => (
                            <div key={i} className="whitespace-nowrap overflow-hidden text-ellipsis">
                                {log}
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-2 text-[10px] text-right text-white/30">
                        <div>SYSTEM_STATUS: UNSTABLE</div>
                        <div>MEMORY_USAGE: 98%</div>
                        <div>THREAT_LEVEL: CRITICAL</div>
                    </div>
                </div>

                {/* --- STAGE 1: SCAN --- */}
                <BiometricReticle />

                {/* --- STAGE 2: DRIFT --- */}
                <MemoryCloud />

                {/* --- STAGE 3: EXTRACT --- */}
                <div ref={stageExtractRef} className="extract-stage absolute inset-0 flex flex-col items-center justify-center opacity-0 bg-black z-30">
                    <div className="text-4xl md:text-8xl font-black text-white mix-blend-difference mb-8 extract-text">
                        EXTRACTING...
                    </div>
                    <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="extract-bar-inner h-full bg-white w-0" />
                    </div>
                    <div className="mt-4 font-mono text-xs text-scandalea-gold animate-pulse">
                        DO NOT TURN OFF THE DEVICE
                    </div>

                    {/* Rapid flashing images (Simulated with text for now to save bandwidth) */}
                    <div className="absolute inset-x-0 bottom-20 text-center opacity-20 text-[10rem] font-serif leading-none select-none pointer-events-none">
                        MEMORY
                    </div>
                </div>

                {/* --- STAGE 4: THE TRUTH (RECONSTRUCTION) --- */}
                <div ref={stageTruthRef} className="truth-stage absolute inset-0 z-40 flex items-center justify-center opacity-0">
                    {/* Background reconstructed image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/parfum/scandalea/misfit.jpeg"
                            alt="Truth"
                            fill
                            sizes="100vw"
                            className="object-cover opacity-40 grayscale"
                        />
                        <div className="absolute inset-0 bg-black/60" />
                    </div>

                    <div className="relative z-10 text-center p-8 border border-white/10 backdrop-blur-sm bg-black/20">
                        <div className="text-scandalea-gold text-xs tracking-[0.5em] mb-6 uppercase">
                            Analysis Complete
                        </div>
                        <h2 className="final-title text-6xl md:text-9xl font-serif text-white uppercase leading-none mix-blend-overlay">
                            Memory Is<br />A Weapon
                        </h2>
                        <div className="w-full h-px bg-white/20 my-8" />
                        <p className="text-white/60 max-w-lg mx-auto font-sans leading-relaxed">
                            You cannot bury the past. You can only wear it. <br />
                            This is not a perfume. It is a time machine.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
};
