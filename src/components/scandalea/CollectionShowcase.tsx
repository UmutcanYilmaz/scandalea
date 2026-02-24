/**
 * COLLECTION SHOWCASE - REDESIGNED
 * Premium gallery-like product showcase with:
 * - Product color-themed accent elements throughout
 * - Fragrance notes visualization with styled pills
 * - Vibe tag badges
 * - Enhanced hover effects with color-themed gradients
 * - GSAP scroll-triggered reveals and parallax
 */

"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SCANDALEA_PRODUCTS } from "@/constants/scandaleaData";

gsap.registerPlugin(ScrollTrigger);

export const CollectionShowcase = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Title animation
        gsap.fromTo(titleRef.current,
            {
                opacity: 0,
                y: 60,
                filter: 'blur(12px)',
            },
            {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
            }
        );

        // Animate title decorations
        gsap.fromTo('.title-line',
            { scaleX: 0 },
            {
                scaleX: 1,
                duration: 1,
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
            }
        );

    }, { scope: sectionRef });

    return (
        <div ref={sectionRef} id="collection" className="relative w-full bg-neutral-950 py-20">

            {/* Title Section */}
            <div ref={titleRef} className="text-center py-20">
                <div className="flex items-center justify-center gap-8 mb-6">
                    <div
                        className="title-line w-32 h-px origin-right"
                        style={{
                            background: 'linear-gradient(to left, #D4AF37, transparent)',
                        }}
                    />
                    <span
                        className="text-xs tracking-[0.5em] uppercase"
                        style={{ color: 'rgba(212, 175, 55, 0.6)' }}
                    >
                        Discover
                    </span>
                    <div
                        className="title-line w-32 h-px origin-left"
                        style={{
                            background: 'linear-gradient(to right, #D4AF37, transparent)',
                        }}
                    />
                </div>
                <h2
                    className="text-4xl md:text-6xl lg:text-7xl font-serif uppercase tracking-widest"
                    style={{
                        color: '#F1DFA0',
                        textShadow: '0 0 80px rgba(212, 175, 55, 0.3), 0 4px 20px rgba(0, 0, 0, 0.8)',
                    }}
                >
                    The Collection
                </h2>
                <p
                    className="mt-4 text-sm tracking-[0.3em] uppercase"
                    style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                >
                    Five signatures. One audacity.
                </p>
            </div>

            <div className="flex flex-col w-full">
                {SCANDALEA_PRODUCTS.map((product, index) => (
                    <ProductSection key={product.id} product={product} index={index} />
                ))}
            </div>
        </div>
    );
};

