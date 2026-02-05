"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Confessions = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const textRefs = useRef<(HTMLParagraphElement | HTMLHeadingElement | null)[]>([]);

    useEffect(() => {
        // Animate Text Lines
        textRefs.current.forEach((el, index) => {
            if (!el) return;
            gsap.fromTo(el,
                { opacity: 0, y: 30, filter: "blur(10px)" },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    delay: index * 0.2
                }
            );
        });

        // Animate Vertical Line
        if (lineRef.current) {
            gsap.fromTo(lineRef.current,
                { height: "0%" },
                {
                    height: "100px", // Grow to fixed height
                    duration: 1.5,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "center 70%",
                        scrub: 1
                    }
                }
            );
        }
    }, []);

    return (
        <section
            ref={containerRef}
            className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center relative z-20"
            style={{ backgroundColor: '#0a0505' }} // Slightly lighter than pure black
        >
            <div className="max-w-3xl space-y-12 flex flex-col items-center">

                <h2
                    ref={(el) => { textRefs.current[0] = el; }}
                    className="text-3xl md:text-5xl font-serif text-white leading-tight"
                >
                    "Bir kadın odaya girdiğinde sessizlik olmamalı."
                </h2>

                <h2
                    ref={(el) => { textRefs.current[1] = el; }}
                    className="text-3xl md:text-5xl font-serif text-scandalea-gold leading-tight italic"
                >
                    Fısıltılar başlamalı.
                </h2>

                <p
                    ref={(el) => { textRefs.current[2] = el; }}
                    className="text-xl md:text-2xl font-light text-gray-400"
                >
                    Biz, unutulmaya değil, olay yaratmaya geldik.
                </p>

                {/* Vertical Gold Line */}
                <div className="relative h-32 w-full flex justify-center mt-8">
                    <div
                        ref={lineRef}
                        className="w-px bg-scandalea-gold shadow-[0_0_10px_#D4AF37]"
                        style={{ height: '0px' }}
                    ></div>
                </div>

            </div>
        </section>
    );
};
