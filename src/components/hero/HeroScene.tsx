/**
 * HERO SCENE
 * Main R3F scene orchestrator that combines all hero elements:
 * LiquidGoldBackground, CrystalBottle, CausticLighting.
 */

"use client";

import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload, PerformanceMonitor, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';

import { LiquidGoldBackground } from './LiquidGoldBackground';
import { CrystalBottle } from './CrystalBottle';
import { CausticLighting } from './CausticLighting';

interface HeroSceneProps {
    greyScale?: number;
    bottleVisible?: boolean;
    onSceneReady?: () => void;
}

// Scene content component (inside Canvas)
const SceneContent: React.FC<HeroSceneProps> = ({
    greyScale = 1.0,
    bottleVisible = false,
    onSceneReady,
}) => {
    const { gl, camera } = useThree();
    const hasNotifiedReady = useRef(false);

    // Notify when scene is ready
    useEffect(() => {
        if (!hasNotifiedReady.current && onSceneReady) {
            // Small delay to ensure everything is rendered
            const timer = setTimeout(() => {
                onSceneReady();
                hasNotifiedReady.current = true;
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [onSceneReady]);

    // Configure renderer for high quality
    useEffect(() => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
        gl.outputColorSpace = THREE.SRGBColorSpace;
    }, [gl]);

    return (
        <>
            {/* Background shader */}
            <LiquidGoldBackground
                intensity={1.2}
                viscosity={0.85}
                greyScale={greyScale}
            />

            {/* Lighting */}
            <CausticLighting intensity={1.0} greyScale={greyScale} />

            {/* Crystal Bottle */}
            <CrystalBottle
                position={[0, 0, 0]}
                scale={1.2}
                visible={bottleVisible}
                greyScale={greyScale}
            />
        </>
    );
};

// Kintsugi crack overlay (2D Canvas overlay)
interface KintsugiOverlayProps {
    progress: number;
    visible: boolean;
}

const KintsugiOverlay: React.FC<KintsugiOverlayProps> = ({ progress, visible }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !visible) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (progress <= 0) return;

        // Draw crack pattern
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
        const currentRadius = maxRadius * progress;

        // Golden glow color
        const goldGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, currentRadius
        );
        goldGradient.addColorStop(0, 'rgba(212, 175, 55, 0.9)');
        goldGradient.addColorStop(0.5, 'rgba(241, 223, 160, 0.6)');
        goldGradient.addColorStop(1, 'rgba(251, 245, 183, 0)');

        // Draw cracks
        const numCracks = 12;
        const crackWidth = 2 + progress * 3;

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 0; i < numCracks; i++) {
            const angle = (i / numCracks) * Math.PI * 2;
            const length = currentRadius * (0.6 + Math.random() * 0.4);

            // Main crack line
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);

            let x = centerX;
            let y = centerY;
            const segments = 8;

            for (let j = 0; j < segments; j++) {
                const segmentLength = length / segments;
                const wobble = (Math.random() - 0.5) * 0.3;
                const newAngle = angle + wobble;

                x += Math.cos(newAngle) * segmentLength;
                y += Math.sin(newAngle) * segmentLength;

                ctx.lineTo(x, y);

                // Branch cracks
                if (j > 2 && Math.random() > 0.6) {
                    const branchAngle = newAngle + (Math.random() - 0.5) * Math.PI * 0.5;
                    const branchLength = segmentLength * (0.3 + Math.random() * 0.4);

                    ctx.moveTo(x, y);
                    ctx.lineTo(
                        x + Math.cos(branchAngle) * branchLength,
                        y + Math.sin(branchAngle) * branchLength
                    );
                    ctx.moveTo(x, y);
                }
            }

            // Glow effect
            ctx.shadowColor = '#D4AF37';
            ctx.shadowBlur = 20 * progress;
            ctx.strokeStyle = goldGradient;
            ctx.lineWidth = crackWidth;
            ctx.stroke();

            // Sharp core
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#FBF5B7';
            ctx.lineWidth = crackWidth * 0.4;
            ctx.stroke();
        }

    }, [progress, visible]);

    if (!visible) return null;

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

// Main HeroScene component
export const HeroScene: React.FC<HeroSceneProps & {
    crackProgress?: number;
    showCracks?: boolean;
}> = ({
    greyScale = 1.0,
    bottleVisible = false,
    onSceneReady,
    crackProgress = 0,
    showCracks = false,
}) => {
        const [dpr, setDpr] = useState(1.5);

        return (
            <div className="absolute inset-0 z-0">
                {/* Kintsugi crack overlay */}
                <KintsugiOverlay progress={crackProgress} visible={showCracks} />

                {/* 3D Canvas */}
                <Canvas
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: 'high-performance',
                        stencil: false,
                    }}
                    dpr={dpr}
                    camera={{
                        position: [0, 0, 5],
                        fov: 45,
                        near: 0.1,
                        far: 100,
                    }}
                    style={{ background: 'transparent' }}
                >
                    <PerformanceMonitor
                        onIncline={() => setDpr(Math.min(2, dpr + 0.1))}
                        onDecline={() => setDpr(Math.max(1, dpr - 0.1))}
                    >
                        <AdaptiveDpr pixelated />
                    </PerformanceMonitor>

                    <Suspense fallback={null}>
                        <SceneContent
                            greyScale={greyScale}
                            bottleVisible={bottleVisible}
                            onSceneReady={onSceneReady}
                        />
                        <Preload all />
                    </Suspense>
                </Canvas>
            </div>
        );
    };

export default HeroScene;