const ProductSection = ({ product, index }: { product: any; index: number }) => {
    const sectionRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Parallax on image
        gsap.to(imageRef.current, {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
        });

        // Content reveal
        gsap.fromTo(contentRef.current,
            {
                opacity: 0,
                x: index % 2 === 0 ? 60 : -60,
                filter: 'blur(8px)',
            },
            {
                opacity: 1,
                x: 0,
                filter: 'blur(0px)',
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 60%',
                    toggleActions: 'play none none reverse',
                },
            }
        );

        // Stagger content children
        gsap.fromTo(
            contentRef.current?.querySelectorAll('.content-item'),
            {
                opacity: 0,
                y: 40,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 50%',
                    toggleActions: 'play none none reverse',
                },
            }
        );

    }, { scope: sectionRef });

    // Parse notes into individual items
    const noteCategories = [
        { label: 'TOP', notes: product.notes.top.split(' • ') },
        { label: 'HEART', notes: product.notes.heart.split(' • ') },
        { label: 'BASE', notes: product.notes.base.split(' • ') },
    ];

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-screen flex flex-col md:flex-row items-center overflow-hidden"
            style={{
                borderTop: `1px solid rgba(${hexToRgb(product.color)}, 0.08)`,
                background: `linear-gradient(${index % 2 === 0 ? '135deg' : '225deg'}, ${product.gradient.replace('70%)', '95%)')})`,
            }}
        >

            {/* Visual Side */}
            <div
                ref={imageRef}
                className={`relative w-full md:w-1/2 h-[60vh] md:h-screen ${index % 2 === 1 ? 'md:order-2' : 'md:order-1'}`}
            >
                <div className="absolute inset-0 group">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-all duration-700 group-hover:scale-105"
                        style={{
                            opacity: 0.75,
                        }}
                    />

                    {/* Product-colored gradient overlay on hover */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                        style={{
                            background: `radial-gradient(ellipse at center, ${product.color}15 0%, transparent 70%)`,
                        }}
                    />

                    {/* Edge gradients */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: index % 2 === 0
                                ? 'linear-gradient(to right, transparent 60%, rgba(0,0,0,0.8) 100%)'
                                : 'linear-gradient(to left, transparent 60%, rgba(0,0,0,0.8) 100%)',
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    {/* Vertical accent bar on image edge */}
                    <div
                        className={`absolute top-0 w-[2px] h-full ${index % 2 === 0 ? 'right-0' : 'left-0'}`}
                        style={{
                            background: `linear-gradient(to bottom, transparent 10%, ${product.color}40 30%, ${product.color}60 50%, ${product.color}40 70%, transparent 90%)`,
                        }}
                    />
                </div>

                {/* ID number with product-colored glow */}
                <div
                    className="absolute top-10 left-10 text-9xl font-serif pointer-events-none"
                    style={{
                        color: `${product.color}18`,
                        textShadow: `0 0 60px ${product.color}25`,
                    }}
                >
                    0{index + 1}
                </div>

                {/* Vibe badge */}
                <div
                    className="absolute bottom-8 left-8 md:bottom-12 md:left-12"
                >
                    <div
                        className="px-4 py-2 text-[10px] tracking-[0.4em] uppercase border backdrop-blur-sm"
                        style={{
                            borderColor: `${product.color}30`,
                            color: `${product.color}cc`,
                            background: `rgba(0,0,0,0.5)`,
                            boxShadow: `0 0 20px ${product.color}10`,
                        }}
                    >
                        {product.vibe}
                    </div>
                </div>
            </div>

            {/* Narrative Side */}
            <div
                ref={contentRef}
                className={`w-full md:w-1/2 p-12 md:p-20 lg:p-24 flex flex-col justify-center space-y-8 ${index % 2 === 1 ? 'md:order-1 text-right items-end' : 'md:order-2 text-left items-start'}`}
            >
                {/* Tagline */}
                <p
                    className="content-item text-[11px] tracking-[0.5em] uppercase"
                    style={{ color: `${product.color}99` }}
                >
                    {product.tagline}
                </p>

                {/* Product name */}
                <h2
                    className="content-item text-5xl md:text-7xl lg:text-8xl font-serif uppercase tracking-tighter leading-none"
                    style={{
                        color: '#F1DFA0',
                        textShadow: `0 0 50px ${product.color}40, 0 4px 20px rgba(0, 0, 0, 0.8)`,
                    }}
                >
                    {product.name}
                </h2>

                {/* Accent line with product color */}
                <div
                    className="content-item h-[2px]"
                    style={{
                        width: '60px',
                        background: `linear-gradient(to right, ${product.color}, ${product.color}40)`,
                        boxShadow: `0 0 15px ${product.color}30`,
                    }}
                />

                {/* Description */}
                <p className="content-item text-white/55 text-lg font-light leading-relaxed max-w-lg">
                    {product.description}
                </p>

                {/* Fragrance Notes visualization */}
                <div className="content-item flex flex-col gap-4 max-w-lg w-full">
                    {noteCategories.map((category) => (
                        <div
                            key={category.label}
                            className={`flex items-start gap-3 ${index % 2 === 1 ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <span
                                className="text-[9px] tracking-[0.3em] uppercase mt-1.5 shrink-0 w-10"
                                style={{
                                    color: `${product.color}60`,
                                    textAlign: index % 2 === 1 ? 'right' : 'left',
                                }}
                            >
                                {category.label}
                            </span>
                            <div className={`flex flex-wrap gap-1.5 ${index % 2 === 1 ? 'justify-end' : 'justify-start'}`}>
                                {category.notes.map((note: string, j: number) => (
                                    <span
                                        key={j}
                                        className="px-3 py-1 text-[10px] tracking-wider rounded-full border"
                                        style={{
                                            borderColor: `${product.color}20`,
                                            color: 'rgba(255,255,255,0.5)',
                                            background: `${product.color}08`,
                                        }}
                                    >
                                        {note}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="content-item pt-6">
                    <Link
                        href={`/scandalea/product/${product.id}`}
                        className="group relative px-10 py-4 border text-scandalea-gold uppercase tracking-widest overflow-hidden transition-all duration-500"
                        style={{
                            borderColor: `${product.color}40`,
                        }}
                    >
                        <span
                            className="relative z-10 transition-colors duration-300 group-hover:text-black text-sm"
                            style={{ color: `${product.color}cc` }}
                        >
                            Explore
                        </span>
                        {/* Product-colored fill on hover */}
                        <div
                            className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                            style={{
                                background: `linear-gradient(to right, ${product.color}, ${product.color}cc)`,
                            }}
                        />
                    </Link>
                </div>
            </div>

        </section>
    );
};

// Helper to convert hex color to rgb
function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '255,255,255';
    return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}
