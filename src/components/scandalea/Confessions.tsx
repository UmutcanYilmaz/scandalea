"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Confessions = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const textElement = textRef.current;
        if (!textElement) return;

        // Split text into words manually to avoid extra dependencies like SplitText (which is premium)
        // or just use spans.
        const words = textElement.innerText.split(" ");
        textElement.innerHTML = "";
        words.forEach((word) => {
            const span = document.createElement("span");
            span.innerText = word + " "; // Add space back
            span.style.display = "inline-block";
            span.style.opacity = "0";
            span.style.transform = "translateY(20px)";
            textElement.appendChild(span);
        });

        const spans = textElement.querySelectorAll("span");

        gsap.to(spans, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "center 75%",
                toggleActions: "play none none reverse"
            }
        });

    }, []);

    return (
        <section
            ref={containerRef}
            className="h-[50vh] flex items-center justify-center bg-black px-6 relative z-20"
        >
            <div className="max-w-4xl">
                <h2
                    ref={textRef}
                    className="text-3xl md:text-5xl font-serif text-[#D4AF37] text-center italic leading-relaxed"
                >
                    Bir kadın odaya girdiğinde sessizlik olmamalı. Fısıltılar başlamalı.
                </h2>
            </div>
        </section>
    );
};
