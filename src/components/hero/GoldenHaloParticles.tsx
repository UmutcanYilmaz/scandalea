/**
 * GOLDEN HALO PARTICLES
 * Three.js particle system creating the "Altın Hale" (Golden Halo) effect
 * around the goddess logo - radiating golden light particles.
 */

"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface GoldenHaloParticlesProps {
    count?: number;
    radius?: number;
    intensity?: number;
    visible?: boolean;
}

export const GoldenHaloParticles: React.FC<GoldenHaloParticlesProps> = ({
    count = 200,
    radius = 3,
    intensity = 1,
    visible = true,
}) => {
    const pointsRef = useRef<THREE.Points>(null);
    const { viewport } = useThree();

    // Generate particle positions
    const { positions, velocities, sizes, opacities } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const opacities = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Spiral outward pattern
            const angle = (i / count) * Math.PI * 8;
            const r = (i / count) * radius;
            const heightVariation = (Math.random() - 0.5) * 1.5;

            positions[i * 3] = Math.cos(angle) * r;
            positions[i * 3 + 1] = heightVariation;
            positions[i * 3 + 2] = Math.sin(angle) * r * 0.5; // Elliptical

            // Outward velocity
            velocities[i * 3] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 1] = Math.random() * 0.01;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

            sizes[i] = Math.random() * 8 + 2;
            opacities[i] = Math.random() * 0.6 + 0.2;
        }

        return { positions, velocities, sizes, opacities };
    }, [count, radius]);

    // Gold gradient texture
    const particleTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d')!;

        // Radial gradient for soft glow
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(251, 245, 183, 1)');   // Bright center
        gradient.addColorStop(0.3, 'rgba(212, 175, 55, 0.8)'); // Gold
        gradient.addColorStop(0.6, 'rgba(170, 130, 24, 0.4)'); // Dark gold
        gradient.addColorStop(1, 'rgba(170, 130, 24, 0)');     // Fade out

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);

        return new THREE.CanvasTexture(canvas);
    }, []);

    // Animate particles
    useFrame((state, delta) => {
        if (!pointsRef.current || !visible) return;

        const time = state.clock.elapsedTime;
        const geometry = pointsRef.current.geometry;
        const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
        const positions = positionAttr.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Orbital motion
            const angle = time * 0.2 + (i / count) * Math.PI * 2;
            const baseRadius = (i / count) * radius + Math.sin(time + i) * 0.1;

            // Spiral outward slowly
            positions[i3] = Math.cos(angle) * baseRadius + velocities[i3] * time;
            positions[i3 + 1] += Math.sin(time * 2 + i * 0.1) * 0.001;
            positions[i3 + 2] = Math.sin(angle) * baseRadius * 0.5;

            // Reset particles that go too far
            const dist = Math.sqrt(positions[i3] ** 2 + positions[i3 + 2] ** 2);
            if (dist > radius * 1.5) {
                positions[i3] *= 0.3;
                positions[i3 + 2] *= 0.3;
            }
        }

        positionAttr.needsUpdate = true;

        // Rotate entire system slowly
        pointsRef.current.rotation.y = time * 0.05;
    });

    if (!visible) return null;

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={count}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={5}
                sizeAttenuation
                transparent
                opacity={0.8 * intensity}
                map={particleTexture}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                vertexColors={false}
                color="#D4AF37"
            />
        </points>
    );
};

// Light rays emanating from center
export const GoldenLightRays: React.FC<{ visible?: boolean }> = ({ visible = true }) => {
    const groupRef = useRef<THREE.Group>(null);
    const raysCount = 12;

    useFrame((state) => {
        if (!groupRef.current || !visible) return;

        const time = state.clock.elapsedTime;
        groupRef.current.rotation.z = time * 0.02;

        // Pulse effect
        const pulse = Math.sin(time * 1.5) * 0.1 + 0.9;
        groupRef.current.scale.setScalar(pulse);
    });

    if (!visible) return null;

    return (
        <group ref={groupRef} position={[0, 0, -1]}>
            {Array.from({ length: raysCount }).map((_, i) => {
                const angle = (i / raysCount) * Math.PI * 2;
                const length = 4 + Math.random() * 2;

                return (
                    <mesh
                        key={i}
                        rotation={[0, 0, angle]}
                        position={[0, 0, 0]}
                    >
                        <planeGeometry args={[0.02, length]} />
                        <meshBasicMaterial
                            color="#D4AF37"
                            transparent
                            opacity={0.3}
                            side={THREE.DoubleSide}
                            blending={THREE.AdditiveBlending}
                        />
                    </mesh>
                );
            })}
        </group>
    );
};

export default GoldenHaloParticles;
